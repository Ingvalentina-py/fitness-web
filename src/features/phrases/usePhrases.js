import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { phraseKeys } from './queryKeys.js'
import { createPhrase, deletePhrase, fetchPhrases, updatePhrase } from './phrasesApi.js'

// Las frases cambian poco: se piden una vez y se reutilizan durante la visita
export function usePhrases(filters = {}) {
  return useQuery({
    queryKey: phraseKeys.list(filters),
    queryFn: () => fetchPhrases(filters),
    staleTime: 10 * 60_000,
  })
}

function useRefreshPhrases() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: phraseKeys.all })
}

export function useCreatePhrase() {
  const refresh = useRefreshPhrases()
  return useMutation({ mutationFn: createPhrase, onSuccess: refresh })
}

export function useUpdatePhrase() {
  const refresh = useRefreshPhrases()
  return useMutation({ mutationFn: updatePhrase, onSuccess: refresh })
}

export function useDeletePhrase() {
  const refresh = useRefreshPhrases()
  return useMutation({ mutationFn: deletePhrase, onSuccess: refresh })
}
