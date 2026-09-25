import React from 'react';
import { Hero } from '../../components/public/Hero';
import { IntroSection } from '../../components/public/IntroSection';
import { ServicesSection } from '../../components/public/ServicesSection';
import { ProjectsSection } from '../../components/public/ProjectsSection';
import { MissionSection } from '../../components/public/MissionSection';
import { VisionSection } from '../../components/public/VisionSection';
import { PricingSection } from '../../components/public/PricingSection';
import { ProcessSection } from '../../components/public/ProcessSection';
import { TestimonialsSection } from '../../components/public/TestimonialsSection';
import { ContactSection } from '../../components/public/ContactSection';
import { FooterCta } from '../../components/public/FooterCta';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      <Hero />
      <IntroSection />
      <MissionSection />
      <VisionSection />
      <ServicesSection limit={6} />
      <ProjectsSection limit={3} />
      <PricingSection />
      <ProcessSection />
      <TestimonialsSection />
      <ContactSection />
      <FooterCta />
    </div>
  );
};
