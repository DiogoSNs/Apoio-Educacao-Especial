# Sistema de Apoio à Educação Especial

Projeto desenvolvido para a disciplina de Desenvolvimento de Sistemas Web.

## Equipe (Dupla)
- **Diogo Augusto Silvério Nascimento**
- **Eduardo Moscatelli Martinho**

## Tema e Descrição do Sistema
**Tema 4 - Sobrecarga burocrática na Educação Especial**

Na Educação Especial, os professores perdem muito tempo preenchendo relatórios e documentos individuais de acompanhamento para cada aluno, sobrando menos tempo para o atendimento em sala. Nosso sistema é voltado para os professores da educação básica e de atendimento especializado organizarem os dados dos alunos atendidos e anotarem observações rápidas do dia a dia. A IA vai entrar para juntar essas anotações curtas do professor e montar um rascunho de relatório individual estruturado, baseado apenas no que foi anotado. Depois disso, o professor só precisa revisar o texto, ajustar o que quiser e salvar o documento no histórico do aluno.

## Tecnologias Utilizadas
- **Frontend:** Next.js (React), Tailwind CSS e React Icons
- **Backend (a partir da Sprint 2):** Python com FastAPI, SQLModel e Autenticação JWT

## Estrutura do Repositório
- `frontend/`: Aplicação web em Next.js com componentes reutilizáveis, gerenciamento de estado e dados mockados (Sprint 1).
- `backend/`: Diretório reservado para a API em FastAPI (Sprint 2 a 4).

## Como Executar o Projeto (Frontend - Sprint 1)

1. Acesse a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no navegador em `http://localhost:3000`.

### Gerar Versão Estática (Export)
Para gerar os arquivos estáticos na pasta `frontend/out`:
```bash
cd frontend
npm run build
```

