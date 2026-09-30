import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, X, Flame, Clock } from 'lucide-react';
import { useSite } from '../../context/SiteContext';

const BANNER_DISMISS_KEY = 'sh_top_offer_banner_dismissed_v1';

export const TopOfferBanner: React.FC = () => {
  const { settings } = useSite();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(BANNER_DISMISS_KEY);
    if (!isDismissed) {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    sessionStorage.setItem(BANNER_DISMISS_KEY, 'true');
    setDismissed(true);
  };

  // If admin toggled it off or user dismissed for this tab
  if (settings.showTopOfferBanner === false || dismissed) {
    return null;
  }

  const badgeText = settings.topOfferBadgeText || '🔥 LIMITED TIME EXCLUSIVE';
  const offerTitle =
    settings.topOfferTitle ||
    'Refer a business & earn 10% direct commission on their web development project';
  const highlightText = settings.topOfferHighlightText || '10% Direct Payout';
  const buttonText = settings.topOfferButtonText || 'Claim Your Partner Link';
  const buttonUrl = settings.topOfferButtonUrl || '/referral-program';
  const expiryText = settings.topOfferExpiryText || 'Limited partner slots available';

  return (
    <div
      aria-label="Special Offer Announcement"
      className="w-full bg-[#12131c] border-b border-[#232638] text-white text-xs py-2 px-4 transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Badge + Offer Text + Urgency */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-sm">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>{badgeText}</span>
          </span>

          <span className="text-neutral-300 text-xs sm:text-[13px] font-medium leading-tight">
            {offerTitle}
          </span>

          {highlightText && (
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold">
              {highlightText}
            </span>
          )}

          {expiryText && (
            <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span>{expiryText}</span>
            </span>
          )}
        </div>

        {/* Right Side: CTA Button + Dismiss */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to={buttonUrl}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition-colors shadow-sm cursor-pointer"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Dismiss Announcement"
            aria-label="Dismiss Announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
