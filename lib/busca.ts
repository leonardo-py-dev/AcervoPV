import { normalizarParaBusca } from "@/lib/texto";
import type { Acervo, EntradaDeFaixa, Pessoa } from "@/lib/tipos";

export type ResultadoBusca = {
  readonly pessoas: readonly Pessoa[];
  readonly faixas: readonly EntradaDeFaixa[];
};

/** Texto que casa com uma faixa: título, artista e quem trouxe. */
function indiceDaFaixa(entrada: EntradaDeFaixa): string {
  const { pessoa, faixa } = entrada;
  return normalizarParaBusca(`${faixa.titulo} ${faixa.artista} ${pessoa.nome}`);
}

/**
 * Texto que casa com uma pessoa: o nome dela mais tudo que ela escolheu,
 * para que "tim maia" encontre a Mavi sem que o nome dela esteja na lista.
 */
function indiceDaPessoa(pessoa: Pessoa): string {
  const faixas = pessoa.faixas.map((faixa) => `${faixa.titulo} ${faixa.artista}`).join(" ");
  return normalizarParaBusca(`${pessoa.nome} ${faixas}`);
}

/**
 * Todos os termos precisam aparecer (E, não OU): buscar "tim maia tim"
 * afunila a lista em vez de devolver tudo que casasse com metade da frase.
 * Termo vazio devolve o acervo inteiro — é o estado inicial da página de busca.
 */
export function buscar(termo: string, base: Acervo): ResultadoBusca {
  const termos = normalizarParaBusca(termo).split(/\s+/).filter(Boolean);
  if (termos.length === 0) {
    return { pessoas: base.pessoas, faixas: base.faixas };
  }

  const contem = (indice: string) => termos.every((termo) => indice.includes(termo));

  return {
    pessoas: base.pessoas.filter((pessoa) => contem(indiceDaPessoa(pessoa))),
    faixas: base.faixas.filter((entrada) => contem(indiceDaFaixa(entrada))),
  };
}