import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Users } from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Soham Dhanokar",
    role: "OCM Head",
    email: "soham@resonance2026.com",
    phone: "+91 93218 95202",
    image: "/team/9.png"
  },
  {
    id: 2,
    name: "Sara Pathak",
    role: "Sports Secretary",
    email: "sara@resonance2026.com",
    phone: "+91 89280 05205",
    image: "/team/10.png"
  },
  {
    id: 3,
    name: "Parth Naukudkar",
    role: "Technical Secretary",
    email: "parth@resonance2026.com",
    phone: "+91 88281 67334",
    image: "/team/11.png"
  },
  {
    id: 4,
    name: "Swara Hande",
    role: "Marketing Lead",
    email: "swara@resonance2026.com",
    phone: "+91 93724 72223",
    image: "/team/12.png"
  }
];

export const ContactSection = () => {
  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Users className="w-12 h-12 mx-auto text-highlight mb-4" />
          <h2 className="text-4xl md:text-6xl font-orbitron font-black gradient-text mb-6">
            Contact Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our event management team for any queries about RESONANCE 26
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="glass-card p-6 rounded-2xl border-gradient hover:scale-105 transition-all duration-300 h-full">
                <div className="relative mb-4 overflow-hidden rounded-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-4">{member.role}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>{member.phone}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-card p-8 rounded-2xl border-gradient max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="text-2xl font-bold text-white">Event Location</h3>
            </div>
            <p className="text-lg text-muted-foreground mb-2">
              Agnel Polytechnic Campus
            </p>
            <p className="text-muted-foreground">
              Vashi, Navi Mumbai - 400703
            </p>
            <div className="mt-6 flex justify-center">
              <a 
                href="mailto:info@resonance26.com"
                className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
              >
                Email Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
