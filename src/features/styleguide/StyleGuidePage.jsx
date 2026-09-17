import { Dumbbell, Plus, Sparkles } from 'lucide-react'
import Alert from '../../components/Alert.jsx'
import Avatar from '../../components/Avatar.jsx'
import Badge from '../../components/Badge.jsx'
import Button from '../../components/Button.jsx'
import Chip from '../../components/Chip.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import Field from '../../components/Field.jsx'
import GlassCard from '../../components/GlassCard.jsx'
import Logo from '../../components/Logo.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import SegmentedControl from '../../components/SegmentedControl.jsx'
import Switch from '../../components/Switch.jsx'
import { getIcon } from '../../components/icons.js'
import styles from './StyleGuidePage.module.css'

// Guía de estilos (solo en desarrollo, en /estilos): muestra los tokens y componentes
// del sistema de diseño para revisarlos juntos sin tener que navegar por la app.

const COLORS = [
  { name: 'Nube', token: '--color-cloud', use: 'Fondo base' },
  { name: 'Tinta ciruela', token: '--color-ink', use: 'Texto principal', dark: true },
  { name: 'Fucsia pulso', token: '--color-fuchsia', strong: '--color-fuchsia-strong', use: 'Principal · gimnasio' },
  { name: 'Naranja impulso', token: '--color-orange', strong: '--color-orange-strong', use: 'Energía · baile' },
  { name: 'Turquesa eléctrico', token: '--color-turquoise', strong: '--color-turquoise-strong', use: 'Acento · bicicleta · gráficas' },
  { name: 'Amarillo meta', token: '--color-yellow', strong: '--color-yellow-strong', use: 'Logros · rachas · clases' },
  { name: 'Lima', token: '--color-lime', strong: '--color-lime-strong', use: 'Patinaje · completado' },
]

// Mismos colores e íconos que los tipos de actividad del seed
const ACTIVITY_SAMPLES = [
  { name: 'Gimnasio', color: '#FF2E7E', icon: 'dumbbell' },
  { name: 'Baile', color: '#FF6B2C', icon: 'music' },
  { name: 'Clase grupal', color: '#FFC928', icon: 'users' },
  { name: 'Bicicleta', color: '#12D6C5', icon: 'bike' },
  { name: 'Patinaje', color: '#7BDC3A', icon: 'roller-skate' },
  { name: 'Otra', color: '#8A84A3', icon: 'sparkles' },
]

const WEIGHT_UNITS = [
  { value: 'kg', label: 'kg' },
  { value: 'lb', label: 'lb' },
]

export default function StyleGuidePage() {
  return (
    <main className={styles.page}>
      <Stagger>
        <Reveal>
          <PageHeader
            documentTitle="Guía de estilos"
            eyebrow="Sistema de diseño"
            title="Guía de estilos"
            subtitle="Colores, tipografía y componentes de la app."
            action={<Logo showName={false} size={56} />}
          />
        </Reveal>

        <Reveal>
          <GlassCard aria-labelledby="sg-colors">
            <h2 id="sg-colors" className={styles.sectionTitle}>Colores</h2>
            <p className={styles.note}>
              Los colores vivos son para fondos, íconos y gráficas. Para texto se usa su variante
              oscura (contraste ≥ 4.8:1).
            </p>
            <ul className={styles.swatches}>
              {COLORS.map((color) => (
                <li key={color.token} className={styles.swatch}>
                  <span
                    className={styles.swatchColor}
                    style={{ background: `var(${color.token})`, color: color.dark ? '#fff' : 'var(--text)' }}
                  >
                    Aa
                  </span>
                  <span className={styles.swatchName}>{color.name}</span>
                  <code className={styles.code}>{color.token}</code>
                  <span className={styles.swatchUse}>{color.use}</span>
                  {color.strong && (
                    <span className={styles.strongSample} style={{ color: `var(${color.strong})` }}>
                      Texto: {color.strong.replace('--color-', '')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard aria-labelledby="sg-type">
            <h2 id="sg-type" className={styles.sectionTitle}>Tipografía · Archivo</h2>
            <p className={styles.displaySample}>Títulos expandidos</p>
            <p>Texto normal en ancho estándar, cómodo para leer en el celular.</p>
            <p className={`${styles.numbers} num`}>
              12 × 20.5 kg<br />
              10 × 7.25 kg
            </p>
            <p className={styles.note}>Los números usan cifras tabulares: quedan alineados.</p>
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard aria-labelledby="sg-buttons">
            <h2 id="sg-buttons" className={styles.sectionTitle}>Botones</h2>
            <div className={styles.row}>
              <Button icon={Plus}>Empezar rutina</Button>
              <Button variant="secondary">Guardar rutina</Button>
              <Button variant="ghost">Cancelar</Button>
              <Button disabled>Deshabilitado</Button>
            </div>
            <Button size="lg" fullWidth icon={Dumbbell}>
              Terminar sesión
            </Button>
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard aria-labelledby="sg-forms">
            <h2 id="sg-forms" className={styles.sectionTitle}>Formularios</h2>
            <Field label="Nombre de la rutina" placeholder="Inferior A – Fuerza" hint="Máximo 60 caracteres." />
            <Field label="Con error" defaultValue="hola" error="Escribe un correo válido" />
            <Field as="select" label="Objetivo" defaultValue="strength">
              <option value="strength">Fuerza</option>
              <option value="hypertrophy">Hipertrofia</option>
            </Field>
            <SegmentedControl legend="Unidad" name="sg-unit" options={WEIGHT_UNITS} defaultValue="kg" />
            <Switch label="Frases por voz" description="Escucha una frase al terminar." defaultChecked />
          </GlassCard>
        </Reveal>

        <Reveal>
          <GlassCard aria-labelledby="sg-labels">
            <h2 id="sg-labels" className={styles.sectionTitle}>Etiquetas y avisos</h2>
            <ul className={styles.chips}>
              {ACTIVITY_SAMPLES.map((sample) => (
                <li key={sample.name}>
                  <Chip icon={getIcon(sample.icon)} color={sample.color}>
                    {sample.name}
                  </Chip>
                </li>
              ))}
            </ul>
            <div className={styles.row}>
              <Badge>Pronto</Badge>
              <Avatar name="Valentina" />
              <Logo size={32} />
            </div>
            <Alert variant="success">Cambios guardados.</Alert>
            <Alert>Correo o contraseña incorrectos.</Alert>
          </GlassCard>
        </Reveal>

        <Reveal>
          <EmptyState
            icon={Sparkles}
            color="lime"
            title="Pantalla vacía que invita a actuar"
            description="Un ícono con color, un título claro, una explicación corta y una acción."
            action={<Button icon={Plus}>Crear la primera</Button>}
          />
        </Reveal>
      </Stagger>
    </main>
  )
}
