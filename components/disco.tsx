import type { Tema } from "@/lib/temas";

/**
 * O disco.
 *
 * Anatomia de um LP de verdade: sulco de entrada, estriados, faixa lisa do
 * runout, e o rótulo prensado no meio com o furo do eixo.
 *
 * Todas as escritas vivem no rótulo, pelo mesmo motivo de num disco real: é a
 * única superfície que existe para receber texto. Fora do rótulo o fundo é o
 * vinil, e um texto claro sobre preto lá é ilegível, um texto escuro some
 * inteiro. No rótulo o fundo é a cor do tema, e o breu por cima passa de
 * 4.5:1 — o que `tests/temas.test.ts` trava.
 *
 * O texto do aro e o rótulo ficam *estáticos* enquanto os estriados giram.
 * Não é erro: o rótulo é um disco chapado, então girá-lo não mudaria nada, e
 * o texto parado é o que mantém a peça legível.
 *
 * O rótulo se lê como um rótulo de verdade: nome do tema no arco de cima, nome
 * de quem escolheu no de baixo, e o furo do eixo no meio — que é exatamente
 * onde ele fica num LP, e por isso nenhuma escrita passa por ali.
 *
 * A borda do rótulo sai deslocada e recortada pelo ruído: o rótulo foi
 * prensado dentro do disco, não impresso nele.
 *
 * `id` precisa ser único na página: as escritas vivem em `<path>` do SVG e IDs
 * repetidos fariam os dois discos dividirem o mesmo arco.
 */
export function Disco({
  id,
  pessoa,
  tema,
  tamanho,
  girar = false,
  angulo = 0,
  className = "",
}: {
  id: string;
  pessoa: string;
  tema: Tema;
  /** `pequeno` no divisor: só a marca. `grande`: o disco inteiro, com escrita. */
  tamanho: "pequeno" | "grande";
  girar?: boolean;
  /** Graus. Inclinação fixa por pessoa, para parecer tirado da caixa e posto ali. */
  angulo?: number;
  className?: string;
}) {
  const grande = tamanho === "grande";

  return (
    <span
      aria-hidden="true"
      className={`disco inline-grid place-items-center ${className}`}
      data-giro={girar ? "sim" : "nao"}
      style={{ "--giro": `${angulo}deg` } as React.CSSProperties}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <defs>
          {/*
            Arco de cima: sai da esquerda, passa pelo topo, chega na direita.
            `startOffset` 25% põe o centro da frase no meio do topo.
          */}
          <path
            id={`cima-${id}`}
            d="M 63,100 A 37,37 0 0 1 100,63 A 37,37 0 0 1 137,100"
            fill="none"
          />
          {/*
            Arco de baixo, com `sweep` invertido: é o que deixa a escrita de
            baixo legível de pé em vez de de cabeça para baixo.
          */}
          <path id={`baixo-${id}`} d="M 63,100 A 37,37 0 0 0 137,100" fill="none" />
          {/* O brilho é uma faixa de luz atravessando o vinil, não um gradiente radial. */}
          <linearGradient id={`brilho-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#efe3ce" stopOpacity="0.16" />
            <stop offset="42%" stopColor="#efe3ce" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#efe3ce" stopOpacity="0" />
          </linearGradient>
          <filter id={`desgaste-${id}`} x="-12%" y="-12%" width="124%" height="124%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="3"
              seed="11"
              result="ruido"
            />
            <feDisplacementMap in="SourceGraphic" in2="ruido" scale="2.4" />
          </filter>
          <filter id={`falado-${id}`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" seed="5" />
          </filter>
          <mask id={`tinta-${id}`}>
            <rect width="200" height="200" fill="white" />
            <rect width="200" height="200" filter={`url(#falado-${id})`} opacity="0.22" />
          </mask>
        </defs>

        {/* O vinil em si: mais escuro que o breu, senão não lê como plástico. */}
        <circle cx="100" cy="100" r="99" fill="#0C0A07" />

        <g className={girar ? "disco-gira" : undefined}>
          <circle cx="100" cy="100" r="99" fill={`url(#brilho-${id})`} />
          {[93, 88, 83, 78, 73, 68, 63, 58].map((raio) => (
            <circle
              key={raio}
              cx="100"
              cy="100"
              r={raio}
              fill="none"
              stroke="#efe3ce"
              strokeOpacity="0.055"
            />
          ))}
          {/* A borda externa, pegando luz. */}
          <circle cx="100" cy="100" r="99" fill="none" stroke="#efe3ce" strokeOpacity="0.1" />
        </g>

        {/* Rótulo prensado: a tinta não sai inteira, e a borda é irregular. */}
        <g filter={`url(#desgaste-${id})`} mask={`url(#tinta-${id})`}>
          <circle cx="100" cy="100" r="47" fill={tema.cor} />
          <circle
            cx="100"
            cy="100"
            r="47"
            fill="none"
            stroke="#0C0A07"
            strokeOpacity="0.22"
            strokeWidth="1.5"
          />
        </g>

        {/*
          Tudo escrito é breu sobre a cor do rótulo. Fora daqui — sobre o vinil —
          não entra texto nenhum.
        */}
        {grande ? (
          <g fill="#17140f" className="font-selo">
            <text
              style={{
                fontVariationSettings: '"wdth" 82',
                fontSize: "9.5px",
                fontWeight: 600,
                letterSpacing: "0.16em",
              }}
            >
              <textPath href={`#cima-${id}`} startOffset="50%" textAnchor="middle">
                {tema.nome.toUpperCase()}
              </textPath>
            </text>

            <text
              style={{
                fontVariationSettings: '"wdth" 82',
                fontSize: "9.5px",
                fontWeight: 600,
                letterSpacing: "0.16em",
              }}
            >
              <textPath href={`#baixo-${id}`} startOffset="50%" textAnchor="middle">
                {pessoa.toUpperCase()}
              </textPath>
            </text>
          </g>
        ) : null}

        {/*
          O furo do eixo por cima de tudo, porque vinil não tem centro sólido:
          o ar passa por ele. Por isso nenhuma escrita passa pelo meio — num
          disco de verdade o miolo do rótulo também é o furo.
        */}
        <circle cx="100" cy="100" r="6" fill="#0C0A07" />
      </svg>
    </span>
  );
}