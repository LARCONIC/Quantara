import React from 'react';
import { Lightbulb, FlaskConical, Rocket, Sparkles, ArrowRight } from 'lucide-react';

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

interface WorkflowVisualizationProps {
  variant?: 'horizontal' | 'vertical';
  showCounts?: boolean;
  className?: string;
}

const WorkflowVisualization: React.FC<WorkflowVisualizationProps> = ({ 
  variant = 'horizontal',
  showCounts = false,
  className = ''
}) => {
  const stages: WorkflowStage[] = [
    {
      id: 'idea',
      name: 'Idea',
      description: 'Innovative concepts and breakthrough thinking',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'from-yellow-400 to-orange-500',
      count: showCounts ? 12 : undefined,
    },
    {
      id: 'lab',
      name: 'Lab',
      description: 'Experimental development and prototyping',
      icon: <FlaskConical className="w-6 h-6" />,
      color: 'from-blue-400 to-cyan-500',
      count: showCounts ? 5 : undefined,
    },
    {
      id: 'product',
      name: 'Product',
      description: 'Live tools and user-facing applications',
      icon: <Rocket className="w-6 h-6" />,
      color: 'from-green-400 to-emerald-500',
      count: showCounts ? 3 : undefined,
    },
    {
      id: 'future',
      name: 'Future',
      description: 'Next-generation upgrades and vision',
      icon: <Sparkles className="w-6 h-6" />,
      color: 'from-purple-400 to-pink-500',
      count: showCounts ? 6 : undefined,
    },
  ];

  const isHorizontal = variant === 'horizontal';

  return (
    <div className={`${className}`}>
      <div className={`flex ${isHorizontal ? 'flex-row items-center justify-center' : 'flex-col items-start'} gap-6`}>
        {stages.map((stage, index) => (
          <React.Fragment key={stage.id}>
            {/* Stage Card */}
            <div className="group relative">
              {/* Glassmorphism card */}
              <div className="relative p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105">
                {/* Icon with gradient background */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${stage.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {stage.icon}
                  </div>
                </div>

                {/* Stage info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white group-hover:text-[#00A9FF] transition-colors duration-300">
                      {stage.name}
                    </h3>
                    {stage.count !== undefined && (
                      <span className="px-2 py-1 rounded-full bg-white/10 text-white/70 text-sm font-medium">
                        {stage.count}
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors duration-300">
                    {stage.description}
                  </p>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#00A9FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>

              {/* Floating particles on hover */}
              <div className="absolute -top-2 -right-2 w-3 h-3 rounded-full bg-gradient-to-r from-[#00A9FF]/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse" />
              <div className="absolute -bottom-2 -left-2 w-2 h-2 rounded-full bg-gradient-to-r from-[#00A9FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse" />
            </div>

            {/* Arrow connector */}
            {index < stages.length - 1 && (
              <div className={`flex items-center justify-center ${isHorizontal ? 'mx-2' : 'my-4 ml-6'}`}>
                <div className="relative">
                  <ArrowRight 
                    className={`w-6 h-6 text-white/40 hover:text-[#00A9FF] transition-colors duration-300 ${
                      isHorizontal ? '' : 'rotate-90'
                    }`} 
                  />
                  {/* Animated flow effect */}
                  <div className={`absolute inset-0 ${isHorizontal ? 'animate-pulse' : 'animate-pulse'}`}>
                    <ArrowRight 
                      className={`w-6 h-6 text-[#00A9FF]/20 ${
                        isHorizontal ? '' : 'rotate-90'
                      }`} 
                    />
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Workflow description */}
      <div className="mt-8 text-center">
        <p className="text-white/60 text-sm max-w-2xl mx-auto leading-relaxed">
          Our innovation journey transforms bold ideas into reality through systematic experimentation, 
          development, and continuous evolution. Each stage builds upon the last, creating a cycle of 
          perpetual innovation.
        </p>
      </div>
    </div>
  );
};

export default WorkflowVisualization;