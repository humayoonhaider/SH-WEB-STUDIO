import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowLeft, Laptop, ArrowRight, Sparkles } from 'lucide-react';
import { Project } from '../../types';
import { api } from '../../services/api';
import { defaultProjects } from '../../data/defaultProjects';
import { SEO } from '../../components/common/SEO';
import { OptimizedImage } from '../../components/common/OptimizedImage';
import { Spinner } from '../../components/common/Loader';
import { FooterCta } from '../../components/public/FooterCta';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [otherProjects, setOtherProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;
    setLoading(true);
    setError(null);

    api.projects
      .getBySlug(slug)
      .then((res) => {
        if (mounted && res.success && res.data) {
          setProject(res.data);
        } else {
          const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
          const localFallback = defaultProjects.find(
            (p) =>
              (p.slug && p.slug.toLowerCase() === decodedSlug) ||
              p._id === slug ||
              p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === decodedSlug
          );
          if (localFallback) {
            setProject(localFallback);
          } else {
            setError('Project not found or inactive.');
          }
        }
      })
      .catch((err) => {
        const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
        const localFallback = defaultProjects.find(
          (p) =>
            (p.slug && p.slug.toLowerCase() === decodedSlug) ||
            p._id === slug ||
            p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === decodedSlug
        );
        if (mounted && localFallback) {
          setProject(localFallback);
          setError(null);
          return;
        }

        // Fallback: try fetching all projects and matching locally
        api.projects
          .getPublic()
          .then((allRes) => {
            if (mounted && allRes.success && allRes.data) {
              const matched = allRes.data.find(
                (p) =>
                  (p.slug && p.slug.toLowerCase() === decodedSlug) ||
                  p._id === slug ||
                  p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === decodedSlug
              );
              if (matched) {
                setProject(matched);
                setError(null);
                return;
              }
            }
            if (mounted) setError(err.message || 'Project not found.');
          })
          .catch(() => {
            if (mounted) setError(err.message || 'Project not found.');
          });
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // Also fetch all projects for "Explore Other Work" section
    api.projects
      .getPublic()
      .then((res) => {
        if (mounted && res.success && res.data) {
          setOtherProjects(res.data);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-12">
        <Spinner size="lg" label="Loading case details..." />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-12 px-4 text-center">
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

  const relatedList = otherProjects.filter((p) => p._id !== project._id).slice(0, 2);

  return (
    <div className="pt-12 pb-16">
      <SEO 
        title={`${project.title} | Case Details | SH Web Studio Portfolio`}
        description={project.description}
        ogImage={project.imageUrl}
        type="article"
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Selected Work</span>
          </Link>
        </div>

        {/* Header Information */}
        <div className="space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-xs uppercase tracking-widest text-blue-400 font-semibold font-mono">
            <Sparkles className="w-3 h-3" />
            <span>{project.category}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-3xl leading-relaxed">
            {project.description}
          </p>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
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

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <span>Build something like this</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
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
              Key libraries, frameworks, and architecture components used in this system.
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

        {/* Explore Other Work */}
        {relatedList.length > 0 && (
          <div className="border-t border-[#1C1D24] pt-12 mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white font-heading">Explore More Projects</h2>
              <Link
                to="/work"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedList.map((rel) => (
                <Link
                  key={rel._id}
                  to={`/work/${encodeURIComponent(rel.slug || rel._id)}`}
                  className="group p-5 rounded-xl bg-[#121318] border border-[#262833] hover:border-blue-500/50 hover:bg-[#15161D] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[11px] text-neutral-500 font-mono mb-1">{rel.category}</div>
                    <div className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {rel.title}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{rel.description}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1C1D24] flex items-center justify-between text-xs font-semibold text-neutral-300 group-hover:text-white">
                    <span>View Case Details</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterCta />
    </div>
  );
};
