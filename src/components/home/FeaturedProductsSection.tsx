import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../../data/products';

const FeaturedProductsSection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get responsive card width based on screen size
  const getCardWidth = useCallback(() => {
    if (typeof window === 'undefined') return 320;
    
    const width = window.innerWidth;
    if (width < 640) return Math.min(width - 32, 280); // sm: mobile
    if (width < 768) return 320; // md: large mobile
    if (width < 1024) return 360; // lg: tablet
    if (width < 1280) return 380; // xl: small desktop
    return 400; // 2xl: large desktop
  }, []);

  // Enhanced auto-scroll with proper infinite loop
  useEffect(() => {
    if (!isAutoScrolling || isTransitioning) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        setIsTransitioning(true);
        
        // Calculate exact scroll position for current card
        const cardWidth = getCardWidth();
        const gap = window.innerWidth < 640 ? 16 : 24; // Responsive gap
        const scrollAmount = cardWidth + gap;
        
        const nextIndex = currentIndex + 1;
        
        if (nextIndex >= products.length) {
          // Smooth transition to first card
          setCurrentIndex(0);
          container.scrollTo({ 
            left: 0, 
            behavior: 'smooth' 
          });
        } else {
          // Scroll to next card
          setCurrentIndex(nextIndex);
          container.scrollTo({ 
            left: nextIndex * scrollAmount, 
            behavior: 'smooth' 
          });
        }
        
        // Allow transition to complete
        setTimeout(() => setIsTransitioning(false), 600);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoScrolling, currentIndex, isTransitioning, getCardWidth]);

  // Enhanced manual navigation
  const scrollToIndex = useCallback((index: number) => {
    if (scrollContainerRef.current && !isTransitioning) {
      const container = scrollContainerRef.current;
      const cardWidth = getCardWidth();
      const gap = window.innerWidth < 640 ? 16 : 24;
      const scrollAmount = cardWidth + gap;
      
      setIsTransitioning(true);
      setCurrentIndex(index);
      
      container.scrollTo({ 
        left: index * scrollAmount, 
        behavior: 'smooth' 
      });
      
      setTimeout(() => setIsTransitioning(false), 600);
    }
  }, [getCardWidth, isTransitioning]);

  const scrollLeft = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : products.length - 1;
    scrollToIndex(newIndex);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 8000);
  };

  const scrollRight = () => {
    const newIndex = currentIndex < products.length - 1 ? currentIndex + 1 : 0;
    scrollToIndex(newIndex);
    setIsAutoScrolling(false);
    setTimeout(() => setIsAutoScrolling(true), 8000);
  };

  // Update scroll button states
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateScrollButtons = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    container.addEventListener('scroll', updateScrollButtons);
    window.addEventListener('resize', updateScrollButtons);
    updateScrollButtons();

    return () => {
      container.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, []);

  // Pause/resume auto-scroll on hover
  const handleMouseEnter = () => setIsAutoScrolling(false);
  const handleMouseLeave = () => setIsAutoScrolling(true);

  // Handle touch events for mobile
  const handleTouchStart = () => setIsAutoScrolling(false);
  const handleTouchEnd = () => {
    setTimeout(() => setIsAutoScrolling(true), 5000);
  };

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-[#1A1A1A] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 md:mb-4 lg:mb-6">
            Featured Products
          </h2>
          <p className="text-white/70 text-sm sm:text-base md:text-lg lg:text-xl mb-3 md:mb-4 max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
            Explore our innovative digital solutions designed to enhance creativity and productivity.
          </p>
          <div className="w-16 sm:w-20 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-[#00A9FF] to-[#00D4FF] mx-auto rounded-full"></div>
        </div>

        {/* Netflix-style Carousel Container */}
        <div 
          className="relative group mb-8 md:mb-12 lg:mb-16"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Left Arrow - Hidden on mobile, visible on tablet+ */}
          <button
            onClick={scrollLeft}
            className={`hidden md:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-black/60 hover:bg-black/80 border border-white/10 hover:border-[#00A9FF]/50 rounded-full items-center justify-center text-white/70 hover:text-white transition-all duration-300 transform hover:scale-110 ${
              !canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
            }`}
            disabled={!canScrollLeft}
            aria-label="Previous product"
          >
            <ChevronLeft className="w-4 h-4 lg:w-6 lg:h-6" />
          </button>

          {/* Right Arrow - Hidden on mobile, visible on tablet+ */}
          <button
            onClick={scrollRight}
            className={`hidden md:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:w-12 lg:h-12 bg-black/60 hover:bg-black/80 border border-white/10 hover:border-[#00A9FF]/50 rounded-full items-center justify-center text-white/70 hover:text-white transition-all duration-300 transform hover:scale-110 ${
              !canScrollRight ? 'opacity-50 cursor-not-allowed' : 'opacity-0 group-hover:opacity-100'
            }`}
            disabled={!canScrollRight}
            aria-label="Next product"
          >
            <ChevronRight className="w-4 h-4 lg:w-6 lg:h-6" />
          </button>

          {/* Scrolling Products Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-12 lg:px-16"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
            }}
          >
            {products.map((product, index) => (
              <div
                key={`${product.name}-${index}`}
                className="flex-none w-[280px] sm:w-[320px] md:w-[360px] lg:w-[380px] xl:w-[400px] group/card bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-lg md:rounded-xl overflow-hidden hover:border-[#00A9FF]/50 hover:shadow-[0_0_20px_rgba(0,169,255,0.15)] md:hover:shadow-[0_0_30px_rgba(0,169,255,0.2)] transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 hover:scale-[1.02] md:hover:scale-105"
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Product Image/Icon Area */}
                <div className="aspect-[16/9] md:aspect-[16/10] bg-gradient-to-br from-[#1A1A1A] via-[#2A2A2A] to-[#121212] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#00A9FF]/5 to-transparent"></div>
                  <div className="relative z-10 text-center px-4">
                    <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-[#00A9FF] to-white/90 bg-clip-text text-transparent">
                      {product.name}
                    </div>
                    <div className="w-12 sm:w-14 md:w-16 h-0.5 md:h-1 bg-gradient-to-r from-[#00A9FF] to-transparent mx-auto mt-2"></div>
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 w-1.5 md:w-2 h-1.5 md:h-2 bg-[#00A9FF]/30 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 w-1 h-1 bg-white/20 rounded-full"></div>
                </div>

                {/* Product Content */}
                <div className="p-4 sm:p-5 md:p-6 lg:p-7">
                  <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold text-white mb-2 md:mb-3 group-hover/card:text-[#00A9FF] transition-colors duration-300 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-white/70 mb-4 md:mb-6 leading-relaxed text-xs sm:text-sm md:text-sm lg:text-base line-clamp-2 md:line-clamp-3">
                    {product.description}
                  </p>
                  
                  {/* Professional Clean Button */}
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center justify-center w-full px-4 sm:px-5 py-2.5 sm:py-3 md:py-3.5 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#00A9FF]/60 text-white/90 hover:text-white font-medium text-xs sm:text-sm tracking-wide rounded-md md:rounded-lg backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#00A9FF]/10"
                  >
                    <span className="mr-2">Visit Product</span>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-70 group-hover/btn:opacity-100 group-hover/btn:translate-x-0.5 transition-all duration-300" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mt-4 md:mt-6 space-x-1.5 md:space-x-2">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  scrollToIndex(index);
                  setIsAutoScrolling(false);
                  setTimeout(() => setIsAutoScrolling(true), 8000);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'bg-[#00A9FF] w-6 md:w-8 h-2'
                    : 'bg-white/30 hover:bg-white/50 w-2 h-2'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Auto-scroll Status Indicator */}
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center space-x-2 text-white/50 text-xs md:text-sm">
            <div className={`w-1.5 md:w-2 h-1.5 md:h-2 rounded-full ${isAutoScrolling ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="hidden sm:inline">{isAutoScrolling ? 'Auto-scrolling active' : 'Auto-scroll paused'}</span>
            <span className="sm:hidden">{isAutoScrolling ? 'Auto' : 'Paused'}</span>
          </div>
        </div>

        {/* Mobile Touch Navigation Hint */}
        <div className="text-center mb-6 md:mb-8 md:hidden">
          <p className="text-white/40 text-xs">
            Swipe left or right to navigate • Tap to pause auto-scroll
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <a
            href="/products"
            className="inline-flex items-center px-6 sm:px-8 py-3 md:py-4 bg-transparent hover:bg-[#00A9FF]/10 border border-[#00A9FF]/30 md:border-2 hover:border-[#00A9FF]/60 text-white/90 hover:text-white rounded-md md:rounded-lg transition-all duration-300 transform hover:scale-105 group font-medium text-sm md:text-base"
          >
            <span>View All Products</span>
            <ArrowRight className="ml-2 md:ml-3 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;