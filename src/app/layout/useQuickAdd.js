import { useOutletContext } from 'react-router'

// Devuelve la función que abre el panel "¿Qué vas a registrar?" (botón "+").
// AppLayout la comparte con todas las pantallas a través del contexto del Outlet.
export function useQuickAdd() {
  return useOutletContext().openQuickAdd
}
