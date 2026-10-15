/** Uma faixa como o acervo a guarda. `id` e `artistas` são derivados, nunca escritos à mão. */
export type Faixa = {
  id: string;
  titulo: string;
  artista: string;
  /** 11 caracteres, validado em `lib/youtube.ts`. */
  youtubeId: string;
  /** Link para a letra numa fonte licenciada. Ausente => a UI gera link de busca. */
  lyricsUrl?: string;
};

/** A resposta ao porquê a pessoa escolheu. Um elemento por parágrafo do texto original. */
export type Pessoa = {
  slug: string;
  nome: string;
  /** Chave em `lib/temas.ts`. Ausente = caixa sem disco. */
  tema?: string;
  resumo: string[];
  faixas: Faixa[];
};

/** Faixa junto de quem a trouxe, para listagens cruzadas. */
export type EntradaDeFaixa = {
  pessoa: Pessoa;
  faixa: Faixa;
};

/**
 * Um nome de artista no acervo. Colaborações viram entradas separadas:
 * "Marshmello, Bastille" gera um registro para Marshmello e outro para Bastille,
 * para que o índice por artista conte as participações corretamente.
 */
export type Artista = {
  slug: string;
  nome: string;
  entradas: EntradaDeFaixa[];
};

export type Acervo = {
  readonly pessoas: readonly Pessoa[];
  readonly faixas: readonly EntradaDeFaixa[];
  readonly artistas: readonly Artista[];
};