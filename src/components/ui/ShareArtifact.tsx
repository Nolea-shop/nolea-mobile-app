import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Check } from 'lucide-react';

interface ShareArtifactProps {
  guideTitle: string;
  guideImage?: string;
}

export function ShareArtifact({ guideTitle, guideImage }: ShareArtifactProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I finished "${guideTitle}" by Nolea. 🎉`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I finished a Nolea Guide',
          text: shareText,
          url: 'https://www.nolea.shop',
        });
      } catch (e) {
        // User cancelled
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        // noop
      }
    }
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={handleShare}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7A8F4E] text-white text-xs font-bold uppercase tracking-wider btn-press"
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
      {copied ? 'Copied!' : 'Share Achievement'}
    </motion.button>
  );
}
