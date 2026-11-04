"use client";

import { useState } from "react";
import { alunosIniciaisMock } from "@/services/dadosMock";
import { gerarRascunhoRelatorioIA } from "@/services/geradorRelatorioMock";

export function useGestaoRelatorios() {
  const [alunos, setAlunos] = useState(alunosIniciaisMock);
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState(null);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [busca, definirBusca] = useState("");
  const [gerandoIA, setGerandoIA] = useState(false);

  const alunoSelecionado =
    alunos.find((aluno) => aluno.id === alunoSelecionadoId) || null;

  const alunosFiltrados = alunos.filter((aluno) => {
    const textoBusca = busca.trim().toLowerCase();
    const nomeConfere = aluno.nome.toLowerCase().includes(textoBusca);
    const statusConfere = filtroStatus === "todos" || aluno.statusRelatorio === filtroStatus;

    return nomeConfere && statusConfere;
  });

  function obterDataHoje() {
    return new Date().toLocaleDateString("pt-BR");
  }

  function adicionarAnotacao(categoria, texto) {
    if (!alunoSelecionado) return;

    const novaAnotacao = {
      id: Date.now(),
      data: obterDataHoje(),
      categoria,
      texto,
    };

    const listaAtualizada = alunos.map((aluno) => {
      if (aluno.id === alunoSelecionado.id) {
        return {
          ...aluno,
          ultimaAtualizacao: obterDataHoje(),
          anotacoes: [...aluno.anotacoes, novaAnotacao],
        };
      }
      return aluno;
    });

    setAlunos(listaAtualizada);
  }

  function removerAnotacao(anotacaoId) {
    if (!alunoSelecionado) return;

    const listaAtualizada = alunos.map((aluno) => {
      if (aluno.id === alunoSelecionado.id) {
        return {
          ...aluno,
          anotacoes: aluno.anotacoes.filter((a) => a.id !== anotacaoId),
        };
      }
      return aluno;
    });

    setAlunos(listaAtualizada);
  }

  function adicionarNovoAluno(nome, turma, condicao, atendimento) {
    const novoAluno = {
      id: Date.now(),
      nome,
      turma,
      condicao,
      atendimento,
      statusRelatorio: "pendente",
      ultimaAtualizacao: obterDataHoje(),
      anotacoes: [],
      relatorioTexto: "",
    };

    setAlunos([novoAluno, ...alunos]);
  }

  function acionarGeracaoIA(callbackSucesso) {
    if (!alunoSelecionado) return;
    setGerandoIA(true);

    setTimeout(() => {
      const textoGerado = gerarRascunhoRelatorioIA(alunoSelecionado);

      const listaAtualizada = alunos.map((aluno) => {
        if (aluno.id === alunoSelecionado.id) {
          return {
            ...aluno,
            relatorioTexto: textoGerado,
            statusRelatorio: "rascunho",
            ultimaAtualizacao: obterDataHoje(),
          };
        }
        return aluno;
      });

      setAlunos(listaAtualizada);
      setGerandoIA(false);

      if (callbackSucesso) {
        callbackSucesso();
      }
    }, 500);
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

  function aprovarRelatorio() {
    if (!alunoSelecionado) return;

    const listaAtualizada = alunos.map((aluno) => {
      if (aluno.id === alunoSelecionado.id) {
        return {
          ...aluno,
          statusRelatorio: "aprovado",
          ultimaAtualizacao: obterDataHoje(),
        };
      }
      return aluno;
    });

    setAlunos(listaAtualizada);
  }

  return {
    alunos,
    alunosFiltrados,
    alunoSelecionado,
    setAlunoSelecionadoId,
    filtroStatus,
    setFiltroStatus,
    busca,
    definirBusca,
    gerandoIA,
    adicionarAnotacao,
    removerAnotacao,
    adicionarNovoAluno,
    acionarGeracaoIA,
    atualizarTextoRelatorio,
    aprovarRelatorio,
  };
}
