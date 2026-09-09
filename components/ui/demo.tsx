import React from 'react';
import { RadialScrollGallery } from '@/components/ui/portfolio-and-image-gallery';
import { ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const projects = [
  { id: 1, title: "Nebula", cat: "Art", img: "https://cdn.21st.dev/assets/mirror/a0/a0ea47db06a3c131378bee578b9a53747fc7c257e607c38600da4a6f58ab3da1.jpg" },
  { id: 2, title: "Decay", cat: "Photo", img: "https://cdn.21st.dev/assets/mirror/a5/a5d2c310d841cad8bdbbde8b1a02cbe231b9194f3b3fc7c335a0047c565bdba0.jpg" },
  { id: 3, title: "Oceanic", cat: "Nature", img: "https://cdn.21st.dev/assets/mirror/1e/1e4e1a59f7b883f6850a55294853a8e01c6cc8aa7f2a24a96fdea0b9a32b1985.jpg" },
  { id: 4, title: "Neon", cat: "Tech", img: "https://cdn.21st.dev/assets/mirror/58/58c20ed0202d07d41d21b17d58acc08c4e158d7d39e6d9c739d17dba99d9b0b6.jpg" },
  { id: 5, title: "Desert", cat: "Travel", img: "https://cdn.21st.dev/assets/mirror/af/af8af20b571811682fe2cd0d5639e83177c5c524443bd80cc392ee4ae43d02ae.jpg" },
];

export interface DemoRadialScrollGalleryBentoProps {
  className?: string;
}

export default function DemoRadialScrollGalleryBento({
  className = ''
}: DemoRadialScrollGalleryBentoProps = {}) {
  return (
    <div className={`bg-background min-h-[600px] text-foreground overflow-hidden rounded-lg border border-border w-full ${className}`}>
      <div className="h-[300px] flex flex-col items-center justify-center space-y-4 pt-8">
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            Portfolio
          </span>
          <h1 className="text-4xl font-bold tracking-tighter">
            Work
          </h1>
        </div>
        <div className="animate-bounce text-muted-foreground text-xs">↓ Scroll</div>
      </div>

      <RadialScrollGallery
        className="!min-h-[600px]"
        baseRadius={400}
        mobileRadius={250}
        visiblePercentage={50}
        scrollDuration={2000}
      >
        {(hoveredIndex) =>
          projects.map((project, index) => {
            const isActive = hoveredIndex === index;
            return (
              <div 
                key={project.id} 
                className="group relative w-[200px] h-[280px] sm:w-[240px] sm:h-[320px] overflow-hidden rounded-xl bg-card border border-border shadow-lg"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={project.img}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                      isActive ? 'scale-110 blur-0' : 'scale-100 blur-[1px] grayscale-[30%]'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent opacity-60" />
                </div>

                <div className="absolute inset-0 flex flex-col justify-between p-4">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-background/80 backdrop-blur">
                      {project.cat}
                    </Badge>
                    <div className={`w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center transition-all duration-500 ${isActive ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-45'}`}>
                      <ArrowUpRight size={12} />
                    </div>
                  </div>

                  <div className={`transition-transform duration-500 ${isActive ? 'translate-y-0' : 'translate-y-2'}`}>
                    <h3 className="text-xl font-bold leading-tight text-foreground">{project.title}</h3>
                    <div className={`h-0.5 bg-primary mt-2 transition-all duration-500 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                  </div>
                </div>
              </div>
            );
          })
        }
      </RadialScrollGallery>

      <div id="footer-section" className="h-[300px] flex items-center justify-center bg-muted/30">
        <h2 className="text-xl font-light tracking-widest uppercase text-muted-foreground">
          Footer
        </h2>
      </div>
    </div>
  );
}
