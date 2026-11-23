import os
from dotenv import load_dotenv
from fastapi import HTTPException, status
from google import genai

# Lista de modelos do Gemini em ordem de prioridade (se um estiver com fila 503, tenta o proximo)
MODELOS_GEMINI = [
    "gemini-3.6-flash",
    "gemini-3-flash-preview",
    "gemini-3.5-flash",
    "gemini-3.5-flash-lite",
]


# ==========================================================
# FUNCAO PRINCIPAL DA IA (GOOGLE GEMINI)
# Recebe o aluno, monta o prompt com as anotacoes e gera o texto
# ==========================================================
def gerar_rascunho_ia(aluno: dict) -> str:
    # Recarrega o arquivo .env para ler a chave atualizada
    load_dotenv(override=True)
    chave_api = os.getenv("GEMINI_API_KEY", "").strip()

    # 1. Se nao tiver chave no .env, retorna um aviso claro de erro
    if not chave_api:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="A chave GEMINI_API_KEY não foi configurada no arquivo .env do servidor.",
        )

    linhas_anotacoes = "\n".join(
        [f"- Em {a['data']} ({a['categoria']}): {a['texto']}" for a in aluno["anotacoes"]]
    )

    # 2. Prompt estruturado para gerar um parecer pedagogico formal e limpo
    prompt = (
        "Você é um professor especialista em Educação Especial (Atendimento Educacional Especializado - AEE).\n"
        "Sua tarefa é redigir um rascunho de Relatório Individual de Acompanhamento Pedagógico em português formal, claro e objetivo.\n\n"
        "REGRAS OBRIGATÓRIAS:\n"
        "1. Baseie-se EXCLUSIVAMENTE nas anotações do professor listadas abaixo. Não invente atividades, datas ou comportamentos que não foram informados.\n"
        "2. Escreva em português do Brasil com toda a acentuação e cedilha (ç) corretas, apenas sem usar asteriscos (**) ou hashtags (#).\n"
        "3. Organize o documento exatamente nestas seções:\n"
        "   - Cabeçalho com Nome do Estudante, Turma, Condição/Necessidade e Modalidade de Atendimento\n"
        "   - 1. Desenvolvimento e Adaptações Realizadas no Período (transformando as anotações em parágrafos coesos)\n"
        "   - 2. Encaminhamentos e Recomendações Pedagógicas (sugerindo a continuidade dos apoios que funcionaram segundo as anotações)\n\n"
        "DADOS DO ESTUDANTE:\n"
        f"Estudante: {aluno['nome']}\n"
        f"Turma: {aluno['turma']}\n"
        f"Condição/Necessidade: {aluno['condicao']}\n"
        f"Modalidade de Atendimento: {aluno['atendimento']}\n\n"
        f"ANOTAÇÕES REGISTRADAS PELO PROFESSOR:\n{linhas_anotacoes}"
    )

    # 3. Chama a API do Google Gemini tentando os modelos da lista
    cliente = genai.Client(api_key=chave_api)
    ultimo_erro = ""

    for nome_modelo in MODELOS_GEMINI:
        try:
            resposta = cliente.models.generate_content(
                model=nome_modelo,
                contents=prompt,
            )
            if resposta and resposta.text:
                return resposta.text.strip()
        except Exception as erro:
            ultimo_erro = str(erro)
            continue

    raise HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=f"Erro ao comunicar com a API do Gemini: {ultimo_erro}",
    )
