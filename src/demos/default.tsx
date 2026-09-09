import { useState } from 'react';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

export default function ParallaxDemo() {
  const [layout, setLayout] = useState<'responsive' | 'stacked'>('responsive');

  return (
    <>
      <ParallaxComponent layout={layout} />

      {/* Sleek Layout Mode Switcher */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-1.5 p-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/15 shadow-2xl text-xs font-medium">
        <button
          type="button"
          onClick={() => setLayout('responsive')}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            layout === 'responsive'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Single Line
        </button>
        <button
          type="button"
          onClick={() => setLayout('stacked')}
          className={`px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
            layout === 'stacked'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Stacked
        </button>
      </div>

      <div className="osmo-credits">
        <p className="osmo-credits__p">Resource by <a target="_blank" rel="noreferrer" href="https://www.osmo.supply/" className="osmo-credits__p-a">Osmo</a>
        </p>
      </div>
    </>
  );
}
