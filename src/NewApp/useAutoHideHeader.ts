import { useState, useEffect, useRef, useCallback } from "react";

export function useAutoHideHeader({
  scrollDownThreshold = 80,
  scrollUpThreshold = 20,
  idleTimeout = 2000,
}: {
  scrollDownThreshold?: number;
  scrollUpThreshold?: number;
  idleTimeout?: number;
} = {}) {
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollUpAnchor = useRef<number | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout>>(0);

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    const prevY = lastScrollY.current;

    // Scrolling down
    if (currentY > prevY) {
      scrollUpAnchor.current = null;
      if (currentY > scrollDownThreshold) {
        setVisible(false);
      }
    }

    // Scrolling up
    if (currentY < prevY) {
      if (scrollUpAnchor.current === null) {
        scrollUpAnchor.current = prevY;
      }
      if (scrollUpAnchor.current - currentY >= scrollUpThreshold) {
        setVisible(true);
      }
    }

    // At the very top — always show
    if (currentY <= 40) {
      setVisible(true);
    }

    lastScrollY.current = currentY;

    // Reset idle timer
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      setVisible(true);
    }, idleTimeout);
  }, [scrollDownThreshold, scrollUpThreshold, idleTimeout]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(idleTimer.current);
    };
  }, [handleScroll]);

  return visible;
}
