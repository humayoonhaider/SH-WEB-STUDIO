import React from 'react';

interface SectionHeadingProps {
  kicker?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  kicker,
  title,
  description,
  centered = false,
  className = '',
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center max-w-2xl mx-auto' : 'max-w-3xl'} ${className}`}>
      {kicker && (
        <div className="text-xs uppercase tracking-widest text-blue-500 font-semibold mb-3">
          {kicker}
        </div>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white font-heading">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg text-neutral-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
