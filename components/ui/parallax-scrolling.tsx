'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';
import { ArrowDown } from 'lucide-react';
import { SlideTabs } from '@/components/ui/slide-tabs';

export interface ParallaxComponentProps {
  title?: string;
  layout?: 'responsive' | 'stacked';
  showNav?: boolean;
  videoSrc?: string;
  posterSrc?: string;
  showControls?: boolean;
  onUploadVideo?: (file: File) => void;
  onExplore?: () => void;
  exploreText?: string;
}

export function ParallaxComponent({
  title = "OLD TOWN PARK ORDINARY",
  layout = "responsive",
  showNav = true,
  videoSrc = "/assets/hero-video.mp4",
  posterSrc = "/assets/old_town_park_hero.jpg",
  showControls = true,
  onExplore,
  exploreText = "EXPLORE NOW"
}: ParallaxComponentProps = {}) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeVideo, setActiveVideo] = useState(videoSrc);
  const [activePoster, setActivePoster] = useState(posterSrc);

  useEffect(() => {
    setActiveVideo(videoSrc);
  }, [videoSrc]);

  useEffect(() => {
    setActivePoster(posterSrc);
  }, [posterSrc]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setActiveVideo(url);
      setIsPlaying(true);
      if (videoRef.current) {
        videoRef.current.src = url;
        videoRef.current.play();
      }
    }
  };

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

  const handleExplore = () => {
    if (onExplore) {
      onExplore();
      return;
    }
    const target = document.getElementById("explore-section") || document.querySelector('.parallax__content');
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
            <SlideTabs />
          </nav>
        )}
        <div className="parallax__visuals">
          <div className="parallax__black-line-overflow"></div>
          <div data-parallax-layers className="parallax__layers">
            {/* Layer 1: Cinematic Video Background */}
            <div data-parallax-layer="1" className="parallax__layer-video-container">
              <video
                ref={videoRef}
                src={activeVideo}
                poster={activePoster}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="parallax__video-bg"
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

          {/* Floating Hero Video Controls Bar */}
          {showControls && (
            <div className="parallax__hero-controls">
              <div className="flex items-center gap-2 p-1.5 rounded-full bg-zinc-950/75 backdrop-blur-md border border-white/15 text-xs text-white shadow-2xl">
                {/* Scene Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveVideo("/assets/hero-video.mp4");
                    setActivePoster("/assets/old_town_park_hero.jpg");
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeVideo === "/assets/hero-video.mp4"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  Aerial Tower
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveVideo("/assets/interior-video.mp4");
                    setActivePoster("/assets/old_town_interior.jpg");
                  }}
                  className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                    activeVideo === "/assets/interior-video.mp4"
                      ? "bg-white text-black font-semibold shadow-sm"
                      : "text-zinc-300 hover:text-white"
                  }`}
                >
                  Penthouse Suite
                </button>

                <span className="w-px h-4 bg-white/20 mx-0.5"></span>

                {/* Play / Pause */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-2.5 py-1.5 rounded-full text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  title={isPlaying ? "Pause Video" : "Play Video"}
                >
                  {isPlaying ? (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>

                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="px-2.5 py-1.5 rounded-full text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                  <span>{isMuted ? "Muted" : "Sound"}</span>
                </button>

                <span className="w-px h-4 bg-white/20 mx-0.5"></span>

                {/* Upload Custom Video */}
                <label className="px-3 py-1.5 rounded-full text-zinc-300 hover:text-white bg-white/10 hover:bg-white/15 transition-all cursor-pointer flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Upload Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          <div className="parallax__fade"></div>
        </div>
      </section>
      <section className="parallax__content" id="explore-section">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 160 160" fill="none" className="osmo-icon-svg">
          <path d="M94.8284 53.8578C92.3086 56.3776 88 54.593 88 51.0294V0H72V59.9999C72 66.6273 66.6274 71.9999 60 71.9999H0V87.9999H51.0294C54.5931 87.9999 56.3777 92.3085 53.8579 94.8283L18.3431 130.343L29.6569 141.657L65.1717 106.142C67.684 103.63 71.9745 105.396 72 108.939V160L88.0001 160L88 99.9999C88 93.3725 93.3726 87.9999 100 87.9999H160V71.9999H108.939C105.407 71.9745 103.64 67.7091 106.12 65.1938L106.142 65.1716L141.657 29.6568L130.343 18.3432L94.8284 53.8578Z" fill="currentColor"></path>
        </svg>
      </section>
    </div>
  );
}
