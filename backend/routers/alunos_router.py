from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException, status

from dados_memoria import alunos_memoria, buscar_aluno_por_id
from schemas.aluno_schema import Aluno, NovoAluno
from services.ia_service import gerar_rascunho_ia

router = APIRouter(prefix="/alunos", tags=["Alunos e Relatórios IA"])


def data_hoje() -> str:
    return datetime.now().strftime("%d/%m/%Y")


def buscar_aluno_ou_404(aluno_id: int):
    aluno = buscar_aluno_por_id(aluno_id)

    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado.",
        )

    return aluno


# ==========================================================
# ROTA 1: LISTAR ALUNOS (COM FILTRO OPCIONAL POR STATUS E BUSCA)
# ==========================================================
@router.get("", response_model=List[Aluno])
def listar_alunos(status_relatorio: Optional[str] = None, busca: Optional[str] = None):
    resultado = alunos_memoria

    if status_relatorio and status_relatorio != "todos":
        resultado = [a for a in resultado if a["statusRelatorio"] == status_relatorio]

    if busca:
        termo = busca.strip().lower()
        resultado = [a for a in resultado if termo in a["nome"].lower()]

    return resultado


# ==========================================================
# ROTA 2: BUSCAR UM ALUNO ESPECIFICO PELO ID (OU ERRO 404)
# ==========================================================
@router.get("/{aluno_id}", response_model=Aluno)
def obter_aluno(aluno_id: int):
    aluno = buscar_aluno_por_id(aluno_id)

    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado.",
        )

    return aluno


# ==========================================================
# ROTA 3: CADASTRAR NOVO ALUNO (RETORNA CODIGO 201 CREATED)
# ==========================================================
@router.post("", response_model=Aluno, status_code=status.HTTP_201_CREATED)
def criar_aluno(dados: NovoAluno):
    novo_id = max([a["id"] for a in alunos_memoria], default=0) + 1

    novo_aluno = {
        "id": novo_id,
        "nome": dados.nome.strip(),
        "turma": dados.turma.strip(),
        "condicao": dados.condicao.strip(),
        "atendimento": dados.atendimento.strip(),
        "statusRelatorio": "pendente",
        "ultimaAtualizacao": data_hoje(),
        "anotacoes": [],
        "relatorioTexto": "",
    }

    alunos_memoria.insert(0, novo_aluno)
    return novo_aluno


# ==========================================================
# ROTA 4 (IA): GERAR RASCUNHO DO RELATORIO COM IA
# ==========================================================
@router.post("/{aluno_id}/gerar-relatorio", response_model=Aluno)
def gerar_relatorio_aluno(aluno_id: int):
    aluno = buscar_aluno_por_id(aluno_id)

    # 1. Verifica se o aluno existe (senao retorna 404)
    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado.",
        )

    # 2. Verifica se tem anotacoes cadastradas (senao retorna 400 Bad Request)
    if len(aluno["anotacoes"]) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Adicione pelo menos uma observação antes de gerar o relatório com a IA.",
        )

    # 3. Chama o servico do Gemini para montar o rascunho e atualiza o aluno
    texto_gerado = gerar_rascunho_ia(aluno)
    aluno["relatorioTexto"] = texto_gerado
    aluno["statusRelatorio"] = "rascunho"
    aluno["ultimaAtualizacao"] = data_hoje()

    return aluno


@router.delete("/{aluno_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_aluno(aluno_id: int):
    aluno = buscar_aluno_ou_404(aluno_id)
    alunos_memoria.remove(aluno)

