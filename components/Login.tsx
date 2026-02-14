
import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Sparkles, ShieldCheck, Loader2, Leaf, ShieldAlert, Cpu, Globe, UserPlus, LogIn } from 'lucide-react';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { dbService } from '../services/dbService';

interface Props {
  onLogin: (email: string) => void;
  language: Language;
}

const Login: React.FC<Props> = ({ onLogin, language }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const t = TRANSLATIONS[language];

  const validateEmail = (e: string) => {
    return String(e).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in your email and password.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a correct email address.');
      return;
    }

    setLoading(true);

    // Simulate Database Handshake
    setTimeout(() => {
      setLoading(false);
      onLogin(email);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 selection:bg-emerald-200 font-jakarta">
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#064e3b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="w-full max-w-[1200px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-[3rem] shadow-[0_80px_150px_-30px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden relative z-10 animate-in zoom-in-95 duration-1000">
        
        {/* Left Side: System Narrative */}
        <div className="hidden lg:flex flex-col justify-between p-20 bg-slate-900 text-white relative">
          <div className="absolute inset-0 mesh-gradient opacity-20" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <Leaf className="text-white" size={30} />
              </div>
              <div>
                <span className="font-black text-3xl tracking-tighter block leading-none">Samarth Kisan</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mt-2 block">Helping Our Farmers</span>
              </div>
            </div>
            
            <div className="space-y-12">
              <h2 className="text-6xl font-black leading-[0.9] tracking-tighter">
                Grow More <br/> With Smart <br/> <span className="text-emerald-400 italic">Advice.</span>
              </h2>
              
              <div className="space-y-6">
                <SystemFeature icon={<ShieldCheck />} title="Your Data is Private" desc="We keep your farm information safe and secure." />
                <SystemFeature icon={<Cpu />} title="Smart Farm Tips" desc="Get expert advice on crops, pests, and soil." />
                <SystemFeature icon={<Globe />} title="Market Prices" desc="Stay updated with the latest selling rates." />
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-12 border-t border-white/10 flex justify-between items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Status</p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Working Perfectly
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Identity Portal */}
        <div className="p-8 md:p-16 lg:p-24 flex flex-col justify-center relative">
          <div className="mb-12">
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
              {isSignUp ? 'Join Us' : t.welcomeBack}
            </h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed">
              {isSignUp ? 'Create your farm profile to get started.' : t.tagline}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] pl-6">{t.email}</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={22} />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@email.com"
                  className="w-full p-7 pl-16 bg-slate-50 border border-slate-100 rounded-[2.5rem] font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-[12px] focus:ring-emerald-500/5 transition-all text-lg shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between px-6">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.password}</label>
                {!isSignUp && <button type="button" className="text-[10px] font-black text-emerald-600 hover:underline uppercase tracking-widest">{t.forgotPassword}</button>}
              </div>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={22} />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-7 pl-16 bg-slate-50 border border-slate-100 rounded-[2.5rem] font-bold text-slate-900 outline-none focus:border-emerald-500 focus:bg-white focus:ring-[12px] focus:ring-emerald-500/5 transition-all text-lg shadow-inner"
                />
              </div>
            </div>

            {error && (
              <div className="p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-600 text-sm font-bold flex items-center gap-4 animate-in slide-in-from-top-2">
                <ShieldAlert size={20} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-black text-white py-8 rounded-[3rem] font-black text-xl flex items-center justify-center gap-4 shadow-3xl transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-70 group overflow-hidden"
            >
              {loading ? (
                <div className="flex items-center gap-4">
                  <Loader2 className="animate-spin" size={24} />
                  <span className="uppercase tracking-[0.2em] text-sm">Logging in...</span>
                </div>
              ) : (
                <>
                  <span>{isSignUp ? 'Join Samarth Kisan' : t.signIn}</span>
                  {isSignUp ? <UserPlus size={24} /> : <LogIn size={24} />}
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-emerald-600 transition-colors group"
            >
              {isSignUp ? 'Have an account? Sign In' : t.noAccount}
              <ArrowRight size={14} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SystemFeature = ({ icon, title, desc }: any) => (
  <div className="flex gap-6 items-start">
    <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-emerald-400 shrink-0">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <h4 className="text-white font-black uppercase tracking-widest text-xs mb-1">{title}</h4>
      <p className="text-slate-400 text-sm font-medium">{desc}</p>
    </div>
  </div>
);

export default Login;
