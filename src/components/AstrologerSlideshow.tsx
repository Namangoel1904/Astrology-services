"use client";

import { useEffect, useState } from "react";
import AstrologerCard from "@/components/AstrologerCard";
import { astrologers } from "@/lib/astrologers-data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AstrologerSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % astrologers.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + astrologers.length) % astrologers.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % astrologers.length);
  };

  const getVisibleCards = () => {
    const cards = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + astrologers.length) % astrologers.length;
      cards.push({ astrologer: astrologers[index], offset: i });
    }
    return cards;
  };

  return (
    <div className="relative py-12">
      <div className="flex items-center justify-center">
        <Button
          onClick={handlePrev}
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black z-10 h-12 w-12"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>

        <div className="relative overflow-hidden w-full max-w-6xl h-[480px]">
          <div className="absolute inset-0 flex items-center justify-center">
            {getVisibleCards().map(({ astrologer, offset }) => (
              <div
                key={astrologer.id}
                className="absolute transition-all duration-500 ease-in-out"
                style={{
                  transform: `translateX(${offset * 80}%) scale(${offset === 0 ? 1 : 0.7})`,
                  opacity: offset === 0 ? 1 : 0.3,
                  zIndex: offset === 0 ? 10 : 1,
                }}
              >
                <AstrologerCard astrologer={astrologer} />
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleNext}
          variant="outline"
          size="icon"
          className="rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm hover:bg-white dark:hover:bg-black z-10 h-12 w-12"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {astrologers.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index);
              setIsAutoPlaying(false);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "w-8 bg-purple-600"
                : "w-2 bg-purple-300 dark:bg-purple-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
}