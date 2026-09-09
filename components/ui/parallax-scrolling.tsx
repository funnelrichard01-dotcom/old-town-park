'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowDown } from 'lucide-react';
import { SlideTabs } from '@/components/ui/slide-tabs';
import DemoRadialScrollGalleryBento from '@/components/ui/demo';
import TeamSection from '@/components/ui/team';

export interface ParallaxComponentProps {
  title?: string;
  layout?: 'responsive' | 'stacked';
  showNav?: boolean;
  videoSrc?: string;
  posterSrc?: string;
  onExplore?: () => void;
  exploreText?: string;
}

export function ParallaxComponent({
  title = "OLD TOWN PARK ORDINARY",
  layout = "responsive",
  showNav = true,
  videoSrc = "/assets/hero-video.mp4",
  posterSrc = "/assets/old_town_park_hero.jpg",
  onExplore,
  exploreText = "EXPLORE NOW"
}: ParallaxComponentProps = {}) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Robust video autoplay handling
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Force muted on DOM element (required by browser autoplay policies)
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const startPlayback = () => {
      if (video.paused) {
        const promise = video.play();
        if (promise !== undefined) {
          promise.catch((error) => {
            console.warn("Autoplay waiting for user gesture:", error);
          });
        }
      }
    };

    // Attempt playback immediately
    startPlayback();

    // Listen to video readiness events
    video.addEventListener("loadeddata", startPlayback);
    video.addEventListener("canplay", startPlayback);

    // Fallback on first user interaction if browser restricted autoplay
    const handleFirstGesture = () => {
      startPlayback();
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };

    window.addEventListener("pointerdown", handleFirstGesture, { passive: true });
    window.addEventListener("touchstart", handleFirstGesture, { passive: true });
    window.addEventListener("scroll", handleFirstGesture, { passive: true });
    window.addEventListener("keydown", handleFirstGesture, { passive: true });

    return () => {
      video.removeEventListener("loadeddata", startPlayback);
      video.removeEventListener("canplay", startPlayback);
      window.removeEventListener("pointerdown", handleFirstGesture);
      window.removeEventListener("touchstart", handleFirstGesture);
      window.removeEventListener("scroll", handleFirstGesture);
      window.removeEventListener("keydown", handleFirstGesture);
    };
  }, [videoSrc]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = [
        { layer: "1", yPercent: 45 },
        { layer: "3", yPercent: 25 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    const lenis = new Lenis();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf(triggerElement);
      lenis.destroy();
    };
  }, []);

  const isOldTown = title === "OLD TOWN PARK ORDINARY";

  const handleTabChange = (tab: string) => {
    if (tab === "Home") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === "Portfolio") {
      const el = document.getElementById("portfolio-section") || document.getElementById("explore-section");
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === "Team") {
      const el = document.getElementById("team-section");
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === "Buy/sell" || tab === "Contact") {
      const el = document.getElementById("footer-section") || document.getElementById("team-section") || document.getElementById("explore-section");
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExplore = () => {
    if (onExplore) {
      onExplore();
      return;
    }
    const target = document.getElementById("portfolio-section") || document.getElementById("explore-section") || document.querySelector('.parallax__content');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <div className="parallax" ref={parallaxRef}>
      <section className="parallax__header">
        {showNav && (
          <nav className="parallax__nav" aria-label="Hero Navigation">
            <SlideTabs tabs={["Home", "Portfolio", "Team", "Contact"]} onTabChange={handleTabChange} />
          </nav>
        )}
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow"></div>
          <div data-parallax-layers className="parallax__layers">
            {/* Layer 1: Cinematic Video Background */}
            <div data-parallax-layer="1" className="parallax__layer-video-container">
              <video
                ref={videoRef}
                src={videoSrc}
                poster={posterSrc}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="parallax__video-bg"
                onLoadedMetadata={(e) => {
                  e.currentTarget.muted = true;
                  e.currentTarget.play().catch(() => {});
                }}
                onCanPlay={(e) => {
                  e.currentTarget.muted = true;
                  e.currentTarget.play().catch(() => {});
                }}
              />
              <div className="parallax__video-overlay"></div>
            </div>

            {/* Layer 3: Architectural Title & Action */}
            <div data-parallax-layer="3" className="parallax__layer-title">
              <h2 className={`parallax__title ${layout === 'stacked' ? 'parallax__title--stacked' : 'parallax__title--responsive'}`} aria-label={title}>
                {layout === 'stacked' || !isOldTown ? (
                  isOldTown ? (
                    <>
                      <span className="parallax__title-line parallax__title-line--primary">OLD TOWN PARK</span>
                      <span className="parallax__title-line parallax__title-line--secondary">ORDINARY</span>
                    </>
                  ) : (
                    <span>{title}</span>
                  )
                ) : (
                  <>
                    <span className="parallax__title-full">OLD TOWN PARK ORDINARY</span>
                    <span className="parallax__title-split">
                      <span className="block">OLD TOWN PARK</span>
                      <span className="block">ORDINARY</span>
                    </span>
                  </>
                )}
              </h2>

              {/* Premium EXPLORE NOW Button */}
              <div className="parallax__action-wrapper">
                <button
                  type="button"
                  onClick={handleExplore}
                  className="parallax__explore-btn group"
                  aria-label={exploreText}
                >
                  <span>{exploreText}</span>
                  <span className="parallax__explore-icon">
                    <ArrowDown className="w-3.5 h-3.5" strokeWidth={2.2} />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="parallax__fade"></div>
        </div>
      </section>
      <section className="parallax__content !p-0 !min-h-0 bg-background" id="explore-section">
        <div id="portfolio-section" className="w-full">
          <DemoRadialScrollGalleryBento className="border-0 rounded-none bg-transparent" />
        </div>
        <div className="w-full border-t border-border/40">
          <TeamSection id="team-section" />
        </div>
      </section>
    </div>
  );
}
