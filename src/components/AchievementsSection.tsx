import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Award, BookOpen, Medal, Plus, Trash2, Pencil, X, Check } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { AchievementItem } from "@/context/AdminContext";

const iconOptions = [Award, Trophy, BookOpen, Medal];

const AchievementEditDialog = ({
  item,
  onSave,
  onClose,
}: {
  item: AchievementItem;
  onSave: (a: AchievementItem) => void;
  onClose: () => void;
}) => {
  const [draft, setDraft] = useState({ ...item });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card rounded-2xl p-6 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={18} /></button>
        <h3 className="font-display font-bold text-lg mb-4">Edit Achievement</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground">Title</label>
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Description</label>
            <textarea value={draft.description} rows={3} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Year</label>
            <input value={draft.year} onChange={(e) => setDraft({ ...draft, year: e.target.value })} className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm mt-1 focus:outline-none focus:ring-2 focus:ring-primary/50" />
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

const AchievementsSection = () => {
  const { achievements, setAchievements, isAdmin, showAdminControls } = useAdmin();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);

  const save = (item: AchievementItem, idx: number) => {
    const list = [...achievements];
    list[idx] = item;
    setAchievements(list);
  };

  const remove = (idx: number) => setAchievements(achievements.filter((_, i) => i !== idx));

  const add = () => {
    const newItem: AchievementItem = { title: "New Achievement", description: "Description...", year: new Date().getFullYear().toString() };
    setAchievements([...achievements, newItem]);
    setEditingIdx(achievements.length);
  };

  return (
    <section id="achievements" className="section-padding relative">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 flex items-end justify-between">
          <div>
            <p className="text-primary text-sm font-medium tracking-[0.2em] uppercase mb-3">Achievements</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground">
              Milestones &{" "}<span className="gradient-text">recognition</span>
            </h2>
          </div>
          {isAdmin && showAdminControls && (
            <button onClick={add} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-sm">
              <Plus size={14} /> Add
            </button>
          )}
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-secondary/30 to-transparent" />
          <div className="space-y-8">
            {achievements.map((item, i) => {
              const Icon = iconOptions[i % iconOptions.length];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="relative pl-16 md:pl-20 group/item"
                >
                  <div className="absolute left-3.5 md:left-5.5 top-1 w-5 h-5 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  <motion.div
                    className="glass-card rounded-xl p-5 cursor-default"
                    whileHover={{
                      y: -4,
                      boxShadow: "0 0 0 1.5px rgba(15, 190, 210, 0.35), 0 12px 40px rgba(15, 190, 210, 0.16), 0 4px 16px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(15, 190, 210, 0.10)",
                    }}
                    whileTap={{ y: -1, scale: 0.99 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-display font-semibold text-foreground">{item.title}</h3>
                          <span className="text-xs text-primary font-medium px-2 py-0.5 rounded-full bg-primary/10">{item.year}</span>
                          {isAdmin && showAdminControls && (
                            <div className="ml-auto flex gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              <button onClick={() => setEditingIdx(i)} className="w-6 h-6 rounded-full bg-primary/20 hover:bg-primary/40 flex items-center justify-center text-primary"><Pencil size={10} /></button>
                              <button onClick={() => remove(i)} className="w-6 h-6 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400"><Trash2 size={10} /></button>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

              );
            })}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editingIdx !== null && (
          <AchievementEditDialog
            item={achievements[editingIdx]}
            onSave={(a) => save(a, editingIdx)}
            onClose={() => setEditingIdx(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default AchievementsSection;
