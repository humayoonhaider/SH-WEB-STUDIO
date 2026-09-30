import React, { useEffect } from 'react';
import { SEO } from '../../components/common/SEO';
import { ServicesSection } from '../../components/public/ServicesSection';
import { ContactSection } from '../../components/public/ContactSection';
import { SectionHeading } from '../../components/common/SectionHeading';

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-28 pb-16">
      <SEO 
        title="Professional Web Development Services | SH Web Studio"
        description="We deliver full-cycle web development services tailored to growing enterprises, startups, and operational systems including React, Node.js, and Cloud solutions."
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <SectionHeading
          kicker="Engineering Capabilities"
          title="Services & Technology Offerings"
          description="We deliver full-cycle web development services tailored to growing enterprises, startups, and operational systems."
        />
      </div>
      <ServicesSection showHeader={false} />
      <ContactSection />
    </div>
  );
};
