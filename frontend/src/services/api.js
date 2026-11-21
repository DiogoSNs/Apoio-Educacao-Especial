// ==========================================================
// SERVICO DE COMUNICACAO COM A API (FASTAPI)
// Usa a variavel de ambiente NEXT_PUBLIC_API_URL
// ==========================================================

const URL_API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// 1. Faz login e recebe o token JWT
export async function fazerLoginAPI(email, senha) {
  const resposta = await fetch(`${URL_API}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, senha }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.detail || "Erro ao realizar login.");
  }

  return dados;
}

// 2. Busca a lista de alunos na API enviando o token JWT
export async function listarAlunosAPI(token) {
  const resposta = await fetch(`${URL_API}/alunos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.detail || "Erro ao carregar lista de alunos.");
  }

  return dados;
}

// 3. Cadastra um novo aluno na API enviando o token JWT
export async function criarAlunoAPI(token, novoAluno) {
  const resposta = await fetch(`${URL_API}/alunos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(novoAluno),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.detail || "Erro ao cadastrar aluno na API.");
  }

  return dados;
}

// 4. Chama o endpoint da IA no FastAPI para gerar o rascunho do relatorio
export async function gerarRelatorioAPI(token, alunoId) {
  const resposta = await fetch(`${URL_API}/alunos/${alunoId}/gerar-relatorio`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.detail || "Erro ao gerar relatório com a IA.");
  }

  return dados;
}
