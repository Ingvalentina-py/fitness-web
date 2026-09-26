import { Archive, Pencil, Plus } from 'lucide-react'
import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import BackLink from '../../components/BackLink.jsx'
import Button from '../../components/Button.jsx'
import ConfirmSheet from '../../components/ConfirmSheet.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import IconByName from '../../components/IconByName.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import ActivityTypeFormSheet from './ActivityTypeFormSheet.jsx'
import { useActivityTypes, useArchiveActivityType } from './useActivities.js'
import styles from './ActivityTypesPage.module.css'

// /perfil/actividades — tus tipos de actividad y los del sistema
export default function ActivityTypesPage() {
  const { data: activityTypes, isPending, isError } = useActivityTypes()
  const archiveActivityType = useArchiveActivityType()
  // null = cerrado; {} = nuevo; { activityType } = editar
  const [formSheet, setFormSheet] = useState(null)
  const [typeToArchive, setTypeToArchive] = useState(null)

  const mine = activityTypes?.filter((type) => type.owner) ?? []
  const system = activityTypes?.filter((type) => !type.owner) ?? []

  return (
    <Stagger>
      <Reveal>
        <BackLink to="/perfil">Perfil</BackLink>
        <PageHeader
          title="Tipos de actividad"
          subtitle="Lo que haces además del gimnasio, con su color e ícono."
        />
      </Reveal>

      <Reveal>
        <Button icon={Plus} onClick={() => setFormSheet({})}>
          Nuevo tipo
        </Button>
      </Reveal>

      {isPending && (
        <Reveal>
          <GlassCard>Cargando tus tipos de actividad…</GlassCard>
        </Reveal>
      )}
      {isError && (
        <Reveal>
          <Alert>No pudimos cargar los tipos de actividad. Recarga la página.</Alert>
        </Reveal>
      )}

      {mine.length > 0 && (
        <Reveal>
          <GlassCard aria-labelledby="my-types-title">
            <h2 id="my-types-title" className={styles.sectionTitle}>
              Tus tipos
            </h2>
            <ul className={styles.list}>
              {mine.map((type) => (
                <li key={type._id}>
                  <button
                    type="button"
                    className={styles.row}
                    onClick={() => setFormSheet({ activityType: type })}
                  >
                    <TypeIcon type={type} />
                    <TypeText type={type} />
                    <Pencil className={styles.chevron} size={18} aria-hidden="true" />
                  </button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Archive}
                    onClick={() => setTypeToArchive(type)}
                  >
                    Archivar
                  </Button>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      )}

      {system.length > 0 && (
        <Reveal>
          <GlassCard aria-labelledby="system-types-title">
            <h2 id="system-types-title" className={styles.sectionTitle}>
              Del sistema
            </h2>
            <p className={styles.note}>
              Estos vienen con la app y son iguales para todo el mundo. Si quieres uno a tu medida,
              crea el tuyo.
            </p>
            <ul className={styles.list}>
              {system.map((type) => (
                <li key={type._id}>
                  <div className={styles.row}>
                    <TypeIcon type={type} />
                    <TypeText type={type} />
                  </div>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      )}

      {formSheet && (
        <ActivityTypeFormSheet
          activityType={formSheet.activityType}
          onClose={() => setFormSheet(null)}
        />
      )}

      {typeToArchive && (
        <ConfirmSheet
          title={`¿Archivar "${typeToArchive.name}"?`}
          description="Dejará de aparecer al registrar y sale del plan semanal. Lo que ya registraste con él se mantiene en tu historial."
          confirmLabel="Archivar tipo"
          danger
          isPending={archiveActivityType.isPending}
          onClose={() => setTypeToArchive(null)}
          onConfirm={() =>
            archiveActivityType.mutate(typeToArchive._id, { onSuccess: () => setTypeToArchive(null) })
          }
        />
      )}
    </Stagger>
  )
}

function TypeIcon({ type }) {
  return (
    <span className={styles.icon} style={{ '--tone': type.color }} aria-hidden="true">
      <IconByName name={type.icon} size={22} strokeWidth={2.25} />
    </span>
  )
}

function TypeText({ type }) {
  const details = [
    type.usesDistance && 'Registra distancia',
    type.isLegIntensive && 'Exigente para las piernas',
  ].filter(Boolean)

  return (
    <span className={styles.text}>
      <span className={styles.name}>{type.name}</span>
      {details.length > 0 && <span className={styles.details}>{details.join(' · ')}</span>}
    </span>
  )
}
