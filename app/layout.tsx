import type { Metadata } from "next";
import { Archivo, Newsreader } from "next/font/google";
import Link from "next/link";
import "./globals.css";

/*
 * Duas famílias, Paper vernacular. Archivo carrega o eixo `wdth`: é ele que
 * comprime o rótulo no formato de etiqueta carimbada. Newsreader carrega as
 * reflexões das pessoas, que são o texto mais longo do site.
 */
const arquivo = Archivo({
  variable: "--font-arquivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Acervo — músicas que valem um brinde",
    template: "%s — Acervo",
  },
  description:
    "Um acervo de músicas escolhidas por cinco pessoas, cada uma com o relato de por que escolheu. Tim Maia, Legião Urbana, Bruno Mars, Coldplay e o que mais vier na caixa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${arquivo.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-breu-alto focus:px-4 focus:py-2 focus:text-papel"
        >
          Pular para o conteúdo
        </a>
        <header className="border-b border-papel/10">
          <div className="mx-auto flex max-w-5xl items-baseline justify-between gap-4 px-5 py-5">
            <Link
              href="/"
              className="font-selo text-lg font-extrabold tracking-tight"
              style={{ fontVariationSettings: '"wdth" 70' }}
            >
              Acervo
            </Link>
            <nav aria-label="Navegação principal">
              <ul className="flex gap-5 text-sm text-papel-2">
                <li>
                  <Link href="/busca" className="hover:text-papel">
                    Buscar
                  </Link>
                </li>
                <li>
                  <Link href="/artistas" className="hover:text-papel">
                    Artistas
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <footer className="mt-16 border-t border-papel/10">
          <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-papel-2">
            <p className="max-w-prose">
              O acervo guarda links, não letras: letra de música é obra protegida, e quem
              escreve ela é o artista. Cada faixa aponta para a fonte licenciada, ou para uma
              busca quando ainda não há uma cadastrada.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}