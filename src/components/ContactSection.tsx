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

// ── Inline editor for a single link box ──────────────────────────
interface EditBoxProps {
  item: ContactLinkItem;
  onSave: (updated: ContactLinkItem) => void;
  onCancel: () => void;
}
const EditBox = ({ item, onSave, onCancel }: EditBoxProps) => {
  const [draft, setDraft] = useState<ContactLinkItem>({ iconUrl: "", ...item });
  return (
    <div className="glass-card rounded-xl p-4 border border-primary/40 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">Label</p>
          <input
            autoFocus
            value={draft.label}
            onChange={(e) => setDraft({ ...draft, label: e.target.value })}
            placeholder="e.g. GitHub"
            className="w-full bg-muted/60 border border-border rounded-lg px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">URL / Value</p>
          <input
            value={draft.url}
            onChange={(e) => setDraft({ ...draft, url: e.target.value })}
            placeholder="https://… or email@…"
            className="w-full bg-muted/60 border border-border rounded-lg px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
      </div>
      {/* Icon picker — uses 'type' as icon name key */}
      <IconPickerGrid
        selected={draft.type}
        onSelect={(name) => setDraft({ ...draft, type: name })}
        showImageUrl={draft.type === "custom"}
        iconUrl={draft.iconUrl ?? ""}
        onIconUrlChange={(url) => setDraft({ ...draft, iconUrl: url })}
      />
      <div className="flex gap-2 pt-1">
        <button onClick={() => onSave(draft)} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium">
          <Check size={12} /> Save
        </button>
        <button onClick={onCancel} className="flex items-center gap-1 px-3 py-1.5 bg-muted hover:bg-muted/70 text-foreground rounded-lg text-xs font-medium">
          <X size={12} /> Cancel
        </button>
      </div>
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
  const [addingNew, setAddingNew] = useState(false);

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

  const addLink = (item: ContactLinkItem) => {
    setContactLinks([...contactLinks, item]);
    setAddingNew(false);
  };

  return (
    <section id="contact" className="section-padding relative">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
          <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-3">Contact</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
            Let's <span className="gradient-text">connect</span>
          </h2>
          <div className="text-muted-foreground max-w-md mx-auto">
            <EditableText value={contact.subtitle} onChange={(v) => setContact({ ...contact, subtitle: v })} as="p" className="text-muted-foreground" />
          </div>
          {isAdmin && showAdminControls && (
            <motion.button
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setShowInbox(true)}
              className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-sm font-medium transition-all"
            >
              <Inbox size={15} /> See Messages
            </motion.button>
          )}
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
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="md:col-span-2 space-y-3">
            {isAdmin && showAdminControls && <p className="text-xs text-primary opacity-70">Hover a box to edit or delete it</p>}

            <AnimatePresence>
              {contactLinks.map((link, i) => (
                <motion.div key={i} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
                  {isAdmin && showAdminControls && editingIdx === i ? (
                    <EditBox item={link} onSave={(u) => saveLink(i, u)} onCancel={() => setEditingIdx(null)} />
                  ) : (
                    <div className="relative group/box">
                      <a href={hrefFor(link)} target={link.type !== "email" && link.type !== "phone" ? "_blank" : undefined}
                        rel="noopener noreferrer" className="glass-card-hover rounded-xl p-5 flex items-center gap-4 block">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <DynamicIcon iconName={link.type} iconUrl={link.iconUrl} size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-muted-foreground">{link.label}</p>
                          <p className="text-sm text-foreground font-medium truncate">{link.url}</p>
                        </div>
                        {/* Admin controls — always visible when admin is active */}
                        {isAdmin && showAdminControls && (
                          <div className="flex gap-1.5 flex-shrink-0">
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingIdx(i); }}
                              className="w-7 h-7 rounded-lg bg-primary/20 hover:bg-primary/40 flex items-center justify-center text-primary transition-colors"
                              title="Edit"
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteLink(i); }}
                              className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </a>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add new link box */}
            {isAdmin && showAdminControls && (
              addingNew ? (
                <EditBox
                  item={{ type: "other", label: "", url: "" }}
                  onSave={addLink}
                  onCancel={() => setAddingNew(false)}
                />
              ) : (
                <button onClick={() => setAddingNew(true)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 text-primary/60 hover:text-primary text-sm font-medium transition-all">
                  <Plus size={14} /> Add Link Box
                </button>
              )
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showInbox && <AdminInbox onClose={() => setShowInbox(false)} />}
      </AnimatePresence>
    </section>
  );
};

export default ContactSection;
