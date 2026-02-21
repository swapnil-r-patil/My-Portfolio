import { useState } from "react";
import { motion } from "framer-motion";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

interface Props {
    onClose: () => void;
}

const FirebaseLoginModal = ({ onClose }: Props) => {
    const { loginWithFirebase } = useAdmin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await loginWithFirebase(email, password);
            onClose();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Login failed";
            if (msg.includes("invalid-credential") || msg.includes("wrong-password") || msg.includes("user-not-found")) {
                setError("Invalid email or password.");
            } else if (msg.includes("too-many-requests")) {
                setError("Too many attempts. Try again later.");
            } else {
                setError("Login failed. Check your Firebase config.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
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
                        <span className="text-2xl">🛡️</span>
                    </div>
                    <h2 className="font-display font-bold text-xl text-foreground">Admin Verification</h2>
                    <p className="text-sm text-muted-foreground mt-1">Sign in with your admin account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-muted-foreground mb-1.5">Email</label>
                        <input
                            type="email"
                            required
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-muted-foreground mb-1.5">Password</label>
                        <div className="relative">
                            <input
                                type={showPass ? "text" : "password"}
                                required
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
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
                        disabled={loading}
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm magnetic-button flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : null}
                        {loading ? "Signing in..." : "Sign In as Admin"}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default FirebaseLoginModal;
