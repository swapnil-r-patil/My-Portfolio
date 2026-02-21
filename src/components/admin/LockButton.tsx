import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import PasswordModal from "./PasswordModal";

const LockButton = () => {
    const { isAdmin, logout } = useAdmin();
    const [showPassword, setShowPassword] = useState(false);

    // Secret keyboard shortcut: Ctrl + Shift + L  → opens admin login
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") {
                e.preventDefault();
                if (!isAdmin) setShowPassword(true);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isAdmin]);

    return (
        <>
            {/* Only show a subtle logout button when admin is active.
                Completely invisible + unclickable when not logged in. */}
            {isAdmin && (
                <motion.button
                    onClick={logout}
                    title="Exit Admin Mode"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed bottom-5 right-5 z-[9999] w-9 h-9 rounded-full flex items-center justify-center bg-green-500 hover:bg-red-500 shadow-md transition-colors duration-200 glow-primary"
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.93 }}
                >
                    <Shield size={14} className="text-white" />
                </motion.button>
            )}

            <AnimatePresence>
                {showPassword && (
                    <PasswordModal onClose={() => setShowPassword(false)} />
                )}
            </AnimatePresence>
        </>
    );
};

export default LockButton;
