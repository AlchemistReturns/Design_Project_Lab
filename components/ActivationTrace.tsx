"use client";

import { motion } from "framer-motion";
import { scoreToColors } from "@/lib/color";

const container = {
  hidden: {},
  visible: {},
};

const cell = {
  hidden: { scaleY: 0.2, opacity: 0.55 },
  visible: { scaleY: 1, opacity: 1 },
};

export default function ActivationTrace({
  layers,
  revealed,
  highlightLayer,
  height = 22,
  delay = 0,
}: {
  layers: number[];
  revealed: boolean;
  highlightLayer?: number;
  height?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className="flex w-full items-end gap-[2px]"
      style={{ height }}
      initial="hidden"
      animate={revealed ? "visible" : "hidden"}
      variants={container}
      transition={{ staggerChildren: 0.018, delayChildren: delay }}
    >
      {layers.map((v, i) => {
        const layerNum = i + 1;
        const colors = scoreToColors(v);
        const isPeak = highlightLayer === layerNum;
        return (
          <motion.div
            key={layerNum}
            variants={cell}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className={`origin-bottom flex-1 rounded-[1.5px] ${
              isPeak ? "ring-1 ring-indigo-500" : ""
            } ${revealed ? "" : "animate-pulse"}`}
            style={{
              height: "100%",
              backgroundColor: revealed ? colors.border : "#d1d5db",
            }}
            title={`layer ${layerNum}: ${v.toFixed(3)}`}
          />
        );
      })}
    </motion.div>
  );
}
