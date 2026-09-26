import { apiFetch } from '../../lib/apiClient.js'

const dataOf = async (request) => (await request).data

// Todas las consultas de progreso aceptan el mismo filtro de fechas
const withRange = (path, { from, to }) => `${path}?from=${from}&to=${to}`

export const fetchSummary = (range) => dataOf(apiFetch(withRange('/stats/summary', range)))

export const fetchDistribution = (range) => dataOf(apiFetch(withRange('/stats/distribution', range)))

export const fetchExercisesWithHistory = () => dataOf(apiFetch('/stats/exercises'))

export const fetchExerciseProgress = ({ exerciseId, ...range }) =>
  dataOf(apiFetch(withRange(`/stats/exercises/${exerciseId}`, range)))

export const fetchRecords = () => dataOf(apiFetch('/records'))
