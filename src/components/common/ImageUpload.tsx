import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, Image as ImageIcon, Trash2, RefreshCw, Check, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onProcessingChange?: (isProcessing: boolean) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'video' | 'square' | 'wide' | 'avatar' | 'auto';
  maxDimension?: number;
  quality?: number;
  className?: string;
  required?: boolean;
}

/**
 * Optimizes an image file in the browser using HTML Canvas:
 * - Resizes large dimensions (max width/height)
 * - Converts to optimized WebP format (or JPEG fallback)
 * - Drastically reduces upload payload size while preserving crisp quality
 */
async function compressImageFile(
  file: File,
  maxDimension = 1600,
  quality = 0.85
): Promise<{ dataUrl: string; sizeKb: number; format: string }> {
  return new Promise((resolve, reject) => {
    // If it's an SVG, load it directly as data URL without rasterizing
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          dataUrl,
          sizeKb: Math.round(file.size / 1024),
          format: 'SVG',
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // Calculate aspect ratio preservation
        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first, fallback to JPEG
        let dataUrl = '';
        let format = 'WebP';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality);
            format = 'JPEG';
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
          format = 'JPEG';
        }

        // Estimate size in KB from base64 string
        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024);

        resolve({ dataUrl, sizeKb, format });
      };
      img.onerror = () => reject(new Error('Failed to decode image file'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = '',
  onChange,
  onProcessingChange,
  label = 'Upload Image',
  helperText,
  aspectRatio = 'video',
  maxDimension = 1600,
  quality = 0.85,
  className = '',
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ sizeKb?: number; format?: string } | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const setProcessingState = (processing: boolean) => {
    setIsProcessing(processing);
    if (onProcessingChange) {
      onProcessingChange(processing);
    }
  };

  const handleProcessFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (PNG, JPG, WebP, SVG).');
      return;
    }

    setError(null);
    setProcessingState(true);

    try {
      const result = await compressImageFile(file, maxDimension, quality);
      onChange(result.dataUrl);
      setStats({ sizeKb: result.sizeKb, format: result.format });
    } catch (err: any) {
      setError(err?.message || 'Failed to process image file.');
    } finally {
      setProcessingState(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
    // Reset file input so re-selecting same file triggers change
    if (e.target) e.target.value = '';
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProcessFile(file);
    }
  };

  const handleRemove = () => {
    onChange('');
    setStats(null);
    setError(null);
  };

  const handleManualUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl('');
      setShowUrlInput(false);
      setStats(null);
    }
  };

  // Determine aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square max-w-[200px]';
      case 'avatar':
        return 'w-24 h-24 rounded-2xl';
      case 'wide':
        return 'aspect-[21/9]';
      case 'video':
        return 'aspect-[16/9]';
      case 'auto':
      default:
        return 'min-h-[160px]';
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label & Optional Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-neutral-400 hover:text-blue-400 transition-colors flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL Option' : 'Or Paste URL'}</span>
        </button>
      </div>

      {/* Manual URL Input Bar (Collapsible) */}
      {showUrlInput && (
        <div className="p-3 rounded-xl bg-[#17181D] border border-[#262833] space-y-2 animate-in fade-in duration-200">
          <div className="flex gap-2">
            <input
              type="url"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or image link"
              className="flex-1 px-3 py-1.5 rounded-lg bg-[#0E0F14] border border-[#262833] text-white text-xs focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleManualUrlSubmit}
              disabled={!manualUrl.trim()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Upload / Preview Area */}
      {value ? (
        /* Image Preview State with Actions */
        <div className="relative rounded-2xl bg-[#17181D] border border-[#262833] overflow-hidden group">
          <div className={`relative w-full flex items-center justify-center bg-[#0B0B0F] overflow-hidden ${getAspectRatioClass()}`}>
            <img
              src={value}
              alt="Uploaded Preview"
              className="w-full h-full object-contain max-h-[340px]"
            />

            {/* Hover Actions Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="px-3 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                <span>Change Image</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Bottom Info Bar */}
          <div className="px-4 py-2 bg-[#121318] border-t border-[#262833] flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>Image Loaded</span>
            </span>
            <div className="flex items-center gap-2 font-mono">
              {stats?.sizeKb && <span>{stats.sizeKb} KB</span>}
              {stats?.format && <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{stats.format}</span>}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-neutral-300 hover:text-white underline ml-2"
              >
                Upload New
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer p-6 flex flex-col items-center justify-center text-center group ${
            isDragging
              ? 'border-blue-500 bg-blue-500/10'
              : 'border-[#262833] bg-[#121318] hover:border-blue-500/50 hover:bg-[#15161D]'
          }`}
        >
          {isProcessing ? (
            <div className="py-6 flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 text-blue-400 animate-spin" />
              <p className="text-xs font-medium text-neutral-300">Optimizing & converting image...</p>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-[#1A1B24] border border-[#262833] flex items-center justify-center text-neutral-400 group-hover:text-blue-400 group-hover:scale-110 transition-all mb-3 shadow-inner">
                <Upload className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Click to Upload or Drag & Drop
                </p>
                <p className="text-[11px] text-neutral-500">
                  {helperText || 'Supports PNG, JPG, WebP, SVG (Auto-compressed for fast loading)'}
                </p>
              </div>

              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 text-xs font-semibold transition-colors">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose Image File</span>
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
