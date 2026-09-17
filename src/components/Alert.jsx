// Mensaje destacado. Los errores usan role="alert" para que los lectores de pantalla
// los anuncien de inmediato; los mensajes de éxito, role="status".
export default function Alert({ variant = 'error', children }) {
  return (
    <div className={`alert alert--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
