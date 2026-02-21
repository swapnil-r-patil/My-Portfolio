import { motion } from "framer-motion";
import { Bot, EyeOff } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";

const BotToggle = () => {
    const { isAdmin, showBot, setBotVisibility, showAdminControls } = useAdmin();

    if (!isAdmin || !showAdminControls) return null;

    return (
        <motion.button
            onClick={() => setBotVisibility(!showBot)}
            title={showBot ? "Hide Bot" : "Show Bot"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`fixed right-5 bottom-20 z-[9998] w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${showBot
                    ? "bg-primary text-primary-foreground glow-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
        >
            {showBot ? <Bot size={18} /> : <EyeOff size={18} />}
        </motion.button>
    );
};

export default BotToggle;
