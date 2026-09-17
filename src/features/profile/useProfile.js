import { useMutation, useQueryClient } from '@tanstack/react-query'
import { currentUserKey } from '../auth/queryKeys.js'
import { changePassword, updateProfile } from './profileApi.js'

// Ambas devuelven el usuario actualizado: se guarda en caché y toda la app lo ve al instante

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (user) => queryClient.setQueryData(currentUserKey, user),
  })
}

export function useChangePassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: changePassword,
    onSuccess: (user) => queryClient.setQueryData(currentUserKey, user),
  })
}
