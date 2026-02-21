import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { IconPickerGrid, DynamicIcon } from "./admin/IconPickerGrid";

type StatDraft = { label: string; value: string; icon: string; iconUrl: string };

const DEFAULT_ICON = "Rocket";

const TrustStrip = () => {
  const { stats, setStats, isAdmin } = useAdmin();
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [draft, setDraft] = useState<StatDraft>({ label: "", value: "", icon: DEFAULT_ICON, iconUrl: "" });
  const [addingNew, setAddingNew] = useState(false);
  const [newStat, setNewStat] = useState<StatDraft>({ label: "", value: "", icon: DEFAULT_ICON, iconUrl: "" });

  // Each stat can optionally have icon/iconUrl already stored; fall back gracefully
  const iconOf = (s: { icon?: string }) => s.icon ?? DEFAULT_ICON;
  const iconUrlOf = (s: { iconUrl?: string }) => s.iconUrl ?? "";

  const startEdit = (i: number) => {
    const s = stats[i] as typeof stats[0] & { icon?: string; iconUrl?: string };
    setDraft({ label: s.label, value: s.value, icon: iconOf(s), iconUrl: iconUrlOf(s) });
    setEditingIdx(i);
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    const updated = [...stats];
    updated[editingIdx] = { ...updated[editingIdx], ...draft } as typeof stats[0];
    setStats(updated);
    setEditingIdx(null);
  };

  const deleteStat = (i: number) => setStats(stats.filter((_, idx) => idx !== i));

  const saveNew = () => {
    const s = { label: newStat.label.trim() || "Label", value: newStat.value.trim() || "0", icon: newStat.icon, iconUrl: newStat.iconUrl };
    setStats([...stats, s as typeof stats[0]]);
    setNewStat({ label: "", value: "", icon: DEFAULT_ICON, iconUrl: "" });
    setAddingNew(false);
  };

  return (
    <section className="relative py-12 border-y border-[hsl(var(--glass-border))]">
      <div className="max-w-6xl mx-auto px-6">
        {isAdmin && (
          <p className="text-xs text-center text-primary mb-4 opacity-70">
            Click ✏️ to edit a stat box, 🗑️ to delete, or "+ Add Stat" to create one
          </p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {stats.map((stat, i) => {
              const s = stat as typeof stat & { icon?: string; iconUrl?: string };
              return (
                <motion.div
                  key={`${stat.label}-${i}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  {isAdmin && editingIdx === i ? (
                    /* ── Edit mode ── */
                    <div className="glass-card rounded-xl p-4 border border-primary/40 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">Value</p>
                          <input
                            autoFocus
                            value={draft.value}
                            onChange={(e) => setDraft({ ...draft, value: e.target.value })}
                            placeholder="e.g. 15+"
                            className="w-full bg-muted/60 border border-border rounded-lg px-2 py-1.5 text-sm font-bold text-foreground outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground mb-1">Label</p>
                          <input
                            value={draft.label}
                            onChange={(e) => setDraft({ ...draft, label: e.target.value })}
                            placeholder="e.g. Projects Built"
                            className="w-full bg-muted/60 border border-border rounded-lg px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                          />
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
                        <button onClick={saveEdit} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors">
                          <Check size={12} /> Save
                        </button>
                        <button onClick={() => setEditingIdx(null)} className="flex items-center gap-1 px-3 py-1.5 bg-muted hover:bg-muted/70 text-foreground rounded-lg text-xs font-medium transition-colors">
                          <X size={12} /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── View mode ── */
                    <motion.div
                      className="glass-card rounded-xl px-5 py-4 flex items-center gap-4 glow-soft"
                      whileHover={{
                        y: -4,
                        boxShadow: "0 0 0 1.5px rgba(15, 190, 210, 0.35), 0 12px 36px rgba(15, 190, 210, 0.15), 0 4px 12px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(15, 190, 210, 0.10)",
                      }}
                      whileTap={{ y: -1, scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <DynamicIcon iconName={iconOf(s)} iconUrl={iconUrlOf(s)} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display font-bold text-xl text-foreground">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                      </div>
                      {isAdmin && (
                        <div className="flex flex-col gap-1">
                          <button onClick={() => startEdit(i)} className="w-6 h-6 rounded-md bg-primary/20 hover:bg-primary/40 flex items-center justify-center text-primary transition-colors" title="Edit">
                            <Pencil size={11} />
                          </button>
                          <button onClick={() => deleteStat(i)} className="w-6 h-6 rounded-md bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 transition-colors" title="Delete">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Add new stat */}
        {isAdmin && (
          <div className="mt-6">
            {addingNew ? (
              <div className="glass-card rounded-xl p-4 border border-primary/40 space-y-3 max-w-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Value</p>
                    <input
                      autoFocus
                      value={newStat.value}
                      onChange={(e) => setNewStat({ ...newStat, value: e.target.value })}
                      placeholder="e.g. 5+"
                      className="w-full bg-muted/60 border border-border rounded-lg px-2 py-1.5 text-sm font-bold text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">Label</p>
                    <input
                      value={newStat.label}
                      onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && saveNew()}
                      placeholder="e.g. Awards"
                      className="w-full bg-muted/60 border border-border rounded-lg px-2 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <IconPickerGrid
                  selected={newStat.icon}
                  onSelect={(name) => setNewStat({ ...newStat, icon: name })}
                  showImageUrl={newStat.icon === "custom"}
                  iconUrl={newStat.iconUrl}
                  onIconUrlChange={(url) => setNewStat({ ...newStat, iconUrl: url })}
                />
                <div className="flex gap-2">
                  <button onClick={saveNew} className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors">
                    <Check size={12} /> Add
                  </button>
                  <button onClick={() => { setAddingNew(false); setNewStat({ label: "", value: "", icon: DEFAULT_ICON, iconUrl: "" }); }} className="flex items-center gap-1 px-3 py-1.5 bg-muted hover:bg-muted/70 text-foreground rounded-lg text-xs font-medium transition-colors">
                    <X size={12} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingNew(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 text-primary/60 hover:text-primary text-sm font-medium transition-all"
              >
                <Plus size={14} /> Add Stat
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default TrustStrip;
