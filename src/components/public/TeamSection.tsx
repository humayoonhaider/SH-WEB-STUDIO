import React, { useState, useEffect } from 'react';
import { Mail, Globe, Github, Linkedin, ExternalLink, ShieldCheck } from 'lucide-react';
import { TeamMember } from '../../types';
import { api } from '../../services/api';
import { SectionHeading } from '../common/SectionHeading';

export const TeamSection: React.FC = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.team.getPublic();
        if (res.success && res.data) {
          setTeam(res.data);
        }
      } catch {
        // Fallback team members if offline
        setTeam([
          {
            _id: '1',
            name: 'Humayoon',
            role: 'Co-Founder & Lead Engineer',
            bio: 'Full-stack software engineer specializing in modern React ecosystems, Node.js services, and cloud architecture.',
            imageUrl: '',
            email: 'humayoonkhan003@gmail.com',
            portfolioUrl: 'https://humayoon-portfolio.vercel.app/',
            githubUrl: 'https://github.com/humayoonhaider',
            isFounder: true,
            order: 1,
            isActive: true,
          },
          {
            _id: '2',
            name: 'Shariq',
            role: 'Co-Founder & Developer',
            bio: 'Full-stack engineer passionate about scalable backends, database design, and end-to-end web applications.',
            imageUrl: '',
            email: '',
            portfolioUrl: '',
            githubUrl: '',
            isFounder: true,
            order: 2,
            isActive: true,
          },
          {
            _id: '3',
            name: 'Shujaulmulk',
            role: 'Co-Founder & Developer',
            bio: 'Frontend and user experience engineer focused on clean interfaces, smooth interactions, and client solutions.',
            imageUrl: '',
            email: '',
            portfolioUrl: '',
            githubUrl: '',
            isFounder: true,
            order: 3,
            isActive: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading || team.length === 0) {
    return null;
  }

  return (
    <section className="py-24 bg-[#0B0B0F] relative overflow-hidden border-t border-[#1C1D24]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          kicker="Our Experts"
          title="Meet Our Engineering Team"
          description="Talented developers and founders building exceptional digital solutions and custom web applications."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {team.map((member) => (
            <div
              key={member._id}
              className="group bg-[#121318] border border-[#262833] hover:border-blue-500/40 rounded-3xl p-8 transition-all duration-300 flex flex-col justify-between shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center gap-4 mb-6">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#262833]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[#1A1B22] border border-[#262833] flex items-center justify-center text-blue-400 font-mono font-bold text-lg shadow-inner">
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold font-heading text-white group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-medium text-blue-400/90 mt-0.5">{member.role}</p>
                  </div>
                </div>

                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  {member.bio || 'Experienced software developer crafting scalable web applications.'}
                </p>
              </div>

              <div className="pt-6 border-t border-[#1C1D24] flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  {member.portfolioUrl && (
                    <a
                      href={member.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#17181D] hover:bg-blue-600 text-neutral-300 hover:text-white transition-colors"
                      title="Portfolio Website"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                  {member.githubUrl && (
                    <a
                      href={member.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#17181D] hover:bg-blue-600 text-neutral-300 hover:text-white transition-colors"
                      title="GitHub Profile"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#17181D] hover:bg-blue-600 text-neutral-300 hover:text-white transition-colors"
                      title="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 rounded-xl bg-[#17181D] hover:bg-blue-600 text-neutral-300 hover:text-white transition-colors"
                      title="Email Contact"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {member.portfolioUrl && (
                  <a
                    href={member.portfolioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>View Portfolio</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
