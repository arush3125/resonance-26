import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

export const Reso25Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Images from Reso 25 folder
  const slides = [
    {
      src: "/Reso 25/MP10 - Copy.webp",
      alt: "Reso 25 - Moment 1",
      caption: "RESONANCE 25 Highlights"
    },
    {
      src: "/Reso 25/MP14.jpg",
      alt: "Reso 25 - Moment 2",
      caption: "Unforgettable Performances"
    },
    {
      src: "/Reso 25/MP16 - Copy.jpeg",
      alt: "Reso 25 - Moment 3",
      caption: "Cultural Extravaganza"
    },
    {
      src: "/Reso 25/Two_Girls_with_Parasols_at_Fladbury_by_John_Singer_Sargent_1889.jpeg.jpeg",
      alt: "Reso 25 - Moment 4",
      caption: "Artistic Expressions"
    }
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 z-10" />
      
      {/* Slideshow container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img
              src={slides[currentIndex].src}
              alt={slides[currentIndex].alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center"
          >
            <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-4">
              <span className="gradient-text bg-gradient-to-r from-white via-primary to-accent bg-clip-text text-transparent">
                RESONANCE 26
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              February 27-28, 2025
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="glass-card px-6 py-3 rounded-full inline-block"
            >
              <p className="text-lg font-medium text-white">
                {slides[currentIndex].caption}
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Navigation controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-4">
          {/* Previous button */}
          <button
            onClick={goToPrevious}
            className="p-3 rounded-full glass-card text-white hover:bg-white/20 transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Play/Pause button */}
          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full glass-card text-white hover:bg-white/20 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </button>

          {/* Next button */}
          <button
            onClick={goToNext}
            className="p-3 rounded-full glass-card text-white hover:bg-white/20 transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 right-8 z-30 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Side navigation hints */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30">
          <button
            onClick={goToPrevious}
            className="p-2 rounded-full glass-card text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 opacity-0 hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        </div>

        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30">
          <button
            onClick={goToNext}
            className="p-2 rounded-full glass-card text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 opacity-0 hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="absolute bottom-8 left-8 z-30"
        >
          <div className="flex flex-col items-center text-white/70">
            <span className="text-sm mb-2">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-8 bg-white/50 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
