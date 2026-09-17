import { cx } from '../lib/cx.js'
import GlassCard from './GlassCard.jsx'
import styles from './EmptyState.module.css'

// Pantalla o sección vacía que invita a actuar ("Crea tu primera rutina").
// color: fuchsia | orange | turquoise | yellow | lime
export default function EmptyState({
  icon: Icon,
  color = 'fuchsia',
  title,
  titleAs: Title = 'h2',
  description,
  action,
  note,
}) {
  return (
    <GlassCard className={styles.empty} padding="lg">
      <span className={cx(styles.icon, styles[color])} aria-hidden="true">
        <Icon size={30} strokeWidth={2.25} />
      </span>
      <Title className={styles.title}>{title}</Title>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.action}>{action}</div>}
      {note && <p className={styles.note}>{note}</p>}
    </GlassCard>
  )
}
