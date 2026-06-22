import React from 'react';
import { motion } from 'motion/react';

export default function BlobBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20 bg-slate-50 dark:bg-[#030303]">
      {/* Geometric theme glowing radial gradients */}
      <div className="absolute top-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#06b6d4]/[0.05] dark:bg-[#06b6d4]/[0.03] blur-[150px]" />
      <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-[#a855f7]/[0.05] dark:bg-[#a855f7]/[0.03] blur-[130px]" />
      
      {/* Solid translucent base backdrop */}
      <div className="absolute inset-0 bg-slate-100/10 dark:bg-neutral-950/20" />

      {/* Grid Pattern overlays in exact geometric balance */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_50%,#000_65%,transparent_100%)] opacity-80" />
    </div>
  );
}
