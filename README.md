# Sistema de Apoio à Educação Especial

Projeto desenvolvido para a disciplina de Desenvolvimento de Sistemas Web (UTFPR).

## Equipe (Dupla)
- **Diogo Augusto Silvério Nascimento**
- **Eduardo Moscatelli Martinho**

## Repositório e Links de Produção
- **Repositório GitHub:** https://github.com/DiogoSNs/Apoio-Educacao-Especial
- **API Backend (Render - Swagger):** https://apoio-educacao-especial-api.onrender.com/docs

## Tema e Descrição do Sistema
**Tema 4 - Sobrecarga burocrática na Educação Especial**

Na Educação Especial, os professores perdem muito tempo preenchendo relatórios e documentos individuais de acompanhamento para cada aluno, sobrando menos tempo para o atendimento em sala. Nosso sistema é voltado para os professores da educação básica e de atendimento especializado organizarem os dados dos alunos atendidos e anotarem observações rápidas do dia a dia. A IA vai entrar para juntar essas anotações curtas do professor e montar um rascunho de relatório individual estruturado, baseado apenas no que foi anotado. Depois disso, o professor só precisa revisar o texto, ajustar o que quiser e salvar o documento no histórico do aluno.

## Stack e Tecnologias Utilizadas
- **Frontend:** Next.js (React), Tailwind CSS e React Icons
- **Backend:** Python com FastAPI
- **Banco de Dados:** PostgreSQL (hospedado no Neon DB) com ORM SQLModel (e suporte a SQLite local)
- **Autenticação:** JWT (`PyJWT` com esquema Bearer)
- **Inteligência Artificial:** Google Gemini API (`google-genai`)

## Estrutura do Repositório
```text
├── frontend/                  # Aplicação web em Next.js
│   ├── src/app/               # Página principal e layout (page.js, layout.js)
│   ├── src/components/        # Componentes visuais reutilizáveis
│   ├── src/hooks/             # Hook de gerenciamento de estado (useGestaoRelatorios.js)
│   └── src/services/          # Comunicação com a API (api.js) e exportação .txt
│
└── backend/                   # API REST em Python com FastAPI
    ├── main.py                # Inicialização do FastAPI, CORS e banco de dados
    ├── database.py            # Conexão SQLModel com PostgreSQL (Neon) e carga inicial
    ├── dados_memoria.py       # Dados iniciais (seed) para popular o banco na 1ª execução
    ├── auth/jwt_auth.py       # Criação e validação de tokens JWT
    ├── models/modelos_db.py   # Tabelas SQLModel (AlunoDB e AnotacaoDB com relacionamento 1:N)
    ├── schemas/aluno_schema.py# Schemas Pydantic de entrada e saída
    ├── services/ia_service.py # Integração com o modelo Google Gemini
    └── routers/               # Rotas de autenticação (/auth) e alunos/relatórios (/alunos)
```

## Como Executar o Backend (FastAPI)

1. Acesse a pasta `backend`:
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

4. Crie um arquivo `.env` na pasta `backend/` (baseado no `.env.example`):
```env
GEMINI_API_KEY=sua_chave_do_google_ai_studio
JWT_SECRET=chave_secreta_jwt_educacao_especial
ORIGENS_PERMITIDAS=http://localhost:3000
DATABASE_URL=postgresql://usuario:senha@host.neon.tech/neondb?sslmode=require
```
*(Observação: Caso `DATABASE_URL` não seja informada, o sistema utiliza automaticamente um banco SQLite local `banco_local.db`).*

5. Inicie o servidor:
```bash
uvicorn main:app --reload
```

6. A API ficará disponível em `http://localhost:8000` e a documentação interativa em `http://localhost:8000/docs`.

## Como Executar o Frontend (Next.js)

1. Acesse a pasta `frontend`:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Crie um arquivo `.env.local` na pasta `frontend/` (baseado no `.env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

5. Acesse `http://localhost:3000` no navegador.

### Credenciais de Acesso do Professor (Login)
- **E-mail:** `professor@escola.pr.gov.br`
- **Senha:** `123456`
