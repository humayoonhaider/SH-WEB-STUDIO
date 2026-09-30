import React, { useEffect } from 'react';
import { SEO } from '../../components/common/SEO';
import { ServicesSection } from '../../components/public/ServicesSection';
import { ContactSection } from '../../components/public/ContactSection';
import { SectionHeading } from '../../components/common/SectionHeading';

export const ServicesPage: React.FC = () => {
  return (
    <div className="pt-12 pb-16">
      <SEO 
        title="Engineering Services & Solutions | Full-Stack Web Development"
        description="We deliver full-cycle web development services tailored to growing enterprises, startups, and operational systems including React, Node.js, E-commerce and Admin Dashboards."
        keywords="web development services, mern stack experts, react development agency, custom business systems, ecommerce solutions, admin dashboard development"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <h1 className="sr-only text-0">Engineering Services & Solutions | SH Web Studio</h1>
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
