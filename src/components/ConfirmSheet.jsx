import Button from './Button.jsx'
import Sheet from './Sheet.jsx'
import styles from './ConfirmSheet.module.css'

// Pide confirmación antes de una acción importante. children: contenido extra (ej. un selector).
export default function ConfirmSheet({
  open = true,
  onClose,
  title,
  description,
  confirmLabel,
  onConfirm,
  danger = false,
  isPending = false,
  confirmDisabled = false,
  children,
}) {
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      {description && <p className={styles.description}>{description}</p>}
      {children}
      <div className={styles.actions}>
        <Button
          variant={danger ? 'danger' : 'primary'}
          fullWidth
          onClick={onConfirm}
          disabled={isPending || confirmDisabled}
        >
          {confirmLabel}
        </Button>
        <Button variant="ghost" fullWidth onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </Sheet>
  )
}
