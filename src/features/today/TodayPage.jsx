import { Activity, Flame, Plus, Timer } from 'lucide-react'
import Button from '../../components/Button.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { todayDayString } from '../../lib/calendar.js'
import { formatLongDate } from '../../lib/dates.js'
import { useQuickAdd } from '../../app/layout/useQuickAdd.js'
import { useCurrentUser } from '../auth/useAuth.js'
import { useActivitiesByDay } from '../activities/useActivities.js'
import PhraseRotator from '../phrases/PhraseRotator.jsx'
import { useStatsSummary } from '../progress/useProgress.js'
import TodayActivities from './TodayActivities.jsx'
import TodayPlan from './TodayPlan.jsx'
import styles from './TodayPage.module.css'

export default function TodayPage() {
  const { data: user } = useCurrentUser()
  const openQuickAdd = useQuickAdd()
  // Sin `day`, la API responde con el día de hoy en la zona horaria de la persona
  const { data: activities = [] } = useActivitiesByDay()
  // Las rachas se calculan sobre todo el historial: el rango solo acota los totales
  const today = todayDayString(user.preferences.timezone)
  const { data: stats } = useStatsSummary({ from: today, to: today })
  const streak = stats?.streak.current ?? 0
  const firstName = user.name.split(' ')[0]

  const minutes = activities.reduce((total, activity) => total + (activity.durationMinutes ?? 0), 0)

  return (
    <Stagger>
      <Reveal>
        <PageHeader
          documentTitle="Hoy"
          eyebrow={formatLongDate(new Date(), user.preferences.timezone)}
          title={`Hola, ${firstName}`}
        />
      </Reveal>

      <Reveal>
        <GlassCard aria-label="Frase del día">
          {/* Con racha, también entran las frases que la celebran */}
          <PhraseRotator
            contexts={streak >= 2 ? ['general', 'streak'] : ['general']}
            canSpeakAloud={user.preferences.voicePhrases}
          />
        </GlassCard>
      </Reveal>

      <Reveal>
        <GlassCard aria-labelledby="today-summary-title">
          <h2 id="today-summary-title" className={styles.sectionTitle}>
            Tu día
          </h2>

          <dl className={styles.stats}>
            <Stat
              icon={Activity}
              tone="var(--accent-main)"
              label="Actividades"
              value={activities.length}
            />
            <Stat icon={Timer} tone="var(--accent-calm)" label="Minutos" value={minutes} />
            <Stat icon={Flame} tone="var(--accent-award)" label="Días de racha" value={streak} />
          </dl>

          <Button icon={Plus} size="lg" fullWidth onClick={openQuickAdd}>
            Registrar actividad
          </Button>
        </GlassCard>
      </Reveal>

      <Reveal>
        <TodayPlan timeZone={user.preferences.timezone} />
      </Reveal>

      {activities.length > 0 && (
        <Reveal>
          <TodayActivities activities={activities} />
        </Reveal>
      )}
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
