import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Eye, EyeOff } from "lucide-react";
import FirebaseLoginModal from "./FirebaseLoginModal";

interface Props {
    onClose: () => void;
}

const PORTAL_PASSWORD = "swapnilpatil";

const PasswordModal = ({ onClose }: Props) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [shake, setShake] = useState(false);
    const [showFirebase, setShowFirebase] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === PORTAL_PASSWORD) {
            setShowFirebase(true);
        } else {
            setError("Incorrect password");
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setPassword("");
        }
    };

    if (showFirebase) {
        return <FirebaseLoginModal onClose={onClose} />;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, x: shake ? [0, -10, 10, -10, 10, 0] : 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: shake ? 0.4 : 0.2 }}
                className="glass-card rounded-2xl p-8 w-full max-w-sm mx-4 relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X size={18} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔐</span>
                    </div>
                    <h2 className="font-display font-bold text-xl text-foreground">Portal Access</h2>
                    <p className="text-sm text-muted-foreground mt-1">Enter the portal password to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            ref={inputRef}
                            type={showPass ? "text" : "password"}
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(""); }}
                            placeholder="Portal password"
                            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-400 text-sm text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm magnetic-button"
                    >
                        Continue →
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default PasswordModal;
