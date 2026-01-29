import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Calendar, Users, Phone, Mail, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { festivalInfo } from "@/data/festivalData";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  dropdown?: NavItem[];
}

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
      setActiveDropdown(null);
    }
  };

  const navItems: NavItem[] = [
    {
      label: "Home",
      href: "#home",
    },
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Auditions",
      href: "#auditions",
    },
    {
      label: "Events",
      href: "#events",
      dropdown: [
        { label: "All Events", href: "#events" },
        { label: "Other Talents", href: "#events?category=fun" },
        { label: "Creative", href: "#events?category=culture" },
      ],
    },
    {
      label: "Schedule",
      href: "#schedule",
    },
    {
      label: "Team",
      href: "#team",
    },
    {
      label: "DJ Night",
      href: "#dj-night",
    },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.dropdown) {
      setActiveDropdown(activeDropdown === item.label ? null : item.label);
    } else if (item.href.startsWith('/')) {
      // Handle external routes
      window.location.href = item.href;
      setIsOpen(false);
    } else {
      const sectionId = item.href.replace("#", "");
      scrollToSection(sectionId);
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
              onClick={() => scrollToSection('home')}
              style={{ cursor: 'pointer' }}
            >
              <img
                src="/1.png"
                alt="Resonance Festival Logo"
                className="w-16 h-16 object-contain rounded-lg"
              />
              <img
                src="/Council Logo.png"
                alt="Council Logo"
                className="w-16 h-16 object-contain rounded-lg"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-orbitron font-bold gradient-text">RESONANCE</h1>
                <p className="text-xs text-muted-foreground">Festival 2026</p>
              </div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => (
                <div key={item.label} className="relative">
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => handleNavClick(item)}
                        className="flex items-center gap-1 text-foreground hover:text-primary transition-colors font-medium"
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            activeDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <AnimatePresence>
                        {activeDropdown === item.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-48 glass-card rounded-lg border border-border/50 overflow-hidden"
                          >
                            {item.dropdown.map((dropdownItem) => (
                              <button
                                key={dropdownItem.label}
                                onClick={() => {
                                  const sectionId = dropdownItem.href.replace("#", "");
                                  scrollToSection(sectionId);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                              >
                                {dropdownItem.label}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleNavClick(item)}
                      className="text-foreground hover:text-primary transition-colors font-medium"
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Button
                variant="festival"
                size="sm"
                onClick={() => scrollToSection("events")}
              >
                Register Now
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-foreground hover:text-primary transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/95 backdrop-blur-lg"
              onClick={() => setIsOpen(false)}
            />

            {/* Mobile Menu */}
            <div className="relative w-80 h-full bg-background border-r border-border/50 shadow-xl">
              <div className="p-6">
                {/* Mobile Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <img
                      src="/1.png"
                      alt="Resonance Festival Logo"
                      className="w-14 h-14 object-contain rounded-lg"
                    />
                    <img
                      src="/Council Logo.png"
                      alt="Council Logo"
                      className="w-14 h-14 object-contain rounded-lg"
                    />
                    <div>
                      <h1 className="text-lg font-orbitron font-bold gradient-text">RESONANCE</h1>
                      <p className="text-xs text-muted-foreground">Festival 2026</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Mobile Menu Items */}
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      {item.dropdown ? (
                        <div>
                          <button
                            onClick={() => handleNavClick(item)}
                            className="w-full flex items-center justify-between p-3 text-left text-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-lg font-medium"
                          >
                            {item.label}
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                activeDropdown === item.label ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === item.label && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="ml-4 space-y-1 overflow-hidden"
                              >
                                {item.dropdown.map((dropdownItem) => (
                                  <button
                                    key={dropdownItem.label}
                                    onClick={() => {
                                      const sectionId = dropdownItem.href.replace("#", "");
                                      scrollToSection(sectionId);
                                    }}
                                    className="w-full text-left p-2 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded"
                                  >
                                    {dropdownItem.label}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleNavClick(item)}
                          className="w-full p-3 text-left text-foreground hover:bg-primary/10 hover:text-primary transition-colors rounded-lg font-medium"
                        >
                          {item.label}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-8">
                  <Button
                    variant="festival"
                    size="lg"
                    className="w-full"
                    onClick={() => scrollToSection("events")}
                  >
                    Register Now
                  </Button>
                </div>

                {/* Quick Info */}
                <div className="mt-8 p-4 glass-card rounded-lg">
                  <h4 className="font-semibold text-foreground mb-3">Quick Info</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{festivalInfo.dates.start} - {festivalInfo.dates.end}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{festivalInfo.venue.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <span>{festivalInfo.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <span>{festivalInfo.contact.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
