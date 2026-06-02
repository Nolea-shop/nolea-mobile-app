import React from 'react';
import { motion } from 'motion/react';

interface ShimmerSkeletonProps {
  className?: string;
}

export function ShimmerSkeleton({ className = '' }: ShimmerSkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-[#F2EFE9] rounded-xl ${className}`}>
      <motion.div
        className="absolute inset-0 -translate-x-full"
        animate={{ translateX: '100%' }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
        }}
      />
    </div>
  );
}
