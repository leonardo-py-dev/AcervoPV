import type { Metadata } from "next";
import Link from "next/link";
import { acervo } from "@/lib/acervo";

export const metadata: Metadata = {
  title: "Artistas",
  description: "Todos os artistas do acervo, dasParticipações mais repetidas às uniques.",
};

export default function PaginaArtistas() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <h1
        className="font-selo text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] font-extrabold tracking-tight"
        style={{ fontVariationSettings: '"wdth" 64' }}
      >
        Artistas
      </h1>
      <p className="prosa mt-4 text-papel-2">
        {acervo.artistas.length} artistas em {acervo.faixas.length} faixas. Os que se repetem são
        os que dizem mais sobre o acervo: Tim Maia entra em quatro, Bruno Mars em três.
      </p>

      <ul className="mt-10 divide-y divide-papel/10 border-t border-papel/10">
        {acervo.artistas.map((artista) => (
          <li key={artista.slug}>
            <Link
              href={`/artista/${artista.slug}`}
              className="flex items-baseline justify-between gap-4 py-3 hover:text-papel"
            >
              <span className="font-prosa text-[1.0625rem]">{artista.nome}</span>
              <span className="shrink-0 text-sm text-papel-2">
                {artista.entradas.length}{" "}
                {artista.entradas.length === 1 ? "faixa" : "faixas"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}