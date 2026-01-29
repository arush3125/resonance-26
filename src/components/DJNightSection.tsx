import { motion } from "framer-motion";
import { Music, Sparkles } from "lucide-react";

export const DJNightSection = () => (
  <section id="dj-night" className="py-32 relative overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/reso 26.png')" }} />
    <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-primary/20 to-background/90" />
    <motion.div className="absolute inset-0 opacity-30" animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }} transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }} style={{ background: "radial-gradient(circle at 50% 50%, hsla(320, 100%, 59%, 0.3) 0%, transparent 50%)", backgroundSize: "200% 200%" }} />
    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <Sparkles className="w-12 h-12 mx-auto text-highlight mb-4" />
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-black gradient-text mb-6">DJ Night</h2>
        <p className="text-xl md:text-3xl text-muted-foreground mb-8">Outstanding Performance • EDM Madness • Night Party</p>
        <div className="flex justify-center gap-4 flex-wrap">
          {["Electro House", "Progressive", "Dubstep", "Trance"].map((genre, i) => (
            <motion.span key={genre} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="px-4 py-2 rounded-full glass-card text-sm font-medium">
              {genre}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);
