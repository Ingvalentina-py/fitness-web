import { Link } from 'react-router'
import Button from '../components/Button.jsx'
import PageMessage from '../components/PageMessage.jsx'
import { APP_NAME } from './config.js'

export default function NotFoundPage() {
  return (
    <PageMessage>
      <title>{`Página no encontrada · ${APP_NAME}`}</title>
      <h1>Esta página no existe</h1>
      <Button as={Link} to="/">
        Ir al inicio
      </Button>
    </PageMessage>
  )
}
