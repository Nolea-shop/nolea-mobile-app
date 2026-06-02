import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LogIn, ShieldCheck, UserCircle } from 'lucide-react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { getStoredAnalyticsEvents } from '../lib/analytics';
import { useFavorites } from '../context/FavoritesContext';

export function Account() {
  const [user] = useAuthState(auth);
  const { favoriteIds, purchasedGuides } = useFavorites();
  const events = getStoredAnalyticsEvents();

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8 md:py-14">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <header className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#7A8F4E] mb-3">Account</p>
          <h1 className="text-3xl md:text-5xl font-serif italic text-[#1F1D1A] mb-4">Konto</h1>
          <p className="text-[#5C5748] max-w-2xl leading-relaxed">
            Das Konto ist optional. Es soll erst dann wichtig werden, wenn Nutzer ihre gekauften Guides wiederfinden oder Download-Links neu generieren wollen.
          </p>
        </header>

        <section className="bg-white border border-[#E5E2D9] rounded-[2rem] p-6 md:p-8 shadow-sm mb-5">
          <div className="flex flex-col sm:flex-row gap-5 sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#F2EFE9] text-[#7A8F4E] grid place-items-center">
                <UserCircle size={34} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-serif italic text-2xl text-[#1F1D1A]">
                  {user ? 'Eingeloggt' : 'Gastmodus'}
                </h2>
                <p className="text-sm text-[#5C5748]">
                  {user?.email || 'Du kannst ohne Konto shoppen und via Stripe bezahlen.'}
                </p>
              </div>
            </div>
            {!user && (
              <button
                onClick={() => signInWithGoogle()}
                className="inline-flex items-center justify-center gap-2 bg-[#1F1D1A] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider btn-press"
              >
                <LogIn size={16} />
                Google Login
              </button>
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          {[
            { label: 'Favoriten', value: favoriteIds.length },
            { label: 'Meine Guides', value: purchasedGuides.length },
            { label: 'App Events', value: events.length },
          ].map((stat) => (
            <div key={stat.label} className="bg-white border border-[#E5E2D9] rounded-2xl p-5 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5C5748]">{stat.label}</p>
              <p className="text-3xl font-serif italic text-[#1F1D1A] mt-2">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="bg-[#1F1D1A] text-white rounded-[2rem] p-6 md:p-8">
          <ShieldCheck size={28} className="text-[#9AAF6E] mb-4" strokeWidth={1.5} />
          <h2 className="text-2xl font-serif italic mb-3">Security Regeln fuer die echte App</h2>
          <ul className="space-y-2 text-sm text-white/75 leading-relaxed">
            <li>Keine Stripe-, Firebase-Admin-, Resend- oder AI-Secrets im Frontend.</li>
            <li>Download-Link-Generierung nur serverseitig nach Stripe Payment + Ownership Check.</li>
            <li>48h Download Tokens konsistent in API, E-Mail, FAQ und Rechtstexten verwenden.</li>
            <li>AI Assistant rate-limitieren und nur als Support, nicht als Hauptinterface nutzen.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
