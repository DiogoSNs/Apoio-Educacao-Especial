import "./globals.css";

export const metadata = {
  title: "Apoio Educação Especial",
  description: "Sistema de acompanhamento e relatórios da Educação Especial",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">
        {children}
      </body>
    </html>
  );
}
