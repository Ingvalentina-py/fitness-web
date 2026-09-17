import { CalendarRange, Dumbbell, Plus } from 'lucide-react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'

// Pantalla vacía por ahora: grupos, rutinas y plan semanal llegan en la Fase 4
export default function RoutinesPage() {
  return (
    <Stagger>
      <Reveal>
        <PageHeader title="Rutinas" subtitle="Tus grupos, rutinas guardadas y plan semanal." />
      </Reveal>

      <Reveal>
        <EmptyState
          icon={Dumbbell}
          color="fuchsia"
          title="Crea tu primera rutina"
          description="Guarda tus ejercicios con series, repeticiones y descanso, y empieza a entrenar con un solo toque."
          action={
            <Button icon={Plus} disabled>
              Crear rutina
            </Button>
          }
          note="Disponible en la Fase 4."
        />
      </Reveal>

      <Reveal>
        <EmptyState
          icon={CalendarRange}
          color="turquoise"
          title="Arma tu plan semanal"
          description="Asigna rutinas o actividades a cada día y la pantalla Hoy te dirá qué toca."
          note="Disponible en la Fase 4."
        />
      </Reveal>
    </Stagger>
  )
}
