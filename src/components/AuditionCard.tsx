import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuditionEvent } from "@/data/festivalData";

interface AuditionCardProps {
  event: AuditionEvent;
  onRegister: (formUrl: string) => void;
}

const categoryColors = {
  dance: "from-accent to-purple-400",
  singing: "from-primary to-pink-400",
  instrument: "from-highlight to-orange-400",
  fashion: "from-red-500 to-rose-400",
};

export const AuditionCard = ({ event, onRegister }: AuditionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="event-card group relative"
    >
      {/* Category Badge */}
      <div
        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-orbitron uppercase tracking-wider bg-gradient-to-r ${categoryColors[event.category]} text-white`}
      >
        {event.category}
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 blur-xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <h3 className="text-xl md:text-2xl font-orbitron font-bold text-foreground mb-3 pr-20 group-hover:text-primary transition-colors">
          {event.name}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(event.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-secondary" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="truncate">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ExternalLink className="w-4 h-4 text-highlight" />
            <span>Audition</span>
          </div>
        </div>

        {/* Rules Preview */}
        <div className="mb-4">
          <h4 className="text-xs font-orbitron uppercase tracking-wider text-muted-foreground mb-2">Rules:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {event.rules.slice(0, 2).map((rule, ruleIndex) => (
              <li key={ruleIndex} className="flex items-start">
                <span className="text-primary mr-2">•</span>
                {rule}
              </li>
            ))}
            {event.rules.length > 2 && (
              <li className="text-primary text-xs">
                +{event.rules.length - 2} more rules
              </li>
            )}
          </ul>
        </div>

        {/* Register Button */}
        <Button
          variant="festival"
          size="lg"
          className="w-full"
          onClick={() => onRegister(event.formUrl)}
        >
          Register for Audition
        </Button>
      </div>
    </motion.div>
  );
};
