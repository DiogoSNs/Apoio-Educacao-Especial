import { FiSearch } from "react-icons/fi";

export default function CampoBusca({ valor, aoMudar }) {
  return (
    <div className="relative w-full sm:w-64">
      <FiSearch className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        placeholder="Buscar aluno pelo nome..."
        className="w-full bg-white border border-slate-300 rounded-md pl-8 pr-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
      />
    </div>
  );
}
