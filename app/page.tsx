import Link from "next/link";
import { Divisor } from "@/components/divisor";
import { Disco } from "@/components/disco";
import { acervo, pessoas } from "@/lib/acervo";
import { temaDe } from "@/lib/temas";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
      <section className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-2xl">
          <h1
            className="font-selo text-[clamp(2.75rem,9vw,6rem)] leading-[0.9] font-extrabold tracking-[-0.02em]"
            style={{ fontVariationSettings: '"wdth" 68' }}
          >
            Acervo
          </h1>
          <p className="prosa mt-5 text-papel-2 italic">
            Músicas que valem um brinde: uma caixa de discos que cinco pessoas
            asseram para a mesma roda, cada uma com o relato de por que escolheu.
          </p>
          <p className="mt-6 text-sm text-papel-2/80">
            {acervo.faixas.length} faixas de {acervo.artistas.length} artistas, em{" "}
            {pessoas.length} caixas.
          </p>
        </div>

        {/* Rótulo neutro de prensagem: este disco é do acervo, não de uma pessoa. */}
        <Disco
          id="hero"
          pessoa="Acervo"
          tema={{ ...temaDe(undefined), nome: "Desde sempre", chave: "hero" }}
          tamanho="grande"
          girar
          angulo={-5}
          className="size-40 shrink-0 self-start sm:size-48"
        />
      </section>

      <h2 className="sr-only">As pessoas do acervo</h2>
      <ul className="mt-14 grid gap-5 sm:grid-cols-2">
        {pessoas.map((pessoa) => (
          <li key={pessoa.slug}>
            <Divisor pessoa={pessoa} />
          </li>
        ))}
      </ul>

      <p className="prosa mt-14 text-papel-2">
        Tim Maia aparece {conteNoAcervo("Tim Maia")}, Bruno Mars{" "}
        {conteNoAcervo("Bruno Mars")}.{" "}
        <Link
          href="/artistas"
          className="text-lampiao underline underline-offset-4 hover:text-papel"
        >
          O índice por artista
        </Link>{" "}
        mostra o que se repete entre as caixas.
      </p>
    </div>
  );
}

function conteNoAcervo(nome: string): string {
  const artista = acervo.artistas.find((a) => a.nome.toLowerCase() === nome.toLowerCase());
  const total = artista?.entradas.length ?? 0;
  return `${total} ${total === 1 ? "vez" : "vezes"}`;
}