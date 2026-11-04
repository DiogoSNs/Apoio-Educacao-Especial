import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

export default function MensagemFeedback({ tipo, texto, aoFechar }) {
  if (!texto) return null;

  const estilos = {
    sucesso: "bg-green-50 border-green-300 text-green-800",
    erro: "bg-red-50 border-red-300 text-red-800",
    info: "bg-blue-50 border-blue-300 text-blue-800",
  };

  const estiloAtual = estilos[tipo] || estilos.info;

  return (
    <div
      className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-md border text-sm ${estiloAtual}`}
    >
      <div className="flex items-center gap-2">
        {tipo === "sucesso" && <FiCheckCircle className="w-4 h-4 shrink-0" />}
        {tipo === "erro" && <FiAlertCircle className="w-4 h-4 shrink-0" />}
        {tipo === "info" && <FiInfo className="w-4 h-4 shrink-0" />}
        <span>{texto}</span>
      </div>
      {aoFechar && (
        <button
          type="button"
          onClick={aoFechar}
          className="text-current opacity-70 hover:opacity-100 cursor-pointer"
          title="Fechar aviso"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

