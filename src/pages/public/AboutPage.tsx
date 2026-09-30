import React from 'react';
import { SEO } from '../../components/common/SEO';
import { AboutSection } from '../../components/public/AboutSection';
import { TeamSection } from '../../components/public/TeamSection';
import { ProcessSection } from '../../components/public/ProcessSection';
import { FooterCta } from '../../components/public/FooterCta';

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-12 pb-16">
      <SEO 
        title="About Our Studio | The Founders & Our Story"
        description="Learn about SH Web Studio, our mission to build high-performance web applications, and the engineering team behind the studio. Founded by Humayoon, Shariq, and Shujaulmulk."
        type="business"
        keywords="web studio founders, sh web studio team, humayoon khaider, shariq developer, shujaulmulk developer, web engineering collective"
      />
      <h1 className="sr-only">About SH Web Studio | Our Mission & Founders</h1>
      <AboutSection showFounders={false} />
      <TeamSection />
      <ProcessSection />
      <FooterCta />
    </div>
  );
};
