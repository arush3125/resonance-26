import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const SimpleSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Images from Reso 25 folder
  const slides = [
    "/Reso 25/WhatsApp Image 2026-01-28 at 5.06.14 PM.jpeg",
    "/Reso 25/WhatsApp Image 2026-01-28 at 5.06.26 PM.jpeg",
    "/Reso 25/WhatsApp Image 2026-01-28 at 5.06.31 PM.jpeg",
    "/Reso 25/WhatsApp Image 2026-01-28 at 5.06.32 PM.jpeg",
    "/Reso 25/WhatsApp Image 2026-01-28 at 5.06.35 PM.jpeg",
    "/Reso 25/WhatsApp Image 2026-01-28 at 5.06.37 PM.jpeg",
    "/Reso 25/WhatsApp Image 2026-01-28 at 5.06.38 PM.jpeg",
    "/Reso 25/WhatsApp Image 2026-01-28 at 5.06.40 PM.jpeg"
  ];

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full h-full">
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={slides[currentIndex]}
          alt={`Reso 25 - Slide ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-2xl"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </AnimatePresence>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-6"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
