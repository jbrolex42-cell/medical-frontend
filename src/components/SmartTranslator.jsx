// frontend-react/src/components/SmartTranslator.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mic, Volume2, Copy, CheckCircle, Languages } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
];

const medicalPhrases = {
  en: {
    'chest pain': 'Chest pain',
    'difficulty breathing': 'Difficulty breathing',
    'bleeding': 'Bleeding',
    'unconscious': 'Unconscious',
    'pregnant': 'Pregnant woman',
    'child': 'Child emergency'
  },
  sw: {
    'chest pain': 'Kuumwa kifua',
    'difficulty breathing': 'Shida ya kupumua',
    'bleeding': 'Kutokwa damu',
    'unconscious': 'Hajitambui',
    'pregnant': 'Mwanamke mjamzito',
    'child': 'Dharura ya mtoto'
  }
};

export default function SmartTranslator() {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('sw');
  const [input, setInput] = useState('');
  const [translated, setTranslated] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulated translation (integrate with Google Translate API or similar)
  const translate = (text) => {
    // In production: call translation API
    const mockTranslations = {
      'help': 'msaada',
      'ambulance': 'gari la wagonjwa',
      'emergency': 'dharura',
      'pain': 'maumivu',
      'doctor': 'daktari'
    };
    
    let result = text.toLowerCase();
    Object.entries(mockTranslations).forEach(([en, sw]) => {
      result = result.replace(en, sourceLang === 'en' ? sw : en);
    });
    
    setTranslated(result);
  };

  useEffect(() => {
    if (input.length > 2) {
      const timeout = setTimeout(() => translate(input), 500);
      return () => clearTimeout(timeout);
    }
  }, [input, sourceLang, targetLang]);

  const handleVoiceInput = () => {
    setIsRecording(true);
    // Integrate with Web Speech API
    setTimeout(() => {
      setInput(sourceLang === 'en' ? 'I need an ambulance' : 'Nahitaji gari la wagonjwa');
      setIsRecording(false);
    }, 2000);
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetLang === 'sw' ? 'sw-KE' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setInput(translated);
    setTranslated(input);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-100 rounded-xl">
            <Globe className="text-indigo-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Medical Translator</h3>
            <p className="text-gray-500 text-sm">Real-time emergency communication</p>
          </div>
        </div>
      </div>

      {/* Language Selector */}
      <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-xl">
        <select 
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 font-medium"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>

        <button 
          onClick={swapLanguages}
          className="p-2 hover:bg-gray-200 rounded-lg transition"
        >
          <Languages size={20} className="text-gray-600" />
        </button>

        <select 
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="bg-white border border-gray-300 rounded-lg px-3 py-2 font-medium"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Medical Phrases */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(medicalPhrases[sourceLang] || {}).slice(0, 4).map(([key, phrase]) => (
          <button
            key={key}
            onClick={() => setInput(phrase)}
            className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm hover:bg-red-100 transition"
          >
            {phrase}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={sourceLang === 'en' ? "Type or speak emergency details..." : "Andika au sema maelezo ya dharura..."}
          className="w-full h-32 p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        />
        <button
          onClick={handleVoiceInput}
          className={`absolute bottom-4 right-4 p-2 rounded-lg transition ${
            isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Mic size={20} />
        </button>
      </div>

      {/* Translation Output */}
      <AnimatePresence>
        {translated && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-indigo-50 rounded-xl p-4 mb-4"
          >
            <div className="flex items-start justify-between">
              <p className="text-lg font-medium text-indigo-900">{translated}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => speak(translated)}
                  className="p-2 hover:bg-indigo-100 rounded-lg transition"
                >
                  <Volume2 size={18} className="text-indigo-600" />
                </button>
                <button 
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-indigo-100 rounded-lg transition"
                >
                  {copied ? <CheckCircle size={18} className="text-green-600" /> : <Copy size={18} className="text-indigo-600" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency Presets */}
      <div className="grid grid-cols-2 gap-3">
        <button className="p-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition">
          🚨 Call Emergency (999)
        </button>
        <button className="p-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition">
          📍 Share Location
        </button>
      </div>
    </div>
  );
}