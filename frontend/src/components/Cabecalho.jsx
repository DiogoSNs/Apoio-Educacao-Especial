import { FiBookOpen, FiLogOut, FiUser } from "react-icons/fi";

export default function Cabecalho({ totalAlunos, totalAprovados, aoSair }) {
  return (
    <header className="bg-blue-800 text-white border-b border-blue-900 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-blue-700 p-2.5 rounded-lg">
            <FiBookOpen className="w-6 h-6 text-blue-100" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Apoio Educação Especial</h1>
            <p className="text-xs text-blue-200">
              Registro de observações diárias e geração assistida de relatórios pedagógicos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs bg-blue-900/60 px-3 py-2 rounded-md">
          <div>
            <span className="text-blue-200">Relatórios aprovados: </span>
            <strong className="text-white">
              {totalAprovados} de {totalAlunos}
            </strong>
          </div>
          <span className="text-blue-400">|</span>
          <div className="flex items-center gap-1.5 text-blue-100">
            <FiUser className="w-4 h-4" />
            <span>Prof. Sala de Recursos</span>
          </div>
          {aoSair && (
            <>
              <span className="text-blue-400">|</span>
              <button
                type="button"
                onClick={aoSair}
                className="inline-flex items-center gap-1 text-red-200 hover:text-white font-medium cursor-pointer"
                title="Encerrar sessão"
              >
                <FiLogOut className="w-3.5 h-3.5" />
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
