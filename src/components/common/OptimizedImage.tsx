import React, { useState, useEffect } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  quality?: number;
  priority?: boolean;
}

/**
 * A specialized image component that automatically uses the server-side 
 * optimization utility to serve WebP images, handle resizing, and 
 * enforce lazy loading for improved Core Web Vitals.
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  priority = false,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // If it's a remote URL that isn't already optimized, we route it through our proxy
  const isExternal = src.startsWith('http');
  const optimizedSrc = isExternal 
    ? `/api/media/optimize?url=${encodeURIComponent(src)}&q=${quality}${width ? `&w=${width}` : ''}`
    : src;

  return (
    <div className={`relative overflow-hidden ${className} ${!isLoaded && !error ? 'animate-pulse bg-neutral-800' : ''}`}>
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError(true);
          setIsLoaded(true);
        }}
        className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        {...props}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-neutral-500 text-[10px] font-mono">
          Image Load Failed
        </div>
      )}
    </div>
  );
};
