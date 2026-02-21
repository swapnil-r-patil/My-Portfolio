import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Shield, LogOut, Plus, Trash2, Pencil, Check, Bot, Eye, EyeOff } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import EditableText from "./admin/EditableText";
import ThemeToggle, { useTheme } from "./ThemeToggle";
import EyeFollower from "./EyeFollower";
import type { NavLinkItem } from "@/context/AdminContext";

const Navbar = () => {
  const {
    isAdmin, logout, navbar, setNavbar, navLinks, setNavLinks,
    customSections, setCustomSections, showBot, setBotVisibility,
    showAdminControls, setShowAdminControls
  } = useAdmin();
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [editingLinkIdx, setEditingLinkIdx] = useState<number | null>(null);
  const [linkDraft, setLinkDraft] = useState<NavLinkItem>({ label: "", href: "" });
  const [addingNew, setAddingNew] = useState(false);
  const [newLink, setNewLink] = useState<NavLinkItem>({ label: "", href: "" });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const startEdit = (i: number) => {
    setEditingLinkIdx(i);
    setLinkDraft({ ...navLinks[i] });
  };
  const saveEdit = () => {
    if (editingLinkIdx === null) return;
    const updated = [...navLinks];
    updated[editingLinkIdx] = linkDraft;
    setNavLinks(updated);
    setEditingLinkIdx(null);
  };
  const removeLink = (i: number) => setNavLinks(navLinks.filter((_, idx) => idx !== i));
  const saveNewLink = () => {
    if (newLink.label.trim() && newLink.href.trim()) {
      setNavLinks([...navLinks, { label: newLink.label.trim(), href: newLink.href.trim() }]);
      // Auto-create a matching page section (id = href without the #)
      const sectionId = newLink.href.trim().replace(/^#/, "");
      const alreadyExists = customSections.some((s) => s.id === sectionId);
      if (!alreadyExists) {
        setCustomSections([
          ...customSections,
          { id: sectionId, title: newLink.label.trim(), content: "" },
        ]);
      }
    }
    setNewLink({ label: "", href: "" });
    setAddingNew(false);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const element = document.getElementById(targetId);
      if (element) {
        setMobileOpen(false);
        // Small delay to allow the menu animation to start/finish
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass-card border-b border-[hsl(var(--glass-border))]" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Logo + Eye avatar */}
        <div className="flex items-center gap-2 md:gap-3">
          <a href="#" className="font-display font-bold text-lg tracking-tight text-foreground">
            <EditableText
              value={navbar.logo}
              onChange={(v) => setNavbar({ ...navbar, logo: v })}
              as="span"
              className="font-display font-bold text-lg tracking-tight text-foreground"
            />
          </a>
          {showBot && (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <EyeFollower className="flex" />
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-6 flex-wrap">
          {navLinks.map((link, i) => (
            <div key={i} className="relative group/navlink flex items-center gap-1">
              {isAdmin && editingLinkIdx === i ? (
                /* ── Inline edit mode ── */
                <span className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-2 py-1">
                  <input
                    autoFocus
                    value={linkDraft.label}
                    onChange={(e) => setLinkDraft({ ...linkDraft, label: e.target.value })}
                    placeholder="Label"
                    className="bg-transparent border-b border-primary outline-none w-16 text-sm text-foreground"
                  />
                  <span className="text-muted-foreground text-xs">→</span>
                  <input
                    value={linkDraft.href}
                    onChange={(e) => setLinkDraft({ ...linkDraft, href: e.target.value })}
                    placeholder="#section"
                    className="bg-transparent border-b border-primary outline-none w-20 text-sm text-foreground"
                  />
                  <button onClick={saveEdit} className="text-green-400 hover:text-green-300"><Check size={12} /></button>
                  <button onClick={() => setEditingLinkIdx(null)} className="text-red-400 hover:text-red-300"><X size={12} /></button>
                </span>
              ) : (
                <>
                  <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
                    {link.label}
                  </a>
                  {/* Admin controls — appear on hover */}
                  {isAdmin && (
                    <span className="absolute -top-2 -right-4 hidden group-hover/navlink:flex gap-0.5 z-10">
                      <button onClick={() => startEdit(i)} className="w-4 h-4 rounded-full bg-primary/80 flex items-center justify-center text-white hover:bg-primary"><Pencil size={8} /></button>
                      <button onClick={() => removeLink(i)} className="w-4 h-4 rounded-full bg-red-500/80 flex items-center justify-center text-white hover:bg-red-500"><X size={8} /></button>
                    </span>
                  )}
                </>
              )}
            </div>
          ))}

          {/* Add new link button (admin only) */}
          {isAdmin && (
            addingNew ? (
              <span className="flex items-center gap-1.5 bg-muted/60 rounded-lg px-2 py-1">
                <input
                  autoFocus
                  value={newLink.label}
                  onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                  placeholder="Label"
                  onKeyDown={(e) => e.key === "Enter" && saveNewLink()}
                  className="bg-transparent border-b border-primary outline-none w-16 text-sm text-foreground"
                />
                <span className="text-muted-foreground text-xs">→</span>
                <input
                  value={newLink.href}
                  onChange={(e) => setNewLink({ ...newLink, href: e.target.value })}
                  placeholder="#section"
                  onKeyDown={(e) => e.key === "Enter" && saveNewLink()}
                  className="bg-transparent border-b border-primary outline-none w-20 text-sm text-foreground"
                />
                <button onClick={saveNewLink} className="text-green-400 hover:text-green-300"><Check size={12} /></button>
                <button onClick={() => { setAddingNew(false); setNewLink({ label: "", href: "" }); }} className="text-red-400 hover:text-red-300"><X size={12} /></button>
              </span>
            ) : (
              <button
                onClick={() => setAddingNew(true)}
                className="flex items-center gap-1 text-xs text-primary/60 hover:text-primary border border-dashed border-primary/30 hover:border-primary/60 rounded-lg px-2 py-1 transition-all"
              >
                <Plus size={10} /> Add Link
              </button>
            )
          )}

          {/* Bot visibility toggle (Admin only) */}
          {isAdmin && (
            <div className="flex items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/40">
              <button
                onClick={() => setBotVisibility(!showBot)}
                className={`p-1.5 rounded-lg transition-all duration-300 ${showBot ? "bg-primary/20 text-primary" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
                title={showBot ? "Hide Robot" : "Show Robot"}
              >
                <Bot size={15} />
              </button>
              <button
                onClick={() => setShowAdminControls(!showAdminControls)}
                className={`p-1.5 rounded-lg transition-all duration-300 ${showAdminControls ? "bg-primary/20 text-primary" : "bg-transparent text-muted-foreground hover:bg-muted"}`}
                title={showAdminControls ? "Hide Controls" : "Show Controls"}
              >
                {showAdminControls ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          )}

          {/* Theme toggle */}
          <ThemeToggle theme={theme} toggle={toggle} />

          {/* Admin badge + Logout */}
          {isAdmin ? (
            <div className="flex items-center gap-2 ml-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-medium"
              >
                <Shield size={11} /> Admin
              </motion.div>
              <button
                onClick={logout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium transition-colors"
              >
                <LogOut size={11} /> Logout
              </button>
            </div>
          ) : (
            <a href="#contact" className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium magnetic-button ml-2">
              Let's Talk
            </a>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-[hsl(var(--glass-border))]"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link, i) => (
                <div key={i} className="flex items-center justify-between">
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-sm text-muted-foreground hover:text-foreground py-1"
                  >
                    {link.label}
                  </a>
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button onClick={(e) => { e.preventDefault(); startEdit(i); }} className="text-primary/60 hover:text-primary"><Pencil size={12} /></button>
                      <button onClick={(e) => { e.preventDefault(); removeLink(i); }} className="text-red-400/60 hover:text-red-400"><Trash2 size={12} /></button>
                    </div>
                  )}
                </div>
              ))}
              {isAdmin && (
                <button onClick={() => { setAddingNew(true); setMobileOpen(false); }} className="flex items-center gap-1 text-xs text-primary py-1 mb-2">
                  <Plus size={12} /> Add nav link
                </button>
              )}

              {/* Mobile theme toggle */}
              <div className="flex items-center justify-between py-2 border-t border-border/40">
                <span className="text-sm text-muted-foreground font-medium">Appearance</span>
                <ThemeToggle theme={theme} toggle={toggle} />
              </div>
              {isAdmin && (
                <button
                  onClick={() => setBotVisibility(!showBot)}
                  className={`flex items-center gap-2 text-sm py-1 transition-colors ${showBot ? "text-primary" : "text-muted-foreground"}`}
                >
                  <Bot size={14} /> {showBot ? "Hide Robot" : "Show Robot"}
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setShowAdminControls(!showAdminControls)}
                  className={`flex items-center gap-2 text-sm py-1 transition-colors ${showAdminControls ? "text-primary" : "text-muted-foreground"}`}
                >
                  {showAdminControls ? <Eye size={14} /> : <EyeOff size={14} />} {showAdminControls ? "Hide Controls" : "Show Controls"}
                </button>
              )}
              {isAdmin && (
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-2 text-sm text-red-400 py-1">
                  <LogOut size={14} /> Logout Admin
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
