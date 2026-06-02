import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, Sparkles, Download } from 'lucide-react';

type RevealStage = 'anticipation' | 'reveal' | 'celebration' | 'done';

interface PurchaseRevealProps {
  title: string;
  coverUrl: string;
  downloadUrl?: string;
  onDownload?: () => void;
}

export const PurchaseReveal: React.FC<PurchaseRevealProps> = ({ 
  title, 
  coverUrl, 
  downloadUrl, 
  onDownload 
}) => {
  const [stage, setStage] = useState<RevealStage>('anticipation');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStage('reveal');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }, 1800);

    const timer2 = setTimeout(() => {
      setStage('celebration');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([30, 50, 30]);
      }
    }, 3000);

    const timer3 = setTimeout(() => {
      setStage('done');
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleDownload = () => {
    if (onDownload) onDownload();
    if (downloadUrl) window.open(downloadUrl, '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      <AnimatePresence mode="wait">
        {stage === 'anticipation' && (
          <motion.div
            key="anticipation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Sparkles className="text-[#7A8F4E]" size={48} strokeWidth={1.5} />
            </motion.div>
            <p className="mt-6 text-[#5C5748] text-sm italic font-serif">
              Preparing your guide...
            </p>
          </motion.div>
        )}

        {stage === 'reveal' && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="perspective-1000"
          >
            <img
              src={coverUrl}
              alt={title}
              className="w-48 h-60 object-cover rounded-2xl shadow-2xl"
            />
          </motion.div>
        )}

        {stage === 'celebration' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="relative"
          >
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(122,143,78,0.3)', 
                  '0 0 40px rgba(122,143,78,0.6)', 
                  '0 0 20px rgba(122,143,78,0.3)'
                ] 
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="rounded-2xl p-1"
            >
              <img
                src={coverUrl}
                alt={title}
                className="w-48 h-60 object-cover rounded-2xl"
              />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg"
            >
              <CheckCircle className="text-[#7A8F4E]" size={32} />
            </motion.div>
            <p className="mt-6 font-serif italic text-[#1F1D1A] text-lg">
              {title}
            </p>
          </motion.div>
        )}

        {stage === 'done' && downloadUrl && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <img
              src={coverUrl}
              alt={title}
              className="w-40 h-52 object-cover rounded-2xl shadow-lg mb-6"
            />
            <h3 className="font-serif italic text-xl text-[#1F1D1A] mb-1">
              {title}
            </h3>
            <p className="text-xs text-[#5C5748] mb-6">Ready to download</p>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDownload}
              className="inline-flex items-center gap-2 bg-[#1F1D1A] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider btn-press"
            >
              <Download size={16} />
              Download PDF
            </motion.button>
            <p className="text-[10px] text-[#5C5748] mt-3 uppercase tracking-wider">
              Link valid for 48 hours
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
