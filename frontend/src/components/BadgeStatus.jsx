import { FiCheckCircle, FiClock, FiEdit3 } from "react-icons/fi";

export default function BadgeStatus({ status }) {
  if (status === "aprovado") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        <FiCheckCircle className="w-3.5 h-3.5" />
        Aprovado
      </span>
    );
  }

  if (status === "rascunho") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
        <FiEdit3 className="w-3.5 h-3.5" />
        Rascunho IA
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
      <FiClock className="w-3.5 h-3.5" />
      Pendente
    </span>
  );
}

