// Utilidades para navegación suave
export const smoothScrollTo = (elementId: string, offset: number = 120) => {
  try {
    const element = document.getElementById(elementId.replace('#', ''))
    
    if (element) {
      const elementPosition = element.offsetTop - offset
      
      console.log(`Scrolling to: ${elementId}`)
      console.log(`Element top: ${element.offsetTop}, offset: ${offset}, final position: ${elementPosition}`)
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      
      // Verificar que el scroll se complete
      setTimeout(() => {
        console.log(`Scroll completed. Current position: ${window.scrollY}, target was: ${elementPosition}`)
      }, 1000)
      
    } else {
      console.error(`Element not found: ${elementId}`)
      // Listar elementos disponibles para debug
      const allSections = ['inicio', 'servicios', 'nosotros', 'portfolio', 'contacto']
      console.log('Available sections:', allSections.map(id => ({
        id,
        exists: !!document.getElementById(id)
      })))
    }
  } catch (error) {
    console.error('Error during scroll:', error)
  }
}

// Hook para manejar clics en enlaces de navegación
export const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  e.preventDefault()
  e.stopPropagation()
  
  console.log('=== NAV CLICK DEBUG ===')
  console.log('Clicked href:', href)
  
  // Si es un enlace de ancla (empieza con #)
  if (href.startsWith('#')) {
    const targetId = href.replace('#', '')
    console.log('Target ID:', targetId)
    
    // Verificar que el elemento existe
    const element = document.getElementById(targetId)
    console.log('Element found:', element)
    
    if (element) {
      console.log('Element position:', element.offsetTop)
      
      // Scroll directo sin timeout
      const scrollPosition = element.offsetTop - 100
      console.log('Scrolling to position:', scrollPosition)
      
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      })
      
      // Verificar después de 1 segundo
      setTimeout(() => {
        console.log('Final scroll position:', window.scrollY)
        console.log('Expected position:', scrollPosition)
      }, 1500)
    } else {
      console.error('Element not found with ID:', targetId)
      console.log('Available elements:', ['inicio', 'servicios', 'nosotros', 'portfolio', 'contacto'].map(id => ({
        id,
        exists: !!document.getElementById(id),
        element: document.getElementById(id)
      })))
    }
  } else {
    // Si es un enlace externo
    window.location.href = href
  }
}

// Función para obtener la sección activa basada en el scroll
export const getActiveSection = (sections: string[]) => {
  const scrollY = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  
  // Si estamos muy arriba, mostrar inicio
  if (scrollY < 50) {
    return 'inicio'
  }
  
  // Si estamos cerca del final de la página, mostrar contacto
  if (scrollY + windowHeight >= documentHeight - 100) {
    return 'contacto'
  }
  
  // Encontrar la sección que está más cerca del centro de la pantalla
  let activeSection = 'inicio'
  let smallestDistance = Infinity
  
  sections.forEach(sectionId => {
    const element = document.getElementById(sectionId)
    if (element) {
      const rect = element.getBoundingClientRect()
      const sectionCenter = rect.top + rect.height / 2
      const screenCenter = windowHeight / 2
      
      // Calcular distancia del centro de la sección al centro de la pantalla
      const distance = Math.abs(sectionCenter - screenCenter)
      
      // Si la sección está visible y es la más cercana al centro
      if (rect.top < windowHeight && rect.bottom > 0 && distance < smallestDistance) {
        activeSection = sectionId
        smallestDistance = distance
      }
    }
  })
  
  console.log(`Active section detected: ${activeSection}, scroll: ${Math.round(scrollY)}`)
  return activeSection
}