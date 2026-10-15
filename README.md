# Acervo

Um acervo de músicas escolhidas por cinco pessoas, cada uma com o relato de
por que escolheu. São 51 faixas de 40 artistas, em 5 caixas.

## Rodar

```bash
npm install
npm run dev
```

Abre em http://localhost:3000.

## Verificar

Na ordem — falha de tipo é rápida, chegar ao build é caro:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run check` roda os quatro em sequência.

### Por que há um `@rolldown/binding-win32-x64-msvc` em `optionalDependencies`

O Vitest 5 roda sobre rolldown, que carrega um binding nativo por plataforma. O
npm tem um bug conhecido ([npm/cli#4828](https://github.com/npm/cli/issues/4828))
em que o binding específico do Windows não entra no `node_modules`, e o Vitest
não sobe com um erro de "Cannot find native binding".

Declarar o binding em `optionalDependencies` resolve os dois lados: no Windows
ele é instalado, e em Linux/CI o npm pula em silêncio em vez de abortar o
`npm install` com `EBADPLATFORM` — que foi exatamente o que quebrou o primeiro
build na Vercel quando ele estava em `devDependencies`.

## Onde estão os dados

Tudo em `lib/acervo.ts`. É o arquivo espelho de `gemini-code-1792026163878.md`,
com os links normalizados (sem o `?si=` de tracking) e o texto de cada pessoa
guardado **verbatim**, um parágrafo por elemento do array `resumo`.

O `youtubeUrl` fica como escrito, e o ID de 11 caracteres é extraído na
normalização. Um link quebrado **quebra o build** em vez de virar 404 em
produção — é o que `normalizar()` faz ao lançar.

O slug e o índice por artista são derivados, nunca escritos à mão:

- `lib/texto.ts` — `slugificar`, `normalizarParaBusca`, `separarArtistas`
- `lib/youtube.ts` — extração de ID, URLs canônicas, link de busca da letra
- `lib/busca.ts` — filtro do `/busca`, termos múltiplos são E, não OU
- `lib/tipos.ts` — os tipos

Colaborações viram artistas separados: "Marshmello, Bastille" gera um registro
para Marshmello e outro para Bastille, senão a participação de um não contaria
na caixa da outra.

## Sobre as letras

**O acervo não hospeda letra.** Letra de música é obra protegida por direito
autoral, e copiar e redistribuir o texto completo tem consequência legal. Cada
faixa tem um campo `lyricsUrl` opcional que aponta para uma fonte licenciada;
quando ele está vazio, o botão cai num link de busca por título + artista.

## Rotas

| Rota | O que é |
|---|---|
| `/` | As caixas, com o primeiro parágrafo de cada reflexão |
| `/pessoa/[slug]` | A reflexão inteira (página de verdade) e as faixas |
| `/faixa/[id]` | Player sob demanda, letra, vizinhança na caixa |
| `/artista/[slug]` | Todas as faixas de um artista, agrupadas por caixa |
| `/artistas` | Índice, mais presentes primeiro |
| `/busca` | Filtro no cliente, sem backend |

## Design

A metáfora é a **caixa de disco**: cada pessoa é um divisor, com a etiqueta em
cima e os discos atrás. Isso mapeia a estrutura do dado, então não é enfeite.

O carimbo (`components/disco.tsx`) é o dispositivo-assinatura: sulcos, brilho, e um rótulo prensado no meio com a borda deslocada pelo ruído. As escritas ficam todas no rótulo — tema em cima, nome de quem escolheu embaixo, furo do eixo no meio. Fora do rótulo não entra texto, porque sobre o vinil não há cor que funcione.

Tokens e tipografia em `app/globals.css`. Duas famílias: **Archivo** (eixo `wdth`
comprimindo o rótulo) e **Newsreader** (as reflexões, que são o texto mais
longo do site).

## Como entra uma lista nova

1. Adicionar o bloco em `lib/acervo.ts`, com `slug`, `nome`, `tema`, `resumo`
   (um elemento por parágrafo) e as faixas.
2. Se a pessoa ganhou tema novo, criar a entrada em `lib/temas.ts`. O teste
   "toda chave declarada em TEMAS é usada por alguém" reclama de sobra, e o
   "quem tem faixas tem tema" reclama de falta.

O resto se ajusta sozinho: slugs, IDs, índice por artista e as rotas
estáticas são derivados na normalização.

A caixa de cada pessoa tem uma temática, e ela não foi escolhida de fora: saiu
das músicas e das palavras de quem escolheu. Os temas vivem em `lib/temas.ts`,
cada um com a cor do rótulo do disco e uma nota que aponta para a frase do
texto que sustenta o tema.

| Pessoa | Tema | Rótulo |
|---|---|---|
| Mavi | Nacional | `#D98452` |
| Leonardo | Paixão | `#C9737F` |
| Davi Braga | Momentos | `#5FA99B` |
| Nicole | Nostalgia | `#A79BC9` |
| Isaac | União | `#93A85A` |

A cor não entra na paleta global (`app/globals.css`): ela mora dentro do disco,
que é onde a cor de uma pessoa pertence num disco de verdade. Todo texto do
disco é breu sobre a cor do rótulo, e `tests/temas.test.ts` trava que isso
passa de 4.5:1.