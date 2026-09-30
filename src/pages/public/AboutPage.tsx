import React, { useEffect } from 'react';
import { AboutSection } from '../../components/public/AboutSection';
import { TeamSection } from '../../components/public/TeamSection';
import { ProcessSection } from '../../components/public/ProcessSection';
import { FooterCta } from '../../components/public/FooterCta';

export const AboutPage: React.FC = () => {
  useEffect(() => {
    document.title = 'About SH Web Studio | The Founders & Our Story';
  }, []);

  return (
    <div className="pt-28 pb-16">
      <AboutSection showFounders={false} />
      <TeamSection />
      <ProcessSection />
      <FooterCta />
    </div>
  );
};
