import os
from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine, select

from dados_memoria import alunos_memoria
from models.modelos_db import AlunoDB, AnotacaoDB

load_dotenv()

# ==========================================================
# 1. CONFIGURACAO DA CONEXAO COM O BANCO (NEON POSTGRESQL OU SQLITE LOCAL)
# ==========================================================
url_banco = os.getenv("DATABASE_URL", "sqlite:///./banco_local.db").strip()

# Ajusta o prefixo da URL do Postgres para usar o driver psycopg2
if url_banco.startswith("postgres://"):
    url_banco = url_banco.replace("postgres://", "postgresql+psycopg2://", 1)
elif url_banco.startswith("postgresql://"):
    url_banco = url_banco.replace("postgresql://", "postgresql+psycopg2://", 1)

# pool_pre_ping evita queda de conexao quando o banco serverless do Neon hiberna
engine = create_engine(url_banco, pool_pre_ping=True)


# ==========================================================
# 2. CRIACAO DAS TABELAS E CARGA INICIAL (SEED)
# ==========================================================
def iniciar_banco():
    SQLModel.metadata.create_all(engine)

    with Session(engine) as sessao:
        primeiro_aluno = sessao.exec(select(AlunoDB)).first()

        # Se o banco estiver vazio na primeira execucao, insere os 4 alunos iniciais
        if not primeiro_aluno:
            for item in alunos_memoria:
                aluno_db = AlunoDB(
                    nome=item["nome"],
                    turma=item["turma"],
                    condicao=item["condicao"],
                    atendimento=item["atendimento"],
                    statusRelatorio=item["statusRelatorio"],
                    ultimaAtualizacao=item["ultimaAtualizacao"],
                    relatorioTexto=item["relatorioTexto"],
                )
                sessao.add(aluno_db)
                sessao.commit()
                sessao.refresh(aluno_db)

                for anot in item["anotacoes"]:
                    anotacao_db = AnotacaoDB(
                        data=anot["data"],
                        categoria=anot["categoria"],
                        texto=anot["texto"],
                        aluno_id=aluno_db.id,
                    )
                    sessao.add(anotacao_db)

                sessao.commit()


# ==========================================================
# 3. DEPENDENCIA QUE ENTREGA A SESSAO DO BANCO PARA AS ROTAS
# ==========================================================
def obter_sessao():
    with Session(engine) as sessao:
        yield sessao
