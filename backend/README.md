# Backend - API Apoio Educação Especial (FastAPI)

API desenvolvida em Python com FastAPI para a Sprint 2.

## Estrutura de Pastas
- `main.py`: Inicialização do servidor FastAPI e configuração de CORS.
- `config.py`: Leitura das variáveis de ambiente (chave e modelo do Gemini, origens do CORS).
- `dados_memoria.py`: Lista de alunos em memória para a Sprint 2.
- `schemas/aluno_schema.py`: Modelos Pydantic alinhados com o frontend.
- `services/ia_service.py`: Integração com o Google Gemini (`gemini-3.5-flash-lite`) via variável de ambiente `GEMINI_API_KEY`.
- `routers/alunos_router.py`: Endpoints REST da aplicação.

## Como Executar Localmente

1. Entre na pasta `backend`:
```bash
cd backend
```

2. Crie e ative o ambiente virtual (opcional, mas recomendado):
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
GEMINI_MODELO=gemini-3.5-flash-lite
ORIGENS_PERMITIDAS=http://localhost:3000
```

`GEMINI_MODELO` e `ORIGENS_PERMITIDAS` são opcionais. Sem elas, a API usa o modelo `gemini-3.5-flash-lite` e aceita qualquer origem (`*`). Para mais de uma origem, separe por vírgula. Depois de mudar o `.env`, reinicie o servidor.

5. Inicie o servidor:
```bash
uvicorn main:app --reload
```

6. Acesse a documentação interativa (Swagger) em:
`http://localhost:8000/docs`
