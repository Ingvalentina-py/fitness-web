// "1 ejercicio", "3 ejercicios"
export function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm}`
}

// Mueve un elemento de una posición a otra y devuelve una lista nueva
export function moveItem(list, fromIndex, toIndex) {
  const result = [...list]
  const [item] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, item)
  return result
}
