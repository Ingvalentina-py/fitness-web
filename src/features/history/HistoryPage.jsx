import { CalendarDays, Plus } from 'lucide-react'
import Button from '../../components/Button.jsx'
import EmptyState from '../../components/EmptyState.jsx'
import PageHeader from '../../components/PageHeader.jsx'
import { Reveal, Stagger } from '../../components/Reveal.jsx'
import { useQuickAdd } from '../../app/layout/useQuickAdd.js'

// Pantalla vacía por ahora: el calendario llega en la Fase 7
export default function HistoryPage() {
  const openQuickAdd = useQuickAdd()

  return (
    <Stagger>
      <Reveal>
        <PageHeader title="Historial" subtitle="Tu calendario y el detalle de cada día." />
      </Reveal>

      <Reveal>
        <EmptyState
          icon={CalendarDays}
          color="orange"
          title="Tu historial está vacío"
          description="Cada actividad que registres aparecerá en tu calendario, marcada con su color."
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
