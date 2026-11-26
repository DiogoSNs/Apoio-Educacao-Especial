from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from auth.jwt_auth import verificar_token
from dados_memoria import alunos_memoria, buscar_aluno_por_id
from database import obter_sessao
from models.modelos_db import AlunoDB, AnotacaoDB
from schemas.aluno_schema import Aluno, NovaAnotacao, NovoAluno, RelatorioAprovar
from services.ia_service import gerar_rascunho_ia

router = APIRouter(prefix="/alunos", tags=["Alunos e Relatórios IA"])


def data_hoje() -> str:
    return datetime.now().strftime("%d/%m/%Y")


# ==========================================================
# ROTA 1: LISTAR ALUNOS DO BANCO DE DADOS (SQLMODEL)
# ==========================================================
@router.get("", response_model=List[Aluno])
def listar_alunos(
    status_relatorio: Optional[str] = None,
    busca: Optional[str] = None,
    sessao: Session = Depends(obter_sessao),
    usuario: str = Depends(verificar_token),
):
    consulta = select(AlunoDB).order_by(AlunoDB.id)
    resultado = sessao.exec(consulta).all()

    if status_relatorio and status_relatorio != "todos":
        resultado = [a for a in resultado if a.statusRelatorio == status_relatorio]

    if busca:
        termo = busca.strip().lower()
        resultado = [a for a in resultado if termo in a.nome.lower()]

    return resultado


# ==========================================================
# ROTA 2: BUSCAR UM ALUNO PELO ID NO BANCO (SQLMODEL)
# ==========================================================
@router.get("/{aluno_id}", response_model=Aluno)
def obter_aluno(
    aluno_id: int,
    sessao: Session = Depends(obter_sessao),
    usuario: str = Depends(verificar_token),
):
    aluno = sessao.get(AlunoDB, aluno_id)

    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado.",
        )

    return aluno


# ==========================================================
# ROTA 3: CADASTRAR NOVO ALUNO NO BANCO (SQLMODEL)
# ==========================================================
@router.post("", response_model=Aluno, status_code=status.HTTP_201_CREATED)
def criar_aluno(
    dados: NovoAluno,
    sessao: Session = Depends(obter_sessao),
    usuario: str = Depends(verificar_token),
):
    novo_aluno = AlunoDB(
        nome=dados.nome.strip(),
        turma=dados.turma.strip(),
        condicao=dados.condicao.strip(),
        atendimento=dados.atendimento.strip(),
        statusRelatorio="pendente",
        ultimaAtualizacao=data_hoje(),
        relatorioTexto="",
    )

    sessao.add(novo_aluno)
    sessao.commit()
    sessao.refresh(novo_aluno)
    return novo_aluno


# ==========================================================
# ROTA 4 (IA): GERAR RASCUNHO COM IA E SALVAR NO BANCO (SQLMODEL)
# ==========================================================
@router.post("/{aluno_id}/gerar-relatorio", response_model=Aluno)
def gerar_relatorio_aluno(
    aluno_id: int,
    sessao: Session = Depends(obter_sessao),
    usuario: str = Depends(verificar_token),
):
    aluno = sessao.get(AlunoDB, aluno_id)

    # 1. Verifica se o aluno existe no banco (senao retorna 404)
    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado.",
        )

    # 2. Verifica se tem anotacoes relacionadas no banco (senao retorna 400)
    if len(aluno.anotacoes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Adicione pelo menos uma observação antes de gerar o relatório com a IA.",
        )

    # 3. Monta o dicionario com os dados do banco para enviar ao servico da IA
    dados_para_ia = {
        "nome": aluno.nome,
        "turma": aluno.turma,
        "condicao": aluno.condicao,
        "atendimento": aluno.atendimento,
        "anotacoes": [
            {"data": a.data, "categoria": a.categoria, "texto": a.texto}
            for a in aluno.anotacoes
        ],
    }

    texto_gerado = gerar_rascunho_ia(dados_para_ia)

    # 4. Atualiza os campos e salva no banco de dados
    aluno.relatorioTexto = texto_gerado
    aluno.statusRelatorio = "rascunho"
    aluno.ultimaAtualizacao = data_hoje()

    sessao.add(aluno)
    sessao.commit()
    sessao.refresh(aluno)

    return aluno


# ==========================================================
# PARTE DO EDUARDO (SPRINT 4: PASSAR ESTAS 4 ROTAS PARA SQLMODEL)
# ==========================================================
def proximo_id_anotacao() -> int:
    maior_id = 0

    for aluno in alunos_memoria:
        for anotacao in aluno["anotacoes"]:
            if anotacao["id"] > maior_id:
                maior_id = anotacao["id"]

    return maior_id + 1


def buscar_aluno_ou_404(aluno_id: int):
    aluno = buscar_aluno_por_id(aluno_id)

    if not aluno:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aluno não encontrado.",
        )

    return aluno


@router.delete("/{aluno_id}", status_code=status.HTTP_204_NO_CONTENT)
def excluir_aluno(aluno_id: int, usuario: str = Depends(verificar_token)):
    aluno = buscar_aluno_ou_404(aluno_id)
    alunos_memoria.remove(aluno)


@router.post("/{aluno_id}/anotacoes", response_model=Aluno, status_code=status.HTTP_201_CREATED)
def adicionar_anotacao(
    aluno_id: int,
    dados: NovaAnotacao,
    usuario: str = Depends(verificar_token),
):
    aluno = buscar_aluno_ou_404(aluno_id)

    texto = dados.texto.strip()

    if len(texto) < 10:
        raise HTTPException(
            status_code=422,
            detail="A observação deve ter pelo menos 10 caracteres.",
        )

    nova_anotacao = {
        "id": proximo_id_anotacao(),
        "data": data_hoje(),
        "categoria": dados.categoria.strip(),
        "texto": texto,
    }

    aluno["anotacoes"].append(nova_anotacao)
    aluno["ultimaAtualizacao"] = data_hoje()

    return aluno


@router.delete("/{aluno_id}/anotacoes/{anotacao_id}", response_model=Aluno)
def remover_anotacao(
    aluno_id: int,
    anotacao_id: int,
    usuario: str = Depends(verificar_token),
):
    aluno = buscar_aluno_ou_404(aluno_id)

    for anotacao in aluno["anotacoes"]:
        if anotacao["id"] == anotacao_id:
            aluno["anotacoes"].remove(anotacao)
            return aluno

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Anotação não encontrada.",
    )


@router.put("/{aluno_id}/aprovar-relatorio", response_model=Aluno)
def aprovar_relatorio(
    aluno_id: int,
    dados: RelatorioAprovar,
    usuario: str = Depends(verificar_token),
):
    aluno = buscar_aluno_ou_404(aluno_id)

    if dados.relatorioTexto.strip() == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="O relatório não pode estar vazio para ser aprovado.",
        )

    aluno["relatorioTexto"] = dados.relatorioTexto
    aluno["statusRelatorio"] = "aprovado"
    aluno["ultimaAtualizacao"] = data_hoje()

    return aluno
