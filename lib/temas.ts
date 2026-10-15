/**
 * A temática de cada caixa.
 *
 * O tema não foi escolhido de fora: saiu das músicas e das palavras de quem
 * escolheu. Cada `nota` aponta para a frase do próprio texto que sustenta o
 * tema — se o texto mudar e o tema deixar de fazer sentido, a nota denuncia.
 *
 * As cores são rótulos de disco Minticão desbotado: saturadas o bastante para
 * se distinguirem, apagadas o bastante para conviverem com o breu. Todas
 * passam de 5:1 com o breu, que é a cor das iniciais impressas no rótulo.
 */
export type Tema = {
  chave: string;
  nome: string;
  /** Rótulo do disco. Precisa de L >= 0.20 para o breu do texto do rótulo passar AA. */
  cor: string;
  nota: string;
};

export const TEMAS: Record<string, Tema> = {
  nacional: {
    chave: "nacional",
    nome: "Nacional",
    cor: "#D98452",
    nota: "Quase toda MPB e rock nacional dos anos 2000. O texto pede valorização da cultura musical, e o disco é da terra.",
  },
  paixao: {
    chave: "paixao",
    nome: "Paixão",
    cor: "#C9737F",
    nota: "Todas as faixas falam de amor de algum jeito. O texto nomeia o que move cada uma: paixão, saudade, arrependimento, vontade de estar com alguém.",
  },
  momentos: {
    chave: "momentos",
    nome: "Momentos",
    cor: "#5FA99B",
    nota: "A música está presente em momentos diferentes da vida, e a caixa mostra: da animação ao silêncio.",
  },
  nostalgia: {
    chave: "nostalgia",
    nome: "Nostalgia",
    cor: "#A79BC9",
    nota: "Infância, saudade, melancolia. O texto dá nome ao sentimento e diz que a música é uma ponte entre o que foi e o que sobra.",
  },
  uniao: {
    chave: "uniao",
    nome: "União",
    cor: "#93A85A",
    nota: "Todas as faixas puxam para o mesmo lado: força e união. O texto pede lembrar que a vida não é simples, e que ela deve ser enfrentada sem desviar o foco por causa de briga pequena.",
  },
};

/** Rótulo de disco em branco, para quem ainda não tem caixa. */
export const SEM_TEMA: Tema = {
  chave: "sem-tema",
  nome: "Sem rótulo",
  cor: "#6B6257",
  nota: "A caixa desta pessoa ainda não tem disco dentro.",
};

export function temaDe(chave: string | undefined): Tema {
  if (!chave) return SEM_TEMA;
  return TEMAS[chave] ?? SEM_TEMA;
}