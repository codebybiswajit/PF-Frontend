export const PALETTES = {
  classic: {
    name: 'Classic Cyan',
    dark: { neon: '#00fff0', neon2: '#ff00c8', border: 'rgba(0, 255, 240, 0.15)', glow: '0 0 20px rgba(0, 255, 240, 0.3)', glow2: '0 0 20px rgba(255, 0, 200, 0.3)' },
    light: { neon: '#008694', neon2: '#c0007a', border: 'rgba(0, 134, 148, 0.2)', glow: '0 4px 20px rgba(0, 134, 148, 0.15)', glow2: '0 4px 20px rgba(192, 0, 122, 0.15)' }
  },
  vaporwave: {
    name: 'Vaporwave Purple',
    dark: { neon: '#a200ff', neon2: '#ff007f', border: 'rgba(162, 0, 255, 0.15)', glow: '0 0 20px rgba(162, 0, 255, 0.3)', glow2: '0 0 20px rgba(255, 0, 127, 0.3)' },
    light: { neon: '#7209b7', neon2: '#f72585', border: 'rgba(114, 9, 183, 0.2)', glow: '0 4px 20px rgba(114, 9, 183, 0.15)', glow2: '0 4px 20px rgba(247, 37, 133, 0.15)' }
  },
  matrix: {
    name: 'Matrix Emerald',
    dark: { neon: '#39ff14', neon2: '#00a896', border: 'rgba(57, 255, 20, 0.15)', glow: '0 0 20px rgba(57, 255, 20, 0.3)', glow2: '0 0 20px rgba(0, 168, 150, 0.3)' },
    light: { neon: '#1b4d3e', neon2: '#00a896', border: 'rgba(27, 77, 62, 0.2)', glow: '0 4px 20px rgba(27, 77, 62, 0.15)', glow2: '0 4px 20px rgba(0, 168, 150, 0.15)' }
  },
  cyberpunk: {
    name: 'Cyberpunk Gold',
    dark: { neon: '#ffe600', neon2: '#ff6b00', border: 'rgba(255, 230, 0, 0.15)', glow: '0 0 20px rgba(255, 230, 0, 0.3)', glow2: '0 0 20px rgba(255, 107, 0, 0.3)' },
    light: { neon: '#d97706', neon2: '#ea580c', border: 'rgba(217, 119, 6, 0.2)', glow: '0 4px 20px rgba(217, 119, 6, 0.15)', glow2: '0 4px 20px rgba(234, 88, 12, 0.15)' }
  },
  sapphire: {
    name: 'Royal Sapphire',
    dark: { neon: '#00d2ff', neon2: '#0066ff', border: 'rgba(0, 210, 255, 0.15)', glow: '0 0 20px rgba(0, 210, 255, 0.3)', glow2: '0 0 20px rgba(0, 102, 255, 0.3)' },
    light: { neon: '#0284c7', neon2: '#4338ca', border: 'rgba(2, 132, 199, 0.2)', glow: '0 4px 20px rgba(2, 132, 199, 0.15)', glow2: '0 4px 20px rgba(67, 56, 202, 0.15)' }
  }
};

export const applyThemeAndAccent = (theme: string, accent: string) => {
  // 1. Set global data-theme attribute
  document.documentElement.setAttribute('data-theme', theme);
  
  // 2. Resolve target colors
  const palette = PALETTES[accent as keyof typeof PALETTES] || PALETTES.classic;
  const colors = theme === 'dark' ? palette.dark : palette.light;
  
  // 3. Set style properties directly on root style
  document.documentElement.style.setProperty('--neon', colors.neon);
  document.documentElement.style.setProperty('--neon2', colors.neon2);
  document.documentElement.style.setProperty('--border', colors.border);
  document.documentElement.style.setProperty('--glow', colors.glow);
  document.documentElement.style.setProperty('--glow2', colors.glow2);
};
