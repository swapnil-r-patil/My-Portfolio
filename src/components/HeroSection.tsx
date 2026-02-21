import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import EditableText from "./admin/EditableText";
import EditableTextarea from "./admin/EditableTextarea";
import EditableList from "./admin/EditableList";

const Particles = () => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/20"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  const { hero, setHero, isAdmin } = useAdmin();
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const typeSpeed = 60;
  const deleteSpeed = 30;
  const pauseDuration = 2000;

  const tick = useCallback(() => {
    const currentRole = hero.roles[roleIndex];
    if (!currentRole) return;
    if (!isDeleting) {
      setDisplayText(currentRole.substring(0, displayText.length + 1));
      if (displayText.length === currentRole.length) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      setDisplayText(currentRole.substring(0, displayText.length - 1));
      if (displayText.length === 0) {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % hero.roles.length);
        return;
      }
    }
  }, [displayText, isDeleting, roleIndex, hero.roles]);

  // Typing animation — paused when in admin mode to prevent interference
  useEffect(() => {
    if (isAdmin) return;
    const timer = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, isAdmin]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
      {/* Gradient mesh background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      {/* Grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

      <Particles />

      {/* Floating glass cards */}
      <motion.div className="absolute top-[20%] right-[10%] w-48 h-32 glass-card rounded-2xl hidden lg:block" animate={{ y: [0, -15, 0], rotate: [3, 5, 3] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}>
        <div className="p-4 text-xs text-muted-foreground">
          <div className="w-8 h-1 bg-primary rounded mb-3" />
          <div className="w-full h-1 bg-muted rounded mb-2" />
          <div className="w-3/4 h-1 bg-muted rounded mb-2" />
          <div className="w-1/2 h-1 bg-muted rounded" />
        </div>
      </motion.div>
      <motion.div className="absolute bottom-[25%] left-[8%] w-40 h-28 glass-card rounded-2xl hidden lg:block" animate={{ y: [0, 12, 0], rotate: [-2, -4, -2] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-success" />
          </div>
          <div>
            <div className="w-16 h-1 bg-muted rounded mb-2" />
            <div className="w-10 h-1 bg-muted-foreground/30 rounded" />
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-muted-foreground text-sm md:text-base tracking-[0.3em] uppercase mb-6">
          <EditableText value={hero.greeting} onChange={(v) => setHero({ ...hero, greeting: v })} className="tracking-[0.3em]" />
        </motion.p>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="font-display font-900 text-5xl md:text-7xl lg:text-8xl tracking-tight mb-4">
          <EditableText value={hero.name} onChange={(v) => setHero({ ...hero, name: v })} as="span" className="font-display font-900" />{" "}
          <EditableText value={hero.lastName} onChange={(v) => setHero({ ...hero, lastName: v })} as="span" className="gradient-text font-display font-900" />
        </motion.h1>

        {/* Rotating roles — show editor in admin mode, animation in normal mode */}
        {isAdmin ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-4 rounded-xl border border-dashed border-primary/30">
            <p className="text-xs text-primary mb-3 opacity-70">✏️ Rotating roles (hover to edit/delete):</p>
            <EditableList
              items={hero.roles}
              onChange={(roles) => setHero({ ...hero, roles })}
              itemClassName="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
              label="role"
            />
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }} className="h-8 md:h-10 mb-8 flex items-center justify-center">
            <span className="text-primary font-medium text-lg md:text-xl font-display">{displayText}</span>
            <span className="inline-block w-0.5 h-6 ml-1 bg-primary animate-typing-cursor" />
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.6 }} className="max-w-2xl mx-auto mb-12">
          <EditableTextarea
            value={hero.tagline}
            onChange={(v) => setHero({ ...hero, tagline: v })}
            className="text-muted-foreground text-base md:text-lg leading-relaxed"
            rows={3}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#projects" className="group magnetic-button inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-primary">
            View My Work
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#contact" className="magnetic-button inline-flex items-center gap-2 px-8 py-3.5 rounded-xl glass-card text-foreground font-semibold text-sm hover:bg-[hsl(var(--glass-hover))]">
            <Mail size={16} />
            Contact Me
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-5 h-8 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
