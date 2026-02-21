import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import type { CustomSection } from "@/context/AdminContext";

const CustomSections = () => {
    const { isAdmin, customSections, setCustomSections, showAdminControls } = useAdmin();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [draft, setDraft] = useState<CustomSection>({ id: "", title: "", content: "" });

    if (customSections.length === 0) return null;

    const startEdit = (sec: CustomSection) => {
        setEditingId(sec.id);
        setDraft({ ...sec });
    };

    const saveEdit = () => {
        setCustomSections(customSections.map((s) => (s.id === editingId ? draft : s)));
        setEditingId(null);
    };

    const deleteSection = (id: string) => {
        setCustomSections(customSections.filter((s) => s.id !== id));
    };

    return (
        <>
            {customSections.map((sec) => (
                <section key={sec.id} id={sec.id} className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        {isAdmin && showAdminControls && editingId === sec.id ? (
                            /* ── Edit mode ── */
                            <div className="glass-card rounded-2xl p-8 border border-primary/30 space-y-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground font-mono">Section Title</span>
                                    <input
                                        autoFocus
                                        value={draft.title}
                                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                                        className="flex-1 bg-muted/40 border border-primary/30 rounded-lg px-3 py-1.5 text-xl font-display font-bold text-foreground outline-none focus:border-primary"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-muted-foreground font-mono">Content</span>
                                    <textarea
                                        value={draft.content}
                                        onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                                        rows={6}
                                        className="bg-muted/40 border border-primary/30 rounded-lg px-3 py-2 text-foreground/80 text-sm leading-relaxed outline-none focus:border-primary resize-y"
                                        placeholder="Write your section content here..."
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={saveEdit}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <Check size={14} /> Save Section
                                    </button>
                                    <button
                                        onClick={() => setEditingId(null)}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-muted hover:bg-muted/70 text-foreground rounded-lg text-sm font-medium transition-colors"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* ── View mode ── */
                            <div className={`relative group/sec ${isAdmin ? "glass-card rounded-2xl p-8 border border-dashed border-primary/20 hover:border-primary/40 transition-colors" : ""}`}>
                                {/* Admin overlay controls */}
                                {isAdmin && showAdminControls && (
                                    <div className="absolute top-4 right-4 hidden group-hover/sec:flex gap-2 z-10">
                                        <button
                                            onClick={() => startEdit(sec)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-primary/80 hover:bg-primary text-white rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <Pencil size={11} /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteSection(sec.id)}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-lg text-xs font-medium transition-colors"
                                        >
                                            <Trash2 size={11} /> Delete
                                        </button>
                                    </div>
                                )}

                                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                                    {sec.title}
                                </h2>

                                {sec.content ? (
                                    <div className="text-foreground/70 text-base leading-relaxed whitespace-pre-wrap">
                                        {sec.content}
                                    </div>
                                ) : (
                                    <div className="text-muted-foreground/40 italic text-sm">
                                        {isAdmin ? "Hover and click Edit to add content to this section." : ""}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </section>
            ))}
        </>
    );
};

export default CustomSections;
