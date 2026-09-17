import { useId } from 'react'
import { cx } from '../lib/cx.js'
import styles from './Field.module.css'

// Campo de formulario con etiqueta, ayuda y error conectados para lectores de pantalla.
// `as="select"` lo convierte en un desplegable (las opciones van como children)
// y `as="textarea"` en un texto de varias líneas.
export default function Field({ label, hint, error, as: Control = 'input', ...controlProps }) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <Control
        id={id}
        className={cx(
          styles.control,
          Control === 'select' && styles.select,
          Control === 'textarea' && styles.textarea,
        )}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...controlProps}
      />
      {hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}
