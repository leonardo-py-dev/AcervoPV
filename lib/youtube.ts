/** Um ID de YouTube tem exatamente 11 caracteres de [A-Za-z0-9_-]. */
const ID_YOUTUBE = /^[\w-]{11}$/;

const PADRAO_SHORT = /^(?:https?:)?\/\/youtu\.be\/([\w-]+)/i;
const PADRAO_WATCH = /^(?:https?:)?\/\/(?:www\.|m\.)?youtube(?:-nocookie)?\.com\/watch\?(?:.*&)?v=([\w-]+)/i;
const PADRAO_EMBED = /^(?:https?:)?\/\/(?:www\.|m\.)?youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/i;
const PADRAO_SHORTS = /^(?:https?:)?\/\/(?:www\.)?youtube\.com\/shorts\/([\w-]+)/i;

/**
 * Extrai o ID do vídeo de qualquer formato de link do YouTube.
 * Devolve `null` em vez de lançar: quem chama decide o que fazer com o erro,
 * porque a validação de verdade acontece uma vez, na normalização do acervo.
 */
export function extrairIdYoutube(url: string): string | null {
  const alvo = url.trim();
  if (ID_YOUTUBE.test(alvo)) return alvo;

  for (const padrao of [PADRAO_SHORT, PADRAO_WATCH, PADRAO_EMBED, PADRAO_SHORTS]) {
    const achado = padrao.exec(alvo);
    const id = achado?.[1];
    if (id && ID_YOUTUBE.test(id)) return id;
  }
  return null;
}

/** Link canônico, sem o tracking `?si=` que o YouTube anexa ao compartilhar. */
export function urlYoutube(id: string): string {
  return `https://youtu.be/${id}`;
}

/**
 * Player embutido no domínio sem cookies: nada é enviado ao YouTube antes
 * de a pessoa apertar play.
 */
export function urlEmbed(id: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

/**
 * Destino do botão "letra" quando a faixa não tem fonte licenciada cadastrada.
 * O acervo não hospeda letra: letra de música é obra protegida, e o pior que
 * fazemos aqui é mandar a pessoa procurar num lugar que respeita o autor.
 */
export function urlBuscaLetra(titulo: string, artista: string): string {
  const termo = `${titulo} ${artista} letra`;
  return `https://www.google.com/search?q=${encodeURIComponent(termo)}`;
}