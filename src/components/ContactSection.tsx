import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Inbox, Loader2, Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAdmin } from "@/context/AdminContext";
import EditableText from "./admin/EditableText";
import AdminInbox from "./admin/AdminInbox";
import { IconPickerGrid, DynamicIcon } from "./admin/IconPickerGrid";
import type { ContactLinkItem } from "@/context/AdminContext";

function hrefFor(item: ContactLinkItem) {
  if (item.type === "email") return `mailto:${item.url}`;
  if (item.type === "phone") return `tel:${item.url}`;
  return item.url;
}

// ── Edit dialog for a single link ──────────────────────────
const ContactLinkEditDialog = ({
  item,
  onSave,
  onClose,
}: {
  item: ContactLinkItem;
  onSave: (updated: ContactLinkItem) => void;
  onClose: () => void;
}) => {
  const [draft, setDraft] = useState<ContactLinkItem>({ iconUrl: "", ...item });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>
        <h3 className="font-display font-bold text-lg mb-4">Edit Social Link</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground mb-1 font-mono">Label</p>
              <input
                autoFocus
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                placeholder="GitHub, LinkedIn..."
                className="w-full bg-muted/60 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1 font-mono">Type (Icon Key)</p>
              <input
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
                placeholder="Github, Mail..."
                className="w-full bg-muted/60 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground mb-1 font-mono">URL / Value</p>
            <input
              value={draft.url}
              onChange={(e) => setDraft({ ...draft, url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-muted/60 border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <IconPickerGrid
            selected={draft.type}
            onSelect={(name) => setDraft({ ...draft, type: name })}
            showImageUrl={draft.type === "custom"}
            iconUrl={draft.iconUrl ?? ""}
            onIconUrlChange={(url) => setDraft({ ...draft, iconUrl: url })}
          />
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={() => { onSave(draft); onClose(); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1"><Check size={14} /> Save</button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────
const ContactSection = () => {
  const { contact, setContact, isAdmin, contactLinks, setContactLinks, showAdminControls } = useAdmin();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [showInbox, setShowInbox] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await addDoc(collection(db, "contact_messages"), {
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
        sentAt: new Date().toISOString(),
      });
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("Failed to send:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  const saveLink = (idx: number, updated: ContactLinkItem) => {
    const next = [...contactLinks];
    next[idx] = updated;
    setContactLinks(next);
    setEditingIdx(null);
  };

  const deleteLink = (idx: number) => setContactLinks(contactLinks.filter((_, i) => i !== idx));

  const addLink = () => {
    const newItem: ContactLinkItem = { type: "Link", label: "New Link", url: "" };
    setContactLinks([...contactLinks, newItem]);
    setEditingIdx(contactLinks.length);
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-3">Contact</p>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
                Let's <span className="gradient-text">connect</span>
              </h2>
              <div className="text-muted-foreground max-w-sm">
                <EditableText value={contact.subtitle} onChange={(v) => setContact({ ...contact, subtitle: v })} as="p" className="text-muted-foreground" />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {isAdmin && (
                <>
                  <button
                    onClick={() => setShowInbox(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-sm font-medium transition-all"
                  >
                    <Inbox size={15} /> Messages
                  </button>
                  <button
                    onClick={addLink}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium transition-all shadow-lg shadow-primary/20"
                  >
                    <Plus size={15} /> Add Social
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 md:gap-10">
          {/* Contact form */}
          <motion.form initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="md:col-span-3 space-y-5">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Name</label>
              <input type="text" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Email</label>
              <input type="email" required maxLength={255} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Message</label>
              <textarea required maxLength={1000} rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" placeholder="Tell me about your project…" />
            </div>
            <button type="submit" disabled={status === "sending"}
              className="magnetic-button inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm glow-primary disabled:opacity-60 transition-opacity">
              {status === "sending" && <><Loader2 size={16} className="animate-spin" />Sending…</>}
              {status === "sent" && <><CheckCircle size={16} />Sent! I'll reply soon.</>}
              {status === "error" && <><Send size={16} />Failed — try again</>}
              {status === "idle" && <><Send size={16} />Send Message</>}
            </button>
          </motion.form>

          {/* Dynamic link boxes */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="md:col-span-2 space-y-4">
            <AnimatePresence>
              {contactLinks.map((link, i) => (
                <motion.div key={i} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <div className="relative group/box">
                    <a href={hrefFor(link)} target={link.type !== "email" && link.type !== "phone" ? "_blank" : undefined}
                      rel="noopener noreferrer" className="glass-card rounded-xl p-5 flex items-center gap-4 block transition-all hover:border-primary/40 hover:bg-primary/5">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <DynamicIcon iconName={link.type} iconUrl={link.iconUrl} size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground">{link.label}</p>
                        <p className="text-sm text-foreground font-medium truncate">{link.url}</p>
                      </div>
                    </a>

                    {/* Admin controls — semi-visible by default for discoverability */}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex gap-1.5 z-[30] opacity-40 group-hover/box:opacity-100 transition-opacity translate-x-1 -translate-y-1">
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingIdx(i); }}
                          className="w-7 h-7 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center text-primary backdrop-blur-sm transition-all shadow-sm border border-primary/20"
                          title="Edit social link"
                        >
                          <Pencil size={11} />
                        </button>
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteLink(i); }}
                          className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 backdrop-blur-sm transition-all shadow-sm border border-red-500/10"
                          title="Delete social link"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Also keep the "Add" button here for better discoverability like other sections */}
            {isAdmin && (
              <button
                onClick={addLink}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-primary/20 hover:border-primary/40 text-primary/40 hover:text-primary transition-all hover:bg-primary/5 text-sm font-medium"
              >
                <Plus size={16} /> Add Social Link
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showInbox && <AdminInbox onClose={() => setShowInbox(false)} />}
        {editingIdx !== null && (
          <ContactLinkEditDialog
            item={contactLinks[editingIdx]}
            onSave={(updated) => {
              saveLink(editingIdx, updated);
              setEditingIdx(null);
            }}
            onClose={() => setEditingIdx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactSection;
