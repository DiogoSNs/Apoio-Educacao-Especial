"use client";

import Cabecalho from "@/components/Cabecalho";
import CampoBusca from "@/components/CampoBusca";
import CardAluno from "@/components/CardAluno";
import FormularioLogin from "@/components/FormularioLogin";
import FormularioNovoAluno from "@/components/FormularioNovoAluno";
import MensagemFeedback from "@/components/MensagemFeedback";
import PainelRelatorio from "@/components/PainelRelatorio";
import { useGestaoRelatorios } from "@/hooks/useGestaoRelatorios";

export default function PaginaInicial() {
  const {
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
  } = useGestaoRelatorios();

  // 1. Se nao tiver token JWT, exibe a tela de Login
  if (!token) {
    return <FormularioLogin aoLogar={realizarLogin} />;
  }

  const totalAprovados = alunos.filter(
    (a) => a.statusRelatorio === "aprovado"
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Cabecalho
        totalAlunos={alunos.length}
        totalAprovados={totalAprovados}
        aoSair={realizarLogout}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 space-y-4">
        {/* Exibe erros vindos da API (tratamento visual de erro) */}
        <MensagemFeedback
          tipo="erro"
          texto={erroAPI}
          aoFechar={() => setErroAPI("")}
        />

        {/* Estado visual de carregamento enquanto busca na API */}
        {carregando ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-sm text-slate-600">
            Carregando dados dos alunos na API...
          </div>
        ) : !alunoSelecionado ? (
          <div className="space-y-5">
            <FormularioNovoAluno aoAdicionarAluno={adicionarNovoAluno} />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Alunos Atendidos ({alunosFiltrados.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Selecione um aluno para registrar observações ou gerar o relatório.
                </p>
              </div>

              <CampoBusca valor={busca} aoMudar={definirBusca} />

              <div className="flex flex-wrap gap-1.5">
                {[
                  { valor: "todos", rotulo: "Todos" },
                  { valor: "pendente", rotulo: "Pendentes" },
                  { valor: "rascunho", rotulo: "Rascunho IA" },
                  { valor: "aprovado", rotulo: "Aprovados" },
                ].map((item) => (
                  <button
                    key={item.valor}
                    type="button"
                    onClick={() => setFiltroStatus(item.valor)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      filtroStatus === item.valor
                        ? "bg-blue-700 text-white"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.rotulo}
                  </button>
                ))}
              </div>
            </div>

            {alunosFiltrados.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-sm text-slate-500">
                Nenhum aluno encontrado para esta busca ou filtro.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {alunosFiltrados.map((aluno) => (
                  <CardAluno
                    key={aluno.id}
                    aluno={aluno}
                    aoSelecionar={setAlunoSelecionadoId}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <PainelRelatorio
            aluno={alunoSelecionado}
            gerandoIA={gerandoIA}
            aoVoltar={() => setAlunoSelecionadoId(null)}
            aoExcluirAluno={excluirAluno}
            aoAdicionarAnotacao={adicionarAnotacao}
            aoRemoverAnotacao={removerAnotacao}
            aoGerarIA={acionarGeracaoIA}
            aoEditarRelatorio={atualizarTextoRelatorio}
            aoAprovarRelatorio={aprovarRelatorio}
          />
        )}
      </main>
    </div>
  );
}
