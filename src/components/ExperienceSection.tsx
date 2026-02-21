import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Calendar, Plus, Trash2, Pencil, X, Check } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { ExperienceItem } from "@/context/AdminContext";

const ExperienceEditDialog = ({
  exp,
  onSave,
  onClose,
}: {
  exp: ExperienceItem;
  onSave: (e: ExperienceItem) => void;
  onClose: () => void;
}) => {
  const [draft, setDraft] = useState({ ...exp });
  const [hlInput, setHlInput] = useState("");

  const addHighlight = () => {
    if (hlInput.trim()) { setDraft({ ...draft, highlights: [...draft.highlights, hlInput.trim()] }); setHlInput(""); }
  };
  const removeHighlight = (i: number) => setDraft({ ...draft, highlights: draft.highlights.filter((_, idx) => idx !== i) });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>
        <h3 className="font-display font-bold text-lg mb-4">Edit Experience</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Role / Title</label>
            <input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Company</label>
            <input value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Period (e.g. 2024 or Jan–Jun 2024)</label>
            <input value={draft.period} onChange={(e) => setDraft({ ...draft, period: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <textarea value={draft.description} rows={3} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Highlights / Tags</label>
            <div className="flex flex-wrap gap-2 mt-1 mb-2">
              {draft.highlights.map((h, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
                  {h} <button onClick={() => removeHighlight(i)}><X size={10} /></button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={hlInput} onChange={(e) => setHlInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHighlight())} placeholder="Add tag..." className="flex-1 px-3 py-1.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              <button onClick={addHighlight} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20"><Plus size={14} /></button>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground">Cancel</button>
          <button onClick={() => { onSave(draft); onClose(); }} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center gap-1"><Check size={14} /> Save</button>
        </div>
      </motion.div>
    </div>
  );
};

const ExperienceSection = () => {
  const { experiences, setExperiences, isAdmin } = useAdmin();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const save = (exp: ExperienceItem, idx: number) => {
    const list = [...experiences];
    list[idx] = exp;
    setExperiences(list);
  };

  const remove = (idx: number) => setExperiences(experiences.filter((_, i) => i !== idx));

  const add = () => {
    const newExp: ExperienceItem = { role: "New Role", company: "Company", period: "2024", description: "Description...", highlights: [] };
    setExperiences([...experiences, newExp]);
    setEditingIdx(experiences.length);
  };

  return (
    <section id="experience" className="section-padding relative">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 flex items-end justify-between">
          <div>
            <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-3">Experience</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Professional{" "}<span className="gradient-text">journey</span>
            </h2>
          </div>
          {isAdmin && (
            <button onClick={add} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-sm">
              <Plus size={14} /> Add
            </button>
          )}
        </motion.div>

        <div className="space-y-6">
          {experiences.map((exp, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }} className="glass-card rounded-2xl p-5 md:p-8 relative group/exp">
              {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover/exp:opacity-100 transition-opacity">
                  <button onClick={() => setEditingIdx(i)} className="w-7 h-7 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center text-primary"><Pencil size={12} /></button>
                  <button onClick={() => remove(i)} className="w-7 h-7 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400"><Trash2 size={12} /></button>
                </div>
              )}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">{exp.role}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Calendar size={14} />{exp.period}
                </div>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{exp.description}</p>
              <div className="flex flex-wrap gap-2">
                {exp.highlights.map((h) => (
                  <span key={h} className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">{h}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {editingIdx !== null && (
          <ExperienceEditDialog
            exp={experiences[editingIdx]}
            onSave={(e) => save(e, editingIdx)}
            onClose={() => setEditingIdx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ExperienceSection;
