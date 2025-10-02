import React from 'react';
import VisionSection from '../components/about/VisionSection';
import MissionValuesSection from '../components/about/MissionValuesSection';
import FounderSection from '../components/about/FounderSection';
import WorkflowVisualization from '../components/shared/WorkflowVisualization';
import { ArrowRight, Target, Lightbulb, Users } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <>
      <VisionSection />
      <MissionValuesSection />
      
      {/* Innovation Philosophy Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Innovation Philosophy
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                We believe in systematic innovation that transforms bold ideas into 
                breakthrough technologies through disciplined experimentation and iteration.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Purpose-Driven</h3>
                <p className="text-white/70 leading-relaxed">
                  Every project starts with a clear purpose: solving real problems 
                  and enhancing human capabilities through technology.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Lightbulb className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Experimental Mindset</h3>
                <p className="text-white/70 leading-relaxed">
                  We embrace uncertainty and failure as learning opportunities, 
                  rapidly prototyping and iterating toward breakthrough solutions.
                </p>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Human-Centered</h3>
                <p className="text-white/70 leading-relaxed">
                  Technology should amplify human potential, not replace it. 
                  We design with empathy and focus on meaningful user experiences.
                </p>
              </div>
            </div>

            {/* Workflow Visualization */}
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-white mb-8 text-center">
                Our Innovation Journey
              </h3>
              <WorkflowVisualization variant="horizontal" showCounts={false} />
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-6">
                Join Our Mission
              </h3>
              <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto leading-relaxed">
                We're always looking for passionate individuals, innovative partners, 
                and forward-thinking organizations to collaborate with us in shaping the future.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                  href="/contact" 
                  className="px-6 py-3 bg-[#00A9FF]/20 hover:bg-[#00A9FF]/30 border border-[#00A9FF]/50 hover:border-[#00A9FF] text-white rounded-md transition-all duration-300 flex items-center group"
                >
                  <span>Get In Touch</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a 
                  href="/lab" 
                  className="px-6 py-3 bg-transparent hover:bg-white/5 border border-white/20 hover:border-white/40 text-white/90 hover:text-white rounded-md transition-all duration-300"
                >
                  Explore Our Lab
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FounderSection />
    </>
  );
};

export default AboutPage;
