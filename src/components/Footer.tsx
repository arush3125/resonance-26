import { motion } from "framer-motion";
import { festivalInfo } from "@/data/festivalData";
import { Mail, Phone, MapPin, Instagram, Youtube, MessageCircle } from "lucide-react";

export const Footer = () => (
  <footer className="py-16 border-t border-border/30 relative">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="md:col-span-2">
          <h3 className="text-3xl font-orbitron font-bold gradient-text mb-4">{festivalInfo.name}</h3>
          <p className="text-muted-foreground mb-6">{festivalInfo.tagline}</p>
          <div className="flex gap-4">
            {[{ icon: Instagram, href: festivalInfo.social.instagram }, { icon: Youtube, href: festivalInfo.social.youtube }, { icon: MessageCircle, href: `https://wa.me/${festivalInfo.contact.whatsapp.replace(/\s/g, "")}` }].map(({ icon: Icon, href }, i) => (
              <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:neon-glow-pink transition-all">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-orbitron font-bold mb-4">Contact Us</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" />{festivalInfo.contact.email}</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-secondary" />{festivalInfo.contact.phone}</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-accent" />{festivalInfo.venue.name}</p>
          </div>
        </div>
        <div>
          <h4 className="font-orbitron font-bold mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm">
            {["About", "Events", "Schedule", "Contact"].map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`} className="block text-muted-foreground hover:text-primary transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
      <div className="pt-8 border-t border-border/30 text-center text-sm text-muted-foreground">
        <p>© 2026 {festivalInfo.name}. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
