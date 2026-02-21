import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "portfolio_theme";

export function useTheme() {
    const [theme, setThemeState] = useState<"dark" | "light">(() => {
        return (localStorage.getItem(STORAGE_KEY) as "dark" | "light") ?? "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "light") {
            root.classList.add("light");
        } else {
            root.classList.remove("light");
        }
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggle = () => setThemeState((t) => (t === "dark" ? "light" : "dark"));

    return { theme, toggle };
}

interface Props {
    theme: "dark" | "light";
    toggle: () => void;
    className?: string;
}

export default function ThemeToggle({ theme, toggle, className = "" }: Props) {
    const isDark = theme === "dark";

    return (
        <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isDark ? "bg-primary/20 border border-primary/30" : "bg-amber-100 border border-amber-300"
                } ${className}`}
        >
            {/* Track */}
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={`absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${isDark
                        ? "right-0.5 bg-primary"
                        : "left-0.5 bg-amber-400"
                    }`}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isDark ? (
                        <motion.span key="moon" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.15 }}>
                            <Moon size={13} className="text-background" />
                        </motion.span>
                    ) : (
                        <motion.span key="sun" initial={{ scale: 0, rotate: 90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: -90 }} transition={{ duration: 0.15 }}>
                            <Sun size={13} className="text-white" />
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Labels */}
            <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold transition-opacity duration-200 select-none ${isDark ? "opacity-0" : "opacity-60 text-amber-700"}`}>
                L
            </span>
            <span className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold transition-opacity duration-200 select-none ${isDark ? "opacity-60 text-primary" : "opacity-0"}`}>
                D
            </span>
        </button>
    );
}
