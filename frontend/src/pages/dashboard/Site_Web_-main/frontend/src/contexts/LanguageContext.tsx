import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react'

type Language = 'en' | 'es'

interface Translations {
  en: {
    [key: string]: string
  }
  es: {
    [key: string]: string
  }
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isTransitioning: boolean
}

const translations: Translations = {
  en: {
    // Header
    home: 'Home',
    services: 'Services',
    about: 'About Us',
    portfolio: 'Portfolio',
    contact: 'Contact',
    signIn: 'Sign In',
    faq: 'FAQ',
    // Hero Section
    mainTitle: 'Your easy access to premium digital tools',
    highlightText: '',
    subtitle: 'ChatGPT Plus, Adobe, Spotify, Canva Pro and more in one place.',
    ctaButton: 'View available memberships',
    secondaryButton: 'Talk to an advisor',
    // Features highlight
    academicTools: 'ACADEMIC TOOLS',
    techSolutions: 'TECH SOLUTIONS',
    digitalization: 'DIGITALIZATION',
    businessGrowth: 'BUSINESS GROWTH',
    // Legacy (keeping for compatibility)
    noTimeLimit: 'No Time Limit',
    propFirm: 'LynxTech',
    conquerMarket: 'Conquer the market',
    traderRegistration: 'TRADER REGISTRATION',
    noTpsl: 'NO TP/SL | HIT PROGRAM',
    instantFunding: 'INSTANT FUNDING',
    cryptoTrading: 'CRYPTO TRADING',
    startChallenge: 'START A CHALLENGE',
    freeTrial: 'FREE TRIAL',
    // Features
    academicPlatforms: 'ACADEMIC PLATFORMS',
    academicPlatformsDesc: 'Custom learning management systems and educational tools designed for modern institutions.',
    businessSolutions: 'BUSINESS SOLUTIONS',
    businessSolutionsDesc: 'Complete digital transformation services from web development to cloud integration.',
    dataAnalytics: 'DATA & ANALYTICS',
    dataAnalyticsDesc: 'Advanced analytics and business intelligence solutions to drive informed decision-making.',
    // Services Section
    servicesTitle: 'Our digital solutions',
    servicesSubtitle: 'We offer memberships and licenses for the most powerful tools on the market for students, professionals and businesses.',
    webDevTitle: 'Artificial Intelligence',
    webDevSubtitle: 'Enhance your creativity with AI',
    webDevDesc: 'The best AI tools for students and professionals looking to optimize their productivity.',
    webDevFeature1: 'ChatGPT Plus',
    webDevFeature2: 'Gemini Advanced',
    webDevFeature3: 'GitHub Copilot',
    webDevFeature4: 'Claude Pro',
    designTitle: 'Design and Creativity',
    designSubtitle: 'Professional design tools',
    designDesc: 'Complete suite of tools for graphic designers, video editors and digital creatives.',
    designFeature1: 'Adobe Creative Suite',
    designFeature2: 'Canva Pro',
    designFeature3: 'CapCut Pro',
    designFeature4: 'Figma Professional',
    ecommerceTitle: 'Entrepreneurs and Business',
    ecommerceSubtitle: 'Digitize your professional brand',
    ecommerceDesc: 'Digitize your brand with custom websites, catalogs and online stores. Complete tools to grow your business.',
    ecommerceFeature1: 'Custom Websites',
    ecommerceFeature2: 'Online Stores',
    ecommerceFeature3: 'Digital Catalogs',
    ecommerceFeature4: 'Digital Marketing',
    consultingTitle: 'Entertainment',
    consultingSubtitle: 'Enjoy the best content',
    consultingDesc: 'The best streaming and digital entertainment platforms to relax and enjoy.',
    consultingFeature1: 'Spotify Premium',
    consultingFeature2: 'YouTube Premium',
    consultingFeature3: 'Netflix',
    consultingFeature4: 'Amazon Prime',
    // FAQ Section
    faqTitle: 'Frequently asked questions',
    faqSubtitle: 'Everything you need to know about the product and billing.',
    faqQ1: 'Is the service or activation fast and reliable?',
    faqA1: 'Yes . Once your payment is confirmed, we perform activation immediately or within a maximum period of 5 to 30 minutes, depending on the contracted service. All activations are managed securely, verified and 100% functional, guaranteeing that you receive complete access without complications.',
    faqQ2: 'How does the activation process work?',
    faqA2: 'The process is simple and transparent: Choose your plan or membership (for example, ChatGPT Plus, Adobe or Spotify). Make the payment by the agreed method. In a few minutes, our team sends you the access data or account confirmation. Verify access and ready! you can now enjoy the service. Throughout the process we keep you informed and provide support if you need it.',
    faqQ3: 'Is there a free trial available?',
    faqA3: 'We currently do not offer free trials on premium memberships, as all licenses are managed officially and securely. However, some services include demo plans or free basic versions. If you have questions, our team can guide you on the best option for you.',
    faqQ4: 'Can I change my plan later?',
    faqA4: 'Yes, you can upgrade or change your plan at any time. You just need to contact us to adjust your subscription according to your new needs or the type of tool you want to add.',
    faqQ5: 'What is your cancellation policy?',
    faqA5: 'You can cancel your membership whenever you need to. If you cancel before renewal, your account will remain active until the current expiration date with no additional charges. In case of business or special plans, specific conditions apply that we will inform you at the time of purchase.',
    faqQ6: 'How does billing work?',
    faqA6: 'Billing is done monthly or annually, depending on the plan chosen. Upon completing your subscription, you will automatically receive confirmation and the corresponding receipt in your email.',
    faqQ7: 'Do you offer website development or services for companies?',
    faqA7: 'Yes . At LynxTech we also help entrepreneurs and businesses digitize their online presence. We develop websites, digital catalogs, e-commerce stores and personalized systems with artificial intelligence integration. Our goal is for your company to grow and stand out in the digital environment.',
    faqQ8: 'Will there be ways to learn how to use AI correctly?',
    faqA8: 'Yes . At LynxTech we plan to offer guides, resources and workshops to teach how to use artificial intelligence tools safely, ethically and professionally. Instead of trying to "hide" the use of AI, we teach how to use it intelligently to create natural, authentic and high-level content, avoiding errors that usually activate automatic detectors.',
    // Suggestions Section
    suggestionsTitle: 'Suggest New Services',
    suggestionsDescription: 'At LynxTech we want to continue growing together with our community. If you have ideas for new services or tools you would like us to offer, please share them with us!',
    suggestionsButton: 'Send Suggestion',
    // About Section
    aboutTitle: 'Who we are',
    aboutSubtitle: 'A team passionate about technology',
    aboutDesc: 'At LynxTech we are a team passionate about technology. We were born with the mission of bringing the best digital tools to everyone from students and freelancers to companies looking to innovate. We believe that technology should be accessible, reliable and useful for everyone.',
    aboutExperience: 'Years of Experience',
    aboutProjects: 'Completed Projects',
    aboutClients: 'Satisfied Clients',
    aboutTechnologies: 'Mastered Technologies',
    // Contact Section
    contactTitle: 'Contact',
    contactSubtitle: 'We are here to help you make your digital project a reality',
    contactName: 'Full name',
    contactEmail: 'Email address',
    contactCompany: 'Company (optional)',
    contactMessage: 'Message',
    contactSend: 'Send Message',
    contactEmailLabel: 'Email',
    contactPhoneLabel: 'Phone',
    contactLocationLabel: 'Location',
    contactInterest: 'What tools are you interested in?',
    contactSelectOption: 'Select an option',
    contactAI: 'Artificial Intelligence (ChatGPT, Claude, etc.)',
    contactDesign: 'Design and Creativity (Adobe, Canva, etc.)',
    contactProductivity: 'Productivity (Microsoft 365, Notion, etc.)',
    contactEntertainment: 'Entertainment (Spotify, Netflix, etc.)',
    contactMultiple: 'Multiple tools',
    contactMessagePlaceholder: 'Tell us about your specific needs...',
    contactSubmit: 'Request information',
    contactDirectTitle: 'Direct contact',
    contactImmediateResponse: 'Immediate response',
    contactSupport: 'Support',
    contactSupportDesc: 'Technical assistance',
    contactSocialMedia: 'Social Media',
    contactFollowUs: 'Follow us',
    contactDetailedQuestions: 'Detailed inquiries',
    // Vision Section
    ourVision: 'Our Vision',
    whereWeGoing: 'Where We Are Going',
    visionStory: 'Today we offer you digital tools. Tomorrow, we drive the digitalization of your company or venture.',
    todayTitle: 'Today',
    todayDesc: 'Academic AI, subscriptions, digital support',
    tomorrowTitle: 'Tomorrow',
    tomorrowDesc: 'Websites, business solutions, digitalization',
    // Testimonials Section
    testimonials: 'Success Stories & Testimonials',
    testimonial1: 'LynxTech academic service saved my semester.',
    testimonial2: 'I recommend it, very reliable.',
    testimonial3: 'Excellent support and quality tools.',
    clientName1: 'J. Pérez',
    clientName2: 'M. Flores',
    clientName3: 'A. García',
    // About Us Section
    aboutUs: 'About Us',
    aboutUsDesc: 'At LynxTech we believe in technology as a tool for academic and business growth. We are a young team that bets on innovation and trust.',
    // Final CTA Section
    finalCtaTitle: 'Ready to Join the Digital Evolution?',
    finalCtaSubtitle: 'Transform your academic and professional future with our innovative solutions',
    contactUs: 'Talk to an advisor',
    // Footer
    footerCopyright: '© 2025 LynxTech - Driving your digital future',
    adminLogin: 'Admin Login'
  },
  es: {
    // Header
    home: 'Inicio',
    services: 'Servicios',
    about: 'Nosotros',
    portfolio: 'Portfolio',
    contact: 'Contacto',
    signIn: 'Entrar',
    faq: 'FAQ',
    // Hero Section
    mainTitle: 'Tu acceso fácil a herramientas digitales premium',
    highlightText: '',
    subtitle: 'ChatGPT Plus, Adobe, Spotify, Canva Pro y más en un solo lugar.',
    ctaButton: 'Ver membresías disponibles',
    secondaryButton: 'Hablar con un asesor',
    // Features highlight
    academicTools: 'HERRAMIENTAS ACADÉMICAS',
    techSolutions: 'SOLUCIONES TECNOLÓGICAS',
    digitalization: 'DIGITALIZACIÓN',
    businessGrowth: 'CRECIMIENTO EMPRESARIAL',
    // Legacy (keeping for compatibility)
    noTimeLimit: 'Sin Límite de Tiempo',
    propFirm: 'LynxTech',
    conquerMarket: 'Conquista el mercado',
    traderRegistration: 'REGISTRO TRADER',
    noTpsl: 'SIN TP/SL | HIT PROGRAM',
    instantFunding: 'FUNDING INSTANTÁNEO',
    cryptoTrading: 'CRYPTO TRADING',
    startChallenge: 'INICIAR DESAFÍO',
    freeTrial: 'PRUEBA GRATIS',
    // Features
    academicPlatforms: 'PLATAFORMAS ACADÉMICAS',
    academicPlatformsDesc: 'Sistemas de gestión educativa personalizados y herramientas para instituciones modernas.',
    businessSolutions: 'SOLUCIONES EMPRESARIALES',
    businessSolutionsDesc: 'Servicios completos de transformación digital desde desarrollo web hasta integración en la nube.',
    dataAnalytics: 'DATOS Y ANALÍTICAS',
    dataAnalyticsDesc: 'Soluciones avanzadas de analítica e inteligencia empresarial para decisiones informadas.',
    // Services Section
    servicesTitle: 'Nuestras soluciones digitales',
    servicesSubtitle: 'Ofrecemos membresías y licencias de las herramientas más potentes del mercado para estudiantes, profesionales y empresas.',
    webDevTitle: 'Inteligencia Artificial',
    webDevSubtitle: 'Potencia tu creatividad con IA',
    webDevDesc: 'Las mejores herramientas de IA para estudiantes y profesionales que buscan optimizar su productividad.',
    webDevFeature1: 'ChatGPT Plus',
    webDevFeature2: 'Gemini Advanced',
    webDevFeature3: 'GitHub Copilot',
    webDevFeature4: 'Claude Pro',
    designTitle: 'Diseño y Creatividad',
    designSubtitle: 'Herramientas profesionales de diseño',
    designDesc: 'Suite completa de herramientas para diseñadores gráficos, editores de video y creativos digitales.',
    designFeature1: 'Adobe Creative Suite',
    designFeature2: 'Canva Pro',
    designFeature3: 'CapCut Pro',
    designFeature4: 'Figma Professional',
    ecommerceTitle: 'Emprendedores y Negocios',
    ecommerceSubtitle: 'Digitaliza tu marca profesional',
    ecommerceDesc: 'Digitaliza tu marca con páginas web personalizadas, catálogos y tiendas online. Herramientas completas para hacer crecer tu negocio.',
    ecommerceFeature1: 'Páginas Web Personalizadas',
    ecommerceFeature2: 'Tiendas Online',
    ecommerceFeature3: 'Catálogos Digitales',
    ecommerceFeature4: 'Marketing Digital',
    consultingTitle: 'Entretenimiento',
    consultingSubtitle: 'Disfruta del mejor contenido',
    consultingDesc: 'Las mejores plataformas de streaming y entretenimiento digital para relajarte y disfrutar.',
    consultingFeature1: 'Spotify Premium',
    consultingFeature2: 'YouTube Premium',
    consultingFeature3: 'Netflix',
    consultingFeature4: 'Amazon Prime',
    // FAQ Section
    faqTitle: 'Preguntas Frecuentes',
    faqSubtitle: 'Todo lo que necesitas saber sobre nuestros servicios y procesos.',
    faqQ1: '¿El servicio o la activación es rápida y confiable?',
    faqA1: 'Sí . Una vez confirmado tu pago, realizamos la activación de forma inmediata o en un plazo máximo de 5 a 30 minutos, dependiendo del servicio contratado. Todas las activaciones se gestionan de manera segura, verificada y 100% funcional, garantizando que recibas acceso completo sin complicaciones.',
    faqQ2: '¿Cómo funciona el proceso de activación?',
    faqA2: 'El proceso es simple y transparente: Eliges tu plan o membresía (por ejemplo, ChatGPT Plus, Adobe o Spotify). Realizas el pago por el método acordado. En pocos minutos, nuestro equipo te envía los datos de acceso o confirmación de cuenta. Verificas el acceso y ¡listo! ya puedes disfrutar del servicio. Durante todo el proceso te mantenemos informado y te brindamos soporte si lo necesitas.',
    faqQ3: '¿Hay prueba gratuita disponible?',
    faqA3: 'Actualmente no ofrecemos pruebas gratuitas en las membresías premium, ya que todas las licencias se gestionan de forma oficial y segura. Sin embargo, algunos servicios incluyen planes de demostración o versiones básicas gratuitas. Si tienes dudas, nuestro equipo puede orientarte sobre la mejor opción para ti.',
    faqQ4: '¿Puedo cambiar mi plan después?',
    faqA4: 'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Solo debes contactarnos para ajustar tu suscripción según tus nuevas necesidades o el tipo de herramienta que quieras añadir.',
    faqQ5: '¿Cuál es su política de cancelación?',
    faqA5: 'Puedes cancelar tu membresía cuando lo necesites. Si realizas la cancelación antes de la renovación, tu cuenta permanecerá activa hasta la fecha de vencimiento actual sin cargos adicionales. En caso de planes empresariales o especiales, aplican condiciones específicas que te informaremos al momento de la compra.',
    faqQ6: '¿Cómo funciona la facturación?',
    faqA6: 'La facturación se realiza de forma mensual o anual, dependiendo del plan elegido. Al completar tu suscripción, recibirás automáticamente la confirmación y el comprobante correspondiente en tu correo electrónico.',
    faqQ7: '¿Ofrecen desarrollo de páginas web o servicios para empresas?',
    faqA7: 'Sí . En LynxTech también ayudamos a emprendedores y negocios a digitalizar su presencia online. Desarrollamos páginas web, catálogos digitales, tiendas e-commerce y sistemas personalizados con integración de inteligencia artificial. Nuestro objetivo es que tu empresa crezca y destaque en el entorno digital.',
    faqQ8: '¿Habrá formas de aprender a usar la IA correctamente?',
    faqA8: 'Sí . En LynxTech planeamos ofrecer guías, recursos y talleres para enseñar a usar herramientas de inteligencia artificial de forma segura, ética y profesional. En lugar de intentar "ocultar" el uso de la IA, enseñamos cómo aprovecharla inteligentemente para crear contenidos naturales, auténticos y de alto nivel, evitando errores que suelen activar detectores automáticos.',
    // Suggestions Section
    suggestionsTitle: 'Sugiere Nuevos Servicios',
    suggestionsDescription: 'En LynxTech queremos seguir creciendo junto a nuestra comunidad. Si tienes ideas para nuevos servicios o herramientas que te gustaría que ofrezcamos, ¡compártelas con nosotros!',
    suggestionsButton: 'Enviar Sugerencia',
    // About Section
    aboutTitle: 'Quiénes somos',
    aboutSubtitle: 'Un equipo apasionado por la tecnología',
    aboutDesc: 'En LynxTech somos un equipo apasionado por la tecnología. Nacimos con la misión de acercar las mejores herramientas digitales a todos desde estudiantes y freelancers hasta empresas que buscan innovar. Creemos que la tecnología debe ser accesible, confiable y útil para todos.',
    aboutExperience: 'Años de Experiencia',
    aboutProjects: 'Proyectos Completados',
    aboutClients: 'Clientes Satisfechos',
    aboutTechnologies: 'Tecnologías Dominadas',
    // Contact Section
    contactTitle: 'Contacto',
    contactSubtitle: 'Estamos aquí para ayudarte a hacer realidad tu proyecto digital',
    contactName: 'Nombre completo',
    contactEmail: 'Correo electrónico',
    contactCompany: 'Empresa (opcional)',
    contactMessage: 'Mensaje',
    contactSend: 'Enviar Mensaje',
    contactEmailLabel: 'Email',
    contactPhoneLabel: 'Teléfono',
    contactLocationLabel: 'Ubicación',
    contactInterest: '¿Qué herramientas te interesan?',
    contactSelectOption: 'Selecciona una opción',
    contactAI: 'Inteligencia Artificial (ChatGPT, Claude, etc.)',
    contactDesign: 'Diseño y Creatividad (Adobe, Canva, etc.)',
    contactProductivity: 'Productividad (Microsoft 365, Notion, etc.)',
    contactEntertainment: 'Entretenimiento (Spotify, Netflix, etc.)',
    contactMultiple: 'Múltiples herramientas',
    contactMessagePlaceholder: 'Cuéntanos sobre tus necesidades específicas...',
    contactSubmit: 'Solicitar información',
    contactDirectTitle: 'Contacto directo',
    contactImmediateResponse: 'Respuesta inmediata',
    contactSupport: 'Soporte',
    contactSupportDesc: 'Asistencia técnica',
    contactSocialMedia: 'Redes Sociales',
    contactFollowUs: 'Síguenos',
    contactDetailedQuestions: 'Consultas detalladas',
    // Vision Section
    ourVision: 'Nuestra Visión',
    whereWeGoing: 'A Dónde Vamos',
    visionStory: 'Hoy te ofrecemos herramientas digitales. Mañana, impulsamos la digitalización de tu empresa o emprendimiento.',
    todayTitle: 'Hoy',
    todayDesc: 'IA académica, suscripciones, soporte digital',
    tomorrowTitle: 'Mañana',
    tomorrowDesc: 'Páginas web, soluciones empresariales, digitalización',
    // Testimonials Section
    testimonials: 'Casos de Éxito y Testimonios',
    testimonial1: 'El servicio académico de LynxTech me salvó el semestre.',
    testimonial2: 'Lo recomiendo, muy confiables.',
    testimonial3: 'Excelente soporte y herramientas de calidad.',
    clientName1: 'J. Pérez',
    clientName2: 'M. Flores',
    clientName3: 'A. García',
    // About Us Section
    aboutUs: 'Quiénes Somos',
    aboutUsDesc: 'En LynxTech creemos en la tecnología como herramienta para el crecimiento académico y empresarial. Somos un equipo joven que apuesta por la innovación y la confianza.',
    // Final CTA Section
    finalCtaTitle: '¿Quieres ser parte de la evolución digital?',
    finalCtaSubtitle: 'Transforma tu futuro académico y profesional con nuestras soluciones innovadoras',
    contactUs: 'Hablar con un asesor',
    // Footer
    footerCopyright: '© 2025 LynxTech - Impulsamos tu futuro digital',
    adminLogin: 'Acceso Admin'
  }
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Inicializar con español por defecto, o cargar desde localStorage
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('lynxtech-language')
    return (savedLanguage as Language) || 'es' // Español por defecto
  })
  const [isTransitioning, setIsTransitioning] = useState(false)
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleLanguageChange = (lang: Language) => {
    if (lang === language) return
    
    setIsTransitioning(true)
    
    // Guardar en localStorage
    localStorage.setItem('lynxtech-language', lang)
    
    // Limpiar timeout anterior si existe
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }
    
    // Cambiar idioma después de un pequeño delay para permitir la animación
    transitionTimeoutRef.current = setTimeout(() => {
      setLanguage(lang)
      setIsTransitioning(false)
    }, 250)
  }

  // Efecto para cargar el idioma guardado al montar el componente
  useEffect(() => {
    const savedLanguage = localStorage.getItem('lynxtech-language')
    if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en') && savedLanguage !== language) {
      setLanguage(savedLanguage as Language)
    } else if (!savedLanguage) {
      // Si no hay idioma guardado, establecer español por defecto
      localStorage.setItem('lynxtech-language', 'es')
    }
  }, [])

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t, isTransitioning }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}