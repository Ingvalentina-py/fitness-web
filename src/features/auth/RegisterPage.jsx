import { Link } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Button from '../../components/Button.jsx'
import Field from '../../components/Field.jsx'
import { getFieldErrors } from '../../lib/formErrors.js'
import AuthLayout from './AuthLayout.jsx'
import { useRegister } from './useAuth.js'
import styles from './auth.module.css'

export default function RegisterPage() {
  const register = useRegister()
  const fieldErrors = getFieldErrors(register.error)
  const hasFieldErrors = Object.keys(fieldErrors).some(Boolean)

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    register.mutate({
      name: form.get('name'),
      email: form.get('email'),
      password: form.get('password'),
      // Zona horaria del dispositivo, ej. "America/Bogota": define qué día es "hoy"
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  }

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Empieza a registrar cada entrenamiento."
      footer={
        <>
          ¿Ya tienes cuenta? <Link to="/ingresar">Inicia sesión</Link>
        </>
      }
    >
      <form className={styles.form} onSubmit={handleSubmit}>
        {register.isError && !hasFieldErrors && (
          <Alert>{fieldErrors[''] ?? register.error.message}</Alert>
        )}

        <Field
          label="Nombre"
          name="name"
          autoComplete="given-name"
          maxLength={60}
          required
          error={fieldErrors.name}
        />
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
          autoComplete="new-password"
          minLength={8}
          required
          hint="Mínimo 8 caracteres."
          error={fieldErrors.password}
        />

        <Button type="submit" size="lg" fullWidth disabled={register.isPending}>
          {register.isPending ? 'Creando cuenta…' : 'Crear cuenta'}
        </Button>
      </form>
    </AuthLayout>
  )
}
