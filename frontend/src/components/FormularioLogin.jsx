"use client";

import { useState } from "react";
import { FiBookOpen, FiLogIn } from "react-icons/fi";
import MensagemFeedback from "./MensagemFeedback";

export default function FormularioLogin({ aoLogar }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [entrando, setEntrando] = useState(false);
  const [erroLogin, setErroLogin] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim() || !senha.trim()) {
      setErroLogin("Preencha o e-mail e a senha para entrar.");
      return;
    }

    setEntrando(true);
    setErroLogin("");

    try {
      await aoLogar(email.trim(), senha);
    } catch (erro) {
      setErroLogin(erro.message || "Não foi possível conectar com a API.");
    } finally {
      setEntrando(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="bg-blue-700 p-2.5 rounded-lg text-white">
            <FiBookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800">
              Apoio Educação Especial
            </h1>
            <p className="text-xs text-slate-500">
              Acesso do professor ao painel de relatórios
            </p>
          </div>
        </div>

        <MensagemFeedback
          tipo="erro"
          texto={erroLogin}
          aoFechar={() => setErroLogin("")}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Senha
            </label>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={entrando}
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white text-sm font-medium py-2.5 rounded-md transition-colors cursor-pointer"
          >
            <FiLogIn className="w-4 h-4" />
            {entrando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
