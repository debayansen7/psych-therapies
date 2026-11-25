import type { CSSProperties } from "react";
import {
  BRAIN_STEM,
  CEREBELLUM,
  CEREBELLUM_FOLIA,
  CEREBRUM,
  MAJOR_SULCI,
  MINOR_SULCI,
  NEURAL_NODES,
} from "./brainPaths";
import styles from "./Brain.module.css";

const draw = (delay: number, duration: number): CSSProperties =>
  ({ "--delay": `${delay}s`, "--dur": `${duration}s` }) as CSSProperties;

/** Lateral view of a human brain that draws itself in on load. */
export function Brain() {
  return (
    <svg
      className={styles.brain}
      role="img"
      aria-label="Illustration of a human brain with gently glowing neural activity"
      viewBox="40 6 370 330"
    >
      <defs>
        <radialGradient id="ptBrainFill" cx="40%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FFF4E6" />
          <stop offset="100%" stopColor="#FFD5AA" />
        </radialGradient>
        <radialGradient id="ptHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFC17F" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFC17F" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse className={styles.halo} cx="225" cy="165" rx="230" ry="190" fill="url(#ptHalo)" />

      <g className={styles.fills}>
        <path d={BRAIN_STEM} fill="#F5C99A" />
        <path d={CEREBELLUM} fill="#FFDDB8" />
        <path d={CEREBRUM} fill="url(#ptBrainFill)" />
      </g>

      <g className={styles.outline}>
        <path className={styles.draw} pathLength={1} d={CEREBRUM} style={draw(0.2, 1.6)} />
        <path className={styles.draw} pathLength={1} d={CEREBELLUM} style={draw(0.9, 1)} />
        <path className={styles.draw} pathLength={1} d={BRAIN_STEM} style={draw(1.1, 0.8)} />
      </g>

      <g className={styles.folia}>
        {CEREBELLUM_FOLIA.map((d, i) => (
          <path key={d} className={styles.draw} pathLength={1} d={d} style={draw(1.5 + i * 0.08, 0.7)} />
        ))}
      </g>

      <g className={styles.major}>
        {MAJOR_SULCI.map((d, i) => (
          <path key={d} className={styles.draw} pathLength={1} d={d} style={draw(1.2 + i * 0.05, 0.9)} />
        ))}
      </g>

      <g className={styles.minor}>
        {MINOR_SULCI.map((d, i) => (
          <path key={d} className={styles.draw} pathLength={1} d={d} style={draw(1.5 + (i % 12) * 0.07, 0.7)} />
        ))}
      </g>

      <g className={styles.nodes}>
        {NEURAL_NODES.map(([cx, cy], i) => (
          <circle
            key={`${cx}-${cy}`}
            className={styles.node}
            cx={cx}
            cy={cy}
            r={3}
            style={{ "--dur": `${2 + (i % 4) * 0.6}s`, "--delay": `${2 + (i % 7) * 0.3}s` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}
