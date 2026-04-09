import React from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { getLoginUrl } from '@/const';
import {
  WebGLBackground,
  CustomCursor,
  Navigation,
  Hero,
  FeaturesSection,
  PricingSection,
  TestimonialsSection,
  CTASection,
  Footer,
} from '@/components';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  const handleCtaClick = () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    const element = document.querySelector('#pricing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <WebGLBackground />
      <CustomCursor enabled={true} />
      <Navigation />

      <main className="relative z-10">
        <Hero onCtaClick={handleCtaClick} />
        <FeaturesSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection onCtaClick={handleCtaClick} />
      </main>

      <Footer />
    </div>
  );
}
