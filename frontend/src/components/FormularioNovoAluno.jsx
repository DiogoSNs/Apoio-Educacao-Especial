"use client";

import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import MensagemFeedback from "./MensagemFeedback";

export default function FormularioNovoAluno({ aoAdicionarAluno }) {
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [turma, setTurma] = useState("");
  const [condicao, setCondicao] = useState("");
  const [atendimento, setAtendimento] = useState("Sala de Recursos");
  const [feedback, setFeedback] = useState({ tipo: "", texto: "" });

  function handleSubmit(e) {
    e.preventDefault();

    if (!nome.trim() || !turma.trim() || !condicao.trim()) {
      setFeedback({
        tipo: "erro",
        texto: "Preencha nome, turma e condição do aluno.",
      });
      return;
    }

    aoAdicionarAluno(nome.trim(), turma.trim(), condicao.trim(), atendimento.trim());
    setNome("");
    setTurma("");
    setCondicao("");
    setFeedback({
      tipo: "sucesso",
      texto: "Aluno cadastrado e selecionado na lista!",
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-3.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">
          Cadastro Rápido de Aluno
        </span>
        <button
          type="button"
          onClick={() => {
            setAberto(!aberto);
            setFeedback({ tipo: "", texto: "" });
          }}
          className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 hover:text-blue-900 cursor-pointer"
        >
          <FiUserPlus className="w-3.5 h-3.5" />
          {aberto ? "Fechar formulário" : "Novo Aluno"}
        </button>
      </div>

      {aberto && (
        <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
          <MensagemFeedback
            tipo={feedback.tipo}
            texto={feedback.texto}
            aoFechar={() => setFeedback({ tipo: "", texto: "" })}
          />

          <div>
            <label className="block text-xs text-slate-600 mb-1">Nome do estudante</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Gabriel Souza"
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Turma / Série</label>
              <input
                type="text"
                value={turma}
                onChange={(e) => setTurma(e.target.value)}
                placeholder="Ex: 9º Ano B"
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-600 mb-1">Condição / Necessidade</label>
              <input
                type="text"
                value={condicao}
                onChange={(e) => setCondicao(e.target.value)}
                placeholder="Ex: TEA / TDAH"
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-600 mb-1">Tipo de Atendimento</label>
            <input
              type="text"
              value={atendimento}
              onChange={(e) => setAtendimento(e.target.value)}
              className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium py-2 rounded transition-colors cursor-pointer"
          >
            Cadastrar Aluno
          </button>
        </form>
      )}
    </div>
  );
}

