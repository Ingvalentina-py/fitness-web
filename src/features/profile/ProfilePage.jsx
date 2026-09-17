import { ChevronRight, KeyRound, ListChecks, LogOut, Palette, Quote, Save } from 'lucide-react'
import { useNavigate } from 'react-router'
import Alert from '../../components/Alert.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import Field from '../../components/Field.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import SegmentedControl from '../../components/SegmentedControl.jsx'
import Switch from '../../components/Switch.jsx'
import { getFieldErrors } from '../../lib/formErrors.js'
import { useMeta } from '../../lib/useMeta.js'
import { useCurrentUser, useLogout } from '../auth/useAuth.js'
import { useChangePassword, useUpdateProfile } from './useProfile.js'
import styles from './ProfilePage.module.css'

export default function ProfilePage() {
  const { data: user } = useCurrentUser()
  const { data: meta, isPending, isError } = useMeta()

  return (
    <Stagger>
      <Reveal>
        <PageHeader title="Tu perfil" subtitle={user.email} />
      </Reveal>

      <Reveal>
        {isPending && <GlassCard>Cargando opciones…</GlassCard>}
        {isError && <Alert>No pudimos cargar las opciones. Recarga la página.</Alert>}
        {meta && <ProfileForm user={user} meta={meta} />}
      </Reveal>

      <Reveal>
        <PasswordForm />
      </Reveal>

      <Reveal>
        <CustomizationSection />
      </Reveal>

      <Reveal>
        <SessionSection />
      </Reveal>
    </Stagger>
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
    <GlassCard aria-labelledby="profile-preferences-title">
      <h2 id="profile-preferences-title" className={styles.sectionTitle}>
        Datos y preferencias
      </h2>

      {/* Al editar cualquier campo se oculta el aviso "Cambios guardados" anterior */}
      <form
        className={styles.form}
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

        <SegmentedControl
          legend="Unidad de peso por defecto"
          name="weightUnit"
          options={meta.weightUnits}
          defaultValue={user.preferences.weightUnit}
        />

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
          hint={`La de este dispositivo es ${deviceTimeZone.replaceAll('_', ' ')}.`}
          error={fieldErrors['preferences.timezone']}
        >
          {getTimeZones(user.preferences.timezone).map((zone) => (
            <option key={zone} value={zone}>
              {zone.replaceAll('_', ' ')}
            </option>
          ))}
        </Field>

        <Switch
          name="voicePhrases"
          defaultChecked={user.preferences.voicePhrases}
          label="Frases por voz"
          description="Escucha una frase motivacional al terminar una sesión."
        />

        <Button type="submit" icon={Save} disabled={updateProfile.isPending}>
          {updateProfile.isPending ? 'Guardando…' : 'Guardar cambios'}
        </Button>
      </form>
    </GlassCard>
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
    <GlassCard aria-labelledby="profile-password-title">
      <h2 id="profile-password-title" className={styles.sectionTitle}>
        Cambiar contraseña
      </h2>

      <form className={styles.form} onSubmit={handleSubmit}>
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

        <Button
          type="submit"
          variant="secondary"
          icon={KeyRound}
          disabled={changePassword.isPending}
        >
          {changePassword.isPending ? 'Cambiando…' : 'Cambiar contraseña'}
        </Button>
      </form>
    </GlassCard>
  )
}

// Secciones del perfil que llegan en próximas fases
const CUSTOMIZATION_ITEMS = [
  {
    icon: ListChecks,
    tone: 'var(--color-fuchsia)',
    title: 'Catálogo de ejercicios',
    description: 'Crea y edita tus propios ejercicios.',
  },
  {
    icon: Palette,
    tone: 'var(--color-turquoise)',
    title: 'Tipos de actividad',
    description: 'Colores e íconos de tus actividades.',
  },
  {
    icon: Quote,
    tone: 'var(--color-yellow)',
    title: 'Mis frases',
    description: 'Tus frases motivacionales.',
  },
]

function CustomizationSection() {
  return (
    <GlassCard aria-labelledby="profile-customization-title">
      <h2 id="profile-customization-title" className={styles.sectionTitle}>
        Personalización
      </h2>

      <ul className={styles.rows}>
        {CUSTOMIZATION_ITEMS.map(({ icon: Icon, tone, title, description }) => (
          <li key={title} className={styles.row}>
            <span className={styles.rowIcon} style={{ '--tone': tone }} aria-hidden="true">
              <Icon size={20} strokeWidth={2.25} />
            </span>
            <span className={styles.rowText}>
              <span className={styles.rowTitle}>{title}</span>
              <span className={styles.rowDescription}>{description}</span>
            </span>
            <Badge>Pronto</Badge>
            <ChevronRight className={styles.chevron} size={20} aria-hidden="true" />
          </li>
        ))}
      </ul>
    </GlassCard>
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
    <Button
      variant="secondary"
      icon={LogOut}
      fullWidth
      onClick={handleLogout}
      disabled={logout.isPending}
    >
      {logout.isPending ? 'Cerrando sesión…' : 'Cerrar sesión'}
    </Button>
  )
}
