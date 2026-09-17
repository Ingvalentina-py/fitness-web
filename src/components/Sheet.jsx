import { X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import styles from './Sheet.module.css'

// Panel modal: sube desde abajo en el celular y aparece centrado en el computador.
// Usa <dialog> nativo, que ya trae lo difícil: atrapa el foco del teclado,
// se cierra con Escape y deja inerte el resto de la página.
export default function Sheet({ open, onClose, title, children }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  // Un clic fuera del contenido (sobre el fondo oscurecido) cierra el panel
  function handleClick(event) {
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.sheet}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleClick}
    >
      <div className={styles.content}>
        <span className={styles.handle} aria-hidden="true" />
        <header className={styles.header}>
          <h2 id={titleId} className={styles.title}>
            {title}
          </h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Cerrar">
            <X size={22} strokeWidth={2.25} aria-hidden="true" />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}
