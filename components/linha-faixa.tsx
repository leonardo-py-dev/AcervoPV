import Link from "next/link";
import type { Faixa as TipoFaixa } from "@/lib/tipos";

/**
 * Uma linha de faixa: o furo do disco, o título, o artista.
 * O anel no lugar do bullet é a referência — um disco de 7 polegadas visto de
 * cima tem um furo no meio. Link de verdade (não `div` com handler), para o
 * teclado passar por cima e o botão direito do mouse continuar funcionando.
 */
export function LinhaFaixa({
  faixa,
  rotuloPessoa,
}: {
  faixa: TipoFaixa;
  /** Só aparece quando a listagem cruza mais de uma pessoa. */
  rotuloPessoa?: string;
}) {
  return (
    <Link
      href={`/faixa/${faixa.id}`}
      className="group grid grid-cols-[auto_1fr] items-baseline gap-x-4 py-3 transition-colors"
    >
      <span
        aria-hidden="true"
        className="mt-2 block size-1.5 shrink-0 rounded-full border border-papel-2/60 transition-colors group-hover:border-carimbo-texto"
      />
      <span className="min-w-0">
        <span className="block font-selo text-[1.0625rem] font-semibold text-papel group-hover:text-lampiao">
          {faixa.titulo}
        </span>
        <span className="mt-0.5 block font-prosa text-sm italic text-papel-2">
          {faixa.artista}
          {rotuloPessoa ? <span className="not-italic"> — {rotuloPessoa}</span> : null}
        </span>
      </span>
    </Link>
  );
}