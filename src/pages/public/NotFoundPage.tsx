import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center pt-28 pb-16 px-4 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-7xl font-extrabold font-mono text-blue-500 tracking-tighter">
          404
        </div>
        <h1 className="text-3xl font-bold text-white font-heading">
          Page Not Found
        </h1>
        <p className="text-neutral-400 text-sm leading-relaxed">
          The requested page does not exist or may have been moved. Check the URL or return to the SH Web Studio home.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white bg-[#17181D] border border-[#262833] hover:bg-[#1E2028] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Work</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
