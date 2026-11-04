// Baixa o texto do relatório do aluno como um arquivo .txt
export function baixarRelatorio(aluno) {
  const arquivo = new Blob([aluno.relatorioTexto], { type: "text/plain;charset=utf-8" });
  const endereco = URL.createObjectURL(arquivo);

  const link = document.createElement("a");
  link.href = endereco;
  link.download = "relatorio-" + aluno.nome.replaceAll(" ", "-") + ".txt";
  link.click();

  URL.revokeObjectURL(endereco);
}
