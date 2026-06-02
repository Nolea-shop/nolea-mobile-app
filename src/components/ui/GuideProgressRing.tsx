import React from 'react';
import { motion } from 'motion/react';
import { Check } from 'lucide-react';

type ProgressStatus = 'not_started' | 'in_progress' | 'complete';

interface GuideProgressRingProps {
  status: ProgressStatus;
  progressPercent?: number;
  size?: number;
}

export function GuideProgressRing({ 
  status, 
  progressPercent = 0, 
  size = 48 
}: GuideProgressRingProps) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const colors = {
    not_started: { stroke: '#E5E2D9', bg: '#FAF9F6', icon: null },
    in_progress: { stroke: '#7A8F4E', bg: '#F2EFE9', icon: null },
    complete: { stroke: '#7A8F4E', bg: '#7A8F4E', icon: <Check size={16} className="text-white" /> },
  };

  const current = colors[status];

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={current.bg}
          strokeWidth={strokeWidth}
        />
        {status !== 'not_started' && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={current.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        )}
      </svg>
      {status === 'complete' && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {current.icon}
        </motion.div>
      )}
      {status === 'in_progress' && (
        <span className="absolute text-[10px] font-bold text-[#7A8F4E]">
          {Math.round(progressPercent)}%
        </span>
      )}
    </div>
  );
}
