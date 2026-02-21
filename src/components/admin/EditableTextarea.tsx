import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface Props {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    rows?: number;
}

const EditableTextarea = ({ value, onChange, className = "", rows = 3 }: Props) => {
    const { isAdmin } = useAdmin();
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => { setDraft(value); }, [value]);
    useEffect(() => { if (editing && ref.current) { ref.current.focus(); ref.current.select(); } }, [editing]);

    const save = () => { onChange(draft); setEditing(false); };
    const cancel = () => { setDraft(value); setEditing(false); };

    if (!isAdmin) return <p className={className}>{value}</p>;

    if (editing) {
        return (
            <div className="relative">
                <textarea
                    ref={ref}
                    value={draft}
                    rows={rows}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Escape") cancel(); if (e.key === "Enter" && e.ctrlKey) save(); }}
                    className={`${className} w-full bg-muted/60 border border-primary/50 rounded-lg p-2 outline-none resize-none text-sm`}
                />
                <div className="flex gap-2 mt-1">
                    <button onClick={save} className="flex items-center gap-1 text-xs text-green-400 hover:text-green-300"><Check size={12} /> Save (Ctrl+Enter)</button>
                    <button onClick={cancel} className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"><X size={12} /> Cancel</button>
                </div>
            </div>
        );
    }

    return (
        <p
            className={`${className} cursor-pointer hover:outline-dashed hover:outline-1 hover:outline-primary/50 rounded p-1 -m-1 group/edit relative`}
            onClick={() => setEditing(true)}
            title="Click to edit"
        >
            {value}
            <Pencil size={11} className="inline ml-1 opacity-0 group-hover/edit:opacity-60 text-primary transition-opacity" />
        </p>
    );
};

export default EditableTextarea;
