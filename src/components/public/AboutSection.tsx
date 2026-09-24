import React, { useState, useEffect } from 'react';
import { useSite } from '../../context/SiteContext';
import { TeamMember } from '../../types';
import { api } from '../../services/api';
import { SectionHeading } from '../common/SectionHeading';
import { Mail, Globe, ExternalLink, Github, Linkedin, ShieldCheck } from 'lucide-react';

export const AboutSection: React.FC<{ showFounders?: boolean }> = ({ showFounders = true }) => {
  const { settings } = useSite();
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    let mounted = true;
    api.team
      .getPublic()
      .then((res) => {
        if (mounted && res.success && res.data) {
          setTeam(res.data);
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section id="about" className="py-24 border-t border-[#1C1D24] bg-[#0B0B0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Main Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              kicker="Who We Are"
              title={settings.aboutTitle || 'About SH Web Studio'}
              className="mb-6"
            />
            <div className="space-y-4 text-base text-neutral-400 leading-relaxed font-normal whitespace-pre-line">
              {settings.aboutDescription || (
                <>
                  <p>
                    SH Web Studio is a small web development studio founded by Humayoon,
                    Shariq and Shujaulmulk. We focus on building modern websites, web
                    applications and custom digital solutions for businesses.
                  </p>
                  <p>
                    Our approach is simple: understand the business first, then build technology
                    that solves a real problem.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Founders Grid */}
          {showFounders && (
            <div className="lg:col-span-6 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-mono font-semibold">
                  Founders & Core Team
                </h3>
                <span className="text-[11px] font-mono text-blue-400">
                  {team.length} Active {team.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {team.map((member) => (
                  <div
                    key={member._id}
                    className="rounded-2xl bg-[#121318] border border-[#262833] p-5 flex flex-col items-center text-center group hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Founder Badge */}
                    {member.isFounder && (
                      <div className="absolute top-2.5 right-2.5">
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Founder
                        </span>
                      </div>
                    )}

                    {/* Avatar or Clean Initials Fallback */}
                    {member.imageUrl ? (
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-16 h-16 rounded-2xl object-cover mb-3.5 border border-[#262833] group-hover:border-blue-500/40 transition-colors"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-[#17181D] border border-[#262833] flex items-center justify-center text-blue-400 font-heading font-bold text-lg mb-3.5 group-hover:border-blue-500/40 transition-colors shadow-inner">
                        {getInitials(member.name)}
                      </div>
                    )}

                    <h4 className="text-base font-bold text-white font-heading tracking-tight">
                      {member.name}
                    </h4>
                    <p className="text-xs text-blue-400 mt-0.5 font-medium leading-tight">
                      {member.role || 'Co-Founder'}
                    </p>

                    {member.bio && (
                      <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed line-clamp-3">
                        {member.bio}
                      </p>
                    )}

                    {/* Quick Connect & Portfolio Links */}
                    <div className="mt-3.5 pt-3 border-t border-[#1C1D24] w-full flex items-center justify-center gap-2 text-neutral-400">
                      {member.portfolioUrl && (
                        <a
                          href={member.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:text-white hover:bg-[#1E2028] transition-colors"
                          title="Personal Portfolio"
                        >
                          <Globe className="w-3.5 h-3.5 text-blue-400" />
                        </a>
                      )}

                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-1.5 rounded-lg hover:text-white hover:bg-[#1E2028] transition-colors"
                          title={`Email ${member.name} (${member.email})`}
                        >
                          <Mail className="w-3.5 h-3.5 text-neutral-300 hover:text-blue-400" />
                        </a>
                      )}

                      {member.githubUrl && (
                        <a
                          href={member.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:text-white hover:bg-[#1E2028] transition-colors"
                          title="GitHub Profile"
                        >
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {member.linkedinUrl && (
                        <a
                          href={member.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg hover:text-blue-400 hover:bg-[#1E2028] transition-colors"
                          title="LinkedIn Profile"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
