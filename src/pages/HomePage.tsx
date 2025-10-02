import React from 'react';
import HeroSection from '../components/home/HeroSection';
import IntroSection from '../components/home/IntroSection';
import FeaturedProductsSection from '../components/home/FeaturedProductsSection';
import WorkflowVisualization from '../components/shared/WorkflowVisualization';
import ProjectCard from '../components/shared/ProjectCard';
import { products } from '../data/products';
import { labProjects } from '../data/labProjects';
import { futureProjects } from '../data/futureProjects';
import { ArrowRight, Sparkles, FlaskConical, Rocket } from 'lucide-react';

const HomePage: React.FC = () => {
  // Get featured projects from each category
  const featuredProduct = products[0]; // Most recent product
  const featuredLabProject = labProjects.find(p => p.status === 'beta') || labProjects[0];
  const featuredFutureProject = futureProjects[0];

  return (
    <>
      <HeroSection />
      <IntroSection />
      
      {/* Innovation Workflow Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Innovation Journey
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                From bold ideas to breakthrough products, we follow a systematic approach 
                to transform visionary concepts into reality.
              </p>
            </div>
            
            <WorkflowVisualization 
              variant="horizontal" 
              showCounts={true}
              className="mb-16"
            />
          </div>
        </div>
      </section>

      {/* Highlights from Each Section */}
      <section className="py-20 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Across Our Ecosystem
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto leading-relaxed">
                Explore highlights from our live products, experimental lab, and future vision projects.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Products Highlight */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <Rocket className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Live Products</h3>
                    <p className="text-white/60 text-sm">{products.length} active tools</p>
                  </div>
                </div>
                
                <ProjectCard project={featuredProduct} />
                
                <a 
                  href="/products" 
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 text-green-400 rounded-lg transition-all duration-300 group"
                >
                  <span>View All Products</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Lab Highlight */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30">
                    <FlaskConical className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Innovation Lab</h3>
                    <p className="text-white/60 text-sm">{labProjects.length} experiments</p>
                  </div>
                </div>
                
                <ProjectCard project={featuredLabProject} />
                
                <a 
                  href="/lab" 
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 rounded-lg transition-all duration-300 group"
                >
                  <span>Explore Lab</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Future Highlight */}
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Future Vision</h3>
                    <p className="text-white/60 text-sm">{futureProjects.length} moonshots</p>
                  </div>
                </div>
                
                <ProjectCard project={featuredFutureProject} />
                
                <a 
                  href="/future" 
                  className="flex items-center justify-center space-x-2 w-full py-3 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-400 rounded-lg transition-all duration-300 group"
                >
                  <span>See Future Vision</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FeaturedProductsSection />
    </>
  );
};

export default HomePage;
