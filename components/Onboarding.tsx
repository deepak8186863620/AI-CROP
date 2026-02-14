
import React, { useState, useEffect } from 'react';
import { FarmerProfile, Language } from '../types';
import { TRANSLATIONS, SOIL_TYPES, WATER_SOURCES, CROP_TYPES } from '../constants';
import { 
  MapPin, ArrowRight, CheckCircle, Sparkles, Sprout, Target, 
  Globe, Camera, Zap, BookOpen, BarChart3, ChevronDown, Leaf 
} from 'lucide-react';

interface Props {
  onComplete: (profile: FarmerProfile) => void;
}

const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0); 
  const [profile, setProfile] = useState<FarmerProfile>({
    language: 'en',
    fieldSize: 1,
    soilType: SOIL_TYPES[0],
    waterSource: WATER_SOURCES[0],
    currentCrop: CROP_TYPES[0],
    onboarded: false,
  });

  // Auto-scroll to top on step change for mobile friendliness
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  const updateProfile = (updates: Partial<FarmerProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else onComplete({ ...profile, onboarded: true });
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const t = TRANSLATIONS[profile.language];

  const handleLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        updateProfile({
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude }
        });
        nextStep();
      }, () => {
        // Fallback or silent skip
        nextStep(); 
      });
    } else {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen mesh-gradient flex flex-col items-center px-4 py-8 md:py-16 selection:bg-emerald-200">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 opacity-20 pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px] animate-pulse" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-400 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-xl md:max-w-2xl relative z-10">
        <div className="bg-white/95 backdrop-blur-3xl rounded-[3rem] md:rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
          
          {/* Progress Indicator */}
          {step > 0 && step < 5 && (
            <div className="px-10 md:px-16 pt-10 flex justify-between gap-2">
               {[1, 2, 3, 4].map(s => (
                 <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ease-out ${step >= s ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-slate-100'}`} />
               ))}
            </div>
          )}

          <div className="p-8 md:p-14">
            {/* STEP 0: HERO START PAGE */}
            {step === 0 && (
              <div className="space-y-8 md:space-y-12 animate-in slide-in-from-bottom-6 duration-1000">
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                    <Sparkles size={14} className="animate-pulse" /> Samarth Kisan
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-4 leading-none">
                    Grow <span className="text-emerald-600 italic">Better.</span>
                  </h1>
                  <p className="text-slate-500 font-medium text-lg md:text-xl leading-relaxed max-w-md mx-auto italic">
                    "Smart advice for every farmer, helping you grow more with ease."
                  </p>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={nextStep}
                    className="w-full bg-slate-900 hover:bg-black text-white py-6 md:py-8 rounded-[2rem] font-black text-xl md:text-2xl flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden"
                  >
                    <span className="relative z-10">{t.getStarted}</span>
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform relative z-10" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FeatureIcon icon={<Zap className="text-amber-500" />} title="More Profit" />
                  <FeatureIcon icon={<Camera className="text-blue-500" />} title="Crop Doctor" />
                </div>
                
                <p className="text-center text-[9px] text-slate-400 font-black uppercase tracking-[0.4em] pt-4 opacity-50">Powered by Smart AI</p>
              </div>
            )}

            {/* STEP 1: LANGUAGE SELECTION */}
            {step === 1 && (
              <div className="space-y-10 animate-in slide-in-from-right-6 duration-500">
                <div className="text-center">
                  <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl rotate-3">
                     <Globe size={32} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">{t.languageSelect}</h2>
                  <p className="text-slate-500 font-medium">Which language do you prefer for advice?</p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {['en', 'hi', 'te'].map((id) => (
                    <button
                      key={id}
                      onClick={() => updateProfile({ language: id as Language })}
                      className={`p-7 rounded-[2rem] border-2 text-left transition-all flex justify-between items-center group ${
                        profile.language === id 
                        ? 'border-emerald-500 bg-emerald-50 shadow-xl' 
                        : 'border-slate-100 bg-slate-50 hover:border-emerald-200'
                      }`}
                    >
                      <span className="font-black text-2xl text-slate-900">
                        {id === 'en' ? 'English' : id === 'hi' ? 'हिंदी' : 'తెలుగు'}
                      </span>
                      {profile.language === id && (
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle size={24} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <button onClick={nextStep} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all hover:bg-black shadow-xl mt-4">
                  {t.next} <ArrowRight size={22} />
                </button>
              </div>
            )}

            {/* STEP 2: LOCATION */}
            {step === 2 && (
              <div className="space-y-12 text-center animate-in slide-in-from-right-6 duration-500">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl border border-emerald-100">
                  <MapPin size={48} className="animate-bounce" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Farm Location</h2>
                  <p className="text-slate-500 px-6 font-medium leading-relaxed italic text-lg">
                    We need your location to give you accurate weather and crop tips.
                  </p>
                </div>
                <div className="space-y-6">
                  <button onClick={handleLocation} className="w-full bg-emerald-600 text-white py-7 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                    <Sparkles size={24} /> Set My Location
                  </button>
                  <button onClick={nextStep} className="w-full text-slate-400 font-black py-2 hover:text-slate-600 uppercase tracking-widest text-[10px]">Skip for now</button>
                </div>
              </div>
            )}

            {/* STEP 3: TECHNICAL CALIBRATION */}
            {step === 3 && (
              <div className="space-y-10 animate-in slide-in-from-right-6 duration-500">
                <div className="text-center">
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">{t.fieldDetails}</h2>
                  <p className="text-slate-500 font-medium">Tell us a bit about your land.</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">Farm Size (Acres)</label>
                    <input 
                      type="number" 
                      value={profile.fieldSize} 
                      onChange={(e) => updateProfile({ fieldSize: Number(e.target.value) })} 
                      className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-black text-3xl outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner" 
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{t.soilType}</label>
                      <select 
                        value={profile.soilType} 
                        onChange={(e) => updateProfile({ soilType: e.target.value })} 
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-slate-700 appearance-none outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      >
                        {SOIL_TYPES.map(s => <option key={s} value={s}>{s} Soil</option>)}
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-4">{t.waterSource}</label>
                      <select 
                        value={profile.waterSource} 
                        onChange={(e) => updateProfile({ waterSource: e.target.value })} 
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[2rem] font-bold text-slate-700 appearance-none outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      >
                        {WATER_SOURCES.map(w => <option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <button onClick={nextStep} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] shadow-2xl">
                  {t.next} <ArrowRight size={22} />
                </button>
              </div>
            )}

            {/* STEP 4: CURRENT CROP SELECTION */}
            {step === 4 && (
              <div className="space-y-10 animate-in slide-in-from-right-6 duration-500">
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl -rotate-3">
                     <Leaf size={40} />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">My Crops</h2>
                  <p className="text-slate-500 font-medium italic">What are you growing right now?</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {CROP_TYPES.map((crop) => (
                    <button
                      key={crop}
                      onClick={() => updateProfile({ currentCrop: crop })}
                      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
                        profile.currentCrop === crop 
                        ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-[1.02]' 
                        : 'border-slate-100 bg-slate-50 hover:bg-white'
                      }`}
                    >
                      <div className={`p-3 rounded-2xl ${profile.currentCrop === crop ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                        <Sprout size={24} />
                      </div>
                      <span className="font-black text-lg text-slate-900">{crop}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => updateProfile({ currentCrop: '' })}
                    className={`col-span-2 p-6 rounded-[2rem] border-2 transition-all font-black text-sm uppercase tracking-widest ${
                      profile.currentCrop === '' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:bg-white'
                    }`}
                  >
                    Not planted yet
                  </button>
                </div>
                <button 
                  onClick={nextStep} 
                  className="w-full bg-emerald-600 text-white py-7 rounded-[2.5rem] font-black text-2xl flex items-center justify-center gap-4 shadow-[0_25px_60px_-10px_rgba(16,185,129,0.35)] transition-all hover:scale-[1.02]"
                >
                  Save My Profile <ArrowRight size={24} />
                </button>
              </div>
            )}

            {/* STEP 5: SUCCESS FINISH PAGE */}
            {step === 5 && (
              <div className="space-y-12 text-center animate-in zoom-in-95 duration-1000">
                <div className="relative w-40 h-40 bg-slate-900 text-white rounded-[3rem] flex items-center justify-center mx-auto shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] rotate-6">
                  <CheckCircle size={80} strokeWidth={3} />
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <Sparkles size={24} />
                  </div>
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 italic leading-tight">All Set!</h2>
                  <p className="text-slate-500 text-lg md:text-xl leading-relaxed font-medium max-w-sm mx-auto">
                    Your smart farming helper is ready to help you grow better crops.
                  </p>
                </div>
                <div className="space-y-4 pt-4">
                  <button 
                    onClick={() => onComplete({ ...profile, onboarded: true })} 
                    className="w-full bg-emerald-600 text-white py-8 rounded-[2.5rem] font-black text-2xl md:text-3xl flex items-center justify-center gap-4 shadow-[0_30px_70px_-15px_rgba(16,185,129,0.4)] transition-all hover:scale-[1.05] active:scale-95"
                  >
                    Go to Dashboard
                  </button>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Setting up your farm tips...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="py-12 w-full text-center opacity-40 text-slate-900 font-black uppercase tracking-[0.6em] text-[10px] md:text-xs">
        Samarth Kisan • Helping Our Farmers
      </div>
    </div>
  );
};

const FeatureIcon: React.FC<{ icon: React.ReactElement<any>; title: string }> = ({ icon, title }) => (
  <div className="p-4 bg-white/50 backdrop-blur-sm rounded-[1.5rem] border border-slate-100 flex items-center gap-4 group hover:bg-white transition-all shadow-sm">
    <div className="p-3 bg-white rounded-xl shadow-md shrink-0 group-hover:rotate-12 transition-transform">
      {React.cloneElement(icon, { size: 20 } as any)}
    </div>
    <span className="font-black text-slate-900 text-[10px] uppercase tracking-widest leading-none">{title}</span>
  </div>
);

export default Onboarding;
