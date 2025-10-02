import React from 'react';
import { FlaskConical, Zap, Cpu, Brain, ArrowUpRight } from 'lucide-react';
import ProjectCard from '../components/shared/ProjectCard';
import { labProjects } from '../data/labProjects';

const LabPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10" />
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-blue-500/5 backdrop-blur-xl animate-float" />
        <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-cyan-500/5 backdrop-blur-xl animate-float-slow" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-8 animate-fade-in">
              <FlaskConical className="w-10 h-10 text-blue-400" />
            </div>
            
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-6 animate-slide-up">
              Innovation Lab
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-white/70 mb-8 animate-fade-in-delay">
              Where bold ideas transform into breakthrough technologies
            </p>
            
            {/* Description */}
            <p className="text-lg text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-delay-longer">
              Our experimental playground pushes the boundaries of what's possible. 
              Here, we prototype cutting-edge solutions, test innovative concepts, 
              and develop the technologies that will shape tomorrow's digital landscape.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-in-delay-longer">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {labProjects.filter(p => p.status !== 'graduated').length}
                </div>
                <div className="text-sm text-white/60">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-1">
                  {labProjects.filter(p => p.status === 'beta').length}
                </div>
                <div className="text-sm text-white/60">In Beta</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {labProjects.filter(p => p.status === 'graduated').length}
                </div>
                <div className="text-sm text-white/60">Graduated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">∞</div>
                <div className="text-sm text-white/60">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Philosophy Section */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Our Lab Philosophy
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Rapid Experimentation</h3>
                <p className="text-white/70 leading-relaxed">
                  Fast iteration cycles allow us to test hypotheses quickly, 
                  fail fast, and pivot toward breakthrough solutions.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Cutting-Edge Tech</h3>
                <p className="text-white/70 leading-relaxed">
                  We embrace emerging technologies like AI, quantum computing, 
                  and advanced algorithms to solve complex problems.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Human-Centered</h3>
                <p className="text-white/70 leading-relaxed">
                  Every experiment is guided by the goal of enhancing human 
                  capabilities and improving quality of life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Workflow Section */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Professional Development Workflow
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6 mb-16">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FlaskConical className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Development</h3>
                <p className="text-white/60 text-sm">Initial prototyping and core feature development</p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Upgradation</h3>
                <p className="text-white/60 text-sm">Feature enhancement and performance optimization</p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Experimentation</h3>
                <p className="text-white/60 text-sm">Advanced testing and innovative feature exploration</p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Graduation</h3>
                <p className="text-white/60 text-sm">Ready for production deployment and user adoption</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl font-bold text-white">
                Current Experiments
              </h2>
              <div className="text-white/60 text-sm">
                {labProjects.filter(p => p.status !== 'graduated').length} active projects
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {labProjects.filter(project => project.status !== 'graduated').map((project) => (
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

      {/* Graduated Projects Section */}
      {labProjects.some(p => p.status === 'graduated') && (
        <section className="py-16 border-t border-white/10">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    Graduated Products
                  </h2>
                  <p className="text-white/70">
                    Successful projects that have transitioned from Lab to Production
                  </p>
                </div>
                <div className="text-white/60 text-sm">
                  {labProjects.filter(p => p.status === 'graduated').length} graduated
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {labProjects.filter(project => project.status === 'graduated').map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    showGraduation={false}
                  />
                ))}
              </div>

              {/* Success Story */}
              <div className="p-8 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Lab to Production Success
                  </h3>
                  <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                    Our rigorous development workflow has successfully graduated {labProjects.filter(p => p.status === 'graduated').length} projects 
                    from experimental prototypes to production-ready products, serving users worldwide.
                  </p>
                  <a 
                    href="/products" 
                    className="inline-flex items-center px-6 py-3 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 hover:border-green-500 text-green-400 rounded-lg transition-all duration-300 group"
                  >
                    <span>View Live Products</span>
                    <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Join Our Innovation Journey
            </h2>
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Interested in collaborating on experimental projects or have ideas 
              that could benefit from our lab environment? We're always looking 
              for innovative partnerships and fresh perspectives.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="/contact" 
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 hover:border-blue-500 text-white rounded-md transition-all duration-300"
              >
                Collaborate With Us
              </a>
              <a 
                href="/future" 
                className="px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white/90 hover:text-white rounded-md transition-all duration-300"
              >
                Explore Future Vision
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LabPage;