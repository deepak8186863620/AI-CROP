
import React from 'react';
import { Language } from '../types';

interface Props {
  current: Language;
  onSelect: (lang: Language) => void;
}

const LanguageSwitcher: React.FC<Props> = ({ current, onSelect }) => {
  const langs: { id: Language; label: string }[] = [
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'हिंदी' },
    { id: 'te', label: 'తెలుగు' },
  ];

  return (
    <div className="flex gap-2">
      {langs.map((l) => (
        <button
          key={l.id}
          onClick={() => onSelect(l.id)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            current === l.id 
              ? 'bg-green-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
