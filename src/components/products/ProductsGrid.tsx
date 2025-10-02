import React from 'react';
import { ArrowRight } from 'lucide-react';
import ProjectCard from '../shared/ProjectCard';
import { products } from '../../data/products';

const ProductsGrid: React.FC = () => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Live Products
              </h2>
              <p className="text-white/70">
                Production-ready tools and applications serving users worldwide
              </p>
            </div>
            <div className="text-white/60 text-sm">
              {products.length} active products
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="animate-fade-in-delay"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ProjectCard 
                  project={product} 
                  showGraduation={true}
                />
              </div>
            ))}
          </div>

          {/* Graduation Success Story */}
          {products.some(p => p.graduatedFrom) && (
            <div className="mt-16 p-8 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  From Lab to Production
                </h3>
                <p className="text-white/70 mb-6 max-w-2xl mx-auto">
                  {products.filter(p => p.graduatedFrom).length} of our products successfully graduated 
                  from experimental prototypes in our Innovation Lab to full production releases.
                </p>
                <a 
                  href="/lab" 
                  className="inline-flex items-center px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 hover:border-purple-500 text-purple-400 rounded-lg transition-all duration-300 group"
                >
                  <span>Explore Our Lab</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
