import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Quote,
  MessageSquarePlus,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import { Testimonial } from '../../types';
import { api } from '../../services/api';
import { Modal } from '../../components/common/Modal';
import { Spinner } from '../../components/common/Loader';
import { defaultTestimonials } from '../../data/defaultTestimonials';

export const ReviewsPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    projectTag: 'Web Development',
    rating: 5,
    content: '',
  });

  const fetchReviews = async () => {
    try {
      const res = await api.testimonials.getAll();
      if (res.success && res.data && res.data.length > 0) {
        setTestimonials(res.data);
      }
    } catch {
      setTestimonials(defaultTestimonials);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.content.trim()) return;

    setSubmitting(true);
    try {
      const res = await api.testimonials.submitReview(formData);
      if (res.success) {
        setSuccessToast(true);
        setModalOpen(false);
        setFormData({
          name: '',
          role: '',
          company: '',
          projectTag: 'Web Development',
          rating: 5,
          content: '',
        });
        await fetchReviews();
        setTimeout(() => setSuccessToast(false), 6000);
      }
    } catch (err) {
      alert('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Collect unique categories for filtering
  const tags: string[] = [
    'all',
    ...Array.from(
      new Set(testimonials.map((t) => t.projectTag).filter((tag): tag is string => Boolean(tag)))
    ),
  ];

  const filtered = selectedTag === 'all'
    ? testimonials
    : testimonials.filter((t) => t.projectTag === selectedTag);

  // Stats calculation
  const totalCount = testimonials.length;
  const avgRating = totalCount > 0
    ? (testimonials.reduce((acc, cur) => acc + (cur.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';

  return (
    <div className="pt-28 pb-20 bg-[#0B0B0F] min-h-screen">
      {/* Header Banner */}
      <section className="relative overflow-hidden py-16 border-b border-[#1C1D24]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Client Feedback & Testimonials</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white tracking-tight">
              Trusted by Builders & Growing Businesses.
            </h1>

            <p className="mt-4 text-sm sm:text-base text-neutral-400 leading-relaxed">
              Read authentic feedback from founders, academic leaders, and business partners who trusted SH Web Studio to build their core digital experiences.
            </p>

            {/* Quick Actions */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <MessageSquarePlus className="w-4 h-4" />
                <span>Leave Client Feedback</span>
              </button>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white bg-[#17181D] hover:bg-[#1E2028] border border-[#262833] transition-colors"
              >
                <span>Start Your Project</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </Link>
            </div>
          </div>

          {/* Metrics Card Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-12">
            <div className="bg-[#121318] border border-[#262833] rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-2xl font-bold font-heading text-white">{avgRating} / 5.0</div>
              <p className="text-xs text-neutral-400 mt-0.5">Average Client Rating</p>
            </div>

            <div className="bg-[#121318] border border-[#262833] rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center text-blue-400 mb-1">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold font-heading text-white">{totalCount}+ Reviews</div>
              <p className="text-xs text-neutral-400 mt-0.5">Verified Testimonials</p>
            </div>

            <div className="bg-[#121318] border border-[#262833] rounded-2xl p-5 text-center">
              <div className="flex items-center justify-center text-emerald-400 mb-1">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-2xl font-bold font-heading text-white">100%</div>
              <p className="text-xs text-neutral-400 mt-0.5">On-Time Architecture Delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Notification */}
      {successToast && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-300 text-xs sm:text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Thank you for your feedback! Your review has been submitted and is now published on our reviews board.</span>
          </div>
        </div>
      )}

      {/* Main Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filters */}
        {tags.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <span className="text-xs text-neutral-500 font-mono uppercase mr-2">Filter by:</span>
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#17181D] text-neutral-400 hover:text-white border border-[#262833]'
                }`}
              >
                {tag === 'all' ? 'All Reviews' : tag}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="py-24 flex justify-center">
            <Spinner size="lg" label="Loading verified reviews..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center bg-[#121318] border border-[#262833] rounded-2xl p-8">
            <p className="text-neutral-400 text-sm">No reviews found in this category.</p>
            <button
              onClick={() => setSelectedTag('all')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-blue-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((review) => (
              <div
                key={review._id}
                className="rounded-3xl bg-[#121318] border border-[#262833] p-6 sm:p-8 flex flex-col justify-between hover:border-neutral-600 transition-all duration-300 relative group overflow-hidden"
              >
                {/* Ambient Quote Watermark */}
                <Quote className="absolute top-4 right-6 w-16 h-16 text-[#1A1B22] opacity-50 pointer-events-none group-hover:text-blue-500/10 transition-colors" />

                <div className="space-y-4 relative z-10">
                  {/* Rating & Tag */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-mono text-neutral-400 ml-1.5">
                        {review.rating}.0
                      </span>
                    </div>

                    {review.projectTag && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {review.projectTag}
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base text-neutral-200 leading-relaxed">
                    "{review.content}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-6 pt-5 border-t border-[#1C1D24] flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    {review.avatarUrl ? (
                      <img
                        src={review.avatarUrl}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#262833]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[#17181D] border border-blue-500/30 flex items-center justify-center text-xs font-bold font-mono text-blue-400">
                        {review.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white font-heading">{review.name}</h4>
                      <p className="text-xs text-neutral-400">
                        {review.role}
                        {review.company && (
                          <>
                            <span className="mx-1 text-neutral-600">•</span>
                            <span className="text-neutral-300 font-medium">{review.company}</span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Verified Client</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-b from-[#121318] to-[#0E0F14] border border-[#262833] rounded-3xl p-8 sm:p-12 max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            Ready to Build Your Digital Experience?
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto">
            From modern responsive websites to enterprise web software, we turn your business requirements into clean, scalable software.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Get In Touch With Founders
            </Link>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 rounded-xl text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white bg-[#17181D] hover:bg-[#1E2028] border border-[#262833] transition-colors"
            >
              Share Your Client Review
            </button>
          </div>
        </div>
      </section>

      {/* Submit Review Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Share Your Client Review"
      >
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <p className="text-xs text-neutral-400 leading-relaxed">
            Your feedback helps us continuously elevate our software engineering and client support standards.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Kamran Tariq"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Designation / Job Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g. Academic Director / CEO"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="e.g. Horizon Grammar Academy"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
                Project Category
              </label>
              <input
                type="text"
                value={formData.projectTag}
                onChange={(e) => setFormData({ ...formData, projectTag: e.target.value })}
                placeholder="e.g. School Management System"
                className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Star Rating Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-2">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-1 text-neutral-500 hover:text-amber-400 focus:outline-none transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= formData.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-neutral-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-mono text-neutral-400 ml-2">
                {formData.rating} Stars
              </span>
            </div>
          </div>

          {/* Feedback Content */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-1.5">
              Your Review / Experience *
            </label>
            <textarea
              required
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Tell us about working with SH Web Studio, product quality, speed, communication..."
              className="w-full px-3 py-2 rounded-xl bg-[#17181D] border border-[#262833] text-white text-sm focus:outline-none focus:border-blue-500 resize-y"
            />
          </div>

          <div className="pt-4 border-t border-[#262833] flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
            >
              {submitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{submitting ? 'Submitting...' : 'Publish Review'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
