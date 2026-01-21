import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/data/festivalData";

interface EventCardProps {
  event: Event;
  onRegister: (event: Event) => void;
}

const categoryColors = {
  music: "from-primary to-pink-400",
  dance: "from-accent to-purple-400",
  tech: "from-secondary to-blue-400",
  gaming: "from-green-500 to-emerald-400",
  fun: "from-highlight to-orange-400",
  culture: "from-red-500 to-rose-400",
};

export const EventCard = ({ event, onRegister }: EventCardProps) => {
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
            <Users className="w-4 h-4 text-highlight" />
            <span>
              {event.teamSize.min === event.teamSize.max
                ? `${event.teamSize.min} member${event.teamSize.min > 1 ? "s" : ""}`
                : `${event.teamSize.min}-${event.teamSize.max} members`}
            </span>
          </div>
        </div>

        {/* Prize & Fee */}
        <div className="flex items-center justify-between mb-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-highlight" />
            <span className="text-sm font-medium text-foreground">
              ₹{event.prizePool.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground">Entry Fee</span>
            <p className="text-lg font-orbitron font-bold text-primary">
              ₹{event.entryFee}
            </p>
          </div>
        </div>

        {/* Register Button */}
        <Button
          variant="festival"
          size="lg"
          className="w-full"
          onClick={() => onRegister(event)}
        >
          Register & Pay
        </Button>
      </div>
    </motion.div>
  );
};
