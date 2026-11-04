"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import MensagemFeedback from "./MensagemFeedback";

export default function FormularioAnotacao({ aoAdicionar }) {
  const [categoria, setCategoria] = useState("Adaptação de Material");
  const [texto, setTexto] = useState("");
  const [feedback, setFeedback] = useState({ tipo: "", texto: "" });

  function handleSubmit(e) {
    e.preventDefault();

    if (texto.trim().length < 10) {
      setFeedback({
        tipo: "erro",
        texto: "Digite uma observação válida (mínimo de 10 caracteres).",
      });
      return;
    }

    aoAdicionar(categoria, texto.trim());
    setTexto("");
    setFeedback({
      tipo: "sucesso",
      texto: "Observação registrada com sucesso no histórico do aluno!",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3"
    >
      <h4 className="text-sm font-semibold text-slate-800">
        Nova Observação do Dia a Dia
      </h4>

      <MensagemFeedback
        tipo={feedback.tipo}
        texto={feedback.texto}
        aoFechar={() => setFeedback({ tipo: "", texto: "" })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Categoria
          </label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="Adaptação de Material">Adaptação de Material</option>
            <option value="Avaliação">Avaliação</option>
            <option value="Leitura e Escrita">Leitura e Escrita</option>
            <option value="Interação e Rotina">Interação e Rotina</option>
            <option value="Participação em Aula">Participação em Aula</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Descrição rápida da observação
          </label>
          <input
            type="text"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Ex: Realizou a atividade com apoio de imagens e tempo estendido..."
            className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-medium px-3.5 py-2 rounded-md transition-colors cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          Adicionar Anotação
        </button>
      </div>
    </form>
  );
}

