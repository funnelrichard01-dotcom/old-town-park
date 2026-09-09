import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface Position {
  left: number;
  width: number;
  opacity: number;
}

export interface SlideTabsProps {
  tabs?: string[];
  onTabChange?: (tab: string, index: number) => void;
  className?: string;
}

export const SlideTabs: React.FC<SlideTabsProps> = ({
  tabs = ["Home", "Portfolio", "Buy/sell", "Contact"],
  onTabChange,
  className = "",
}) => {
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  // State to track the currently selected tab, defaulting to the first tab (index 0)
  const [selected, setSelected] = useState(0);
  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  // This effect runs when the component mounts, when the selected tab changes, or on window resize.
  // It calculates the position of the selected tab and sets the cursor.
  useEffect(() => {
    const updatePosition = () => {
      const selectedTab = tabsRef.current[selected];
      if (selectedTab) {
        const { width } = selectedTab.getBoundingClientRect();
        setPosition({
          left: selectedTab.offsetLeft,
          width,
          opacity: 1,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    return () => window.removeEventListener("resize", updatePosition);
  }, [selected]);

  return (
    <ul
      onMouseLeave={() => {
        // When the mouse leaves the container, reset the cursor
        // to the position of the currently selected tab.
        const selectedTab = tabsRef.current[selected];
        if (selectedTab) {
          const { width } = selectedTab.getBoundingClientRect();
          setPosition({
            left: selectedTab.offsetLeft,
            width,
            opacity: 1,
          });
        }
      }}
      className={`relative mx-auto flex w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl items-center justify-between rounded-full border border-black/15 bg-white/90 p-1 backdrop-blur-md shadow-2xl dark:border-white/20 dark:bg-neutral-950/75 transition-all ${className}`}
    >
      {tabs.map((tab, i) => (
        <Tab
          key={tab}
          ref={(el) => {
            tabsRef.current[i] = el;
          }}
          setPosition={setPosition}
          onClick={() => {
            setSelected(i);
            onTabChange?.(tab, i);
          }}
        >
          {tab}
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
};

interface TabProps {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  onClick: () => void;
}

// The Tab component is wrapped in forwardRef to accept a ref from its parent.
const Tab = React.forwardRef<HTMLLIElement, TabProps>(
  ({ children, setPosition, onClick }, ref) => {
    return (
      <li
        ref={ref}
        onClick={onClick}
        onMouseEnter={(e) => {
          const target = e.currentTarget;
          if (!target) return;

          const { width } = target.getBoundingClientRect();

          setPosition({
            left: target.offsetLeft,
            width,
            opacity: 1,
          });
        }}
        className="relative z-10 flex-1 text-center cursor-pointer px-3 sm:px-5 md:px-7 py-1 md:py-1.5 text-xs md:text-sm uppercase tracking-widest text-white mix-blend-difference font-semibold select-none whitespace-nowrap"
      >
        {children}
      </li>
    );
  }
);

Tab.displayName = "Tab";

const Cursor: React.FC<{ position: Position }> = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      className="absolute z-0 top-1 bottom-1 rounded-full bg-black dark:bg-white"
    />
  );
};

export default SlideTabs;
