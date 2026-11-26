from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel


# ==========================================================
# 1. TABELA DE ALUNOS NO BANCO DE DADOS (SQLMODEL)
# Relacionamento 1 para N: Um aluno possui varias anotacoes
# ==========================================================
class AlunoDB(SQLModel, table=True):
    __tablename__ = "alunos"

    id: Optional[int] = Field(default=None, primary_key=True)
    nome: str
    turma: str
    condicao: str
    atendimento: str = Field(default="Sala de Recursos")
    statusRelatorio: str = Field(default="pendente")
    ultimaAtualizacao: str
    relatorioTexto: str = Field(default="")

    anotacoes: List["AnotacaoDB"] = Relationship(
        back_populates="aluno",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


# ==========================================================
# 2. TABELA DE ANOTACOES NO BANCO DE DADOS (SQLMODEL)
# Possui chave estrangeira (aluno_id) apontando para a tabela alunos
# ==========================================================
class AnotacaoDB(SQLModel, table=True):
    __tablename__ = "anotacoes"

    id: Optional[int] = Field(default=None, primary_key=True)
    data: str
    categoria: str
    texto: str

    aluno_id: int = Field(foreign_key="alunos.id")
    aluno: Optional[AlunoDB] = Relationship(back_populates="anotacoes")
