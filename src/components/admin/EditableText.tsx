import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface Props {
    value: string;
    onChange: (val: string) => void;
    className?: string;
    as?: "span" | "p" | "h1" | "h2" | "h3";
    placeholder?: string;
}

const EditableText = ({ value, onChange, className = "", as: Tag = "span", placeholder = "Click to edit" }: Props) => {
    const { isAdmin } = useAdmin();
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => { setDraft(value); }, [value]);
    useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

    const save = () => { onChange(draft); setEditing(false); };
    const cancel = () => { setDraft(value); setEditing(false); };

    if (!isAdmin) return <Tag className={className}>{value}</Tag>;

    if (editing) {
        return (
            <span className="inline-flex items-center gap-1 group">
                <input
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") cancel(); }}
                    className={`${className} bg-transparent border-b-2 border-primary outline-none min-w-[60px]`}
                    placeholder={placeholder}
                />
                <button onClick={save} className="text-green-400 hover:text-green-300 shrink-0"><Check size={14} /></button>
                <button onClick={cancel} className="text-red-400 hover:text-red-300 shrink-0"><X size={14} /></button>
            </span>
        );
    }

    return (
        <Tag
            className={`${className} group/edit relative cursor-pointer hover:outline-dashed hover:outline-1 hover:outline-primary/50 rounded px-0.5`}
            onClick={() => setEditing(true)}
            title="Click to edit"
        >
            {value}
            <Pencil size={11} className="inline ml-1 opacity-0 group-hover/edit:opacity-60 text-primary transition-opacity" />
        </Tag>
    );
};

export default EditableText;
