import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Check, RefreshCw, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { trackAppEvent } from '../lib/analytics';

type Question = {
  id: string;
  text: string;
  options: { label: string; value: string; category: string }[];
};

const questions: Question[] = [
  {
    id: 'goal',
    text: 'Was möchtest du heute erreichen?',
    options: [
      { label: 'Meine Routinen optimieren', value: 'routines', category: 'Lifestyle' },
      { label: 'Mehr Energie & Gesundheit', value: 'health', category: 'Ernährung' },
      { label: 'Finanzielle Klarheit', value: 'finance', category: 'Finanzen' },
      { label: 'KI im Alltag nutzen', value: 'ai', category: 'Digital' },
    ],
  },
  {
    id: 'time',
    text: 'Wie viel Zeit kannst du pro Tag investieren?',
    options: [
      { label: 'Nur 10-15 Minuten', value: 'quick', category: 'Quick Wins' },
      { label: '30-60 Minuten', value: 'medium', category: 'Deep Dive' },
      { label: 'Ich will mich voll reinhängen', value: 'intensive', category: 'Mastery' },
    ],
  },
];

export function GuideRecommender() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: string, value: string, category: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value, category }));
    trackAppEvent('guide_recommender_answered', { questionId, value, category });
    
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 400);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const currentQuestion = questions[step];

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-12 md:py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F2EFE9] text-[#7A8F4E] mb-6">
            <Sparkles size={32} strokeWidth={1.5} />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif italic text-[#1F1D1A] mb-4">
            Finde deinen perfekten Guide
          </h1>
          <p className="text-[#5C5748] max-w-md mx-auto">
            Beantworte 2 kurze Fragen und wir empfehlen dir den passenden Nolea Guide für deine aktuellen Ziele.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div
              key="questions"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-[#E5E2D9]"
            >
              {/* Progress */}
              <div className="flex gap-2 mb-8">
                {questions.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                      idx <= step ? 'bg-[#7A8F4E]' : 'bg-[#E5E2D9]'
                    }`}
                  />
                ))}
              </div>

              <h2 className="text-xl md:text-2xl font-serif italic text-[#1F1D1A] mb-8">
                {currentQuestion.text}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(currentQuestion.id, option.value, option.category)}
                    className="w-full text-left p-5 rounded-2xl border border-[#E5E2D9] hover:border-[#7A8F4E] hover:bg-[#F2EFE9] transition-all duration-300 group flex items-center justify-between"
                  >
                    <span className="text-[#1F1D1A] font-medium group-hover:text-[#7A8F4E] transition-colors">
                      {option.label}
                    </span>
                    <ArrowRight size={20} className="text-[#E5E2D9] group-hover:text-[#7A8F4E] transition-colors" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-[#E5E2D9] text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#7A8F4E]/10 text-[#7A8F4E] mb-6">
                <Check size={32} strokeWidth={1.5} />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-serif italic text-[#1F1D1A] mb-4">
                Wir haben eine Empfehlung für dich!
              </h2>
              <p className="text-[#5C5748] mb-8">
                Basierend auf deinen Antworten ({answers.category}) empfehlen wir dir unseren Bestseller in dieser Kategorie.
              </p>

              <div className="bg-[#F2EFE9] rounded-2xl p-6 mb-8 text-left flex gap-4 items-start">
                <div className="w-24 h-32 bg-[#E5E2D9] rounded-xl flex-shrink-0 flex items-center justify-center text-[#5C5748]">
                  <ShoppingBag size={32} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A8F4E] mb-1">
                    {answers.category || 'Lifestyle'}
                  </p>
                  <h3 className="font-serif italic text-xl text-[#1F1D1A] mb-2">
                    Der perfekte Start-Guide
                  </h3>
                  <p className="text-sm text-[#5C5748] mb-4">
                    Ein kompakter, praxisnaher Guide, der genau auf deine ausgewählten Ziele eingeht.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 bg-[#1F1D1A] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider btn-press"
                  >
                    Guide ansehen <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <button
                onClick={reset}
                className="inline-flex items-center gap-2 text-[#5C5748] hover:text-[#1F1D1A] transition-colors text-sm font-medium"
              >
                <RefreshCw size={16} />
                Empfehlung neu starten
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
