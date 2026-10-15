import { describe, expect, it } from "vitest";
import { buscar } from "@/lib/busca";
import { slugificar } from "@/lib/texto";
import type { Acervo, EntradaDeFaixa, Pessoa } from "@/lib/tipos";

function pessoa(slug: string, nome: string, faixas: [string, string][]): Pessoa {
  return {
    slug,
    nome,
    resumo: [],
    faixas: faixas.map(([titulo, artista]) => ({
      id: `${slug}-${slugificar(titulo)}`,
      titulo,
      artista,
      youtubeId: "abcdefghijk",
    })),
  };
}

function montarAcervo(lista: Pessoa[]): Acervo {
  const faixas: EntradaDeFaixa[] = lista.flatMap((p) =>
    p.faixas.map((faixa) => ({ pessoa: p, faixa })),
  );
  return { pessoas: lista, faixas, artistas: [] };
}

const acervo = montarAcervo([
  pessoa("mavi", "Mavi", [
    ["Gostava Tanto de Você", "Tim Maia"],
    ["Burguesinha", "Seu Jorge"],
  ]),
  pessoa("leonardo", "Leonardo", [["Risk It All", "Bruno Mars"]]),
]);

describe("buscar", () => {
  it("devolve o acervo inteiro quando não há termo, que é o estado inicial da página", () => {
    const resultado = buscar("", acervo);
    expect(resultado.faixas).toHaveLength(3);
    expect(resultado.pessoas).toHaveLength(2);
  });

  it("ignora termo só com espaços", () => {
    expect(buscar("   ", acervo).faixas).toHaveLength(3);
  });

  it("acha por título", () => {
    const { faixas } = buscar("burguesinha", acervo);
    expect(faixas.map((e) => e.faixa.titulo)).toEqual(["Burguesinha"]);
  });

  it("acha ignorando acento e caixa", () => {
    expect(buscar("TIM MAIA", acervo).faixas).toHaveLength(1);
    expect(buscar("seu jorge", acervo).faixas).toHaveLength(1);
  });

  it("acha a pessoa pelo conteúdo da lista, mesmo sem o nome dela no termo", () => {
    // "Bruno Mars" não é a pessoa, é o que a pessoa escolheu.
    const { pessoas } = buscar("Bruno Mars", acervo);
    expect(pessoas.map((p) => p.nome)).toEqual(["Leonardo"]);
  });

  it("acha a faixa pelo nome de quem trouxe", () => {
    const { faixas } = buscar("leonardo", acervo);
    expect(faixas.map((e) => e.faixa.titulo)).toEqual(["Risk It All"]);
  });

  it("trata termos múltiplos como E, para a busca afunilar em vez de alargar", () => {
    expect(buscar("tim burguesinha", acervo).faixas).toHaveLength(0);
    expect(buscar("mavi seu jorge", acervo).faixas).toHaveLength(1);
  });

  it("devolve listas vazias quando nada casa, em vez de null", () => {
    const resultado = buscar("naitruts", acervo);
    expect(resultado.faixas).toEqual([]);
    expect(resultado.pessoas).toEqual([]);
  });

  it("devolve a faixa uma vez por pessoa que a escolheu, cada uma com o ID próprio", () => {
    const repetida = montarAcervo([
      ...acervo.pessoas,
      pessoa("leo2", "Leo", [["Burguesinha", "Seu Jorge"]]),
    ]);
    const { faixas } = buscar("burguesinha", repetida);
    expect(faixas.map((e) => e.pessoa.slug).sort()).toEqual(["leo2", "mavi"]);
    expect(new Set(faixas.map((e) => e.faixa.id)).size).toBe(2);
  });
});