import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <main className="page page--centered">
      <h1 className="page-title">Esta página no existe</h1>
      <Link to="/">Ir al inicio</Link>
    </main>
  )
}
