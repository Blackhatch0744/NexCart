import { motion } from "framer-motion";

export default function ProductSkeleton() {
  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 pt-32 pb-20 grid lg:grid-cols-2 gap-12"
      animate={{ opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.2, repeat: Infinity }}
    >
      {/* Image */}
      <div className="h-[420px] rounded-3xl bg-zinc-800" />

      {/* Info */}
      <div className="space-y-6">
        <div className="h-4 w-1/4 bg-zinc-800 rounded" />
        <div className="h-8 w-3/4 bg-zinc-800 rounded" />
        <div className="h-5 w-1/3 bg-zinc-800 rounded" />

        <div className="space-y-2">
          <div className="h-4 w-full bg-zinc-800 rounded" />
          <div className="h-4 w-5/6 bg-zinc-800 rounded" />
        </div>

        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-14 bg-zinc-800 rounded-full" />
          ))}
        </div>

        <div className="h-11 w-full bg-zinc-800 rounded-full" />
      </div>
    </motion.div>
  );
}
