// Mismos cálculos que hace la API, para mostrar el avance en vivo mientras entrenas.
// El valor que queda guardado siempre es el que calcula el servidor.
const KG_PER_LB = 0.45359237

// Los ejercicios unilaterales se registran por lado, así que cuentan los dos lados
const UNILATERAL_SIDES = 2

export function toKg(weight, unit) {
  return unit === 'lb' ? weight * KG_PER_LB : weight
}

// Solo cuentan las series marcadas como completadas
export function exerciseVolumeKg(item) {
  const sides = item.isUnilateral ? UNILATERAL_SIDES : 1
  const total = item.sets.reduce((sum, set) => {
    if (!set.completed || !set.reps || !set.weight) return sum
    return sum + Number(set.reps) * toKg(Number(set.weight), set.unit)
  }, 0)

  return total * sides
}

export function draftStats(draft) {
  const sets = draft.exercises.flatMap((item) => item.sets)

  return {
    volumeKg: draft.exercises.reduce((total, item) => total + exerciseVolumeKg(item), 0),
    completedSets: sets.filter((set) => set.completed).length,
    totalSets: sets.length,
  }
}

// Músculos principales trabajados en la sesión, sin repetir
export function workedMuscles(exercises) {
  return [...new Set(exercises.flatMap((item) => item.primaryMuscles ?? item.exercise.primaryMuscles))]
}
