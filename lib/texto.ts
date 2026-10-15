/**
 * Normaliza texto para comparação: sem diacríticos, minúsculo, sem espaços das pontas.
 * Usado tanto na busca quanto na geração de slugs, para que "Tim Maia" e "tim maia"
 * caiam no mesmo lugar.
 */
export function normalizarParaBusca(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

/** Versão URL-safe de um texto: "Naitruts" e "João Gomes" sobrevivem intactos. */
export function slugificar(texto: string): string {
  return normalizarParaBusca(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Lê a lista de artistas de uma faixa, separando colaborações por vírgula. */
export function separarArtistas(artista: string): string[] {
  return artista
    .split(",")
    .map((nome) => nome.trim())
    .filter(Boolean);
}