// Krishna-inspired color palette
const theme = {
  colors: {
    // Primary Krishna colors
    krishnaBlue: '#1A237E', // Deep blue (Krishna's skin)
    peacockFeather: '#00BCD4', // Peacock feather blue
    saffron: '#FF5722', // Saffron (sacred color)
    gold: '#FFC107', // Gold (divine element)
    forestGreen: '#2C5F2D', // Current app green
    purple: '#4A148C', // Royal purple
    
    // Gradients
    krishnaGradient: 'linear-gradient(135deg, #1A237E 0%, #4A148C 100%)',
    peacockGradient: 'linear-gradient(135deg, #00BCD4 0%, #009688 50%, #4CAF50 100%)',
    
    // UI colors
    background: '#F9F7F2', // Light cream background
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textPrimary: '#333333',
    textSecondary: '#666666',
    error: '#D32F2F',
    success: '#4CAF50',
  },
  
  fonts: {
    heading: "'Rozha One', serif", // Sanskrit-inspired decorative font
    body: "'Poppins', sans-serif", // Clean body font
  },
  
  shadows: {
    light: '0 2px 10px rgba(0, 0, 0, 0.05)',
    medium: '0 4px 20px rgba(0, 0, 0, 0.1)',
    heavy: '0 8px 30px rgba(0, 0, 0, 0.15)',
    divine: '0 10px 30px rgba(26, 35, 126, 0.2)',
  },
  
  // Border radii
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    round: '50%',
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  
  // Transitions
  transitions: {
    default: '0.3s ease',
    slow: '0.5s ease',
  },
  
  // Breakpoints for responsive design
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  }
};

export default theme; 