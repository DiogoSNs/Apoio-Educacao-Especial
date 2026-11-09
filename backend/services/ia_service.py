import os
from dotenv import load_dotenv
from google import genai


# ==========================================================
# FUNCAO RESERVA (CASO ESTEJA SEM CHAVE OU SEM INTERNET)
# Monta o rascunho no mesmo formato usando as anotacoes
# ==========================================================
def montar_relatorio_padrao(aluno: dict) -> str:
    linhas = [
        f"- Em {item['data']} ({item['categoria']}): {item['texto']}"
        for item in aluno["anotacoes"]
    ]
    lista_observacoes = "\n".join(linhas)

    return (
        "RELATÓRIO INDIVIDUAL DE ACOMPANHAMENTO PEDAGÓGICO (RASCUNHO IA)\n\n"
        f"Estudante: {aluno['nome']} | Turma: {aluno['turma']}\n"
        f"Condição/Necessidade: {aluno['condicao']}\n"
        f"Modalidade de Atendimento: {aluno['atendimento']}\n\n"
        "1. Desenvolvimento e Observações do Período:\n"
        "Com base nos registros realizados pelo professor durante os atendimentos, foram observados os seguintes pontos:\n"
        f"{lista_observacoes}\n\n"
        "2. Síntese e Recomendações Pedagógicas:\n"
        "A partir das anotações registradas acima, verifica-se que o(a) estudante responde de forma positiva às adaptações aplicadas em sala. "
        "Recomenda-se manter os recursos de apoio descritos nas observações e dar continuidade ao acompanhamento individualizado."
    )


# ==========================================================
# FUNCAO PRINCIPAL DA IA (GOOGLE GEMINI)
# Recebe o aluno, monta o prompt com as anotacoes e gera o texto
# ==========================================================
def gerar_rascunho_ia(aluno: dict) -> str:
    # Recarrega o arquivo .env a cada chamada
    load_dotenv(override=True)
    chave_api = os.getenv("GEMINI_API_KEY", "").strip()

    # Se nao tiver chave configurada no .env, usa o gerador padrao
    if not chave_api:
        return montar_relatorio_padrao(aluno)

    linhas_anotacoes = "\n".join(
        [f"- {a['data']} ({a['categoria']}): {a['texto']}" for a in aluno["anotacoes"]]
    )

    prompt = (
        "Você é um assistente pedagógico de Educação Especial.\n"
        "Escreva um rascunho de Relatório Individual de Acompanhamento Pedagógico em português formal e simples.\n"
        "REGRA IMPORTANTE: Utilize APENAS os fatos das anotações abaixo, sem inventar informações.\n\n"
        f"Estudante: {aluno['nome']}\n"
        f"Turma: {aluno['turma']}\n"
        f"Condição/Necessidade: {aluno['condicao']}\n"
        f"Atendimento: {aluno['atendimento']}\n\n"
        f"Anotações registradas pelo professor:\n{linhas_anotacoes}\n\n"
        "Estruture o texto com cabeçalho do estudante, '1. Síntese das Observações do Período' e '2. Encaminhamento Pedagógico'."
    )

    try:
        cliente = genai.Client(api_key=chave_api)
        resposta = cliente.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        if resposta and resposta.text:
            return resposta.text.strip()
        return montar_relatorio_padrao(aluno)
    except Exception as erro:
        print(f"[Aviso IA] Usando relatorio padrao. Motivo: {erro}")
        return montar_relatorio_padrao(aluno)
