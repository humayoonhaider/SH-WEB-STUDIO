import React from 'react';
import { Loader2, UploadCloud, CheckCircle } from 'lucide-react';

interface AdminSubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  isUploading?: boolean;
  loadingText?: string;
  uploadingText?: string;
  successText?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const AdminSubmitButton: React.FC<AdminSubmitButtonProps> = ({
  loading = false,
  isUploading = false,
  loadingText = 'Saving Changes...',
  uploadingText = 'Processing & Uploading Image...',
  successText,
  icon,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled,
  className = '',
  type = 'submit',
  ...props
}) => {
  const isDisabled = disabled || loading || isUploading;

  // Base styling
  const baseClasses = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 select-none';

  // Size styling
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-2.5 text-xs sm:text-sm gap-2',
    lg: 'px-8 py-3.5 text-sm sm:text-base gap-2.5',
  }[size];

  // Variant styling
  const variantClasses = {
    primary: isDisabled && (loading || isUploading)
      ? 'bg-blue-600/70 text-blue-100 cursor-not-allowed shadow-lg shadow-blue-500/10'
      : isDisabled
      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:from-blue-700 active:to-blue-800 text-white shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30',
    secondary: isDisabled
      ? 'bg-[#17181D] text-neutral-500 border border-[#262833] cursor-not-allowed'
      : 'bg-[#17181D] hover:bg-[#20222C] text-neutral-200 border border-[#262833]',
    danger: isDisabled
      ? 'bg-rose-900/50 text-rose-300/50 cursor-not-allowed'
      : 'bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20',
    success: isDisabled
      ? 'bg-emerald-900/50 text-emerald-300/50 cursor-not-allowed'
      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20',
  }[variant];

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${sizeClasses}
        ${variantClasses}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...props}
    >
      {/* Uploading Image Indicator */}
      {isUploading ? (
        <>
          <UploadCloud className="w-4 h-4 animate-bounce text-blue-200" />
          <span className="tracking-wide animate-pulse">{uploadingText}</span>
        </>
      ) : loading ? (
        /* Saving Form Indicator */
        <>
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span className="tracking-wide">{loadingText}</span>
        </>
      ) : (
        /* Default / Idle State */
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}

      {/* Subtle active glow for loading */}
      {(loading || isUploading) && (
        <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </span>
      )}
    </button>
  );
};
