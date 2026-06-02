import React from 'react';
import { ShieldCheck, Clock, Mail } from 'lucide-react';

export function HonestCheckoutNotice() {
  return (
    <div className="bg-[#F2EFE9] border border-[#E5E2D9] rounded-2xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <ShieldCheck className="text-[#7A8F4E] flex-shrink-0 mt-0.5" size={20} />
        <div className="space-y-2">
          <p className="text-sm font-medium text-[#1F1D1A]">
            Transparent & Fair
          </p>
          <ul className="text-xs text-[#5C5748] space-y-1.5">
            <li className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#7A8F4E]" />
              Du zahlst einmalig den angegebenen Betrag. Kein Abo, keine versteckten Kosten.
            </li>
            <li className="flex items-center gap-2">
              <Clock size={12} className="text-[#7A8F4E]" />
              Der Download-Link ist 48 Stunden gültig und kann bei Bedarf neu generiert werden.
            </li>
            <li className="flex items-center gap-2">
              <Mail size={12} className="text-[#7A8F4E]" />
              Du erhältst eine Bestätigung und den Link direkt per E-Mail.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
