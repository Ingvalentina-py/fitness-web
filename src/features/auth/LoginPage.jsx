import { Link } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import Field from '../../components/Field.jsx'
import { getFieldErrors } from '../../lib/formErrors.js'
import AuthLayout from './AuthLayout.jsx'
import { useLogin } from './useAuth.js'
import styles from './auth.module.css'

export default function LoginPage() {
  const login = useLogin()
  const fieldErrors = getFieldErrors(login.error)
  // Si el error es de un campo, se muestra junto a ese campo; si no, arriba del formulario
  const hasFieldErrors = Object.keys(fieldErrors).some(Boolean)

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    login.mutate({ email: form.get('email'), password: form.get('password') })
  }

  return (
    <AuthLayout
      title="Inicia sesión"
      subtitle="Qué bueno verte de nuevo."
      footer={
        <>
          ¿No tienes cuenta? <Link to="/registro">Crea una</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        {login.isError && !hasFieldErrors && (
          <Alert>{fieldErrors[''] ?? login.error.message}</Alert>
        )}

        <Field
          label="Correo"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={fieldErrors.email}
        />
        <Field
          label="Contraseña"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          error={fieldErrors.password}
        />

        <Button type="submit" size="lg" fullWidth disabled={login.isPending}>
          {login.isPending ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </AuthLayout>
  )
}
