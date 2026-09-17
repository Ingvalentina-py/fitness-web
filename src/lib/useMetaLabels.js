import { useMemo } from 'react'
import { useMeta } from './useMeta.js'

// Traduce los valores que guarda la API a sus textos en español:
// labels.muscle('gluteMed') → "Glúteo medio"
export function useMetaLabels() {
  const { data: meta } = useMeta()

  return useMemo(() => {
    const toMap = (options = []) => new Map(options.map((option) => [option.value, option.label]))
    const maps = {
      muscle: toMap(meta?.muscles),
      equipment: toMap(meta?.equipment),
      pattern: toMap(meta?.movementPatterns),
      goal: toMap(meta?.routineGoals),
      day: toMap(meta?.daysOfWeek),
    }
    const labelFrom = (map) => (value) => map.get(value) ?? value

    return {
      meta,
      muscle: labelFrom(maps.muscle),
      equipment: labelFrom(maps.equipment),
      pattern: labelFrom(maps.pattern),
      goal: labelFrom(maps.goal),
      day: labelFrom(maps.day),
    }
  }, [meta])
}
