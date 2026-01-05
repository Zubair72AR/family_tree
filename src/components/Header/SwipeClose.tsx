"use client";
import { useRef } from "react";

export function useSwipeClose({ onClose }: { onClose: () => void }) {
  const startX = useRef(0);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX.current;

    // Swipe left closes menu (diff negative enough)
    if (diff < -50) {
      onClose();
    }
  };

  return { onTouchStart, onTouchEnd };
}
