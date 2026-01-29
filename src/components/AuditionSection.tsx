import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { auditionEvents } from "@/data/festivalData";
import { AuditionCard } from "./AuditionCard";
import type { AuditionEvent } from "@/data/festivalData";

const auditionCategories = [
  { id: "all", name: "All Auditions", icon: "🎭" },
  { id: "dance", name: "Dance", icon: "💃" },
  { id: "singing", name: "Singing", icon: "🎤" },
  { id: "instrument", name: "Instrument", icon: "🎵" },
  { id: "fashion", name: "Fashion", icon: "👗" },
];

export const AuditionSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredEvents =
    activeCategory === "all"
      ? auditionEvents
      : auditionEvents.filter((event) => event.category === activeCategory);

  const handleRegister = (formUrl: string) => {
    window.open(formUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
  };

  return (
    <section id="auditions" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-header mb-4">Auditions</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Showcase your talent and compete in our exciting audition events. Register now for your chance to shine!(Note*:Auditions are compulsory for all participants.)
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {auditionCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "glass-card text-muted-foreground hover:text-foreground hover:bg-card"
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </motion.div>

        {/* Events Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <AuditionCard event={event} onRegister={handleRegister} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg">
              No audition events found in this category.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};
