import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinhaFaixa } from "@/components/linha-faixa";
import { acervo, buscarArtista } from "@/lib/acervo";
import type { EntradaDeFaixa, Pessoa } from "@/lib/tipos";

export function generateStaticParams() {
  return acervo.artistas.map((artista) => ({ slug: artista.slug }));
}

export async function generateMetadata(props: PageProps<"/artista/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const artista = buscarArtista(slug);
  if (!artista) return {};
  const pessoasDistintas = new Set(artista.entradas.map((e) => e.pessoa.slug)).size;
  return {
    title: artista.nome,
    description: `${artista.entradas.length} faixas de ${artista.nome} no acervo, em ${pessoasDistintas} ${
      pessoasDistintas === 1 ? "caixa" : "caixas"
    }.`,
  };
}

export default async function PaginaArtista(props: PageProps<"/artista/[slug]">) {
  const { slug } = await props.params;
  const artista = buscarArtista(slug);
  if (!artista) notFound();

  const porPessoa = agruparPorPessoa(artista.entradas);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <Link href="/artistas" className="text-sm text-papel-2 hover:text-papel">
        Voltar ao índice de artistas
      </Link>

      <h1
        className="mt-8 font-selo text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] font-extrabold tracking-tight"
        style={{ fontVariationSettings: '"wdth" 64' }}
      >
        {artista.nome}
      </h1>
      <p className="prosa mt-4 text-papel-2">
        {artista.entradas.length}{" "}
        {artista.entradas.length === 1 ? "faixa" : "faixas"}, em {porPessoa.length}{" "}
        {porPessoa.length === 1 ? "caixa" : "caixas"}.
      </p>

      <div className="mt-12 space-y-10">
        {porPessoa.map(({ pessoa, entradas }) => (
          <section key={pessoa.slug} aria-labelledby={`caixa-${pessoa.slug}`}>
            <h2
              id={`caixa-${pessoa.slug}`}
              className="flex items-baseline gap-3 font-selo text-lg font-extrabold tracking-tight"
              style={{ fontVariationSettings: '"wdth" 72' }}
            >
              <span aria-hidden="true" className="block h-4 w-1 bg-carimbo" />
              <Link href={`/pessoa/${pessoa.slug}`} className="hover:text-lampiao">
                {pessoa.nome}
              </Link>
            </h2>
            <ul className="mt-3 divide-y divide-papel/10 border-t border-papel/10">
              {entradas.map((entrada) => (
                <li key={entrada.faixa.id}>
                  <LinhaFaixa faixa={entrada.faixa} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function agruparPorPessoa(entradas: EntradaDeFaixa[]): { pessoa: Pessoa; entradas: EntradaDeFaixa[] }[] {
  const grupos = new Map<string, { pessoa: Pessoa; entradas: EntradaDeFaixa[] }>();
  for (const entrada of entradas) {
    const grupo = grupos.get(entrada.pessoa.slug);
    if (grupo) grupo.entradas.push(entrada);
    else grupos.set(entrada.pessoa.slug, { pessoa: entrada.pessoa, entradas: [entrada] });
  }
  return [...grupos.values()];
}