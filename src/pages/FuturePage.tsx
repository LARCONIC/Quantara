import React from 'react';
import { Sparkles, Telescope, Atom, Infinity } from 'lucide-react';
import ProjectCard from '../components/shared/ProjectCard';
import { futureProjects } from '../data/futureProjects';

const FuturePage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
        <div className="absolute top-10 right-20 w-40 h-40 rounded-full bg-purple-500/5 backdrop-blur-xl animate-float" />
        <div className="absolute bottom-10 left-20 w-56 h-56 rounded-full bg-pink-500/5 backdrop-blur-xl animate-float-slow" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-8 animate-fade-in">
              <Sparkles className="w-10 h-10 text-purple-400" />
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6 animate-slide-up">
              Future Vision
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/70 mb-8 animate-fade-in-delay">
              Moonshot ideas that will reshape tomorrow's digital landscape
            </p>
            
            {/* Description */}
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-delay-longer">
              Beyond the horizon of current technology lies a realm of infinite possibilities. 
              Our future vision explores revolutionary concepts that challenge the boundaries 
              of human-computer interaction, consciousness, and reality itself.
            </p>

            {/* Vision Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-delay-longer">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">{futureProjects.length}</div>
                <div className="text-sm text-white/60">Vision Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400 mb-1">∞</div>
                <div className="text-sm text-white/60">Possibilities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">2030+</div>
                <div className="text-sm text-white/60">Timeline</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">🚀</div>
                <div className="text-sm text-white/60">Moonshots</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Philosophy Section */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Our Future Philosophy
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Telescope className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Visionary Thinking</h3>
                <p className="text-white/70 leading-relaxed">
                  We look beyond current limitations to imagine technologies 
                  that could fundamentally transform human experience.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Atom className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Scientific Foundation</h3>
                <p className="text-white/70 leading-relaxed">
                  Every moonshot idea is grounded in emerging scientific 
                  principles and theoretical frameworks.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-pink-500/20 to-rose-500/20 border border-pink-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Infinity className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Infinite Potential</h3>
                <p className="text-white/70 leading-relaxed">
                  We believe in the unlimited potential of human creativity 
                  combined with exponential technological advancement.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Innovation Timeline
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-center space-x-6 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-blue-400 font-bold">2025</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Foundation Phase</h3>
                  <p className="text-white/70">
                    Establishing research partnerships, building theoretical frameworks, 
                    and creating proof-of-concept prototypes for breakthrough technologies.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-purple-400 font-bold">2030</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Breakthrough Phase</h3>
                  <p className="text-white/70">
                    First working implementations of revolutionary interfaces, 
                    quantum-enhanced applications, and consciousness-aware systems.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 group">
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-green-400 font-bold">2035+</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">Transformation Phase</h3>
                  <p className="text-white/70">
                    Widespread adoption of next-generation technologies that fundamentally 
                    change how humans interact with digital systems and each other.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-white">
                Moonshot Projects
              </h2>
              <div className="text-white/60 text-sm">
                {futureProjects.length} vision concepts
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {futureProjects.map((project) => (
                <ProjectCard 
                  key={project.id} 
                  project={project} 
                  showGraduation={false}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Shape the Future With Us
            </h2>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              These moonshot ideas represent our boldest visions for the future. 
              While they may seem like science fiction today, we believe they will 
              become reality through dedicated research, innovation, and collaboration.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/lab" 
                className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 hover:border-purple-500 text-white rounded-md transition-all duration-300"
              >
                Explore Current Lab
              </a>
              <a 
                href="/contact" 
                className="px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white/90 hover:text-white rounded-md transition-all duration-300"
              >
                Discuss Ideas
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FuturePage;