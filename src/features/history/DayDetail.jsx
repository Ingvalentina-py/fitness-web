import { CalendarPlus, Ellipsis, FileText, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import ActionSheet from '../../components/ActionSheet.jsx'
import Button from '../../components/Button.jsx'
import ConfirmSheet from '../../components/ConfirmSheet.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import IconButton from '../../components/IconButton.jsx'
import { useQuickAdd } from '../../app/layout/useQuickAdd.js'
import { formatDayName } from '../../lib/calendar.js'
import { useMetaLabels } from '../../lib/useMetaLabels.js'
import ActivityFormSheet from '../activities/ActivityFormSheet.jsx'
import { activityDetails, activityLook } from '../activities/activityLook.js'
import { useDeleteActivity } from '../activities/useActivities.js'
import styles from './DayDetail.module.css'

// Lo registrado en el día elegido, con las acciones para corregirlo o borrarlo
export default function DayDetail({ day, activities }) {
  const labels = useMetaLabels()
  const navigate = useNavigate()
  const openQuickAdd = useQuickAdd()
  const deleteActivity = useDeleteActivity()
  const [menuFor, setMenuFor] = useState(null)
  const [activityToEdit, setActivityToEdit] = useState(null)
  const [activityToDelete, setActivityToDelete] = useState(null)

  return (
    <GlassCard aria-labelledby="day-detail-title">
      <h2 id="day-detail-title" className={styles.title}>
        {formatDayName(day)}
      </h2>

      {activities.length === 0 ? (
        <EmptyState
          icon={CalendarPlus}
          color="orange"
          title="Ese día no registraste nada"
          titleAs="h3"
          description="Si se te pasó anotarlo, todavía estás a tiempo: al registrar puedes elegir el día."
          action={<Button onClick={openQuickAdd}>Registrar actividad</Button>}
        />
      ) : (
        <ul className={styles.list}>
          {activities.map((activity) => {
            const { color, Icon, name } = activityLook(activity)

            return (
              <li key={activity._id} className={styles.activity}>
                <span className={styles.icon} style={{ '--tone': color }} aria-hidden="true">
                  <Icon size={20} strokeWidth={2.25} />
                </span>
                <span className={styles.text}>
                  <span className={styles.name}>{name}</span>
                  <span className={`${styles.details} num`}>
                    {activityDetails(activity, labels)}
                  </span>
                  {activity.notes && <span className={styles.notes}>{activity.notes}</span>}
                </span>
                <IconButton
                  icon={Ellipsis}
                  label={`Opciones de ${name}`}
                  onClick={() => setMenuFor(activity)}
                />
              </li>
            )
          })}
        </ul>
      )}

      {menuFor && (
        <ActionSheet
          open
          onClose={() => setMenuFor(null)}
          title={activityLook(menuFor).name}
          actions={[
            menuFor.kind === 'gym' && {
              label: 'Ver resumen',
              icon: FileText,
              onSelect: () => navigate(`/sesion/${menuFor._id}/resumen`),
            },
            {
              label: 'Editar',
              icon: Pencil,
              onSelect: () =>
                menuFor.kind === 'gym'
                  ? navigate(`/sesion/${menuFor._id}/editar`)
                  : setActivityToEdit(menuFor),
            },
            {
              label: 'Borrar',
              icon: Trash2,
              danger: true,
              onSelect: () => setActivityToDelete(menuFor),
            },
          ]}
        />
      )}

      {activityToEdit && (
        <ActivityFormSheet activity={activityToEdit} onClose={() => setActivityToEdit(null)} />
      )}

      {activityToDelete && (
        <ConfirmSheet
          title="¿Borrar este registro?"
          description={
            activityToDelete.kind === 'gym'
              ? 'Se borra la sesión completa con sus series, y tus récords se recalculan. Esto no se puede deshacer.'
              : 'Se borra de tu historial. Esto no se puede deshacer.'
          }
          confirmLabel="Borrar"
          danger
          isPending={deleteActivity.isPending}
          onClose={() => setActivityToDelete(null)}
          onConfirm={() =>
            deleteActivity.mutate(activityToDelete._id, { onSuccess: () => setActivityToDelete(null) })
          }
        />
      )}
    </GlassCard>
  )
}
