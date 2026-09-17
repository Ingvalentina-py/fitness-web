import { Check, Save } from 'lucide-react'
import { useState } from 'react'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import Field from '../../components/Field.jsx'
import IconByName from '../../components/IconByName.jsx'
import Sheet from '../../components/Sheet.jsx'
import { GROUP_ICON_NAMES, getIconLabel } from '../../components/icons.js'
import { getFieldErrors } from '../../lib/formErrors.js'
import { GROUP_COLORS } from './options.js'
import { useCreateGroup, useUpdateGroup } from './useRoutines.js'
import styles from './GroupFormSheet.module.css'

// Crear o editar un grupo: nombre, color e ícono. Se monta solo mientras está abierto.
export default function GroupFormSheet({ group, onClose }) {
  const [name, setName] = useState(group?.name ?? '')
  const [color, setColor] = useState(group?.color ?? GROUP_COLORS[0].value)
  const [icon, setIcon] = useState(group?.icon ?? GROUP_ICON_NAMES[0])

  const createGroup = useCreateGroup()
  const updateGroup = useUpdateGroup()
  const save = group ? updateGroup : createGroup
  const fieldErrors = getFieldErrors(save.error)

  function handleSubmit(event) {
    event.preventDefault()
    const values = { name, color, icon }
    save.mutate(group ? { id: group._id, ...values } : values, { onSuccess: onClose })
  }

  return (
    <Sheet open onClose={onClose} title={group ? 'Editar grupo' : 'Nuevo grupo'}>
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
            placeholder="Ej.: Glúteo y femoral"
            maxLength={40}
            required
            error={fieldErrors.name}
          />
        </div>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Color</legend>
          <div className={styles.swatches}>
            {GROUP_COLORS.map((option) => (
              <label key={option.value} className={styles.swatch} style={{ '--tone': option.value }}>
                <input
                  className="visually-hidden"
                  type="radio"
                  name="group-color"
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
            {GROUP_ICON_NAMES.map((iconName) => (
              <label key={iconName} className={styles.iconOption}>
                <input
                  className="visually-hidden"
                  type="radio"
                  name="group-icon"
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

        <Button type="submit" icon={Save} disabled={save.isPending}>
          {save.isPending ? 'Guardando…' : group ? 'Guardar grupo' : 'Crear grupo'}
        </Button>
      </form>
    </Sheet>
  )
}
