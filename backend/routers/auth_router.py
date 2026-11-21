from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from auth.jwt_auth import criar_token_jwt

router = APIRouter(prefix="/auth", tags=["Autenticação"])

# Usuario fixo do professor para login na Sprint 3
USUARIO_PROFESSOR = {
    "email": "professor@escola.pr.gov.br",
    "senha": "123456",
    "nome": "Prof. Sala de Recursos",
}


class DadosLogin(BaseModel):
    email: str
    senha: str


# ==========================================================
# ROTA DE LOGIN: VALIDA CREDENCIAIS E DEVOLVE O TOKEN JWT
# ==========================================================
@router.post("/login")
def fazer_login(dados: DadosLogin):
    email_limpo = dados.email.strip().lower()

    if (
        email_limpo != USUARIO_PROFESSOR["email"]
        or dados.senha != USUARIO_PROFESSOR["senha"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha incorretos.",
        )

    token = criar_token_jwt(email_limpo)

    return {
        "access_token": token,
        "token_type": "bearer",
        "nome": USUARIO_PROFESSOR["nome"],
        "email": USUARIO_PROFESSOR["email"],
    }
