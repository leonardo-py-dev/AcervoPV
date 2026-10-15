import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Disco } from "@/components/disco";
import { LinhaFaixa } from "@/components/linha-faixa";
import { anguloDoDisco, buscarPessoa, pessoas } from "@/lib/acervo";
import { temaDe } from "@/lib/temas";

export function generateStaticParams() {
  return pessoas.map((pessoa) => ({ slug: pessoa.slug }));
}

export async function generateMetadata(props: PageProps<"/pessoa/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const pessoa = buscarPessoa(slug);
  if (!pessoa) return {};
  return {
    title: pessoa.nome,
    description: pessoa.resumo[0] ?? `As músicas que ${pessoa.nome} escolheu.`,
  };
}

export default async function PaginaPessoa(props: PageProps<"/pessoa/[slug]">) {
  const { slug } = await props.params;
  const pessoa = buscarPessoa(slug);
  if (!pessoa) notFound();

  const angulo = anguloDoDisco(pessoa.slug);
  const tema = temaDe(pessoa.tema);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <Link
        href="/"
        className="text-sm text-papel-2 hover:text-papel"
        style={{ fontVariationSettings: '"wdth" 85' }}
      >
        Voltar ao acervo
      </Link>

      <header className="mt-8 flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            id="titulo-pessoa"
            className="font-selo text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] font-extrabold tracking-tight"
            style={{ fontVariationSettings: '"wdth" 64' }}
          >
            {pessoa.nome}
          </h1>
          <p
            className="mt-3 font-selo text-sm"
            style={{ color: tema.cor, fontVariationSettings: '"wdth" 82' }}
          >
            {tema.nome}
          </p>
          {pessoa.faixas.length > 0 ? (
            <p className="prosa mt-4 text-papel-2">{tema.nota}</p>
          ) : null}
        </div>

        <Disco
          id={`pessoa-${pessoa.slug}`}
          pessoa={pessoa.nome}
          tema={tema}
          tamanho="grande"
          girar
          angulo={angulo}
          className="size-40 shrink-0 self-center sm:size-48"
        />
      </header>

      {pessoa.resumo.length > 0 ? (
        <div className="prosa mt-10 text-papel">
          {pessoa.resumo.map((paragrafo, indice) => (
            <p key={indice}>{paragrafo}</p>
          ))}
          <p className="mt-6 font-selo text-sm not-italic text-papel-2">
            — {pessoa.nome}
          </p>
        </div>
      ) : null}

      <section className="mt-14" aria-labelledby="titulo-faixas">
        <h2
          id="titulo-faixas"
          className="font-selo text-sm tracking-wide text-papel-2"
          style={{ fontVariationSettings: '"wdth" 80' }}
        >
          {pessoa.faixas.length === 0
            ? "Nenhuma faixa ainda"
            : `${pessoa.faixas.length} ${pessoa.faixas.length === 1 ? "faixa" : "faixas"} escolhida${
                pessoa.faixas.length === 1 ? "" : "s"
              }`}
        </h2>

        {pessoa.faixas.length > 0 ? (
          <ul className="mt-4 divide-y divide-papel/10 border-t border-papel/10">
            {pessoa.faixas.map((faixa) => (
              <li key={faixa.id}>
                <LinhaFaixa faixa={faixa} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="prosa mt-4 text-papel-2">
            A caixa desta pessoa está aberta, mas ainda não tem disco dentro. Quando a lista
            chegar, ela aparece aqui.
          </p>
        )}
      </section>
    </div>
  );
}