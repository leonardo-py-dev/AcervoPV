import { describe, expect, it } from "vitest";
import {
  acervo,
  anguloDoDisco,
  buscarArtista,
  buscarFaixa,
  buscarPessoa,
  pessoas,
} from "@/lib/acervo";
import { slugificar } from "@/lib/texto";
import { extrairIdYoutube } from "@/lib/youtube";

describe("integridade do acervo", () => {
  it("todo YouTube aponta para um ID válido de 11 caracteres", () => {
    for (const { pessoa, faixa } of acervo.faixas) {
      expect(extrairIdYoutube(faixa.youtubeId), `${pessoa.nome} / ${faixa.titulo}`).toBe(
        faixa.youtubeId,
      );
    }
  });

  it("nenhuma faixa repete ID, senão a rota /faixa devolve a música errada", () => {
    const ids = acervo.faixas.map((e) => e.faixa.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("nenhuma pessoa repete slug", () => {
    const slugs = pessoas.map((pessoa) => pessoa.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("cada ID de faixa carrega o slug de quem trouxe", () => {
    for (const { pessoa, faixa } of acervo.faixas) {
      expect(faixa.id.startsWith(`${pessoa.slug}-`)).toBe(true);
    }
  });

  it("quem já escolheu tem o relato junto", () => {
    for (const pessoa of pessoas) {
      if (pessoa.faixas.length === 0) continue;
      expect(pessoa.resumo.length, `${pessoa.nome} escolheu mas não explicou`).toBeGreaterThan(0);
    }
  });

  it("o texto de reflexão é sempre em parágrafos inteiros, nunca cortado", () => {
    for (const pessoa of pessoas) {
      for (const paragrafo of pessoa.resumo) {
        expect(paragrafo).not.toBe("");
        expect(paragrafo.trim()).toBe(paragrafo);
        expect(paragrafo.endsWith(".")).toBe(true);
      }
    }
  });

  it("as buscas por rota acham o registro e devolvem undefined para o resto", () => {
    const primeira = acervo.faixas[0];
    expect(buscarPessoa(primeira.pessoa.slug)).toBeDefined();
    expect(buscarFaixa(primeira.faixa.id)).toBeDefined();
    expect(buscarPessoa("ninguem")).toBeUndefined();
    expect(buscarFaixa("ninguem-nao-e-uma-faixa")).toBeUndefined();
    expect(buscarArtista("ninguem")).toBeUndefined();
  });
});

describe("índice por artista", () => {
  it("colaboração vira registro próprio, para as participações contarem certo", () => {
    // Nicole escolheu duas faixas com Marshmello, cada uma com um parceiro diferente.
    const marshmello = buscarArtista(slugificar("Marshmello"));
    expect(marshmello?.entradas).toHaveLength(2);
  });

  it("não perde nem duplica faixa ao separar colaborações", () => {
    const totalPorArtista = acervo.artistas.reduce((soma, a) => soma + a.entradas.length, 0);
    const participacoes = acervo.faixas.flatMap((e) => e.faixa.artista.split(",").filter((n) => n.trim()));
    expect(totalPorArtista).toBe(participacoes.length);
  });

  it("ordena os mais presentes primeiro", () => {
    const contagens = acervo.artistas.map((a) => a.entradas.length);
    expect([...contagens].sort((a, b) => b - a)).toEqual(contagens);
  });
});

describe("anguloDoDisco", () => {
  it("fica na faixa estreita que parece tirado da caixa e posto ali", () => {
    for (const pessoa of pessoas) {
      const angulo = anguloDoDisco(pessoa.slug);
      expect(angulo).toBeGreaterThanOrEqual(-7);
      expect(angulo).toBeLessThanOrEqual(7);
    }
  });

  it("é determinístico, senão o mesmo disco mudaria de inclinação a cada render", () => {
    expect(anguloDoDisco("mavi")).toBe(anguloDoDisco("mavi"));
  });

  it("dá inclinações diferentes para pessoas diferentes", () => {
    const angulos = new Set(pessoas.map((p) => anguloDoDisco(p.slug)));
    expect(angulos.size).toBeGreaterThan(1);
  });
});