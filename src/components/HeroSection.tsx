import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// import { AnimatedBackground } from "./AnimatedBackground";
import { festivalInfo } from "@/data/festivalData";
import { ChevronDown, Sparkles, Ticket } from "lucide-react";

export const HeroSection = () => {
  const scrollToEvents = () => {
    document.getElementById("events")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToAbout = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* <AnimatedBackground /> */}
      
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-orbitron font-black mb-4 tracking-tight"
        >
          <span className="gradient-text">{festivalInfo.name}</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto mb-10 font-montserrat"
        >
          {festivalInfo.tagline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            variant="festival"
            size="xl"
            onClick={scrollToEvents}
            className="group"
          >
            <Ticket className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
            Register Now
          </Button>
          <Button
            variant="festivalOutline"
            size="xl"
            onClick={scrollToAbout}
          >
            Explore Events
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto justify-items-center"
        >
          {[
            { value: "14", label: "Events" },
            { value: "1K+", label: "Expected Crowd" },
            { value: "2", label: "Days of Celebration" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-orbitron font-bold neon-text-pink">
                {stat.value}
              </p>
              <p className={`text-sm text-muted-foreground mt-1 ${stat.label === "Days of Celebration" ? "text-center" : ""}`}>{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.button
          onClick={scrollToAbout}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </section>
  );
};
