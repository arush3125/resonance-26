import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";

export const TeamSection = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Soham Dhanokar",
      role: "OCM Head",
      email: "soham@resonance26.com",
      phone: "+91 93218 95202",
      linkedin: "https://linkedin.com/in/soham-dhanokar",
      image: "/team/9.png"
    },
    
    {
    id: 2,
    name: "Aarya Bhalerao",
    role: "Girls representative",
    email: "aarya@resonance2026.com",
    phone: "+91 90047 83103",
    image: "/team/10.png"
  },
    {
      id: 3,
      name: "Samriti Vishwakarma",
      role: "Cultural Secretary",
      email: "samriti@resonance26.com",
      phone: "+91 98928 62025",
      linkedin: "https://linkedin.com/in/samriti-vishwakarma",
      image: "/team/11.png"
    },
    {
      id: 4,
      name: "Jatin Sharma",
      role: "Cultural Secretary",
      email: "jatin@resonance26.com",
      phone: "+91 92200 49222",
      linkedin: "https://linkedin.com/in/jatin-sharma",
      image: "/team/12.png"
    }
  ];

  return (
    <section id="team" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-orbitron font-black gradient-text mb-4">
            APV COUNCIL
          </h2>
          <p className="text-2xl text-primary font-bold mb-6">2025-26</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Meet the dedicated team behind RESONANCE 26
          </p>
        </motion.div>

        {/* Team Grid - Full Image Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              {/* Full Image Card */}
              <div className="relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Full Image Display */}
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-auto object-cover"
                  />
                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                  
                  {/* Branding Overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="glass-card px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-orbitron font-bold">
                        APV COUNCIL
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="glass-card px-3 py-1 rounded-full">
                      <span className="text-white text-xs font-orbitron font-bold">
                        2025-26
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Overlay on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  {/* Glass Card for Content */}
                  <div className="glass-card p-6 rounded-2xl backdrop-blur-md">
                    {/* Name and Role */}
                    <h3 className="text-2xl lg:text-3xl font-orbitron font-bold text-white mb-2">
                      {member.name}
                    </h3>
                    <p className="text-primary font-semibold text-lg mb-6">{member.role}</p>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/70">Email</p>
                          <a 
                            href={`mailto:${member.email}`}
                            className="text-sm font-medium text-white hover:text-primary transition-colors"
                          >
                            {member.email}
                          </a>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs text-white/70">Phone</p>
                          <a 
                            href={`tel:${member.phone}`}
                            className="text-sm font-medium text-white hover:text-primary transition-colors"
                          >
                            {member.phone}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-8 rounded-3xl max-w-2xl mx-auto">
            <h3 className="text-2xl font-orbitron font-bold text-foreground mb-4">
              Get In Touch
            </h3>
            <p className="text-muted-foreground mb-6">
              Have questions about RESONANCE 26? Reach out to our team for any queries.
            </p>
            <a
              href="mailto:info@resonance26.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Our Team
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
