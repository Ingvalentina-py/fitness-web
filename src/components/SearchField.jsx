import { Search, X } from 'lucide-react'
import { useId } from 'react'
import styles from './SearchField.module.css'

// Buscador con ícono y botón para borrar lo escrito
export default function SearchField({ label, value, onChange, placeholder, autoFocus }) {
  const id = useId()

  return (
    <div className={styles.field}>
      <label htmlFor={id} className="visually-hidden">
        {label}
      </label>
      <Search className={styles.icon} size={20} strokeWidth={2.25} aria-hidden="true" />
      <input
        id={id}
        className={styles.input}
        type="search"
        enterKeyHint="search"
        autoComplete="off"
        value={value}
        placeholder={placeholder}
        // Dentro de un panel (Sheet), el foco se aplica al abrirlo; ver Sheet.jsx
        data-autofocus={autoFocus || undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange('')}
          aria-label="Borrar búsqueda"
        >
          <X size={18} strokeWidth={2.25} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
