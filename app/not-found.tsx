import Link from "next/link";

export default function PaginaNaoEncontrada() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24">
      <p className="font-selo text-sm tracking-wide text-carimbo-texto">Erro 404</p>
      <h1
        className="mt-4 font-selo text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] font-extrabold tracking-tight"
        style={{ fontVariationSettings: '"wdth" 64' }}
      >
        Essa caixa não existe
      </h1>
      <p className="prosa mt-4 text-papel-2">
        O endereço está errado ou a faixa saiu do acervo. O índice completo está na página
        inicial.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-sm border border-papel/20 px-4 py-2 text-sm text-papel transition-colors hover:border-lampiao hover:text-lampiao"
      >
        Voltar ao acervo
      </Link>
    </div>
  );
}