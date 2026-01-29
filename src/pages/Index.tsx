import { HeroSection } from "@/components/HeroSection";
import { Navigation } from "@/components/Navigation";
import { AboutSection } from "@/components/AboutSection";
import { AuditionSection } from "@/components/AuditionSection";
import { EventsSection } from "@/components/EventsSection";
import { ScheduleSection } from "@/components/ScheduleSection";
import { DJNightSection } from "@/components/DJNightSection";
import { TeamSection } from "@/components/TeamSection";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <AuditionSection />
      <EventsSection />
      <ScheduleSection />
      <DJNightSection />
      <TeamSection />
      {/* <ContactSection /> */}
      <Footer />
    </div>
  );
};

export default Index;
