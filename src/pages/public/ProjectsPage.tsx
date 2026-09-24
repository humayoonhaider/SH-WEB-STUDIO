import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { api } from '../../services/api';
import { SectionHeading } from '../../components/common/SectionHeading';
import { CardSkeleton } from '../../components/common/Loader';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowRight, Laptop } from 'lucide-react';
import { FooterCta } from '../../components/public/FooterCta';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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

  const categories = ['all', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          kicker="Portfolio & Case Studies"
          title="Selected Work"
          description="Real-world systems, e-commerce applications, and web tools built by SH Web Studio."
        />

        {/* Category Filter Controls */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-2 mb-10 p-1.5 bg-[#121318] border border-[#262833] rounded-xl w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors capitalize ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <CardSkeleton count={3} />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 text-neutral-500 text-sm">
            No projects found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="group flex flex-col rounded-2xl bg-[#121318] border border-[#262833] overflow-hidden transition-all duration-200 hover:border-neutral-600 hover:bg-[#15161D]"
              >
                <div className="relative aspect-[16/10] bg-[#17181D] border-b border-[#262833] overflow-hidden flex items-center justify-center p-6">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#1C1D24] to-[#121318] border border-[#262833] p-5 flex flex-col justify-between relative overflow-hidden">
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

                  {project.featured && (
                    <div className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-wider bg-blue-600/90 text-white px-2.5 py-1 rounded-md shadow-sm">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
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

                  <div className="pt-3 border-t border-[#1C1D24] space-y-4">
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-neutral-400 font-mono">
                      {project.technologies?.map((tech, idx) => (
                        <React.Fragment key={tech}>
                          <span>{tech}</span>
                          {idx < project.technologies.length - 1 && (
                            <span className="text-neutral-600 select-none" aria-hidden="true">
                              ·
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Link
                        to={`/work/${project.slug}`}
                        className="text-xs font-semibold text-neutral-300 hover:text-white inline-flex items-center gap-1.5"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <div className="flex items-center gap-3">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-white transition-colors p-1"
                            title="GitHub Repository"
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
                            aria-label={`Visit live demo for ${project.title}`}
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
      <FooterCta />
    </div>
  );
};
