import { useSyncExternalStore } from 'react'

// La sesión en curso vive en el navegador (localStorage), no en el servidor:
// así se puede entrenar sin señal y el historial nunca queda con sesiones a medias.
// Solo al pulsar "Terminar sesión" se envía a la API.
const STORAGE_KEY = 'fitness:session-draft:v1'

let draft = readFromStorage()
const listeners = new Set()

// El componente se suscribe a los cambios del borrador con useSyncExternalStore:
// es la forma de React 18+ de leer un dato que vive fuera de React.
export function useSessionDraft() {
  return useSyncExternalStore(subscribe, () => draft)
}

export function getDraft() {
  return draft
}

export function updateDraft(changes) {
  if (!draft) return
  setDraft({ ...draft, ...(typeof changes === 'function' ? changes(draft) : changes) })
}

export function clearDraft() {
  setDraft(null)
}

// Empieza una sesión nueva. `routine` es null cuando se entrena desde cero.
export function startDraft({ userId, routine, exercises, defaultUnit }) {
  setDraft({
    userId,
    startedAt: new Date().toISOString(),
    routine: routine ? { _id: routine._id, name: routine.name } : null,
    exercises: exercises.map((item) => newDraftExercise(item, defaultUnit)),
  })
}

// Un ejercicio del borrador. `planned` trae lo que decía la rutina (series y descanso).
export function newDraftExercise({ exercise, targetSets = 3, targetRepsMin, restSeconds, notes }, unit) {
  return {
    key: nextKey(),
    exercise,
    isUnilateral: exercise.isUnilateral,
    restSeconds: restSeconds ?? 60,
    targetReps: targetRepsMin ?? null,
    notes: notes ?? '',
    sets: Array.from({ length: targetSets }, () => newDraftSet(unit)),
  }
}

export function newDraftSet(unit = 'kg') {
  return { key: nextKey(), reps: '', weight: '', unit, completed: false }
}

// Convierte el borrador al formato que espera la API (números, sin campos vacíos).
// Solo viaja lo que realmente hiciste: las series sin marcar y los ejercicios que
// quedaron en blanco no se guardan, para que el historial no se llene de vacíos.
export function draftToRequest(draft, { durationMinutes, energy, notes }) {
  const exercises = draft.exercises
    .map((item) => ({
      exercise: item.exercise._id,
      isUnilateral: item.isUnilateral,
      restSeconds: item.restSeconds,
      ...(item.notes.trim() && { notes: item.notes.trim() }),
      sets: item.sets
        .filter((set) => set.completed)
        .map((set) => ({
          ...(set.reps !== '' && { reps: Number(set.reps) }),
          ...(set.weight !== '' && { weight: Number(set.weight) }),
          unit: set.unit,
          completed: true,
        })),
    }))
    .filter((item) => item.sets.length > 0)

  return {
    ...(draft.routine && { routine: draft.routine._id }),
    date: draft.startedAt,
    durationMinutes,
    ...(energy && { energy }),
    ...(notes?.trim() && { notes: notes.trim() }),
    exercises,
  }
}

let keyCounter = 0

function nextKey() {
  return `d${Date.now().toString(36)}-${keyCounter++}`
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function setDraft(next) {
  draft = next
  writeToStorage(next)
  for (const listener of listeners) listener()
}

// localStorage puede fallar (modo privado, permisos): la app debe seguir funcionando
function readFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function writeToStorage(value) {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Sin almacenamiento la sesión sigue viva en memoria hasta recargar la página
  }
}
