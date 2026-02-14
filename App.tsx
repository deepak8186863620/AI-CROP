
import React, { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import VisionDiagnostic from './components/VisionDiagnostic';
import FertilizerPlanner from './components/FertilizerPlanner';
import Encyclopedia from './components/Encyclopedia';
import CropPredictor from './components/CropPredictor';
import LanguageSwitcher from './components/LanguageSwitcher';
import VoiceAssistant from './components/VoiceAssistant';
import { FarmerProfile, Language } from './types';
import { TRANSLATIONS } from './constants';
import { dbService } from './services/dbService';
import { 
  Camera, TrendingUp, Bell, LayoutDashboard, 
  Search, ShieldCheck, LogOut, Database, Settings
} from 'lucide-react';

export interface GlobalEnv {
  season: 'Kharif' | 'Rabi' | 'Zaid';
  moistureBias: number;
  tempBias: number;
  activeCrop: string;
}

const DEFAULT_USER_EMAIL = 'my_farm_user';

const App: React.FC = () => {
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'diagnosis' | 'planner' | 'encyclopedia' | 'predictor'>('dashboard');
  
  const [globalEnv, setGlobalEnv] = useState<GlobalEnv>({
    season: 'Kharif',
    moistureBias: 0,
    tempBias: 0,
    activeCrop: ''
  });

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Try to load existing profile for the default user
    const userProfile = dbService.getUserProfile(DEFAULT_USER_EMAIL);
    if (userProfile) {
      setProfile(userProfile);
      setGlobalEnv(prev => ({ ...prev, activeCrop: userProfile.currentCrop || '' }));
    }
  }, []);

  const handleOnboardingComplete = (data: Omit<FarmerProfile, 'email' | 'history' | 'lastSync'>) => {
    const newProfile: FarmerProfile = {
      ...data,
      email: DEFAULT_USER_EMAIL,
      history: [{
        id: 'initial',
        timestamp: new Date().toISOString(),
        type: 'ONBOARDING',
        title: 'System Initialized',
        details: 'Farm profile and soil parameters calibrated.'
      }],
      lastSync: new Date().toISOString()
    };

    dbService.saveUserProfile(newProfile);
    setProfile(newProfile);
    setGlobalEnv(prev => ({ ...prev, activeCrop: newProfile.currentCrop || '' }));
  };

  const updateGlobalEnv = (updates: Partial<GlobalEnv>) => {
    setIsSyncing(true);
    setGlobalEnv(prev => ({ ...prev, ...updates }));
    setTimeout(() => setIsSyncing(false), 1200);
  };

  const changeLanguage = (lang: Language) => {
    if (profile) {
      const updated = { ...profile, language: lang };
      setProfile(updated);
      dbService.saveUserProfile(updated);
    } else {
       // Allow language change even during onboarding
       setProfile(prev => prev ? ({...prev, language: lang}) : ({
         language: lang,
         fieldSize: 1,
         soilType: 'Alluvial',
         waterSource: 'Well',
         onboarded: false,
         email: DEFAULT_USER_EMAIL,
         lastSync: new Date().toISOString(),
         history: []
       } as any));
    }
  };

  const resetSession = () => {
    if (confirm("Kya aap apna saara data clear karna chahte hain?")) {
      dbService.deleteAccount(DEFAULT_USER_EMAIL);
      setProfile(null);
      setActiveTab('dashboard');
    }
  };

  if (!profile || !profile.onboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const t = TRANSLATIONS[profile.language];

  return (
    <div className="h-screen w-full bg-[#f8fafc] flex flex-col relative overflow-hidden font-jakarta">
      {/* Precision Header */}
      <header className="flex-none z-50 bg-white/80 backdrop-blur-xl px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black shadow-xl transform -rotate-6">SK</div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white transition-colors duration-500 ${isSyncing ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">Samarth Kisan</h1>
            <div className="flex items-center gap-2 mt-1">
               <Database size={10} className="text-emerald-600" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Kisan Mode</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex bg-slate-100 p-1 rounded-xl">
             <LanguageSwitcher current={profile.language} onSelect={changeLanguage} />
          </div>
          <button className="p-3 bg-white rounded-2xl text-slate-400 hover:text-emerald-600 border border-slate-100 shadow-sm transition-all hover:scale-105 active:scale-95">
             <Bell size={20} />
          </button>
          <div className="h-8 w-px bg-slate-100" />
          <button 
            onClick={resetSession}
            className="flex items-center gap-3 pl-2 pr-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl transition-all shadow-sm active:scale-95 group"
          >
            <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">
               <LogOut size={16} />
            </div>
            <span className="text-xs font-black uppercase tracking-widest hidden sm:block">Reset</span>
          </button>
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 relative overflow-y-auto scrollbar-hide">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
           <div className="tab-transition min-h-full">
              {activeTab === 'dashboard' && <Dashboard profile={profile} globalEnv={globalEnv} />}
              {activeTab === 'diagnosis' && <VisionDiagnostic language={profile.language} userEmail={DEFAULT_USER_EMAIL} />}
              {activeTab === 'planner' && <FertilizerPlanner profile={profile} language={profile.language} />}
              {activeTab === 'encyclopedia' && <Encyclopedia language={profile.language} />}
              {activeTab === 'predictor' && <CropPredictor profile={profile} language={profile.language} globalEnv={globalEnv} onEnvUpdate={updateGlobalEnv} />}
           </div>
        </div>

        {/* Global Footer */}
        <footer className="mt-20 bg-slate-900 rounded-t-[5rem] text-slate-400 overflow-hidden relative border-t border-white/5 pb-32">
          <div className="max-w-6xl mx-auto px-12 pt-24 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black">SK</div>
                  <span className="text-white font-black text-xl tracking-tighter">Samarth Kisan AI</span>
                </div>
                <p className="text-sm leading-relaxed font-medium">Digital sovereignty for the Indian farmer. Multi-user encrypted platform with real-time agronomic reasoning.</p>
              </div>
              <div className="space-y-6">
                <h4 className="text-white font-black uppercase tracking-[0.2em] text-[10px]">{t.profile} Summary</h4>
                <ul className="space-y-3 text-sm font-bold">
                  <li className="text-emerald-400">Field Size: {profile.fieldSize} Acres</li>
                  <li>Soil: {profile.soilType}</li>
                  <li>Season: {globalEnv.season}</li>
                </ul>
              </div>
              <div className="space-y-6 md:col-span-2">
                <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 flex items-center justify-between">
                   <div>
                     <h5 className="text-white font-black uppercase tracking-widest text-xs mb-1">Data Custody</h5>
                     <p className="text-[11px] leading-relaxed italic opacity-60">Your agricultural footprint is stored locally and hashed for maximum privacy. No raw data leaves your browser without encryption.</p>
                   </div>
                   <ShieldCheck size={32} className="text-emerald-500 shrink-0 ml-8" />
                </div>
              </div>
            </div>
            <div className="pt-10 border-t border-white/5 text-center text-[10px] font-black uppercase tracking-[0.5em] opacity-40">
              © 2025 Samarth Kisan AI • Built with Gemini 2.5
            </div>
          </div>
        </footer>
      </main>

      <VoiceAssistant language={profile.language} />

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-50">
        <nav className="glass rounded-[2.5rem] shadow-2xl border border-white/40 p-2 flex justify-between items-center">
          <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={20} />} label={t.home} />
          <NavButton active={activeTab === 'predictor'} onClick={() => setActiveTab('predictor')} icon={<TrendingUp size={20} />} label={t.trends} />
          <button onClick={() => setActiveTab('diagnosis')} className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all hover:scale-110 active:scale-90 -mt-2 ${activeTab === 'diagnosis' ? 'bg-slate-900' : 'bg-emerald-600'}`}>
            <Camera size={24} />
          </button>
          <NavButton active={activeTab === 'planner'} onClick={() => setActiveTab('planner')} icon={<Settings size={20} />} label={t.manage} />
          <NavButton active={activeTab === 'encyclopedia'} onClick={() => setActiveTab('encyclopedia')} icon={<Search size={20} />} label={t.wiki} />
        </nav>
      </div>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 w-16 transition-all duration-300 ${active ? 'text-emerald-700 scale-105' : 'text-slate-400 hover:text-slate-600'}`}>
    <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-emerald-50 shadow-inner' : 'hover:bg-slate-50'}`}>{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-tighter whitespace-nowrap">{label}</span>
  </button>
);

export default App;
