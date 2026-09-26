import { Check, Save } from 'lucide-react'
import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import Field from '../../components/Field.jsx'
import IconByName from '../../components/IconByName.jsx'
import Sheet from '../../components/Sheet.jsx'
import Switch from '../../components/Switch.jsx'
import { ACTIVITY_ICON_NAMES, getIconLabel } from '../../components/icons.js'
import { getFieldErrors } from '../../lib/formErrors.js'
import { PALETTE_COLORS } from '../../lib/palette.js'
import { useCreateActivityType, useUpdateActivityType } from './useActivities.js'
import styles from './ActivityTypeFormSheet.module.css'

// Crear o editar un tipo de actividad propio: nombre, color, ícono y dos opciones.
export default function ActivityTypeFormSheet({ activityType, onClose }) {
  const [name, setName] = useState(activityType?.name ?? '')
  const [color, setColor] = useState(activityType?.color ?? PALETTE_COLORS[0].value)
  const [icon, setIcon] = useState(activityType?.icon ?? ACTIVITY_ICON_NAMES[0])
  const [usesDistance, setUsesDistance] = useState(activityType?.usesDistance ?? false)
  const [isLegIntensive, setIsLegIntensive] = useState(activityType?.isLegIntensive ?? false)

  const createActivityType = useCreateActivityType()
  const updateActivityType = useUpdateActivityType()
  const save = activityType ? updateActivityType : createActivityType
  const fieldErrors = getFieldErrors(save.error)

  function handleSubmit(event) {
    event.preventDefault()
    const values = { name, color, icon, usesDistance, isLegIntensive }
    save.mutate(activityType ? { id: activityType._id, ...values } : values, { onSuccess: onClose })
  }

  return (
    <Sheet open onClose={onClose} title={activityType ? 'Editar tipo' : 'Nuevo tipo de actividad'}>
      <form className={styles.form} onSubmit={handleSubmit}>
        {save.isError && !fieldErrors.name && <Alert>{save.error.message}</Alert>}

        <div className={styles.preview}>
          <span className={styles.previewIcon} style={{ '--tone': color }} aria-hidden="true">
            <IconByName name={icon} size={26} strokeWidth={2.25} />
          </span>
          <Field
            label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej.: Natación"
            maxLength={40}
            required
            error={fieldErrors.name}
          />
        </div>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Color</legend>
          <div className={styles.swatches}>
            {PALETTE_COLORS.map((option) => (
              <label key={option.value} className={styles.swatch} style={{ '--tone': option.value }}>
                <input
                  className="visually-hidden"
                  type="radio"
                  name="activity-type-color"
                  value={option.value}
                  checked={color === option.value}
                  onChange={() => setColor(option.value)}
                />
                <span className="visually-hidden">{option.label}</span>
                {color === option.value && <Check size={20} strokeWidth={3} aria-hidden="true" />}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Ícono</legend>
          <div className={styles.icons}>
            {ACTIVITY_ICON_NAMES.map((iconName) => (
              <label key={iconName} className={styles.iconOption}>
                <input
                  className="visually-hidden"
                  type="radio"
                  name="activity-type-icon"
                  value={iconName}
                  checked={icon === iconName}
                  onChange={() => setIcon(iconName)}
                />
                <span className="visually-hidden">{getIconLabel(iconName)}</span>
                <IconByName name={iconName} size={22} strokeWidth={2.25} aria-hidden="true" />
              </label>
            ))}
          </div>
        </fieldset>

        <div className={styles.switches}>
          <Switch
            label="Registra distancia"
            description="Para bicicleta, patinaje o cualquier actividad donde importe cuánto recorriste."
            checked={usesDistance}
            onChange={(event) => setUsesDistance(event.target.checked)}
          />
          <Switch
            label="Exigente para las piernas"
            description="La app te avisa si planeas pierna intensa justo después de esta actividad."
            checked={isLegIntensive}
            onChange={(event) => setIsLegIntensive(event.target.checked)}
          />
        </div>

        <Button type="submit" icon={Save} disabled={save.isPending}>
          {save.isPending ? 'Guardando…' : activityType ? 'Guardar tipo' : 'Crear tipo'}
        </Button>
      </form>
    </Sheet>
  )
}
