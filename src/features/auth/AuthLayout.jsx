// Marco común de las pantallas de inicio de sesión y registro
export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main className="page">
      <header>
        <p className="eyebrow">App Fitness</p>
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </header>

      <section className="card">{children}</section>

      <p className="page-footer">{footer}</p>
    </main>
  )
}
