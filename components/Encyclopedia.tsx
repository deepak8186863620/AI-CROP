
import React, { useState } from 'react';
import { Search, Bug, Leaf, Shield, Heart, HelpCircle, Loader2, Book } from 'lucide-react';
import { getEncyclopediaEntry } from '../services/geminiService';
import { EncyclopediaEntry, Language } from '../types';
import { TRANSLATIONS } from '../constants';

const Encyclopedia: React.FC<{ language: Language }> = ({ language }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<EncyclopediaEntry | null>(null);
  const t = TRANSLATIONS[language];

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query) return;
    setLoading(true);
    const data = await getEncyclopediaEntry(query, language);
    setEntry(data);
    setLoading(false);
  };

  const quickSearches = language === 'hi' 
    ? ['सफ़ेद मक्खी', 'पत्ती जंग', 'नीम तेल'] 
    : language === 'te' 
    ? ['తెల్లదోమ', 'ఆకు తుప్పు', 'వేప నూనె']
    : ['Whitefly', 'Leaf Rust', 'Neem Oil'];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t.wiki} {t.intelligence}</h2>
        <p className="text-slate-500">{t.askAnything}</p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.askAnything}
          className="w-full p-6 pl-14 bg-white border-2 border-slate-100 rounded-[2rem] shadow-xl shadow-slate-200/40 outline-none focus:border-emerald-500 transition-all font-bold text-slate-800"
        />
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
        <button 
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all"
        >
          {t.next}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        {quickSearches.map(s => (
          <button 
            key={s} 
            onClick={() => { setQuery(s); handleSearch(); }}
            className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-bold text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all"
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
          <p className="text-slate-400 font-bold italic">...</p>
        </div>
      ) : entry ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass p-8 rounded-[3rem] shadow-2xl border-white space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    entry.classification === 'Harmful' ? 'bg-rose-100 text-rose-600' : 
                    entry.classification === 'Beneficial' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {entry.classification}
                  </span>
                </div>
                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{entry.title}</h3>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <Leaf className="text-emerald-500" size={32} />
              </div>
            </div>

            <p className="text-lg text-slate-600 leading-relaxed">{entry.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-emerald-600" /> {t.operationalProtocol}
                </h4>
                <ul className="space-y-3">
                  {entry.controlMethods?.map((m, i) => (
                    <li key={i} className="text-sm text-slate-600 flex gap-2">
                      <span className="text-emerald-500 font-bold">•</span> {m}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
                <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2">
                  <Heart size={18} className="text-emerald-600" /> {t.organicWealth}
                </h4>
                <ul className="space-y-3">
                  {entry.organicSolutions?.map((s, i) => (
                    <li key={i} className="text-sm text-emerald-800 flex gap-2 font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {entry.lifeCycle && (
              <div className="p-6 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 italic">
                   Insight
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">{entry.lifeCycle}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 opacity-40">
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <Book size={32} />
           </div>
        </div>
      )}
    </div>
  );
};

export default Encyclopedia;
