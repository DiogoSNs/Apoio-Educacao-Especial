from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers.alunos_router import router as alunos_router

# ==========================================================
# CONFIGURACAO PRINCIPAL DO FASTAPI
# ==========================================================
app = FastAPI(
    title="API Apoio Educação Especial",
    description="API para gerenciamento de observações diárias e geração de relatórios individuais com IA.",
    version="1.0.0",
)

# Permite que o frontend (Next.js) acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registra as rotas de alunos e relatorios
app.include_router(alunos_router)


@app.get("/", tags=["Status"])
def rota_inicial():
    return {
        "sistema": "API Apoio Educação Especial",
        "status": "online",
        "documentacao": "/docs",
    }

