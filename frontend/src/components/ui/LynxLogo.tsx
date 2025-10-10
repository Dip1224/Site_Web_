import React from 'react'

interface LynxLogoProps {
  className?: string
  size?: number
}

export const LynxLogo: React.FC<LynxLogoProps> = ({ 
  className = "", 
  size = 40 
}) => {
  return (
    <div 
      className={`${className} flex items-center justify-center relative`}
      style={{ width: size, height: size }}
    >
      {/* Logo siempre blanco */}
      <img 
        src="/lynx-logo-dark.png"
        alt="LynxTech Logo" 
        width={size} 
        height={size}
        className="object-contain transition-all duration-500 ease-in-out"
        style={{
          filter: 'drop-shadow(0 2px 4px rgba(255,255,255,0.3))'
        }}
      />
    </div>
  )
}

export default LynxLogo
