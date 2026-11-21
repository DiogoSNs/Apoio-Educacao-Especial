import os
from datetime import datetime, timedelta, timezone
import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

load_dotenv()

# Esquema que le o cabecalho "Authorization: Bearer <token>"
esquema_bearer = HTTPBearer()


def obter_segredo_jwt() -> str:
    return os.getenv("JWT_SECRET", "chave_padrao_desenvolvimento_web")


# ==========================================================
# 1. FUNCAO QUE GERA O TOKEN JWT NO LOGIN
# ==========================================================
def criar_token_jwt(email: str) -> str:
    expiracao = datetime.now(timezone.utc) + timedelta(hours=24)
    dados_token = {
        "sub": email,
        "exp": expiracao,
    }
    token = jwt.encode(dados_token, obter_segredo_jwt(), algorithm="HS256")
    return token


# ==========================================================
# 2. FUNCAO QUE VALIDA O TOKEN NAS ROTAS PROTEGIDAS
# ==========================================================
def verificar_token(
    credenciais: HTTPAuthorizationCredentials = Depends(esquema_bearer),
) -> str:
    token = credenciais.credentials

    try:
        payload = jwt.decode(token, obter_segredo_jwt(), algorithms=["HS256"])
        email_usuario = payload.get("sub")
        if not email_usuario:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido.",
            )
        return email_usuario
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Sessão expirada. Faça login novamente.",
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token de autenticação inválido.",
        )
