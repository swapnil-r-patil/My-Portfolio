import { useState } from "react";
import { Plus, X, Pencil, Check } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    items: string[];
    onChange: (items: string[]) => void;
    itemClassName?: string;
    label?: string;
}

const EditableList = ({ items, onChange, itemClassName = "", label = "item" }: Props) => {
    const { isAdmin } = useAdmin();
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [draft, setDraft] = useState("");
    const [newItem, setNewItem] = useState("");
    const [addingNew, setAddingNew] = useState(false);

    const startEdit = (i: number) => { setEditingIdx(i); setDraft(items[i]); };
    const saveEdit = () => {
        if (editingIdx === null) return;
        const updated = [...items];
        updated[editingIdx] = draft;
        onChange(updated);
        setEditingIdx(null);
    };
    const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
    const addItem = () => {
        if (newItem.trim()) { onChange([...items, newItem.trim()]); setNewItem(""); }
        setAddingNew(false);
    };

    return (
        <div className="flex flex-wrap gap-2.5">
            <AnimatePresence>
                {items.map((item, i) => (
                    <motion.span
                        key={`${item}-${i}`}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`${itemClassName} relative group/tag`}
                    >
                        {isAdmin && editingIdx === i ? (
                            <span className="inline-flex items-center gap-1">
                                <input
                                    autoFocus
                                    value={draft}
                                    onChange={(e) => setDraft(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") setEditingIdx(null); }}
                                    className="bg-transparent border-b border-primary outline-none w-24 text-sm"
                                />
                                <button onClick={saveEdit} className="text-green-400"><Check size={12} /></button>
                                <button onClick={() => setEditingIdx(null)} className="text-red-400"><X size={12} /></button>
                            </span>
                        ) : (
                            <>
                                {item}
                                {isAdmin && (
                                    <span className="absolute -top-1.5 -right-1.5 hidden group-hover/tag:flex gap-0.5">
                                        <button onClick={() => startEdit(i)} className="w-4 h-4 rounded-full bg-primary text-white flex items-center justify-center">
                                            <Pencil size={8} />
                                        </button>
                                        <button onClick={() => remove(i)} className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center">
                                            <X size={8} />
                                        </button>
                                    </span>
                                )}
                            </>
                        )}
                    </motion.span>
                ))}
            </AnimatePresence>

            {isAdmin && (
                addingNew ? (
                    <span className="inline-flex items-center gap-1">
                        <input
                            autoFocus
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") addItem(); if (e.key === "Escape") { setAddingNew(false); setNewItem(""); } }}
                            placeholder={`New ${label}...`}
                            className="bg-transparent border-b border-primary outline-none w-28 text-sm"
                        />
                        <button onClick={addItem} className="text-green-400"><Check size={12} /></button>
                        <button onClick={() => { setAddingNew(false); setNewItem(""); }} className="text-red-400"><X size={12} /></button>
                    </span>
                ) : (
                    <button
                        onClick={() => setAddingNew(true)}
                        className="px-2 py-1 rounded-lg border border-dashed border-primary/40 text-primary/60 hover:border-primary hover:text-primary text-xs flex items-center gap-1"
                    >
                        <Plus size={10} /> Add
                    </button>
                )
            )}
        </div>
    );
};

export default EditableList;
