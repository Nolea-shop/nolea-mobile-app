import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Check } from 'lucide-react';
import { shareContent, haptics } from '../../lib/native';

interface ShareArtifactProps {
  guideTitle: string;
  guideImage?: string;
  shareUrl?: string;
}

export function ShareArtifact({ guideTitle, shareUrl }: ShareArtifactProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I finished "${guideTitle}" by Nolea. 🎉`;
  const targetUrl = shareUrl || 'https://www.nolea.shop';

  const handleShare = async () => {
    haptics.impact('light');
    const ok = await shareContent({
      title: 'I finished a Nolea Guide',
      text: shareText,
      url: targetUrl,
      dialogTitle: 'Share your achievement',
    });
    if (ok) {
      // Wenn Share geöffnet wurde ODER Clipboard-Fallback genutzt wurde
      // unterscheiden wir am Plattform-Verhalten. Auf Web ohne navigator.share
      // → copied = true.
      if (typeof navigator !== 'undefined' && !('share' in navigator) && !(window as any).Capacitor?.isNativePlatform?.()) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
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
