import { APP_NAME } from '../../app/config.js'
import GlassCard from '../../components/GlassCard.jsx'
import Logo from '../../components/Logo.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import styles from './auth.module.css'

// Marco de inicio de sesión y registro. En pantallas grandes suma un mensaje de bienvenida.
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className={styles.page}>
      <title>{`${title} · ${APP_NAME}`}</title>

      <Stagger className={styles.layout}>
        <Reveal className={styles.hero}>
          <Logo size={44} />
          <p className={styles.heroTitle}>
            Cada serie <span className={styles.highlight}>suma</span>.
          </p>
          <p className={styles.heroText}>
            Arma tus rutinas, registra tus entrenamientos y mira cómo avanzas día a día.
          </p>
        </Reveal>

        <Reveal>
          <GlassCard className={styles.card} padding="lg">
            <span className={styles.mobileLogo}>
              <Logo size={40} />
            </span>
            <header className={styles.header}>
              <h1 className={styles.title}>{title}</h1>
              <p className={styles.subtitle}>{subtitle}</p>
            </header>
            {children}
            <p className={styles.footer}>{footer}</p>
          </GlassCard>
        </Reveal>
      </Stagger>
    </main>
  )
}
