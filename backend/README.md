# Backend - API Apoio Educação Especial (FastAPI)

API desenvolvida em Python com FastAPI, SQLModel (PostgreSQL no Neon DB), autenticação JWT e integração com Google Gemini.

## Estrutura de Pastas
- `main.py`: Inicialização do servidor FastAPI, configuração de CORS e inicialização do banco.
- `database.py`: Conexão do SQLModel com o PostgreSQL (`DATABASE_URL`) e carga inicial das tabelas.
- `models/modelos_db.py`: Modelos das tabelas `AlunoDB` e `AnotacaoDB` com relacionamento `1:N`.
- `auth/jwt_auth.py`: Geração e verificação do token JWT (`JWT_SECRET`).
- `schemas/aluno_schema.py`: Modelos Pydantic alinhados com o frontend.
- `services/ia_service.py`: Integração com o Google Gemini via variável de ambiente `GEMINI_API_KEY`.
- `routers/auth_router.py`: Rota de autenticação (`POST /auth/login`).
- `routers/alunos_router.py`: Rotas protegidas por JWT para alunos, anotações e relatórios com IA.

## Como Executar Localmente

1. Entre na pasta `backend`:
```bash
cd backend
```

2. Crie e ative o ambiente virtual:
```bash
python -m venv .venv
.venv\Scripts\activate
```

3. Instale as dependências:
```bash
pip install -r requirements.txt
```

4. Crie um arquivo `.env` na pasta `backend/` baseado no `.env.example`:
```env
GEMINI_API_KEY=sua_chave_aqui
JWT_SECRET=chave_secreta_jwt_educacao_especial
ORIGENS_PERMITIDAS=http://localhost:3000
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require
```

5. Inicie o servidor:
```bash
uvicorn main:app --reload
```

6. Acesse a documentação interativa (Swagger) em:
`http://localhost:8000/docs`
