import React, { useState, useEffect } from 'react';
import {
  Globe,
  Layout,
  ShoppingCart,
  Code2,
  Layers,
  Cpu,
  Smartphone,
  ShieldCheck,
  Server,
  ArrowUpRight,
} from 'lucide-react';
import { Service } from '../../types';
import { api } from '../../services/api';
import { SectionHeading } from '../common/SectionHeading';
import { CardSkeleton } from '../common/Loader';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Globe,
  Layout,
  ShoppingCart,
  Code2,
  Layers,
  Cpu,
  Smartphone,
  ShieldCheck,
  Server,
};

export const ServicesSection: React.FC<{ limit?: number; showHeader?: boolean }> = ({
  limit,
  showHeader = true,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.services
      .getPublic()
      .then((res) => {
        if (mounted && res.success && res.data) {
          setServices(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const displayedServices = limit ? services.slice(0, limit) : services;

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Code2;
    return <IconComponent className="w-6 h-6 text-blue-400" />;
  };

  return (
    <section id="services" className="py-24 bg-[#0B0B0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <SectionHeading
            kicker="Services & Expertise"
            title="Engineered for performance and clarity."
            description="We build clean, purposeful digital products tailored to business workflows, with solid architecture and modern aesthetics."
          />
        )}

        {loading ? (
          <CardSkeleton count={6} />
        ) : services.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-sm">
            Services will be updated shortly.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedServices.map((service) => (
              <div
                key={service._id}
                className="group relative rounded-2xl bg-[#121318] border border-[#262833] p-7 transition-all duration-200 hover:border-neutral-600 hover:bg-[#16171E] flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#17181D] border border-[#262833] flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                    {renderIcon(service.icon)}
                  </div>
                  <h3 className="text-xl font-bold text-white font-heading tracking-tight mb-3">
                    {service.title}
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1C1D24] flex items-center justify-between text-xs font-medium text-neutral-400 group-hover:text-blue-400 transition-colors">
                  <Link to="/contact" className="inline-flex items-center gap-1">
                    <span>Discuss Solution</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
