import { Link, useNavigate } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Field from '../../components/Field.jsx'
import PageMessage from '../../components/PageMessage.jsx'
import { getFieldErrors } from '../../lib/formErrors.js'
import { useMeta } from '../../lib/useMeta.js'
import { useCurrentUser, useLogout } from '../auth/useAuth.js'
import { useChangePassword, useUpdateProfile } from './useProfile.js'

export default function ProfilePage() {
  const { data: user } = useCurrentUser()
  const { data: meta, isPending, isError } = useMeta()

  if (isPending) return <PageMessage>Cargando…</PageMessage>
  if (isError) return <PageMessage>No pudimos cargar las opciones. Recarga la página.</PageMessage>

  return (
    <main className="page">
      <header>
        <Link to="/" className="back-link">
          ← Volver
        </Link>
        <h1 className="page-title">Tu perfil</h1>
        <p className="page-subtitle">{user.email}</p>
      </header>

      <ProfileForm user={user} meta={meta} />
      <PasswordForm />
      <SessionSection />
    </main>
  )
}

// Zonas horarias que conoce el navegador, incluyendo siempre la guardada
function getTimeZones(current) {
  const zones = Intl.supportedValuesOf('timeZone')
  return zones.includes(current) ? zones : [current, ...zones]
}

function ProfileForm({ user, meta }) {
  const updateProfile = useUpdateProfile()
  const fieldErrors = getFieldErrors(updateProfile.error)
  const deviceTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    updateProfile.mutate({
      name: form.get('name'),
      preferences: {
        weightUnit: form.get('weightUnit'),
        weekStartsOn: Number(form.get('weekStartsOn')),
        timezone: form.get('timezone'),
        voicePhrases: form.get('voicePhrases') === 'on',
      },
    })
  }

  return (
    <section className="card">
      <h2 className="card__title">Datos y preferencias</h2>

      {/* Al editar cualquier campo se oculta el aviso "Cambios guardados" anterior */}
      <form
        className="form"
        onSubmit={handleSubmit}
        onChange={() => updateProfile.isSuccess && updateProfile.reset()}
      >
        {updateProfile.isSuccess && <Alert variant="success">Cambios guardados.</Alert>}
        {updateProfile.isError && <Alert>{updateProfile.error.message}</Alert>}

        <Field
          label="Nombre"
          name="name"
          defaultValue={user.name}
          autoComplete="given-name"
          maxLength={60}
          required
          error={fieldErrors.name}
        />

        <fieldset className="fieldset">
          <legend className="field__label">Unidad de peso por defecto</legend>
          <div className="choice-group">
            {meta.weightUnits.map((unit) => (
              <label key={unit.value} className="choice">
                <input
                  type="radio"
                  name="weightUnit"
                  value={unit.value}
                  defaultChecked={user.preferences.weightUnit === unit.value}
                />
                {unit.label}
              </label>
            ))}
          </div>
        </fieldset>

        <Field
          as="select"
          label="Primer día de la semana"
          name="weekStartsOn"
          defaultValue={user.preferences.weekStartsOn}
        >
          {meta.weekStartDays.map((day) => (
            <option key={day.value} value={day.value}>
              {day.label}
            </option>
          ))}
        </Field>

        <Field
          as="select"
          label="Zona horaria"
          name="timezone"
          defaultValue={user.preferences.timezone}
          hint={`La de este dispositivo es ${deviceTimeZone}.`}
          error={fieldErrors['preferences.timezone']}
        >
          {getTimeZones(user.preferences.timezone).map((zone) => (
            <option key={zone} value={zone}>
              {zone.replaceAll('_', ' ')}
            </option>
          ))}
        </Field>

        <label className="choice">
          <input
            type="checkbox"
            name="voicePhrases"
            defaultChecked={user.preferences.voicePhrases}
          />
          Leer una frase motivacional en voz alta al terminar una sesión
        </label>

        <button type="submit" className="button" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </section>
  )
}

function PasswordForm() {
  const changePassword = useChangePassword()
  const fieldErrors = getFieldErrors(changePassword.error)
  const hasFieldErrors = Object.keys(fieldErrors).some(Boolean)

  function handleSubmit(event) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)

    changePassword.mutate(
      { currentPassword: form.get('currentPassword'), newPassword: form.get('newPassword') },
      { onSuccess: () => formElement.reset() },
    )
  }

  return (
    <section className="card">
      <h2 className="card__title">Cambiar contraseña</h2>

      <form className="form" onSubmit={handleSubmit}>
        {changePassword.isSuccess && (
          <Alert variant="success">
            Contraseña actualizada. Se cerraron las sesiones de tus otros dispositivos.
          </Alert>
        )}
        {changePassword.isError && !hasFieldErrors && (
          <Alert>{fieldErrors[''] ?? changePassword.error.message}</Alert>
        )}

        <Field
          label="Contraseña actual"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
          error={fieldErrors.currentPassword}
        />
        <Field
          label="Contraseña nueva"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          hint="Mínimo 8 caracteres."
          error={fieldErrors.newPassword}
        />

        <button type="submit" className="button" disabled={changePassword.isPending}>
          {changePassword.isPending ? 'Cambiando…' : 'Cambiar contraseña'}
        </button>
      </form>
    </section>
  )
}

function SessionSection() {
  const logout = useLogout()
  const navigate = useNavigate()

  function handleLogout() {
    // Al salir se va directo a /ingresar, sin recordar esta página para después
    logout.mutate(undefined, { onSettled: () => navigate('/ingresar', { replace: true }) })
  }

  return (
    <section className="card">
      <h2 className="card__title">Sesión</h2>
      <button
        type="button"
        className="button button--secondary"
        onClick={handleLogout}
        disabled={logout.isPending}
      >
        {logout.isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </button>
    </section>
  )
}
