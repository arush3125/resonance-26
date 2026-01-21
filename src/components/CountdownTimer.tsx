import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { festivalInfo } from "@/data/festivalData";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date(festivalInfo.dates.start + "T00:00:00");
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="flex gap-3 md:gap-6 justify-center">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="relative"
        >
          <div className="glass-card p-3 md:p-6 min-w-[70px] md:min-w-[100px] text-center border-gradient rounded-xl">
            <motion.span
              key={unit.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="block text-2xl md:text-5xl font-orbitron font-bold gradient-text"
            >
              {String(unit.value).padStart(2, "0")}
            </motion.span>
            <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-1 block">
              {unit.label}
            </span>
          </div>
          {index < timeUnits.length - 1 && (
            <span className="absolute -right-2 md:-right-4 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-bold text-primary animate-pulse">
              :
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
};
