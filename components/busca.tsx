"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { LinhaFaixa } from "@/components/linha-faixa";
import { acervo } from "@/lib/acervo";
import { buscar } from "@/lib/busca";

/**
 * A busca roda inteira no cliente: o acervo são 45 faixas, quelques KB, e ir
 * ao servidor a cada tecla seria mais lento do que filtrar. Sem debounce pelo
 * mesmo motivo — filtrar 45 itens é mais barato que o atraso que o debounce
 * introduziria.
 */
export function Busca() {
  const [termo, setTermo] = useState("");
  const idCampo = useId();
  const { pessoas, faixas } = buscar(termo, acervo);
  const nada = pessoas.length === 0 && faixas.length === 0;

  return (
    <div>
      <label htmlFor={idCampo} className="block font-selo text-sm text-papel-2">
        Buscar por título, artista ou pessoa
      </label>
      <input
        id={idCampo}
        type="search"
        value={termo}
        onChange={(evento) => setTermo(evento.target.value)}
        placeholder="Tim Maia, Bruno Mars, nostalgia…"
        className="mt-2 w-full rounded-sm border border-papel/20 bg-breu-alto px-4 py-3 text-papel placeholder:text-papel-2/60"
      />

      {/* A contagem é a única parte da interface que muda com o filtro. */}
      <p aria-live="polite" className="mt-4 text-sm text-papel-2">
        {termo.trim() === ""
          ? `${faixas.length} faixas de ${pessoas.length} pessoas`
          : `${faixas.length} ${faixas.length === 1 ? "faixa" : "faixas"} em ${pessoas.length} ${
              pessoas.length === 1 ? "pessoa" : "pessoas"
            }`}
      </p>

      {nada ? (
        <div className="mt-10 border border-dashed border-papel/20 px-6 py-10 text-center">
          <p className="prosa mx-auto text-papel-2">
            Nada no acervo com esse nome. Tente um artista — Tim Maia e Bruno Mars aparecem
            várias vezes — ou o título de uma faixa.
          </p>
          <Link href="/artistas" className="prosa mt-4 inline-block text-lampiao underline underline-offset-4">
            Ver o índice por artista
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          {pessoas.length > 0 ? (
            <section aria-labelledby="resultados-pessoas">
              <h2
                id="resultados-pessoas"
                className="font-selo text-sm tracking-wide text-papel-2"
                style={{ fontVariationSettings: '"wdth" 80' }}
              >
                Pessoas
              </h2>
              <ul className="mt-3 divide-y divide-papel/10 border-t border-papel/10">
                {pessoas.map((pessoa) => (
                  <li key={pessoa.slug}>
                    <Link
                      href={`/pessoa/${pessoa.slug}`}
                      className="flex items-baseline justify-between gap-4 py-3 hover:text-papel"
                    >
                      <span
                        className="font-selo font-extrabold tracking-tight"
                        style={{ fontVariationSettings: '"wdth" 72' }}
                      >
                        {pessoa.nome}
                      </span>
                      <span className="shrink-0 text-sm text-papel-2">
                        {pessoa.faixas.length}{" "}
                        {pessoa.faixas.length === 1 ? "faixa" : "faixas"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {faixas.length > 0 ? (
            <section aria-labelledby="resultados-faixas">
              <h2
                id="resultados-faixas"
                className="font-selo text-sm tracking-wide text-papel-2"
                style={{ fontVariationSettings: '"wdth" 80' }}
              >
                Faixas
              </h2>
              <ul className="mt-3 divide-y divide-papel/10 border-t border-papel/10">
                {faixas.map(({ pessoa, faixa }) => (
                  <li key={faixa.id}>
                    <LinhaFaixa faixa={faixa} rotuloPessoa={pessoa.nome} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}