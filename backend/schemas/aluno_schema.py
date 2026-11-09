from typing import List
from pydantic import BaseModel, Field


# ==========================================================
# 1. SCHEMAS DE ANOTACAO (OBSERVACOES DO DIA A DIA)
# ==========================================================

# Dados que o professor envia no formulario de nova anotacao
class NovaAnotacao(BaseModel):
    categoria: str = Field(..., min_length=2, description="Categoria da observação")
    texto: str = Field(..., min_length=10, description="Descrição da observação (mínimo 10 caracteres)")


# Formato completo da anotacao salva no aluno
class Anotacao(BaseModel):
    id: int
    data: str
    categoria: str
    texto: str


# ==========================================================
# 2. SCHEMAS DE ALUNO
# ==========================================================

# Dados que o professor envia para cadastrar um novo aluno
class NovoAluno(BaseModel):
    nome: str = Field(..., min_length=2)
    turma: str = Field(..., min_length=2)
    condicao: str = Field(..., min_length=2)
    atendimento: str = Field(default="Sala de Recursos")


# Formato completo do aluno devolvido pela API (igual ao frontend)
class Aluno(BaseModel):
    id: int
    nome: str
    turma: str
    condicao: str
    atendimento: str
    statusRelatorio: str
    ultimaAtualizacao: str
    anotacoes: List[Anotacao] = []
    relatorioTexto: str = ""

