import { motion } from "framer-motion";

export default function ShopSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        >
          <div className="h-72 bg-zinc-800" />
          <div className="p-5 space-y-3">
            <div className="h-4 w-3/4 bg-zinc-800 rounded" />
            <div className="h-4 w-1/3 bg-zinc-800 rounded" />
            <div className="h-9 w-full bg-zinc-800 rounded-lg mt-3" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
