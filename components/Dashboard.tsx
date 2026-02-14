
import React, { useEffect, useState } from 'react';
import { FarmerProfile, WeatherDay, Reminder, HistoryEvent } from '../types';
import { 
  Droplets, Sprout, Bug, Calendar, ArrowRight, CloudRain, 
  Sparkles, Activity, MapPin, Bell, CheckCircle2, Clock, 
  Wind, Thermometer, ShieldCheck, Zap, TrendingUp, Search, AlertCircle,
  Target, Info, ChevronRight, RefreshCcw, Cpu, BarChart2, Globe, History, Layout, Database
} from 'lucide-react';
import { getActionableSignals, getWeeklyWeatherForecast } from '../services/geminiService';
import { GlobalEnv } from '../App';
import { TRANSLATIONS } from '../constants';

interface Props {
  profile: FarmerProfile;
  globalEnv: GlobalEnv;
}

const Dashboard: React.FC<Props> = ({ profile, globalEnv }) => {
  const [signals, setSignals] = useState<any[]>([]);
  const [forecast, setForecast] = useState<WeatherDay[]>([]);
  const [loading, setLoading] = useState(true);
  
  const t = TRANSLATIONS[profile.language];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const signalsData = await getActionableSignals(profile);
      setSignals(signalsData);
      
      if (profile.location?.lat) {
        const weatherData = await getWeeklyWeatherForecast(profile.location.lat, profile.location.lng, profile.language, globalEnv.season);
        setForecast(weatherData);
      }
      setLoading(false);
    };
    fetchData();
  }, [profile.email, globalEnv.season, profile.language]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Real-time Telemetry Section */}
      <section className="relative overflow-hidden rounded-[4rem] bg-slate-900 text-white shadow-2xl border border-white/5">
         <div className="mesh-gradient absolute inset-0 opacity-20" />
         <div className="relative z-10 p-10 md:p-14">
            <div className="flex flex-col lg:flex-row justify-between gap-12">
               <div>
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-emerald-400">
                    <Activity size={14} className="animate-pulse" /> {profile.language === 'en' ? 'Checking your farm...' : 'Checking Status'}
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] mb-6 uppercase">
                    {t.dashboard} <br/> <span className="text-emerald-400">{profile.language === 'en' ? 'Status' : 'Status'}</span>
                  </h1>
                  <p className="text-slate-400 font-medium text-lg italic">{profile.email} • 17°23'28.0"N 78°19'13.1"E</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <StatCard icon={<Droplets />} label={t.soilMoisture} val="48%" color="blue" />
                  <StatCard icon={<Thermometer />} label={t.ambientTemp} val="29°C" color="amber" />
                  <StatCard icon={<Cpu />} label={profile.language === 'en' ? 'Soil Health' : 'Khaad'} val={profile.language === 'en' ? 'Good' : 'Theek hai'} color="emerald" />
                  <StatCard icon={<Activity />} label={t.soilPh} val="6.8" color="blue" />
               </div>
            </div>
         </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Signals Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                <Sparkles className="text-emerald-500" /> {t.strategicIntel}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
               {loading ? (
                 Array.from({length: 2}).map((_, i) => <div key={i} className="h-40 bg-slate-50 animate-pulse rounded-[2.5rem]" />)
               ) : signals.map((s: any, i: number) => (
                 <div key={i} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 flex gap-8 items-start hover:bg-white hover:shadow-2xl transition-all">
                    <div className="p-5 bg-emerald-600 text-white rounded-3xl shrink-0 shadow-lg shadow-emerald-600/20">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 mb-2">{s.title}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed italic">{s.description}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden">
             <h2 className="text-2xl font-black text-slate-900 mb-8">{t.weeklyForecast}</h2>
             <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x">
               {forecast.map((day, i) => (
                 <div key={i} className="min-w-[140px] flex-1 snap-center text-center p-6 rounded-[2.5rem] bg-slate-50 border border-slate-100 transition-all hover:scale-105">
                    <div className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">{day.day}</div>
                    <div className="text-3xl font-black text-slate-900 mb-1" style={{ color: day.color }}>{day.temp}°</div>
                    <div className="text-[9px] font-black text-slate-500 uppercase">{day.condition}</div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        {/* Audit / History Column */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><History size={120} /></div>
              <h3 className="text-xl font-black flex items-center gap-3 mb-8 relative z-10">
                <History size={20} className="text-emerald-400" /> {profile.language === 'en' ? 'Farm History' : 'Mera Itihas'}
              </h3>
              <div className="space-y-6 relative z-10">
                {profile.history?.length > 0 ? profile.history.map(event => (
                  <div key={event.id} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                      <div className="w-px flex-1 bg-white/10 my-2" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </p>
                      <h4 className="font-bold text-sm text-white leading-tight">{event.title}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 leading-relaxed italic">{event.details}</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-slate-500 italic">{profile.language === 'en' ? 'No work saved yet.' : 'Abhi tak koi activity nahi hui.'}</p>
                )}
              </div>
           </div>

           <div className="bg-emerald-600 p-8 rounded-[3.5rem] text-white shadow-2xl flex flex-col justify-between min-h-[160px]">
              <div className="flex justify-between items-start">
                 <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md"><Target size={28} /></div>
                 <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{profile.language === 'en' ? 'Last Update' : 'Last Update'}</div>
                    <div className="text-xs font-bold">{new Date(profile.lastSync).toLocaleTimeString()}</div>
                 </div>
              </div>
              <div>
                 <h4 className="text-2xl font-black leading-none mb-2">Samarth AI</h4>
                 <p className="text-[11px] font-bold uppercase tracking-widest opacity-80">{profile.language === 'en' ? 'Your Smart Helper' : 'Aapka digital saathi'}</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, val, color }: any) => {
  const colors: any = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
  };
  return (
    <div className={`p-6 rounded-3xl border ${colors[color]} flex flex-col items-center justify-center text-center transition-all hover:scale-105`}>
       <div className="mb-2">{React.cloneElement(icon, { size: 20 })}</div>
       <div className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{label}</div>
       <div className="text-2xl font-black leading-none">{val}</div>
    </div>
  );
};

export default Dashboard;
