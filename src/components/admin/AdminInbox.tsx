import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Trash2, RefreshCw, Inbox } from "lucide-react";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Message {
    id: string;
    name: string;
    email: string;
    message: string;
    sentAt: string;
}

interface Props {
    onClose: () => void;
}

const AdminInbox = ({ onClose }: Props) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Message | null>(null);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "contact_messages"), orderBy("sentAt", "desc"));
            const snap = await getDocs(q);
            setMessages(
                snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) }))
            );
        } catch (err) {
            console.error("Failed to fetch messages:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const deleteMessage = async (id: string) => {
        try {
            await deleteDoc(doc(db, "contact_messages", id));
            setMessages((prev) => prev.filter((m) => m.id !== id));
            if (selected?.id === id) setSelected(null);
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                className="glass-card rounded-2xl border border-primary/20 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Inbox size={18} className="text-primary" />
                        <h2 className="font-display font-bold text-lg text-foreground">Contact Messages</h2>
                        <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            {messages.length}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchMessages}
                            title="Refresh"
                            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                        </button>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 overflow-hidden min-h-0">
                    {/* Message list */}
                    <div className="w-80 border-r border-border overflow-y-auto flex-shrink-0">
                        {loading ? (
                            <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                                <RefreshCw size={16} className="animate-spin mr-2" /> Loading…
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm gap-2">
                                <Inbox size={24} className="opacity-30" />
                                No messages yet
                            </div>
                        ) : (
                            messages.map((msg) => (
                                <button
                                    key={msg.id}
                                    onClick={() => setSelected(msg)}
                                    className={`w-full text-left px-4 py-3.5 border-b border-border hover:bg-muted/50 transition-colors group ${selected?.id === msg.id ? "bg-muted/70" : ""}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{msg.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                                            <p className="text-xs text-muted-foreground/70 truncate mt-1">{msg.message}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                            <span className="text-[10px] text-muted-foreground">
                                                {new Date(msg.sentAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                            </span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteMessage(msg.id); }}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Message detail */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {selected ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selected.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-display font-bold text-xl text-foreground">{selected.name}</h3>
                                            <a href={`mailto:${selected.email}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                                                <Mail size={12} /> {selected.email}
                                            </a>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(selected.sentAt).toLocaleString("en-IN", {
                                                    day: "numeric", month: "short", year: "numeric",
                                                    hour: "2-digit", minute: "2-digit"
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border-t border-border pt-4">
                                        <p className="text-foreground/80 text-sm leading-relaxed whitespace-pre-wrap">
                                            {selected.message}
                                        </p>
                                    </div>
                                    <div className="pt-4 flex gap-2">
                                        <a
                                            href={`mailto:${selected.email}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                        >
                                            <Mail size={14} /> Reply via Email
                                        </a>
                                        <button
                                            onClick={() => deleteMessage(selected.id)}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                                <Mail size={32} className="opacity-20" />
                                <p className="text-sm">Select a message to read it</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AdminInbox;
