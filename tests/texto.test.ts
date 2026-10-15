import { describe, expect, it } from "vitest";
import { normalizarParaBusca, separarArtistas, slugificar } from "@/lib/texto";

describe("normalizarParaBusca", () => {
  it("tira o acento e baixa a caixa, para a busca não depender de digitação", () => {
    expect(normalizarParaBusca("Tim Maia")).toBe("tim maia");
    expect(normalizarParaBusca("GOOSEbumps")).toBe("goosebumps");
    expect(normalizarParaBusca("São Paulo")).toBe("sao paulo");
  });
});

describe("slugificar", () => {
  it("transforma título com acento e pontuação em slug", () => {
    expect(slugificar("O Descobridor dos 7 Mares")).toBe("o-descobridor-dos-7-mares");
    expect(slugificar("Não Quero Dinheiro (Só Quero Amar)")).toBe(
      "nao-quero-dinheiro-so-quero-amar",
    );
  });

  it("colapsa separadores repetidos nas pontas", () => {
    expect(slugificar("  --- Ride ---  ")).toBe("ride");
    expect(slugificar("Bang   Bang!!!")).toBe("bang-bang");
  });

  it("preserva dígitos, que fazem parte do título", () => {
    expect(slugificar("21 Questions")).toBe("21-questions");
  });
});

describe("separarArtistas", () => {
  it("quebra a colaboração em nomes individuais", () => {
    expect(separarArtistas("Marshmello, Bastille")).toEqual(["Marshmello", "Bastille"]);
    expect(separarArtistas("Pitbull, Jennifer Lopez")).toEqual(["Pitbull", "Jennifer Lopez"]);
  });

  it("não quebra banda com nome composto", () => {
    expect(separarArtistas("Claudinho e Buchecha")).toEqual(["Claudinho e Buchecha"]);
    expect(separarArtistas("Twenty One Pilots")).toEqual(["Twenty One Pilots"]);
  });

  it("descarta entradas vazias de vírgula sobrando", () => {
    expect(separarArtistas("Tim Maia, ")).toEqual(["Tim Maia"]);
  });
});