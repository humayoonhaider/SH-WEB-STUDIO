import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, ArrowRight, Layers, Layout, Laptop } from 'lucide-react';
import { Project } from '../../types';
import { api } from '../../services/api';
import { SectionHeading } from '../common/SectionHeading';
import { CardSkeleton } from '../common/Loader';
import { Link } from 'react-router-dom';

export const ProjectsSection: React.FC<{ limit?: number; showHeader?: boolean }> = ({
  limit,
  showHeader = true,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.projects
      .getPublic()
      .then((res) => {
        if (mounted && res.success && res.data) {
          setProjects(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const displayedProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <section id="work" className="py-24 border-t border-[#1C1D24] bg-[#08080C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionHeading
              kicker="Featured Projects"
              title="Work that delivers real business value."
              description="Explore selected systems and applications engineered with high standards for usability, performance, and maintainability."
              className="mb-0"
            />
            {limit && projects.length > limit && (
              <Link
                to="/work"
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors shrink-0"
              >
                <span>View all projects</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

        {loading ? (
          <CardSkeleton count={3} />
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 text-sm">
            No projects published yet. Check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedProjects.map((project) => (
              <div
                key={project._id}
                className="group flex flex-col rounded-2xl bg-[#121318] border border-[#262833] overflow-hidden transition-all duration-200 hover:border-neutral-600 hover:bg-[#15161D]"
              >
                {/* Project Visual / Abstract Preview */}
                <div className="relative aspect-[16/10] bg-[#17181D] border-b border-[#262833] overflow-hidden flex items-center justify-center p-6">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    /* Elegant architectural abstract preview card */
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1C1D24] to-[#121318] border border-[#262833] p-5 flex flex-col justify-between relative overflow-hidden">
                      <div
                        className="absolute inset-0 opacity-[0.05]"
                        style={{
                          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
                          backgroundSize: '16px 16px',
                        }}
                      />
                      <div className="flex items-center justify-between text-xs text-neutral-500 font-mono">
                        <span>{project.category}</span>
                        <Laptop className="w-4 h-4 text-blue-400/80" />
                      </div>
                      <div>
                        <div className="text-lg font-bold text-white font-heading tracking-tight">
                          {project.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-1">
                          Interactive Web System
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Featured Tag */}
                  {project.featured && (
                    <div className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-blue-600/90 text-white px-2.5 py-1 rounded-md shadow-sm">
                      Featured
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    {/* Unboxed category metadata with separator */}
                    <div className="text-xs text-neutral-500 font-medium">
                      <span>{project.category}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-heading tracking-tight group-hover:text-blue-400 transition-colors">
                      <Link to={`/work/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Technologies (unboxed text metadata with typographic bullet separators) */}
                  <div className="pt-3 border-t border-[#1C1D24] space-y-4">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-400 font-mono">
                      {project.technologies?.slice(0, 5).map((tech, idx) => (
                        <React.Fragment key={tech}>
                          <span>{tech}</span>
                          {idx < Math.min(project.technologies.length, 5) - 1 && (
                            <span className="text-neutral-600 select-none" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Action Links */}
                    <div className="flex items-center justify-between pt-2">
                      <Link
                        to={`/work/${project.slug}`}
                        className="text-xs font-semibold text-neutral-300 hover:text-white inline-flex items-center gap-1.5"
                      >
                        <span>Case Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex items-center gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-white transition-colors p-1"
                            title="View GitHub Repository"
                            aria-label={`View GitHub repository for ${project.title}`}
                          >
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
                            aria-label={`Visit live site for ${project.title}`}
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
