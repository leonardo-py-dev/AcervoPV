import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayerYoutube } from "@/components/player-youtube";
import { acervo, buscarFaixa, buscarPessoa } from "@/lib/acervo";
import { slugificar, separarArtistas } from "@/lib/texto";
import { urlBuscaLetra, urlYoutube } from "@/lib/youtube";

/** Bloqueia por ler o próprio `params`. Ver `app/pessoa/[slug]/page.tsx`. */
export const instant = false;

export function generateStaticParams() {
  return acervo.faixas.map((entrada) => ({ id: entrada.faixa.id }));
}

export async function generateMetadata(props: PageProps<"/faixa/[id]">): Promise<Metadata> {
  const { id } = await props.params;
  const entrada = buscarFaixa(id);
  if (!entrada) return {};
  return {
    title: `${entrada.faixa.titulo} — ${entrada.faixa.artista}`,
    description: `Uma das faixas que ${entrada.pessoa.nome} escolheu para o acervo.`,
  };
}

export default async function PaginaFaixa(props: PageProps<"/faixa/[id]">) {
  const { id } = await props.params;
  const entrada = buscarFaixa(id);
  if (!entrada) notFound();

  const { pessoa, faixa } = entrada;
  const artistas = separarArtistas(faixa.artista);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <Link href={`/pessoa/${pessoa.slug}`} className="text-sm text-papel-2 hover:text-papel">
        Voltar para {pessoa.nome}
      </Link>

      <h1
        className="mt-8 font-selo text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.05] font-extrabold tracking-tight"
        style={{ fontVariationSettings: '"wdth" 70' }}
      >
        {faixa.titulo}
      </h1>

      <p className="prosa mt-3 text-papel-2">
        {artistas.map((nomeArtista, indice) => (
          <span key={nomeArtista}>
            {indice > 0 ? ", " : ""}
            <Link
              href={`/artista/${slugificar(nomeArtista)}`}
              className="italic underline decoration-papel/25 underline-offset-4 hover:text-papel hover:decoration-papel"
            >
              {nomeArtista}
            </Link>
          </span>
        ))}
      </p>

      <div className="mt-8">
        <PlayerYoutube id={faixa.youtubeId} titulo={faixa.titulo} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={faixa.lyricsUrl ?? urlBuscaLetra(faixa.titulo, faixa.artista)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-papel/20 px-4 py-2 text-sm text-papel transition-colors hover:border-lampiao hover:text-lampiao"
        >
          {faixa.lyricsUrl ? "Ver a letra" : "Procurar a letra"}
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
        <a
          href={urlYoutube(faixa.youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-sm border border-papel/20 px-4 py-2 text-sm text-papel-2 transition-colors hover:border-papel/40 hover:text-papel"
        >
          Abrir no YouTube
          <span className="sr-only"> (abre em nova aba)</span>
        </a>
      </div>

      <p className="mt-10 text-sm text-papel-2">
        Escolhida por{" "}
        <Link href={`/pessoa/${pessoa.slug}`} className="text-papel underline underline-offset-4">
          {pessoa.nome}
        </Link>
        .{" "}
        {pessoa.resumo[0] ? <span className="text-papel-2/80">{resumoCurto(pessoa.resumo[0])}</span> : null}
      </p>

      <FaixasIrmas idDaFaixa={faixa.id} slugDaPessoa={pessoa.slug} />
    </div>
  );
}

/** Recorta na primeira frase, para não despejar o parágrafo inteiro embaixo do player. */
function resumoCurto(texto: string): string {
  const corte = texto.search(/[.!?](\s|$)/);
  return corte === -1 ? texto : texto.slice(0, corte + 1);
}

/** A faixa seguinte e a anterior na mesma caixa — a melhor forma de andar pelo acervo. */
function FaixasIrmas({ idDaFaixa, slugDaPessoa }: { idDaFaixa: string; slugDaPessoa: string }) {
  const pessoa = buscarPessoa(slugDaPessoa);
  if (!pessoa || pessoa.faixas.length < 2) return null;

  const indice = pessoa.faixas.findIndex((faixa) => faixa.id === idDaFaixa);
  const anterior = indice > 0 ? pessoa.faixas[indice - 1] : null;
  const proxima = indice < pessoa.faixas.length - 1 ? pessoa.faixas[indice + 1] : null;
  if (!anterior && !proxima) return null;

  return (
    <nav aria-label={`Outras faixas de ${pessoa.nome}`} className="mt-14 border-t border-papel/10 pt-6">
      <ul className="grid gap-4 sm:grid-cols-2">
        {anterior ? (
          <li>
            <Link href={`/faixa/${anterior.id}`} className="block hover:text-papel">
              <span className="block text-xs text-papel-2">Anterior</span>
              <span className="prosa block text-papel">{anterior.titulo}</span>
            </Link>
          </li>
        ) : null}
        {proxima ? (
          <li className="sm:text-right">
            <Link href={`/faixa/${proxima.id}`} className="block hover:text-papel">
              <span className="block text-xs text-papel-2">Próxima</span>
              <span className="prosa block text-papel">{proxima.titulo}</span>
            </Link>
          </li>
        ) : null}
      </ul>
    </nav>
  );
}