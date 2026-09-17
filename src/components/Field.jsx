import { useId } from 'react'

// Campo de formulario con etiqueta, ayuda y error conectados para lectores de pantalla.
// `as="select"` lo convierte en un desplegable (las opciones van como children).
// Componente básico: en la Fase 3 pasa al sistema de diseño.
export default function Field({ label, hint, error, as: Control = 'input', ...controlProps }) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <Control
        id={id}
        className="field__input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...controlProps}
      />
      {hint && (
        <p id={hintId} className="field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="field__error">
          {error}
        </p>
      )}
    </div>
  )
}
