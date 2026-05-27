import React from 'react';
import HeroSection from '../components/HeroSection';

/* ── HomePage ────────────────────────────────────────────────────
   Landing page — just the animated hero with stats bar.
   The HeroSection itself already renders the CTA buttons and
   stats strip, so no additional markup is needed here.
────────────────────────────────────────────────────────────────── */
const HomePage: React.FC = () => {
  return <HeroSection />;
};

export default HomePage;
