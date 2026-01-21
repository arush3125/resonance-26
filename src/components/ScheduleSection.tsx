import { motion } from "framer-motion";
import { schedule } from "@/data/festivalData";
import { Clock, MapPin } from "lucide-react";

export const ScheduleSection = () => (
  <section id="schedule" className="py-24 relative">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="section-header mb-4">Event Schedule</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Three days packed with non-stop action</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {schedule.map((day, dayIndex) => (
          <motion.div key={day.day} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: dayIndex * 0.1 }} viewport={{ once: true }} className="glass-card p-6">
            <div className="text-center mb-6">
              <span className="text-sm text-primary font-orbitron uppercase tracking-wider">Day {day.day}</span>
              <h3 className="text-xl font-orbitron font-bold mt-1">{day.title}</h3>
              <p className="text-muted-foreground text-sm">{new Date(day.date).toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" })}</p>
            </div>
            <div className="space-y-4">
              {day.events.map((event, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }} className="flex gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="text-primary font-orbitron text-sm font-bold whitespace-nowrap">{event.time}</div>
                  <div><p className="font-medium text-foreground text-sm">{event.name}</p><p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
