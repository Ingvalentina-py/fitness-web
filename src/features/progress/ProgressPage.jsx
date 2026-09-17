import { Plus, Trophy } from 'lucide-react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { useQuickAdd } from '../../app/layout/useQuickAdd.js'

// Pantalla vacía por ahora: estadísticas y récords llegan en la Fase 8
export default function ProgressPage() {
  const openQuickAdd = useQuickAdd()

  return (
    <Stagger>
      <Reveal>
        <PageHeader title="Progreso" subtitle="Tus estadísticas, récords y rachas." />
      </Reveal>

      <Reveal>
        <EmptyState
          icon={Trophy}
          color="yellow"
          title="Tu progreso empieza con tu primera sesión"
          description="Aquí verás tu racha, tus récords personales y cómo suben tus pesos con el tiempo."
          action={
            <Button icon={Plus} onClick={openQuickAdd}>
              Registrar actividad
            </Button>
          }
        />
      </Reveal>
    </Stagger>
  )
}
