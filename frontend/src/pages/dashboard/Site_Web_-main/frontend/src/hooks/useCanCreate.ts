import { useAuth } from '@/contexts/AuthContext'

export function useCanCreate() {
  const { user } = useAuth()
  const email = (user?.email || '').toLowerCase()
  return email === 'diegoarcani190@gmail.com'
}

