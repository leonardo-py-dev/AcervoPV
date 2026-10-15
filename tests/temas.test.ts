import { describe, expect, it } from "vitest";
import { pessoas } from "@/lib/acervo";
import { SEM_TEMA, TEMAS, temaDe } from "@/lib/temas";

/** Luminância relativa, conforme WCAG 2. */
function luminancia(hex: string): number {
  const canal = (offset: number) => {
    const bruto = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return bruto <= 0.03928 ? bruto / 12.92 : ((bruto + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * canal(1) + 0.7152 * canal(3) + 0.0722 * canal(5)
  );
}

function contraste(a: string, b: string): number {
  const [clara, escura] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (clara + 0.05) / (escura + 0.05);
}

const BREU = "#17140f";

describe("temas", () => {
  it("quem tem faixas tem tema, senão a caixa fica com disco em branco", () => {
    for (const pessoa of pessoas) {
      if (pessoa.faixas.length === 0) continue;
      expect(pessoa.tema, `${pessoa.nome} não tem tema`).toBeDefined();
      expect(TEMAS[pessoa.tema!], `chave ${pessoa.tema!} não existe`).toBeDefined();
    }
  });

  it("toda chave declarada em TEMAS é usada por alguém", () => {
    const usadas = new Set(pessoas.map((p) => p.tema).filter(Boolean));
    for (const chave of Object.keys(TEMAS)) {
      expect(usadas.has(chave), `tema "${chave}" não é de ninguém`).toBe(true);
    }
  });

  it("o breu impresso no rótulo passa AA sobre toda cor de tema", () => {
    // A cor do tema aparece embaixo de dois textos: as iniciais no rótulo do
    // disco e o nome do tema no divisor. Se um dia alguém escurecer a cor para
    // "ficar mais bonita", este teste avisa antes de o texto sumir.
    for (const tema of Object.values(TEMAS)) {
      const razao = contraste(tema.cor, BREU);
      expect(razao, `${tema.nome} (${tema.cor}) está em ${razao.toFixed(2)}:1`).toBeGreaterThanOrEqual(
        4.5,
      );
    }
  });

  it("a nota do tema é preenchida, senão o rótulo fica sem explicação", () => {
    for (const tema of [...Object.values(TEMAS), SEM_TEMA]) {
      expect(tema.nota.trim()).not.toBe("");
      expect(tema.nota.endsWith(".")).toBe(true);
    }
  });

  it("nenhuma cor de tema se repete, senão duas caixas viram a mesma", () => {
    const cores = Object.values(TEMAS).map((t) => t.cor.toLowerCase());
    expect(new Set(cores).size).toBe(cores.length);
  });
});

describe("temaDe", () => {
  it("cai no rótulo neutro quando não há tema", () => {
    expect(temaDe(undefined)).toBe(SEM_TEMA);
    expect(temaDe("chave-que-nao-existe")).toBe(SEM_TEMA);
  });

  it("devolve o tema certo quando a chave existe", () => {
    expect(temaDe("nostalgia").nome).toBe("Nostalgia");
  });
});