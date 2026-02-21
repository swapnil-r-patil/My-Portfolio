import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import EditableText from "./admin/EditableText";
import EditableTextarea from "./admin/EditableTextarea";
import { IconPickerGrid, DynamicIcon } from "./admin/IconPickerGrid";

const AboutSection = () => {
  const { about, setAbout, isAdmin } = useAdmin();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState({ title: "", value: "", icon: "Code2", iconUrl: "" });
  const [addingNew, setAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", value: "", icon: "Star", iconUrl: "" });

  const startEdit = (i: number) => {
    const h = about.highlights[i] as { title: string; value: string; icon?: string; iconUrl?: string };
    setEditingIdx(i);
    setDraft({ title: h.title, value: h.value, icon: h.icon ?? "Code2", iconUrl: h.iconUrl ?? "" });
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    const updated = [...about.highlights] as { title: string; value: string; icon: string; iconUrl: string }[];
    updated[editingIdx] = { ...draft };
    setAbout({ ...about, highlights: updated });
    setEditingIdx(null);
  };

  const deleteHighlight = (i: number) => setAbout({ ...about, highlights: about.highlights.filter((_, idx) => idx !== i) });

  const saveNew = () => {
    const trimmed = { title: newItem.title.trim() || "Title", value: newItem.value.trim() || "Value", icon: newItem.icon, iconUrl: newItem.iconUrl };
    setAbout({ ...about, highlights: [...(about.highlights as typeof trimmed[]), trimmed] });
    setNewItem({ title: "", value: "", icon: "Star", iconUrl: "" });
    setAddingNew(false);
  };

  return (
    <section id="about" className="section-padding relative">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-16">
          <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-3">About Me</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
            <EditableText value={about.heading} onChange={(v) => setAbout({ ...about, heading: v })} as="span" />{" "}
            <EditableText value={about.headingHighlight} onChange={(v) => setAbout({ ...about, headingHighlight: v })} as="span" className="gradient-text" />
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
          {/* Paragraphs */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="md:col-span-3 space-y-5">
            {about.paragraphs.map((para, i) => (
              <EditableTextarea key={i} value={para} rows={4}
                onChange={(v) => { const u = [...about.paragraphs]; u[i] = v; setAbout({ ...about, paragraphs: u }); }}
                className="text-muted-foreground leading-relaxed" />
            ))}
          </motion.div>

          {/* Highlight cards */}
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="md:col-span-2 space-y-3">
            <AnimatePresence>
              {(about.highlights as { title: string; value: string; icon?: string; iconUrl?: string }[]).map((item, i) => (
                <motion.div key={i} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: 0.1 * i }}>
                  {isAdmin && editingIdx === i ? (
                    /* ── Edit mode ── */
                    <div className="glass-card rounded-xl p-4 border border-primary/40 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">Label</p>
                          <input autoFocus value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                            placeholder="e.g. Clean Code"
                            className="w-full bg-muted/60 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary" />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">Value</p>
                          <input value={draft.value} onChange={(e) => setDraft({ ...draft, value: e.target.value })}
                            placeholder="e.g. Always"
                            className="w-full bg-muted/60 border border-border rounded-lg px-3 py-1.5 text-sm font-bold text-foreground outline-none focus:border-primary" />
                        </div>
                      </div>
                      <IconPickerGrid
                        selected={draft.icon}
                        onSelect={(name) => setDraft({ ...draft, icon: name })}
                        showImageUrl={draft.icon === "custom"}
                        iconUrl={draft.iconUrl}
                        onIconUrlChange={(url) => setDraft({ ...draft, iconUrl: url })}
                      />
                      <div className="flex gap-2 pt-1">
                        <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium">
                          <Check size={12} /> Save
                        </button>
                        <button onClick={() => setEditingIdx(null)} className="flex items-center gap-1 px-3 py-1.5 bg-muted hover:bg-muted/70 text-foreground rounded-lg text-xs font-medium">
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── View mode ── */
                    <div className="glass-card-hover rounded-xl p-5 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <DynamicIcon iconName={item.icon} iconUrl={item.iconUrl} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground">{item.title}</p>
                        <p className="font-display font-bold text-foreground">{item.value}</p>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => startEdit(i)} className="w-7 h-7 rounded-lg bg-primary/20 hover:bg-primary/40 flex items-center justify-center text-primary transition-colors" title="Edit">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => deleteHighlight(i)} className="w-7 h-7 rounded-lg bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-colors" title="Delete">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add new */}
            {isAdmin && (
              addingNew ? (
                <div className="glass-card rounded-xl p-4 border border-primary/40 space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">Label</p>
                      <input autoFocus value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                        placeholder="e.g. Performance"
                        className="w-full bg-muted/60 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">Value</p>
                      <input value={newItem.value} onChange={(e) => setNewItem({ ...newItem, value: e.target.value })}
                        onKeyDown={(e) => e.key === "Enter" && saveNew()}
                        placeholder="e.g. Priority"
                        className="w-full bg-muted/60 border border-border rounded-lg px-3 py-1.5 text-sm font-bold text-foreground outline-none focus:border-primary" />
                    </div>
                  </div>
                  <IconPickerGrid
                    selected={newItem.icon}
                    onSelect={(name) => setNewItem({ ...newItem, icon: name })}
                    showImageUrl={newItem.icon === "custom"}
                    iconUrl={newItem.iconUrl}
                    onIconUrlChange={(url) => setNewItem({ ...newItem, iconUrl: url })}
                  />
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveNew} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium">
                      <Check size={12} /> Add
                    </button>
                    <button onClick={() => { setAddingNew(false); setNewItem({ title: "", value: "", icon: "Star", iconUrl: "" }); }} className="flex items-center gap-1 px-3 py-1.5 bg-muted text-foreground rounded-lg text-xs font-medium">
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingNew(true)} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 text-primary/60 hover:text-primary text-sm font-medium transition-all">
                  <Plus size={14} /> Add Box
                </button>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
