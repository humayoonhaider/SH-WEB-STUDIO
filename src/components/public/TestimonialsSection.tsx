import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, Quote, ArrowRight } from 'lucide-react';
import { Testimonial } from '../../types';
import { api } from '../../services/api';
import { Spinner } from '../common/Loader';
import { defaultTestimonials } from '../../data/defaultTestimonials';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    api.testimonials
      .getAll()
      .then((res) => {
        if (mounted && res.success && res.data && res.data.length > 0) {
          setTestimonials(res.data);
        }
      })
      .catch(() => {
        if (mounted) {
          setTestimonials(defaultTestimonials);
        }
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Autoplay carousel (pauses when user hovers or interacts)
  useEffect(() => {
    if (testimonials.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [testimonials.length, isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  if (loading) {
    return (
      <section className="py-24 bg-[#0B0B0F] border-t border-[#1C1D24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex justify-center">
          <Spinner size="lg" label="Loading client testimonials..." />
        </div>
      </section>
    );
  }

  if (testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  return (
    <section
      id="testimonials"
      className="py-24 sm:py-32 bg-[#0B0B0F] border-t border-[#1C1D24] relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-[11px] font-mono text-blue-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Client Feedback & Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white tracking-tight">
            Trusted by Builders & Growing Businesses.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-400">
            Read direct experiences from founders, administrators, and product leaders who partner with SH Web Studio to build their core digital products.
          </p>
        </div>

        {/* Carousel Container */}
        <div
          className="max-w-4xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative rounded-3xl bg-[#121318] border border-[#262833] p-8 sm:p-12 md:p-16 shadow-2xl transition-all duration-500">
            {/* Ambient Watermark Quote Icon */}
            <Quote className="absolute top-6 right-8 w-20 h-20 text-[#1C1E29] opacity-40 pointer-events-none" />

            <div className="relative z-10 space-y-8">
              {/* Star Rating & Project Tag */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(current.rating || 5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="text-xs font-mono text-neutral-400 ml-2">
                    {current.rating}.0 / 5.0 Rating
                  </span>
                </div>

                {current.projectTag && (
                  <span className="text-xs font-mono text-blue-400 tracking-wide">
                    {current.projectTag}
                  </span>
                )}
              </div>

              {/* Quote Content */}
              <blockquote className="text-lg sm:text-xl md:text-2xl text-neutral-200 font-sans leading-relaxed tracking-tight">
                "{current.content}"
              </blockquote>

              {/* Client Info & Author Details */}
              <div className="pt-6 border-t border-[#1C1D24] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {current.avatarUrl ? (
                    <img
                      src={current.avatarUrl}
                      alt={current.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#262833]"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-[#17181D] border border-blue-500/30 flex items-center justify-center text-sm font-bold font-mono text-blue-400">
                      {current.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .substring(0, 2)}
                    </div>
                  )}

                  <div>
                    <h4 className="text-base font-bold text-white font-heading">
                      {current.name}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {current.role}
                      {current.company && (
                        <>
                          <span className="mx-1.5 text-neutral-600">•</span>
                          <span className="text-neutral-300 font-medium">
                            {current.company}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                {/* Desktop Prev / Next Navigation Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="p-2.5 rounded-xl bg-[#17181D] hover:bg-[#1E2028] text-neutral-400 hover:text-white border border-[#262833] transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="p-2.5 rounded-xl bg-[#17181D] hover:bg-[#1E2028] text-neutral-400 hover:text-white border border-[#262833] transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Pagination Indicator Indicators */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-8 h-1.5 bg-blue-500'
                    : 'w-2 h-1.5 bg-neutral-700 hover:bg-neutral-500'
                }`}
              />
            ))}
          </div>

          {/* Direct Link to Dedicated Reviews Page */}
          <div className="flex justify-center mt-8">
            <Link
              to="/reviews"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17181D] hover:bg-[#1E2028] text-neutral-300 hover:text-white border border-[#262833] transition-colors text-xs font-semibold"
            >
              <span>Explore All Verified Client Reviews & Ratings</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
