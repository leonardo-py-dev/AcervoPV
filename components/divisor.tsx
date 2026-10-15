import Link from "next/link";
import { Disco } from "@/components/disco";
import { anguloDoDisco } from "@/lib/acervo";
import { separarArtistas } from "@/lib/texto";
import { temaDe } from "@/lib/temas";
import type { Pessoa } from "@/lib/tipos";

/**
 * Cada pessoa é um divisor de caixa de disco: a etiqueta em cima, e atrás dela
 * os discos. Isso mapeia a estrutura do dado, então não é enfeite.
 *
 * A cor da caixa não vem de um catálogo de cores — é a cor do rótulo do disco
 * daquela pessoa, e o tema que dá nome a esse rótulo saiu das músicas e das
 * palavras dela (`lib/temas.ts`).
 */
export function Divisor({ pessoa }: { pessoa: Pessoa }) {
  const tema = temaDe(pessoa.tema);

  return (
    <Link
      href={`/pessoa/${pessoa.slug}`}
      className="divisor group block transition-colors hover:border-papel/25"
    >
      <span className="flex items-center justify-between gap-4 border-b border-papel/10 px-5 py-3">
        <span className="flex items-baseline gap-3">
          <span
            aria-hidden="true"
            className="block h-5 w-1"
            style={{ backgroundColor: tema.cor }}
          />
          <span
            className="font-selo text-xl font-extrabold tracking-tight text-papel"
            style={{ fontVariationSettings: '"wdth" 68' }}
          >
            {pessoa.nome}
          </span>
        </span>
        <Disco
          id={`aba-${pessoa.slug}`}
          pessoa={pessoa.nome}
          tema={tema}
          tamanho="pequeno"
          angulo={anguloDoDisco(pessoa.slug)}
          className="size-14 shrink-0"
        />
      </span>

      <span className="block px-5 py-5">
        {pessoa.faixas.length === 0 ? (
          <span className="prosa block text-papel-2">
            A lista desta pessoa ainda não chegou ao acervo.
          </span>
        ) : (
          <>
            <span
              className="block font-selo text-sm"
              style={{ color: tema.cor, fontVariationSettings: '"wdth" 80' }}
            >
              {tema.nome}
            </span>
            {pessoa.resumo[0] ? (
              <span className="prosa mt-2 line-clamp-2 block text-papel-2">
                {pessoa.resumo[0]}
              </span>
            ) : null}
            <span className="mt-4 block text-sm text-papel-2/80">{quemVeio(pessoa)}</span>
          </>
        )}
      </span>
    </Link>
  );
}

/** "14 faixas de Tim Maia e Legião Urbana." / "11 faixas de 50 Cent, Seu Jorge e mais 6 artistas." */
function quemVeio(pessoa: Pessoa): string {
  const nomes = [...new Set(pessoa.faixas.flatMap((faixa) => separarArtistas(faixa.artista)))];
  const total = nomes.length;
  const faixas = pessoa.faixas.length;

  // Guarda contra dado malformado: faixa sem artista não devolve vazio na cara do leitor.
  if (total === 0) return `${faixas} ${faixaPlural(faixas)} cadastrada${faixas === 1 ? "" : "s"} sem artista.`;
  if (total === 1) return `${faixas} ${faixaPlural(faixas)} de ${nomes[0]}.`;
  if (total === 2) return `${faixas} ${faixaPlural(faixas)} de ${nomes[0]} e ${nomes[1]}.`;

  return `${faixas} ${faixaPlural(faixas)} de ${nomes[0]}, ${nomes[1]} e mais ${total - 2} ${
    total - 2 === 1 ? "artista" : "artistas"
  }.`;
}

function faixaPlural(n: number): string {
  return n === 1 ? "faixa" : "faixas";
}