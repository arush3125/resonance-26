import { motion } from "framer-motion";
import { highlights } from "@/data/festivalData";
import { SimpleSlideshow } from "@/components/SimpleSlideshow";

export const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-header mb-4">About The Fest</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Two days of non-stop entertainment, competitions, and unforgettable memories. 
            RESONANCE 26 brings together the best of music, dance, and culture.
          </p>
        </motion.div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto justify-items-center">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="glass-card p-6 text-center group cursor-pointer"
            >
              <motion.span
                className="text-5xl block mb-4"
                whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.3 }}
              >
                {highlight.icon}
              </motion.span>
              <h3 className="text-xl font-orbitron font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {highlight.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {highlight.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Feature Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 glass-card p-8 md:p-12 rounded-3xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl md:text-4xl font-orbitron font-bold gradient-text mb-4">
                Some glimpses of Resonance 25
              </h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of students for an experience 
                that will define your college memories. From electrifying DJ nights to 
                intense competitions, from graceful dance performances to creative showcases — 
                RESONANCE has it all.
              </p>
              <ul className="space-y-3">
                {[
                  "14+ competitions across all domains",
                  "performances & DJ nights",
                  "Food stalls, gaming zones & more",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-foreground"
                  >
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {item}
                  </motion.li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-2xl overflow-hidden relative">
                <SimpleSlideshow />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
