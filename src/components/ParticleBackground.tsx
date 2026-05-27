import { useEffect } from 'react';

const ParticleBackground: React.FC = () => {
  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (8 + Math.random() * 15) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.opacity = String(Math.random() * 0.5);
      container.appendChild(p);
    }
  }, []);
  return <div id="particles" />;
};

export default ParticleBackground;
