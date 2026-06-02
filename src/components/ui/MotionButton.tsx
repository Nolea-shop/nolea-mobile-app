import React from 'react';
import { motion } from 'motion/react';

interface MotionButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

export function MotionButton({
  variant = 'primary',
  children,
  className = '',
  onClick,
  disabled,
  type = 'button',
  ariaLabel,
}: MotionButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-colors duration-300 btn-press';

  const variants = {
    primary: 'bg-[#1F1D1A] text-white hover:bg-[#2d2b27]',
    secondary: 'bg-[#7A8F4E] text-white hover:bg-[#6a7d43]',
    ghost: 'bg-transparent text-[#1F1D1A] hover:bg-[#F2EFE9]',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      aria-label={ariaLabel}
    >
      {children}
    </motion.button>
  );
}
