import React, { useState, useEffect } from 'react';
import { Check, Zap, Sparkles } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Link } from 'react-router-dom';
import { PricingPlan } from '../../types';
import { api } from '../../services/api';

export const PricingSection: React.FC = () => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await api.pricing.getPublic();
        if (res.success && res.data && res.data.length > 0) {
          setPlans(res.data);
        } else {
          fallbackPlans();
        }
      } catch {
        fallbackPlans();
      } finally {
        setLoading(false);
      }
    };

    const fallbackPlans = () => {
      setPlans([
        {
          _id: 'p1',
          name: 'Basic Plan',
          badge: 'Starter',
          price: '$99',
          period: 'per project',
          description: 'Ideal for small businesses, startups, and portfolios looking for a professional web presence.',
          features: [
            'Professional Business Website',
            'Fully Responsive & Mobile Optimized',
            'Up to 5 Custom Pages',
            'Contact Form & Inquiry Management',
            'Basic SEO Setup',
            '1 Week Delivery & Support',
          ],
          highlighted: false,
          order: 1,
          isActive: true,
        },
        {
          _id: 'p2',
          name: 'Standard Plan',
          badge: '50% OFF - Limited Offer',
          price: '$199',
          period: 'per project',
          description: 'Perfect for growing brands requiring custom web applications, e-commerce, or interactive dashboards.',
          features: [
            'Advanced Web Application / E-commerce',
            'Custom UI/UX & Interactive Design',
            'Database & Backend API Integration',
            'Admin Dashboard CMS Included',
            'Payment Gateway Integration',
            'Advanced SEO & Performance Tuning',
            '1 Month Priority Support',
          ],
          highlighted: true,
          order: 2,
          isActive: true,
        },
        {
          _id: 'p3',
          name: 'Professional Plan',
          badge: 'Enterprise',
          price: '$399',
          period: 'per project',
          description: 'Comprehensive custom enterprise systems, MERN stack software, and dedicated engineering team.',
          features: [
            'Full MERN Stack Custom Platform',
            'Scalable Cloud Architecture & MIS',
            'Multi-Role Admin & User Portals',
            'Real-time Analytics & Reporting',
            'Custom Integrations & Webhooks',
            'Dedicated Senior Engineering Team',
            '3 Months Ongoing Maintenance & SLA',
          ],
          highlighted: false,
          order: 3,
          isActive: true,
        },
      ]);
    };

    fetchPricing();
  }, []);

  if (loading && plans.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-[#0B0B0F] relative overflow-hidden border-t border-[#1C1D24]">
      {/* Background Architectural Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          kicker="Affordable & Transparent Pricing"
          title="Flexible Studio Development Plans"
          description="Choose the right development tier for your business requirements. Affordable pricing with customizable offers and no hidden fees."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
          {plans.map((plan) => (
            <div
              key={plan._id || plan.id || plan.name}
              className={`relative rounded-3xl p-8 sm:p-10 flex flex-col justify-between transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-[#161a2c] to-[#121318] border-2 border-blue-500 shadow-2xl shadow-blue-500/10 lg:-translate-y-2'
                  : 'bg-[#121318] border border-[#262833] hover:border-neutral-600 shadow-xl'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-semibold tracking-wide uppercase flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{plan.badge || 'Most Popular Tier'}</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-[#1A1B22] text-blue-400 border border-[#262833]">
                    {plan.badge || 'Starter'}
                  </span>
                  <h3 className="text-xl font-bold font-heading text-white">{plan.name}</h3>
                </div>

                <p className="text-xs text-neutral-400 leading-relaxed mb-6 min-h-[36px]">
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-[#1C1D24]">
                  <span className="text-4xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-xs text-neutral-400 font-medium">/ {plan.period || 'project'}</span>
                </div>

                <div className="space-y-3.5 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/contact"
                className={`w-full py-4 rounded-2xl text-xs sm:text-sm font-semibold text-center transition-all shadow-lg flex items-center justify-center gap-2 ${
                  plan.highlighted
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20'
                    : 'bg-[#17181D] hover:bg-[#20222C] text-white border border-[#262833]'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Get Started with {plan.name}</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
