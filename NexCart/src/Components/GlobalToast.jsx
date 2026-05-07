import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function GlobalToast() {
    const { showToastVisible, toastMessage } = useCart();

    return (
        <AnimatePresence>
            {showToastVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.25 }}
                    className="
            fixed bottom-6 right-6 z-[9999]
            bg-white/10 backdrop-blur-xl
            border border-white/20
            px-5 py-3 rounded-xl
            text-sm text-white
            shadow-lg
            flex items-center gap-3
          "
                >
                    <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                    {toastMessage}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
