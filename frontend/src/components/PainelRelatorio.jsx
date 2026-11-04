"use client";

import { useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiCpu,
  FiFileText,
  FiList,
  FiTrash2,
} from "react-icons/fi";
import BadgeStatus from "./BadgeStatus";
import FormularioAnotacao from "./FormularioAnotacao";
import MensagemFeedback from "./MensagemFeedback";

export default function PainelRelatorio({
  aluno,
  gerandoIA,
  aoVoltar,
  aoExcluirAluno,
  aoAdicionarAnotacao,
  aoRemoverAnotacao,
  aoGerarIA,
  aoEditarRelatorio,
  aoAprovarRelatorio,
}) {
  const [abaAtiva, setAbaAtiva] = useState("anotacoes");
  const [feedbackIA, setFeedbackIA] = useState({ tipo: "", texto: "" });

  function handleGerarRascunho() {
    if (aluno.anotacoes.length === 0) {
      setFeedbackIA({
        tipo: "erro",
        texto: "Adicione pelo menos uma observação antes de gerar o rascunho.",
      });
      return;
    }

    setFeedbackIA({ tipo: "", texto: "" });
    aoGerarIA(() => {
      setFeedbackIA({
        tipo: "info",
        texto: "Rascunho gerado com base nas anotações! Revise o texto abaixo e clique em Aprovar.",
      });
    });
  }

  function pedirExclusao() {
    const confirmou = window.confirm(
      "Excluir " + aluno.nome + "? As observações e o relatório dele também serão apagados."
    );

    if (confirmou) {
      aoExcluirAluno();
    }
  }

  function handleAprovar() {
    if (!aluno.relatorioTexto.trim()) {
      setFeedbackIA({
        tipo: "erro",
        texto: "O relatório não pode estar vazio para ser aprovado.",
      });
      return;
    }

    aoAprovarRelatorio();
    setFeedbackIA({
      tipo: "sucesso",
      texto: "Relatório salvo como Aprovado!",
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <button
          type="button"
          onClick={aoVoltar}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700 cursor-pointer"
        >
          <FiArrowLeft className="w-4 h-4" />
          Voltar para a lista de alunos
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-800">{aluno.nome}</h2>
              <BadgeStatus status={aluno.statusRelatorio} />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
              <strong>Turma:</strong> {aluno.turma} &nbsp;|&nbsp;{" "}
              <strong>Condição:</strong> {aluno.condicao} &nbsp;|&nbsp;{" "}
              <strong>Atendimento:</strong> {aluno.atendimento}
            </p>
          </div>

          <button
            type="button"
            onClick={pedirExclusao}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-md cursor-pointer"
          >
            <FiTrash2 className="w-4 h-4" />
            Excluir aluno
          </button>
        </div>

        <div className="flex gap-2 mt-5 pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setAbaAtiva("anotacoes")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
              abaAtiva === "anotacoes"
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FiList className="w-4 h-4" />
            Anotações do Dia a Dia ({aluno.anotacoes.length})
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva("relatorio")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
              abaAtiva === "relatorio"
                ? "bg-blue-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FiFileText className="w-4 h-4" />
            Relatório Individual (IA)
          </button>
        </div>
      </div>

      {abaAtiva === "anotacoes" && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
          <FormularioAnotacao aoAdicionar={aoAdicionarAnotacao} />

          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-semibold text-slate-800">
              Observações Registradas ({aluno.anotacoes.length})
            </h3>

            {aluno.anotacoes.length === 0 ? (
              <p className="text-sm text-slate-500 bg-slate-50 p-4 rounded border border-slate-200">
                Nenhuma observação cadastrada ainda para este aluno.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {aluno.anotacoes.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-3 bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                          {item.categoria}
                        </span>
                        <span className="text-xs text-slate-500">{item.data}</span>
                      </div>
                      <p className="text-slate-700 text-sm">{item.texto}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => aoRemoverAnotacao(item.id)}
                      className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Remover anotação"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {abaAtiva === "relatorio" && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                Relatório Individual
              </h3>
              <p className="text-xs text-slate-500">
                Monta o rascunho a partir das {aluno.anotacoes.length} observação(ões) cadastradas.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGerarRascunho}
              disabled={gerandoIA}
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              <FiCpu className="w-4 h-4" />
              {gerandoIA ? "Gerando..." : "Gerar Rascunho com IA"}
            </button>
          </div>

          <MensagemFeedback
            tipo={feedbackIA.tipo}
            texto={feedbackIA.texto}
            aoFechar={() => setFeedbackIA({ tipo: "", texto: "" })}
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">
              Texto do Relatório:
            </label>
            <textarea
              rows={12}
              value={aluno.relatorioTexto}
              onChange={(e) => aoEditarRelatorio(e.target.value)}
              placeholder="Clique em 'Gerar Rascunho com IA' para montar o relatório a partir das anotações do aluno..."
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-3.5 text-sm text-slate-800 leading-relaxed focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={handleAprovar}
              className="inline-flex items-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors cursor-pointer"
            >
              <FiCheck className="w-4 h-4" />
              Aprovar e Salvar Relatório
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
