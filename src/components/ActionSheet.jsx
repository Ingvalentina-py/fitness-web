import { cx } from '../lib/cx.js'
import Sheet from './Sheet.jsx'
import styles from './ActionSheet.module.css'

// Menú de acciones en un panel (ej. "Editar", "Duplicar", "Archivar").
// actions: [{ label, icon, onSelect, danger? }]. Los valores falsos se ignoran,
// así se pueden incluir acciones condicionales: condicion && { ... }.
export default function ActionSheet({ open, onClose, title, actions }) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <ul className={styles.list}>
        {actions.filter(Boolean).map(({ label, icon: Icon, onSelect, danger }) => (
          <li key={label}>
            <button
              type="button"
              className={cx(styles.action, danger && styles.danger)}
              onClick={() => {
                onClose()
                onSelect()
              }}
            >
              <Icon size={20} strokeWidth={2.25} aria-hidden="true" />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
