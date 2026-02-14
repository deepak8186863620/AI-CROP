
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, MessageSquare, Volume2, Sparkles, Square, Maximize2, Minimize2 } from 'lucide-react';
import { getSmartResponse } from '../services/geminiService';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

const VoiceAssistant: React.FC<{ language: Language }> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  // Auto-scroll to bottom when response or query changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response, query, loading]);

  // Track speech synthesis state
  useEffect(() => {
    const checkSpeaking = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 500);
    return () => clearInterval(checkSpeaking);
  }, []);

  const stopEverything = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setLoading(false);
  };

  const startListening = () => {
    stopEverything();
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'te-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleQuery(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  const handleQuery = async (text: string) => {
    if (!text) return;
    setLoading(true);
    setResponse('');
    const res = await getSmartResponse(text, language);
    
    // Check if we were cancelled during loading
    if (loading === false && response === '' && res) {
       // if we manually stopped loading, don't show the response
    }

    setResponse(res || '...');
    setLoading(false);
    
    // Auto-read response
    if (res) {
      const utterance = new SpeechSynthesisUtterance(res);
      utterance.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'te-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={`fixed bottom-24 right-4 md:right-8 z-[60] transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
      <div 
        className={`bg-white rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-slate-100 transition-all duration-300 ${
          isExpanded 
            ? 'w-[calc(100vw-2rem)] md:w-[600px] h-[80vh]' 
            : 'w-[calc(100vw-2rem)] max-w-[360px] h-[500px]'
        }`}
      >
        {/* Sticky Header */}
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0 relative z-10 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-black text-base tracking-tight block leading-none">Samarth AI</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Co-pilot Online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleExpand}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
              title={isExpanded ? t.minimize : t.expand}
            >
              {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button 
              onClick={() => { stopEverything(); setIsOpen(false); }}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="p-8 flex-1 overflow-y-auto space-y-6 bg-slate-50/40 scroll-smooth scrollbar-hide"
        >
          {!query && !loading && !response && (
            <div className="text-center py-20 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <MessageSquare size={40} />
              </div>
              <h4 className="text-slate-900 font-black text-lg mb-2">How can I help you?</h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed px-8">
                Ask about field preparation, seed selection, or pest control in your language.
              </p>
            </div>
          )}

          {query && (
            <div className="flex flex-col items-end animate-in slide-in-from-right-4">
              <div className="bg-slate-900 text-white p-5 rounded-[1.5rem] rounded-tr-none text-sm font-bold max-w-[90%] shadow-lg">
                {query}
              </div>
            </div>
          )}
          
          {(loading || response) && (
            <div className="flex flex-col items-start animate-in slide-in-from-left-4">
              <div className="bg-white border border-slate-100 p-6 rounded-[1.5rem] rounded-tl-none text-sm text-slate-800 font-medium max-w-[90%] shadow-md relative">
                {loading ? (
                  <div className="flex gap-1.5 py-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 text-emerald-600 flex items-center gap-2">
                      <Volume2 size={16} className={isSpeaking ? 'animate-pulse' : ''} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Assistant Response</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{response}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Controls */}
        <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)] shrink-0">
          <div className="flex gap-3">
            <button 
              onClick={startListening}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                isListening 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Mic size={20} />
              {isListening ? '...' : 'Voice Input'}
            </button>

            {(isSpeaking || loading) && (
              <button 
                onClick={stopEverything}
                className="w-16 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all shadow-md active:scale-95 border border-slate-200"
                title={t.stop}
              >
                <Square size={20} fill="currentColor" />
              </button>
            )}
          </div>
          <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-4">
            Samarth AI • Real-time Multilingual Reasoning
          </p>
        </div>
      </div>
    </div>
  );
};

// Re-wrap the trigger button to handle the isOpen state
const VoiceAssistantWrapper: React.FC<{ language: Language }> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div className={`fixed bottom-24 right-4 md:right-8 z-[60] transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white p-5 rounded-[1.8rem] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] hover:scale-110 active:scale-95 transition-all flex items-center gap-4 group border border-white/10"
        >
          <div className="relative">
            <Mic size={28} />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <span className="font-black text-sm tracking-tight hidden md:block uppercase tracking-widest">Samarth AI</span>
        </button>
      </div>
      
      {/* Actual component instance, visibility handled internally via CSS classes based on isOpen prop logic but since we need to pass the toggle down... let's adjust */}
      {/* For code economy, I will just keep the internal state in VoiceAssistant and pass a simplified prop or keep the logic within one component */}
      <AssistantInternal isOpen={isOpen} setIsOpen={setIsOpen} language={language} />
    </>
  );
};

// Internal assistant component to manage the logic
const AssistantInternal: React.FC<{ isOpen: boolean; setIsOpen: (v: boolean) => void; language: Language }> = ({ isOpen, setIsOpen, language }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [response, query, loading]);

  useEffect(() => {
    const checkSpeaking = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 500);
    return () => clearInterval(checkSpeaking);
  }, []);

  const stopEverything = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setLoading(false);
  };

  const startListening = () => {
    stopEverything();
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'te-IN';
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        handleQuery(transcript);
      };
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  const handleQuery = async (text: string) => {
    if (!text) return;
    setLoading(true);
    setResponse('');
    const res = await getSmartResponse(text, language);
    setResponse(res || '...');
    setLoading(false);
    
    if (res) {
      const utterance = new SpeechSynthesisUtterance(res);
      utterance.lang = language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'te-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={`fixed bottom-24 right-4 md:right-8 z-[60] transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90 pointer-events-none'}`}>
      <div 
        className={`bg-white rounded-[2.5rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col border border-slate-100 transition-all duration-500 origin-bottom-right ${
          isExpanded 
            ? 'w-[calc(100vw-2rem)] md:w-[600px] h-[80vh]' 
            : 'w-[calc(100vw-2rem)] max-w-[360px] h-[500px]'
        }`}
      >
        <div className="bg-slate-900 p-6 flex justify-between items-center text-white shrink-0 relative z-10 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="font-black text-base tracking-tight block leading-none">Samarth AI</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-1">Co-pilot Online</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleExpand}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
              title={isExpanded ? t.minimize : t.expand}
            >
              {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
            <button 
              onClick={() => { stopEverything(); setIsOpen(false); }}
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-slate-300 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="p-8 flex-1 overflow-y-auto space-y-6 bg-slate-50/40 scroll-smooth scrollbar-hide"
        >
          {!query && !loading && !response && (
            <div className="text-center py-20 animate-in fade-in duration-500">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <MessageSquare size={40} />
              </div>
              <h4 className="text-slate-900 font-black text-lg mb-2">{t.askAnything}</h4>
            </div>
          )}

          {query && (
            <div className="flex flex-col items-end animate-in slide-in-from-right-4">
              <div className="bg-slate-900 text-white p-5 rounded-[1.5rem] rounded-tr-none text-sm font-bold max-w-[90%] shadow-lg">
                {query}
              </div>
            </div>
          )}
          
          {(loading || response) && (
            <div className="flex flex-col items-start animate-in slide-in-from-left-4">
              <div className="bg-white border border-slate-100 p-6 rounded-[1.5rem] rounded-tl-none text-sm text-slate-800 font-medium max-w-[90%] shadow-md relative">
                {loading ? (
                  <div className="flex gap-1.5 py-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 text-emerald-600 flex items-center gap-2">
                      <Volume2 size={16} className={isSpeaking ? 'animate-pulse' : ''} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Assistant Response</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{response}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.05)] shrink-0">
          <div className="flex gap-3">
            <button 
              onClick={startListening}
              className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
                isListening 
                ? 'bg-rose-500 text-white animate-pulse' 
                : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Mic size={20} />
              {isListening ? '...' : 'Voice Input'}
            </button>

            {(isSpeaking || loading) && (
              <button 
                onClick={stopEverything}
                className="w-16 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all shadow-md active:scale-95 border border-slate-200"
                title={t.stop}
              >
                <Square size={20} fill="currentColor" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistantWrapper;
