export function gerarRascunhoRelatorioIA(aluno) {
  if (!aluno.anotacoes || aluno.anotacoes.length === 0) {
    return "";
  }

  const listaObservacoes = aluno.anotacoes
    .map((item) => `- Em ${item.data} (${item.categoria}): ${item.texto}`)
    .join("\n");

  const rascunho =
    `RELATÓRIO INDIVIDUAL DE ACOMPANHAMENTO PEDAGÓGICO (RASCUNHO IA)\n\n` +
    `Estudante: ${aluno.nome} | Turma: ${aluno.turma}\n` +
    `Condição/Necessidade: ${aluno.condicao}\n` +
    `Modalidade de Atendimento: ${aluno.atendimento}\n\n` +
    `1. Desenvolvimento e Observações do Período:\n` +
    `Com base nos registros realizados pelo professor durante os atendimentos, foram observados os seguintes pontos:\n` +
    `${listaObservacoes}\n\n` +
    `2. Síntese e Recomendações Pedagógicas:\n` +
    `A partir das anotações registradas acima, verifica-se que o(a) estudante responde de forma positiva às adaptações aplicadas em sala. Recomenda-se manter os recursos de apoio descritos nas observações e dar continuidade ao acompanhamento individualizado no próximo período.`;

  return rascunho;
}

