import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '', label }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-blue-500/20 border-t-blue-500 rounded-full animate-spin`}
      />
      {label && <p className="text-xs text-neutral-400 font-medium">{label}</p>}
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl bg-[#121318] border border-[#262833] p-6 space-y-4 animate-pulse"
        >
          <div className="w-10 h-10 rounded-lg bg-neutral-800" />
          <div className="h-5 bg-neutral-800 rounded w-2/3" />
          <div className="space-y-2">
            <div className="h-4 bg-neutral-800/60 rounded w-full" />
            <div className="h-4 bg-neutral-800/60 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
};
