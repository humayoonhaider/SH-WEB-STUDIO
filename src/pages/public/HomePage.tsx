import React from 'react';
import { Hero } from '../../components/public/Hero';
import { IntroSection } from '../../components/public/IntroSection';
import { ServicesSection } from '../../components/public/ServicesSection';
import { ProjectsSection } from '../../components/public/ProjectsSection';
import { PricingSection } from '../../components/public/PricingSection';
import { TeamSection } from '../../components/public/TeamSection';
import { AboutSection } from '../../components/public/AboutSection';
import { ProcessSection } from '../../components/public/ProcessSection';
import { TestimonialsSection } from '../../components/public/TestimonialsSection';
import { ContactSection } from '../../components/public/ContactSection';
import { FooterCta } from '../../components/public/FooterCta';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      <Hero />
      <IntroSection />
      <ServicesSection limit={6} />
      <ProjectsSection limit={3} />
      <PricingSection />
      <ProcessSection />
      <TeamSection />
      <TestimonialsSection />
      <AboutSection />
      <ContactSection />
      <FooterCta />
    </div>
  );
};
