import { Trophy } from 'lucide-react'
import GlassCard from '../../components/GlassCard.jsx'
import { formatLongDate } from '../../lib/dates.js'
import { formatNumber } from '../../lib/format.js'
import { useCurrentUser } from '../auth/useAuth.js'
import { useRecords } from './useProgress.js'
import styles from './RecordsCard.module.css'

// Tus mejores marcas por ejercicio. No dependen del filtro de fechas: un récord
// es un récord aunque lo hayas logrado hace meses.
export default function RecordsCard() {
  const { data: user } = useCurrentUser()
  const { data: records, isPending, isSuccess } = useRecords()
  // La marca se guarda con el instante exacto: se muestra en tu zona horaria,
  // porque una sesión de las 11 de la noche es de ese día, no del siguiente en UTC.
  const when = (date) => formatLongDate(new Date(date), user.preferences.timezone)

  return (
    <GlassCard aria-labelledby="records-title">
      <h2 id="records-title" className={styles.sectionTitle}>
        Tus récords
      </h2>

      {isPending && <p className={styles.message}>Cargando tus marcas…</p>}

      {isSuccess && records.length === 0 && (
        <p className={styles.message}>
          Aún no hay récords. En cuanto repitas un ejercicio con más peso o más volumen,
          aparecerá aquí.
        </p>
      )}

      {records?.length > 0 && (
        <ul className={styles.list}>
          {records.map((record) => (
            <li key={record._id} className={styles.record}>
              <span className={styles.icon} aria-hidden="true">
                <Trophy size={18} strokeWidth={2.5} />
              </span>
              <div className={styles.text}>
                <p className={styles.name}>
                  {record.exercise?.name ?? 'Ejercicio'}
                  {record.exercise?.isArchived && <span className={styles.archived}> (archivado)</span>}
                </p>
                <dl className={styles.marks}>
                  {record.maxWeight && (
                    <div className={styles.mark}>
                      <dt>Peso máximo</dt>
                      <dd className="num">
                        {formatNumber(record.maxWeight.valueKg)} kg
                        {record.maxWeight.reps ? ` × ${record.maxWeight.reps}` : ''}
                        <span className={styles.when}>
                          {' '}
                          · {when(record.maxWeight.achievedAt)}
                        </span>
                      </dd>
                    </div>
                  )}
                  {record.bestVolume && (
                    <div className={styles.mark}>
                      <dt>Mejor volumen</dt>
                      <dd className="num">
                        {formatNumber(record.bestVolume.valueKg, 0)} kg
                        <span className={styles.when}>
                          {' '}
                          · {when(record.bestVolume.achievedAt)}
                        </span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  )
}
