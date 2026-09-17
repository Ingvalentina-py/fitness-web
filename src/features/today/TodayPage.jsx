import { Activity, Flame, Plus, Timer } from 'lucide-react'
import Button from '../../components/Button.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { formatLongDate } from '../../lib/dates.js'
import { useQuickAdd } from '../../app/layout/useQuickAdd.js'
import { useCurrentUser } from '../auth/useAuth.js'
import TodayPlan from './TodayPlan.jsx'
import styles from './TodayPage.module.css'

export default function TodayPage() {
  const { data: user } = useCurrentUser()
  const openQuickAdd = useQuickAdd()
  const firstName = user.name.split(' ')[0]

  return (
    <Stagger>
      <Reveal>
        <PageHeader
          documentTitle="Hoy"
          eyebrow={formatLongDate(new Date(), user.preferences.timezone)}
          title={`Hola, ${firstName}`}
          subtitle="Hoy suma. ¿Qué vas a mover?"
        />
      </Reveal>

      <Reveal>
        <GlassCard aria-labelledby="today-summary-title">
          <h2 id="today-summary-title" className={styles.sectionTitle}>
            Tu día
          </h2>

          {/* Valores en cero hasta que existan registros (Fases 5 a 8) */}
          <dl className={styles.stats}>
            <Stat icon={Activity} tone="var(--color-fuchsia)" label="Actividades" value={0} />
            <Stat icon={Timer} tone="var(--color-turquoise)" label="Minutos" value={0} />
            <Stat icon={Flame} tone="var(--color-yellow)" label="Días de racha" value={0} />
          </dl>

          <Button icon={Plus} size="lg" fullWidth onClick={openQuickAdd}>
            Registrar actividad
          </Button>
        </GlassCard>
      </Reveal>

      <Reveal>
        <TodayPlan timeZone={user.preferences.timezone} />
      </Reveal>
    </Stagger>
  )
}

function Stat({ icon: Icon, tone, label, value }) {
  return (
    <div className={styles.stat}>
      <dt className={styles.statLabel}>
        <span className={styles.statIcon} style={{ '--tone': tone }} aria-hidden="true">
          <Icon size={16} strokeWidth={2.5} />
        </span>
        {label}
      </dt>
      <dd className={`${styles.statValue} num`}>{value}</dd>
    </div>
  )
}
