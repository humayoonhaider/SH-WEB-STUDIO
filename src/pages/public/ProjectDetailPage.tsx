import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ExternalLink, Github, ArrowLeft, Laptop, CheckCircle2, ArrowRight } from 'lucide-react';
import { Project } from '../../types';
import { api } from '../../services/api';
import { SEO } from '../../components/common/SEO';
import { OptimizedImage } from '../../components/common/OptimizedImage';
import { Spinner } from '../../components/common/Loader';
import { FooterCta } from '../../components/public/FooterCta';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;

    api.projects
      .getBySlug(slug)
      .then((res) => {
        if (mounted && res.success && res.data) {
          setProject(res.data);
        } else {
          setError('Project not found or inactive.');
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Project not found.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-28">
        <Spinner size="lg" label="Loading project details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-28 px-4 text-center">
        <h2 className="text-2xl font-bold text-white font-heading mb-3">Project Not Found</h2>
        <p className="text-neutral-400 mb-6 max-w-md">
          {error || 'The requested project could not be found or is not currently active.'}
        </p>
        <Link
          to="/work"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#17181D] border border-[#262833] text-white hover:bg-[#1E2028] transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16">
      <SEO 
        title={`${project.title} | SH Web Studio Portfolio`}
        description={project.description}
        ogImage={project.imageUrl}
        type="article"
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Selected Work</span>
          </Link>
        </div>

        {/* Header Information */}
        <div className="space-y-4 mb-10">
          <div className="text-xs uppercase tracking-widest text-blue-500 font-semibold font-mono">
            {project.category}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            {project.title}
          </h1>
          <p className="text-lg text-neutral-300 max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
              >
                <span>Launch Live Application</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-neutral-300 hover:text-white bg-[#17181D] border border-[#262833] hover:bg-[#1E2028] transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>View Source Code</span>
              </a>
            )}
          </div>
        </div>

        {/* Visual / Screenshot Showcase */}
        <div className="rounded-2xl border border-[#262833] bg-[#121318] overflow-hidden mb-12 shadow-2xl">
          {project.imageUrl ? (
            <OptimizedImage
              src={project.imageUrl}
              alt={project.title}
              className="w-full object-cover max-h-[550px]"
              priority={true}
              width={1200}
            />
          ) : (
            <div className="aspect-[16/9] max-h-[480px] bg-gradient-to-br from-[#17181D] to-[#0E0F14] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
              />
              <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                <span>{project.category}</span>
                <Laptop className="w-5 h-5 text-blue-400" />
              </div>

              <div className="relative z-10 max-w-lg">
                <div className="text-2xl sm:text-3xl font-bold text-white font-heading">
                  {project.title}
                </div>
                <p className="text-sm text-neutral-400 mt-2">
                  System Architecture & Production Deployment
                </p>
              </div>

              <div className="relative z-10 text-xs text-neutral-500 font-mono">
                Live URL verified · Continuous Integration
              </div>
            </div>
          )}
        </div>

        {/* Architectural Tech Stack & Specifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 rounded-2xl bg-[#121318] border border-[#262833] mb-16">
          <div className="md:col-span-1">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-semibold mb-2">
              Technology Stack
            </h3>
            <p className="text-xs text-neutral-500">
              Key libraries, frameworks, and architecture components used.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-lg bg-[#17181D] border border-[#262833] text-xs font-mono text-neutral-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FooterCta />
    </div>
  );
};
