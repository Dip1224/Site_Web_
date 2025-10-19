import { useState } from 'react'
import { AppPage } from '../types'

export const useNavigation = () => {
  const [currentPage, setCurrentPage] = useState<AppPage>('landing')

  const navigateToAuth = () => setCurrentPage('auth')
  const navigateToLanding = () => setCurrentPage('landing')
  const navigateToDashboard = () => setCurrentPage('dashboard')

  return {
    currentPage,
    navigateToAuth,
    navigateToLanding,
    navigateToDashboard
  }
}