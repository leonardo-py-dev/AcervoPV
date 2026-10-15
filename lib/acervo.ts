import { extrairIdYoutube } from "@/lib/youtube";
import { separarArtistas, slugificar } from "@/lib/texto";
import type { Acervo, Artista, EntradaDeFaixa, Faixa, Pessoa } from "@/lib/tipos";

/**
 * O acervo como escrito à mão: espelha `gemini-code-1792026163878.md`.
 *
 * Guardamos a URL completa do YouTube, e não o ID, para que o arquivo continue
 * comparável com a fonte original. O ID é extraído uma vez, na normalização
 * abaixo, e um link quebrado quebra o build em vez de a página.
 */

type FaixaBruta = {
  titulo: string;
  artista: string;
  youtubeUrl: string;
  /** Só entra se apontar para uma fonte de letra licenciada. Ausente => link de busca. */
  lyricsUrl?: string;
};

type PessoaBruta = {
  slug: string;
  nome: string;
  /** Chave em `lib/temas.ts`. O tema sai das músicas e das palavras de quem escolheu. */
  tema?: string;
  /** Um elemento por parágrafo do texto original. */
  resumo: string[];
  faixas: FaixaBruta[];
};

const BRUTO = [
  {
    slug: "mavi",
    nome: "Mavi",
    tema: "nacional",
    resumo: [
      "Essas músicas representam a música brasileira de jeitos inimagináveis, com ritmos únicos, letras e situações do cotidiano do cidadão brasileiro, que traz esse ar de nacional e valorização da cultura musical. Esses artistas muitos são icônicos e que lembram muito um tempo que não volta mais, pois quando você escuta música,  você nunca se sente sozinho.",
    ],
    faixas: [
      { titulo: "Nosso Sonho", artista: "Claudinho e Buchecha", youtubeUrl: "https://youtu.be/NSPy0Rkx8fs" },
      { titulo: "Tempo Perdido", artista: "Legião Urbana", youtubeUrl: "https://youtu.be/r53NJwUkDso" },
      { titulo: "Gostava Tanto de Você", artista: "Tim Maia", youtubeUrl: "https://youtu.be/O8IBbW7SxK0" },
      { titulo: "Dengo", artista: "João Gomes", youtubeUrl: "https://youtu.be/e5t7eDbgiS0" },
      { titulo: "Acenda o Farol", artista: "Tim Maia", youtubeUrl: "https://youtu.be/m4wYDhCUCPM" },
      { titulo: "O Descobridor dos 7 Mares", artista: "Tim Maia", youtubeUrl: "https://youtu.be/aZs1RZJnNds" },
      { titulo: "Cachimbo da Paz", artista: "Gabriel O Pensador", youtubeUrl: "https://youtu.be/YlUDow8OSjI" },
      { titulo: "Tudo Vai Dar Certo", artista: "Naitruts", youtubeUrl: "https://youtu.be/nKVkuXuG2qU" },
      { titulo: "Pescador de Ilusões", artista: "O Rappa", youtubeUrl: "https://youtu.be/tsrJBVLoTb0" },
      { titulo: "Burguesinha", artista: "Seu Jorge", youtubeUrl: "https://youtu.be/VIIwosFJdx8" },
      {
        titulo: "Não Quero Dinheiro (Só Quero Amar)",
        artista: "Tim Maia",
        youtubeUrl: "https://youtu.be/RIDrvmIRvS0",
      },
      { titulo: "Sorri Sou Rei", artista: "Naitruts", youtubeUrl: "https://youtu.be/SdjLkwDSvaM" },
      { titulo: "Fico Assim Sem Você", artista: "Claudinho e Buchecha", youtubeUrl: "https://youtu.be/cucnn8wNTcE" },
      { titulo: "Me Encontra", artista: "Charlie Brown Jr.", youtubeUrl: "https://youtu.be/ZbkshrKvgIg" },
    ],
  },
  {
    slug: "leonardo",
    nome: "Leonardo",
    tema: "paixao",
    resumo: [
      "Escolhi essas músicas porque todas falam de amor de alguma forma, seja sobre paixão, saudade, arrependimento ou o desejo de estar com alguém. Gosto de músicas assim porque são as que mais me fazem mergulhar no que estou ouvindo ou cantando. Acho que, por falarem de sentimentos com os quais consigo me identificar, acabo me conectando mais com elas e sentindo cada vez mais o que a música quer transmitir.",
    ],
    faixas: [
      { titulo: "21 Questions", artista: "50 Cent", youtubeUrl: "https://youtu.be/ktO0ZcMyHfk" },
      { titulo: "Mina do Condomínio", artista: "Seu Jorge", youtubeUrl: "https://youtu.be/Tv9MR550-MI" },
      { titulo: "When I Was Your Man", artista: "Bruno Mars", youtubeUrl: "https://youtu.be/kON9fn01rUQ" },
      { titulo: "Moves Like Jagger", artista: "Maroon 5", youtubeUrl: "https://youtu.be/mgActGlheYQ" },
      { titulo: "I Want It That Way", artista: "Backstreet Boys", youtubeUrl: "https://youtu.be/qjlVAsvQLM8" },
      { titulo: "Everybody", artista: "Backstreet Boys", youtubeUrl: "https://youtu.be/e-syzbglE6g" },
      { titulo: "Cobertor de Orelha", artista: "Turma do Pagode", youtubeUrl: "https://youtu.be/CHsHx1Rzm1A" },
      { titulo: "Love Yourself", artista: "Justin Bieber", youtubeUrl: "https://youtu.be/eu6bAOVuxss" },
      { titulo: "Leave the Door Open", artista: "Bruno Mars", youtubeUrl: "https://youtu.be/mODc2nwKFbg" },
      { titulo: "Risk It All", artista: "Bruno Mars", youtubeUrl: "https://youtu.be/nNJkh92SwUk" },
      { titulo: "Careless Whisperer", artista: "George Michael", youtubeUrl: "https://youtu.be/JqIHlDVqUTw" },
    ],
  },
  {
    slug: "davi-braga",
    nome: "Davi Braga",
    tema: "momentos",
    resumo: [
      "Escolhi essas 10 músicas porque acredito que a música está presente em diferentes momentos da vida e pode transmitir emoções muito diferentes. Algumas me animam, outras me fazem refletir sobre relacionamentos, mudanças e objetivos, enquanto outras simplesmente me fazem bem. No final, percebi que não preciso me identificar completamente com a letra de uma música para gostar dela. Às vezes, a batida, a sensação que ela transmite ou as lembranças que ela traz já são suficientes para que ela faça parte de quem eu sou.",
    ],
    faixas: [
      { titulo: "DtMF", artista: "Bad Bunny", youtubeUrl: "https://youtu.be/w4JXwsSCgBc" },
      { titulo: "One Dance", artista: "Drake", youtubeUrl: "https://youtu.be/ki0Ocze98U8" },
      { titulo: "Sorry", artista: "Justin Bieber", youtubeUrl: "https://youtu.be/BerNfXSuvJ0" },
      { titulo: "Si Antes Te Hubiera Conocido", artista: "Karol G", youtubeUrl: "https://youtu.be/SusylI-b7yo" },
      { titulo: "Quer Voar", artista: "Matuê", youtubeUrl: "https://youtu.be/1l2j6f4RlTE" },
      { titulo: "Lancinho", artista: "Turma do Pagode", youtubeUrl: "https://youtu.be/KSgMPu_ld20" },
      { titulo: "A Sky Full of Stars", artista: "Coldplay", youtubeUrl: "https://youtu.be/HRK_-LNDpcQ" },
      { titulo: "As It Was", artista: "Harry Styles", youtubeUrl: "https://youtu.be/Qfm6nfz1QNQ" },
      { titulo: "Billie Jean", artista: "Michael Jackson", youtubeUrl: "https://youtu.be/QRidtXn0u7k" },
      { titulo: "Goosebumps", artista: "Travis Scott", youtubeUrl: "https://youtu.be/_9XaXHD3680" },
    ],
  },
  {
    slug: "nicole",
    nome: "Nicole",
    tema: "nostalgia",
    resumo: [
      "Eu escolhi essa junção de músicas porque elas me remetem à infância e despertam lembranças da época. Mesmo sem prestar muita atenção às letras, eu me conectava aos ritmos e as sensações, que hoje me remetem a momentos, lugares e sentimentos específicos. A musica, nesse sentido, não nos permite voltar ao passado, mas nos aproxima, por alguns instantes, daquilo que o tempo transformou.",
      "Essa seleção representa o sentimento de nostalgia , que significa saudade, afeto e melancolia. Ao ouvir essas músicas, não me lembro apenas de acontecimentos específicos, mas também da maneira como eu enxergava o mundo quando era criança.",
      "Além disso, essa seleção permite que outras pessoas revisitem suas próprias memórias. Embora cada indivíduo associe os mesmos ritmos a experiências distintas, todos podemos reconhecer a sensação de reencontrar uma parte de nós mesmos em algo aparentemente simples. Assim, a música ultrapassa o som e se torna uma ponte entre passado e presente, entre nossas histórias individuais e experiências coletivas. Afinal, talvez a nostalgia não seja apenas sentir falta do que vivemos, mas perceber o valor de momentos que, enquanto aconteciam, não sabíamos que um dia sentiríamos tanta saudade.",
    ],
    faixas: [
      { titulo: "Happier", artista: "Marshmello, Bastille", youtubeUrl: "https://youtu.be/RE87rQkXdNw" },
      { titulo: "Hymn for the Weekend", artista: "Coldplay", youtubeUrl: "https://youtu.be/DzlfEih1NCM" },
      { titulo: "We Are One (Ole Ola)", artista: "Pitbull, Jennifer Lopez", youtubeUrl: "https://youtu.be/xq1t1mHrmks" },
      { titulo: "FRIENDS", artista: "Marshmello, Anne Marie", youtubeUrl: "https://youtu.be/9jLN8MQRQh0" },
      { titulo: "Believer", artista: "Imagine Dragons", youtubeUrl: "https://youtu.be/W0DM5lcj6mw" },
      { titulo: "Dark House", artista: "Katy Perry", youtubeUrl: "https://youtu.be/4zKjOCsjf3w" },
      { titulo: "Cake by the Ocean", artista: "DNCE", youtubeUrl: "https://youtu.be/PAzH-YAlFYc" },
      { titulo: "Old Town Road", artista: "Lil Nas X", youtubeUrl: "https://youtu.be/U4xPahDjY6k" },
      { titulo: "Bang Bang", artista: "K’NAAN, Adam Levine", youtubeUrl: "https://youtu.be/0mQX-zobVBQ" },
      { titulo: "Ride", artista: "Twenty One Pilots", youtubeUrl: "https://youtu.be/K1cKi5MsOWw" },
    ],
  },
  {
    slug: "isaac",
    nome: "Isaac",
    tema: "uniao",
    resumo: [
      "Eu selecionei as musicas dessa lista, porque eu queria que fossem voltadas ao sentimento de união, de força, de esforço, pra lembrar que a vida não é simples e deve ser enfrentada, mas sem criar desavenças, não desviar o foco por causa de conflitos pequenos e viver a vida.",
    ],
    faixas: [
      { titulo: "One Vision", artista: "Queen", youtubeUrl: "https://youtu.be/t-Je0ZHN4CI" },
      { titulo: "Caçador de Mim", artista: "Milton Nascimento", youtubeUrl: "https://youtu.be/iU8HQFlv0S8" },
      {
        titulo: "É Preciso Saber Viver",
        artista: "Titãs",
        youtubeUrl: "https://youtu.be/yyhPNpFGffA",
      },
      {
        titulo: "Canção da América",
        artista: "Milton Nascimento",
        youtubeUrl: "https://youtu.be/r-6BFsMfcYg",
      },
      {
        titulo: "Dias de Luta, Dias de Glória",
        artista: "Charlie Brown Jr.",
        youtubeUrl: "https://youtu.be/zblI6vnj2BM",
      },
      { titulo: "Trem-Bala", artista: "Ana Vilela", youtubeUrl: "https://youtu.be/jgYRQ4HRp08" },
    ],
  },
] satisfies PessoaBruta[];

function normalizar(brutas: readonly PessoaBruta[]): Pessoa[] {
  return brutas.map((pessoa) => ({
    slug: pessoa.slug,
    nome: pessoa.nome,
    tema: pessoa.tema,
    resumo: pessoa.resumo,
    faixas: pessoa.faixas.map((faixa): Faixa => {
      const youtubeId = extrairIdYoutube(faixa.youtubeUrl);
      if (!youtubeId) {
        throw new Error(
          `Link de YouTube inválido em "${pessoa.nome} / ${faixa.titulo}": ${faixa.youtubeUrl}`,
        );
      }
      return {
        id: `${pessoa.slug}-${slugificar(faixa.titulo)}`,
        titulo: faixa.titulo,
        artista: faixa.artista,
        youtubeId,
        lyricsUrl: faixa.lyricsUrl,
      };
    }),
  }));
}

function indexarArtistas(pessoas: readonly Pessoa[]): Artista[] {
  const porNome = new Map<string, Artista>();

  for (const pessoa of pessoas) {
    for (const faixa of pessoa.faixas) {
      for (const nomeArtista of separarArtistas(faixa.artista)) {
        const chave = slugificar(nomeArtista);
        let registro = porNome.get(chave);
        if (!registro) {
          registro = { slug: chave, nome: nomeArtista, entradas: [] };
          porNome.set(chave, registro);
        }
        registro.entradas.push({ pessoa, faixa });
      }
    }
  }

  // Mais presentes primeiro: é como se lê um índice de caixa de disco.
  return [...porNome.values()].sort(
    (a, b) => b.entradas.length - a.entradas.length || a.nome.localeCompare(b.nome, "pt-BR"),
  );
}

export const pessoas: readonly Pessoa[] = normalizar(BRUTO);

export const acervo: Acervo = {
  pessoas,
  faixas: pessoas.flatMap((pessoa) =>
    pessoa.faixas.map((faixa): EntradaDeFaixa => ({ pessoa, faixa })),
  ),
  artistas: indexarArtistas(pessoas),
};

export function buscarPessoa(slug: string): Pessoa | undefined {
  return pessoas.find((pessoa) => pessoa.slug === slug);
}

export function buscarFaixa(id: string): EntradaDeFaixa | undefined {
  return acervo.faixas.find((entrada) => entrada.faixa.id === id);
}

export function buscarArtista(slug: string): Artista | undefined {
  return acervo.artistas.find((artista) => artista.slug === slug);
}

/**
 * Inclinação do disco de uma pessoa, derivada do slug.
 *
 * Fica entre -7° e 7°: o bastante para parecer tirado da caixa e apoiado ali,
 * pouco o bastante para não parecer torto. Determinístico, para o mesmo disco
 * ficar com a mesma inclinação em toda renderização.
 */
export function anguloDoDisco(slug: string): number {
  let soma = 0;
  for (const caractere of slug) soma = (soma + caractere.charCodeAt(0)) % 997;
  return (soma % 15) - 7;
}