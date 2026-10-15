import { describe, expect, it } from "vitest";
import { extrairIdYoutube, urlBuscaLetra, urlEmbed, urlYoutube } from "@/lib/youtube";

describe("extrairIdYoutube", () => {
  it("lê o link curto com o tracking ?si= que o YouTube anexa ao compartilhar", () => {
    expect(extrairIdYoutube("https://youtu.be/w4JXwsSCgBc?si=c6NsgsFMdnSM1ib2")).toBe(
      "w4JXwsSCgBc",
    );
  });

  it("lê o link de watch", () => {
    expect(extrairIdYoutube("https://www.youtube.com/watch?v=U4xPahDjY6k")).toBe("U4xPahDjY6k");
  });

  it("lê o v= mesmo quando não é o primeiro parâmetro", () => {
    expect(extrairIdYoutube("https://www.youtube.com/watch?list=PLabc&v=Tv9MR550-MI")).toBe(
      "Tv9MR550-MI",
    );
  });

  it("lê o link de embed e de shorts", () => {
    expect(extrairIdYoutube("https://www.youtube.com/embed/HRK_-LNDpcQ")).toBe("HRK_-LNDpcQ");
    expect(extrairIdYoutube("https://youtube.com/shorts/ki0Ocze98U8")).toBe("ki0Ocze98U8");
  });

  it("aceita o ID solto, que é o que fica gravado no acervo", () => {
    expect(extrairIdYoutube("O8IBbW7SxK0")).toBe("O8IBbW7SxK0");
  });

  it("recusa link de outro site, mesmo com cara de vídeo", () => {
    expect(extrairIdYoutube("https://vimeo.com/123456789")).toBeNull();
  });

  it("recusa ID com tamanho errado, em vez de devolver lixo", () => {
    expect(extrairIdYoutube("https://youtu.be/curto")).toBeNull();
    expect(extrairIdYoutube("https://youtu.be/waytoolongforayoutube")).toBeNull();
  });

  it("devolve null em vez de lançar, para quem chama decidir o erro", () => {
    expect(() => extrairIdYoutube("")).not.toThrow();
    expect(extrairIdYoutube("")).toBeNull();
  });
});

describe("urls derivadas", () => {
  it("monta o link canônico sem o tracking", () => {
    expect(urlYoutube("w4JXwsSCgBc")).toBe("https://youtu.be/w4JXwsSCgBc");
  });

  it("embute pelo domínio sem cookies", () => {
    expect(urlEmbed("w4JXwsSCgBc")).toBe("https://www.youtube-nocookie.com/embed/w4JXwsSCgBc");
  });

  it("escapa a query de busca da letra", () => {
    const termo = "Não Quero Dinheiro (Só Quero Amar) Tim Maia letra";
    const url = urlBuscaLetra("Não Quero Dinheiro (Só Quero Amar)", "Tim Maia");

    expect(url.startsWith("https://www.google.com/search?q=")).toBe(true);
    // Espaço vira %20: sem isso o termo se parte em vários parâmetros.
    expect(url).not.toContain(" ");
    expect(decodeURIComponent(url.replace("https://www.google.com/search?q=", ""))).toBe(termo);
  });
});