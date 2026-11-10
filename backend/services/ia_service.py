from fastapi import HTTPException, status
from google import genai

from config import obter_chave_gemini, obter_modelo_gemini


# ==========================================================
# FUNCAO PRINCIPAL DA IA (GOOGLE GEMINI)
# Recebe o aluno, monta o prompt com as anotacoes e gera o texto
# ==========================================================
def gerar_rascunho_ia(aluno: dict) -> str:
    chave_api = obter_chave_gemini()

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
        "2. Não utilize formatação Markdown (não use asteriscos **, nem hashtags #). Escreva em texto puro bem organizado.\n"
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

    # 3. Chama a API do Google Gemini
    try:
        cliente = genai.Client(api_key=chave_api)
        resposta = cliente.models.generate_content(
            model=obter_modelo_gemini(),
            contents=prompt,
        )

        if not resposta or not resposta.text:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="A API do Gemini retornou uma resposta vazia.",
            )

        return resposta.text.strip()

    except HTTPException:
        raise
    except Exception as erro:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erro ao comunicar com a API do Gemini: {str(erro)}",
        )
