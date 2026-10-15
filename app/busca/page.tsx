import type { Metadata } from "next";
import { Busca } from "@/components/busca";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Procura por título, artista ou pessoa em todo o acervo.",
};

export default function PaginaBusca() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <h1
        className="font-selo text-[clamp(2rem,5vw,3.25rem)] leading-[0.95] font-extrabold tracking-tight"
        style={{ fontVariationSettings: '"wdth" 64' }}
      >
        Buscar
      </h1>
      <div className="mt-8">
        <Busca />
      </div>
    </div>
  );
}