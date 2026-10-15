"use client";

import Image from "next/image";
import { useState } from "react";
import { urlEmbed } from "@/lib/youtube";

/**
 * Fachada do player: mostra a miniatura e só pede o iframe depois do clique.
 *
 * Duas coisas boas nisso. O navegador não fala com o YouTube — nem com cookie,
 * nem com beacon — enquanto a pessoa só está lendo. E o `<iframe>` fica fora do
 * DOM até ser pedido, então 45 páginas de faixa não viram 45 players mortos.
 * O domínio é `youtube-nocookie.com`, que não escreve cookie antes do play.
 */
export function PlayerYoutube({ id, titulo }: { id: string; titulo: string }) {
  const [carregado, setCarregado] = useState(false);

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-papel/15 bg-breu-alto">
      {carregado ? (
        <iframe
          className="absolute inset-0 size-full"
          src={urlEmbed(id)}
          title={`${titulo} no YouTube`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setCarregado(true)}
          className="group absolute inset-0 grid size-full cursor-pointer place-items-center"
        >
          {/* Decorativa: o título da faixa já está no h1 e no texto do botão. */}
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 40rem, 100vw"
            className="object-cover opacity-70 transition-opacity group-hover:opacity-90"
          />
          <span className="relative grid size-16 place-items-center rounded-full border border-papel/40 bg-breu/70 text-papel backdrop-blur-sm">
            <span aria-hidden="true" className="ml-1 block size-0 border-y-8 border-l-[13px] border-y-transparent border-l-papel" />
          </span>
          <span className="sr-only">Tocar {titulo} no YouTube</span>
        </button>
      )}
    </div>
  );
}