import styles from './AnimatedBackground.module.css'

// Fondo de color en movimiento, detrás de toda la app. Las manchas son degradados
// radiales (ya se ven difuminados) en vez de usar filter: blur, que es costoso en
// celulares. Solo se anima transform, que la GPU mueve sin redibujar.
export default function AnimatedBackground() {
  return (
    <div className={styles.background} aria-hidden="true">
      <span className={`${styles.blob} ${styles.fuchsia}`} />
      <span className={`${styles.blob} ${styles.orange}`} />
      <span className={`${styles.blob} ${styles.turquoise}`} />
      <span className={`${styles.blob} ${styles.yellow}`} />
    </div>
  )
}
