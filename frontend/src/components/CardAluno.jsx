import { FiArrowRight, FiFileText } from "react-icons/fi";
import BadgeStatus from "./BadgeStatus";

export default function CardAluno({ aluno, aoSelecionar }) {
  return (
    <div
      onClick={() => aoSelecionar(aluno.id)}
      className="bg-white border border-slate-200 hover:border-blue-500 rounded-lg p-5 shadow-xs transition-all cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-slate-800 text-base">{aluno.nome}</h3>
          <BadgeStatus status={aluno.statusRelatorio} />
        </div>

        <p className="text-xs text-slate-600 mb-3">
          {aluno.turma} &bull; {aluno.atendimento}
        </p>

        <span className="text-xs font-medium text-blue-800 bg-blue-50 border border-blue-200 inline-block px-2.5 py-1 rounded">
          {aluno.condicao}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 mt-5 pt-3 border-t border-slate-100">
        <span className="flex items-center gap-1.5">
          <FiFileText className="w-4 h-4 text-slate-400" />
          {aluno.anotacoes.length} observação(ões)
        </span>

        <span className="inline-flex items-center gap-1 font-medium text-blue-700">
          Abrir acompanhamento
          <FiArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
