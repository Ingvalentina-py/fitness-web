import GlassCard from './GlassCard.jsx'
import Logo from './Logo.jsx'
import styles from './PageMessage.module.css'

// Pantalla centrada para estados de carga o de error
export default function PageMessage({ children }) {
  return (
    <main className={styles.page}>
      <GlassCard className={styles.card} padding="lg">
        <span className={styles.logo}>
          <Logo showName={false} size={48} />
        </span>
        {children}
      </GlassCard>
    </main>
  )
}
