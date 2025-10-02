import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, Calendar, Code, ArrowUpRight, FlaskConical, Zap, Cpu, GraduationCap } from 'lucide-react';
import { Project } from '../../data/products';
import TagSystem from './TagSystem';

interface ProjectCardProps {
  project: Project;
  variant?: 'default' | 'featured';
  showGraduation?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  variant = 'default',
  showGraduation = true 
}) => {
  const navigate = useNavigate();
  const isClickable = !!project.url;
  const cardClasses = `
    group relative overflow-hidden rounded-xl border border-white/10 
    bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm
    transition-all duration-500 ease-out
    hover:border-white/20 hover:shadow-2xl hover:shadow-[#00A9FF]/10
    hover:scale-[1.02] hover:-translate-y-1
    ${variant === 'featured' ? 'md:col-span-2' : ''}
    ${isClickable ? 'cursor-pointer' : ''}
  `;

  const handleClick = () => {
    if (project.url) {
      if (project.status === 'graduated') {
        navigate(`/readme?url=${encodeURIComponent(project.url)}`);
      } else {
        window.open(project.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const getPhaseIcon = (phase?: string) => {
    switch (phase) {
      case 'development':
        return <FlaskConical className="w-4 h-4" />;
      case 'upgradation':
        return <Zap className="w-4 h-4" />;
      case 'experimentation':
        return <Cpu className="w-4 h-4" />;
      case 'ready-for-graduation':
        return <GraduationCap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getPhaseColor = (phase?: string) => {
    switch (phase) {
      case 'development':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'upgradation':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'experimentation':
        return 'text-cyan-400 bg-cyan-500/20 border-cyan-500/30';
      case 'ready-for-graduation':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPhaseName = (phase?: string) => {
    switch (phase) {
      case 'development':
        return 'Development';
      case 'upgradation':
        return 'Upgradation';
      case 'experimentation':
        return 'Experimentation';
      case 'ready-for-graduation':
        return 'Ready for Graduation';
      default:
        return null;
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      {/* Glassmorphism overlay that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00A9FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#00A9FF]/20 via-transparent to-[#00A9FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      
      <div className="relative p-6 h-full flex flex-col">
        {/* Header with status and external link */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <TagSystem 
              tags={[]} 
              status={project.status} 
              size="sm"
            />
          </div>
          {project.url && (
            <div className="ml-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight className="w-5 h-5 text-[#00A9FF] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
            </div>
          )}
        </div>

        {/* Project name */}
        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-[#00A9FF] transition-colors duration-300">
          {project.name}
        </h3>

        {/* Development Phase Badge for Lab projects */}
        {project.category === 'lab' && project.developmentPhase && (
          <div className="mb-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getPhaseColor(project.developmentPhase)}`}>
              {getPhaseIcon(project.developmentPhase)}
              <span className="ml-1.5">{getPhaseName(project.developmentPhase)}</span>
            </span>
          </div>
        )}

        {/* Graduation badge */}
        {showGraduation && project.graduatedFrom && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-1.5"></span>
              Graduated from Lab
            </span>
          </div>
        )}

        {/* Graduated status badge for Lab projects */}
        {project.category === 'lab' && project.status === 'graduated' && (
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/20 text-green-300 text-xs border border-green-500/30">
              <GraduationCap className="w-3 h-3 mr-1.5" />
              Graduated to Products
            </span>
          </div>
        )}

        {/* Description */}
        <p className="text-white/70 mb-6 flex-1 leading-relaxed group-hover:text-white/90 transition-colors duration-300">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="mb-4">
          <TagSystem 
            tags={project.technologies} 
            variant="default" 
            size="sm"
          />
        </div>

        {/* Footer with metadata */}
        <div className="flex items-center justify-between text-sm text-white/50 pt-4 border-t border-white/10">
          <div className="flex items-center space-x-4">
            {project.launchDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(project.launchDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short' 
                })}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Code className="w-4 h-4" />
              <span>{project.technologies.length} tech{project.technologies.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
          
          {project.url && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink className="w-4 h-4" />
              <span>{project.status === 'graduated' ? 'Readme' : 'Live Demo'}</span>
            </div>
          )}
        </div>

        {/* Hover effect particles */}
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#00A9FF]/30 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse" />
        <div className="absolute bottom-4 left-4 w-1 h-1 rounded-full bg-[#00A9FF]/20 opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse" />
      </div>
    </div>
  );
};

export default ProjectCard;