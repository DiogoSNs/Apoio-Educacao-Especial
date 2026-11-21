"use client";

import { useEffect, useState } from "react";
import {
  adicionarAnotacaoAPI,
  aprovarRelatorioAPI,
  criarAlunoAPI,
  excluirAlunoAPI,
  fazerLoginAPI,
  gerarRelatorioAPI,
  listarAlunosAPI,
  removerAnotacaoAPI,
} from "@/services/api";

export function useGestaoRelatorios() {
  const [token, setToken] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, definirBusca] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [gerandoIA, setGerandoIA] = useState(false);
  const [erroAPI, setErroAPI] = useState("");

  // Ao abrir a pagina, verifica se ja existe um token JWT salvo no navegador
  useEffect(() => {
    const tokenSalvo = localStorage.getItem("token_jwt_aee");
    if (tokenSalvo) {
      setToken(tokenSalvo);
    }
  }, []);

  // Sempre que o token existir, busca a lista de alunos reais da API (GET /alunos)
  useEffect(() => {
    if (token) {
      carregarAlunosDaAPI(token);
    }
  }, [token]);

  async function carregarAlunosDaAPI(tokenAtual) {
    setCarregando(true);
    setErroAPI("");

    try {
      const listaDaAPI = await listarAlunosAPI(tokenAtual);
      setAlunos(listaDaAPI);
    } catch (erro) {
      setErroAPI(erro.message || "Erro ao buscar alunos na API.");
      if (erro.message && erro.message.includes("Token")) {
        realizarLogout();
      }
    } finally {
      setCarregando(false);
    }
  }

  // ==========================================================
  // 1. AUTENTICACAO (LOGIN E LOGOUT COM JWT)
  // ==========================================================
  async function realizarLogin(email, senha) {
    const resposta = await fazerLoginAPI(email, senha);
    localStorage.setItem("token_jwt_aee", resposta.access_token);
    setToken(resposta.access_token);
  }

  function realizarLogout() {
    localStorage.removeItem("token_jwt_aee");
    setToken(null);
    setAlunos([]);
    setAlunoSelecionadoId(null);
    setErroAPI("");
  }

  // Procura o aluno selecionado na lista carregada da API
  const alunoSelecionado =
    alunos.find((aluno) => aluno.id === alunoSelecionadoId) || null;

  const alunosFiltrados = alunos.filter((aluno) => {
    const textoBusca = busca.trim().toLowerCase();
    const nomeConfere = aluno.nome.toLowerCase().includes(textoBusca);
    const statusConfere =
      filtroStatus === "todos" || aluno.statusRelatorio === filtroStatus;

    return nomeConfere && statusConfere;
  });

  // ==========================================================
  // 2. CRIAR NOVO ALUNO NA API (POST /alunos)
  // ==========================================================
  async function adicionarNovoAluno(nome, turma, condicao, atendimento) {
    setErroAPI("");

    try {
      const alunoCriado = await criarAlunoAPI(token, {
        nome,
        turma,
        condicao,
        atendimento,
      });
      setAlunos([alunoCriado, ...alunos]);
    } catch (erro) {
      setErroAPI(erro.message || "Erro ao cadastrar aluno na API.");
    }
  }

  // ==========================================================
  // 3. GERAR RASCUNHO COM A IA NA API (POST /alunos/{id}/gerar-relatorio)
  // ==========================================================
  async function acionarGeracaoIA(callbackSucesso) {
    if (!alunoSelecionado) return;
    setGerandoIA(true);
    setErroAPI("");

    try {
      const alunoAtualizado = await gerarRelatorioAPI(token, alunoSelecionado.id);

      const listaAtualizada = alunos.map((aluno) =>
        aluno.id === alunoAtualizado.id ? alunoAtualizado : aluno
      );

      setAlunos(listaAtualizada);

      if (callbackSucesso) {
        callbackSucesso();
      }
    } catch (erro) {
      setErroAPI(erro.message || "Erro ao gerar relatório com a IA.");
    } finally {
      setGerandoIA(false);
    }
  }

  function atualizarTextoRelatorio(novoTexto) {
    if (!alunoSelecionado) return;

    const listaAtualizada = alunos.map((aluno) => {
      if (aluno.id === alunoSelecionado.id) {
        return {
          ...aluno,
          relatorioTexto: novoTexto,
        };
      }
      return aluno;
    });

    setAlunos(listaAtualizada);
  }

  // ==========================================================
  // 4. FUNCOES RESTANTES (PARTE DO EDUARDO PARA LIGAR NA API)
  // ==========================================================
  function substituirAlunoNaLista(alunoAtualizado) {
    const listaAtualizada = alunos.map((aluno) =>
      aluno.id === alunoAtualizado.id ? alunoAtualizado : aluno
    );

    setAlunos(listaAtualizada);
  }

  async function adicionarAnotacao(categoria, texto, callbackSucesso) {
    if (!alunoSelecionado) return;
    setErroAPI("");

    try {
      const alunoAtualizado = await adicionarAnotacaoAPI(
        token,
        alunoSelecionado.id,
        categoria,
        texto
      );
      substituirAlunoNaLista(alunoAtualizado);

      if (callbackSucesso) {
        callbackSucesso();
      }
    } catch (erro) {
      setErroAPI(erro.message || "Erro ao adicionar a anotação.");
    }
  }

  async function removerAnotacao(anotacaoId) {
    if (!alunoSelecionado) return;
    setErroAPI("");

    try {
      const alunoAtualizado = await removerAnotacaoAPI(
        token,
        alunoSelecionado.id,
        anotacaoId
      );
      substituirAlunoNaLista(alunoAtualizado);
    } catch (erro) {
      setErroAPI(erro.message || "Erro ao remover a anotação.");
    }
  }

  async function excluirAluno() {
    if (!alunoSelecionado) return;
    setErroAPI("");

    try {
      await excluirAlunoAPI(token, alunoSelecionado.id);

      const listaAtualizada = alunos.filter(
        (aluno) => aluno.id !== alunoSelecionado.id
      );

      setAlunos(listaAtualizada);
      setAlunoSelecionadoId(null);
    } catch (erro) {
      setErroAPI(erro.message || "Erro ao excluir o aluno.");
    }
  }

  async function aprovarRelatorio(callbackSucesso) {
    if (!alunoSelecionado) return;
    setErroAPI("");

    try {
      const alunoAtualizado = await aprovarRelatorioAPI(
        token,
        alunoSelecionado.id,
        alunoSelecionado.relatorioTexto
      );
      substituirAlunoNaLista(alunoAtualizado);

      if (callbackSucesso) {
        callbackSucesso();
      }
    } catch (erro) {
      setErroAPI(erro.message || "Erro ao aprovar o relatório.");
    }
  }

  return {
    token,
    realizarLogin,
    realizarLogout,
    alunos,
    alunosFiltrados,
    alunoSelecionado,
    setAlunoSelecionadoId,
    filtroStatus,
    setFiltroStatus,
    busca,
    definirBusca,
    carregando,
    gerandoIA,
    erroAPI,
    setErroAPI,
    adicionarAnotacao,
    removerAnotacao,
    adicionarNovoAluno,
    excluirAluno,
    acionarGeracaoIA,
    atualizarTextoRelatorio,
    aprovarRelatorio,
  };
}
