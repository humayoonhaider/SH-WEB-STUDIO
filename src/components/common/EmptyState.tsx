import React from 'react';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[#262833] bg-[#121318]/50 my-6">
      <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 mb-4">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <h4 className="text-base font-semibold text-white font-heading">{title}</h4>
      {description && (
        <p className="mt-1 text-sm text-neutral-400 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};
