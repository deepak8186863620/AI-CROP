
import React, { useState, useEffect } from 'react';
import { 
  Sprout, Leaf, Beaker, ShieldCheck, ChevronDown, 
  LayoutGrid, Layers, Info, Loader2, BellPlus, 
  CheckCircle2, TrendingUp, Map as MapIcon, Maximize2,
  DollarSign, Zap, RefreshCcw, ArrowUpRight, ChevronUp,
  Coins, FlaskConical, Milestone, Target, Activity, Layout,
  Sparkles
} from 'lucide-react';
import { getFertilizerPlan, getIntercroppingPlan } from '../services/geminiService';
import { FarmerProfile, FertilizerPlan, Language, Reminder, IntercroppingPlan, FertilizerStage } from '../types';
import { TRANSLATIONS, CROP_TYPES } from '../constants';

interface Props {
  profile: FarmerProfile;
  language: Language;
}

const FertilizerPlanner: React.FC<Props> = ({ profile, language }) => {
  const [activeView, setActiveView] = useState<'nutrients' | 'layout'>('nutrients');
  const [selectedCrop, setSelectedCrop] = useState(CROP_TYPES[0]);
  const [plan, setPlan] = useState<FertilizerPlan | null>(null);
  const [interPlan, setInterPlan] = useState<IntercroppingPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[language];

  const fetchPlan = async (crop: string) => {
    setLoading(true);
    const data = await getFertilizerPlan(crop, profile);
    setPlan(data);
    setLoading(false);
  };

  const fetchIntercropping = async () => {
    setLoading(true);
    const data = await getIntercroppingPlan(profile);
    setInterPlan(data);
    setLoading(false);
  };

  useEffect(() => {
    if (activeView === 'nutrients') {
      fetchPlan(selectedCrop);
    } else {
      fetchIntercropping();
    }
  }, [selectedCrop, activeView, language]);

  return (
    <div className="space-y-8 pb-32">
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <MapIcon className="text-emerald-600" /> {t.manage}
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2 italic">
              {language === 'en' ? 'Daily farm work and money tips' : 'Precision Operations & Profit Logic'}
            </p>
          </div>
          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] border border-slate-200/50">
            <button 
              onClick={() => setActiveView('nutrients')}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'nutrients' ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Beaker size={16} /> {t.apply}
            </button>
            <button 
              onClick={() => setActiveView('layout')}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeView === 'layout' ? 'bg-white text-slate-900 shadow-md ring-1 ring-slate-900/5' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Layout size={16} /> {t.profitBooster}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center flex flex-col items-center shadow-xl">
          <Loader2 className="animate-spin text-emerald-600 mb-6" size={64} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
            {language === 'en' ? 'Thinking of best farm plans...' : 'Simulating Mixed Synergy Blueprints...'}
          </p>
        </div>
      ) : activeView === 'nutrients' && plan ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative">
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-12">
                 <div className="max-w-md">
                   <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 mb-4 inline-block">
                     {language === 'en' ? 'Food for Crops' : 'Nutrition Cycle'}
                   </span>
                   <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{plan.crop} {t.technicalBlueprint}</h3>
                   <p className="text-slate-500 font-medium leading-relaxed italic">
                     {language === 'en' ? 'When and how to give food/fertilizer to your crops.' : 'Synchronized nutrient application based on plant bio-cycles.'}
                   </p>
                 </div>
                 <div className="flex-1 w-full space-y-8">
                    {plan.stages.map((stage, idx) => (
                      <div key={idx} className="group relative pl-12 pb-8 last:pb-0">
                         <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-100 group-last:bg-transparent" />
                         <div className="absolute left-[-16px] top-0 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black shadow-xl group-hover:scale-110 transition-transform">
                            {idx + 1}
                         </div>
                         <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-6 group-hover:bg-white group-hover:shadow-xl transition-all">
                            <div className="flex justify-between items-center mb-4">
                               <h4 className="text-xl font-black text-slate-900">{stage.stage}</h4>
                               <span className="px-3 py-1 bg-white text-emerald-600 rounded-lg text-[10px] font-black uppercase border border-slate-100">{stage.timing}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                               <div>
                                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">
                                    {language === 'en' ? 'Medicine Amount' : 'Chemical Dosage'}
                                  </label>
                                  <p className="text-sm font-bold text-slate-700">{stage.npk} • {stage.dosage}</p>
                               </div>
                               <div>
                                  <label className="text-[10px] font-black uppercase text-emerald-600 tracking-widest block mb-2">
                                    {language === 'en' ? 'Natural Choice' : 'Organic Alternative'}
                                  </label>
                                  <p className="text-sm font-bold text-emerald-700">{stage.organicAlternative}</p>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      ) : activeView === 'layout' && interPlan ? (
        <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
               <div className="mesh-gradient absolute inset-0 opacity-20 pointer-events-none" />
               <div className="relative z-10">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 text-emerald-400">
                    <Sparkles size={12} /> {language === 'en' ? 'Extra Money Plan' : 'Seasonal ROI Advantage'}
                 </div>
                 <h3 className="text-5xl font-black tracking-tighter mb-4 leading-none">{interPlan.combinationName}</h3>
                 <p className="text-slate-400 text-lg font-medium leading-relaxed italic max-w-xl">{interPlan.reasoning}</p>
                 
                 <div className="mt-8 flex gap-8">
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{language === 'en' ? 'Sowing Way' : 'Sowing Pattern'}</div>
                      <div className="text-xl font-black text-emerald-400">{interPlan.sowingPattern}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{language === 'en' ? 'More Profit' : 'Profit Boost'}</div>
                      <div className="text-xl font-black text-emerald-400">{interPlan.profitMultiplier}</div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="bg-emerald-600 p-12 rounded-[3.5rem] text-white shadow-2xl flex flex-col justify-between">
               <div className="flex justify-between items-start">
                  <div className="p-4 bg-white/20 rounded-3xl backdrop-blur-md"><TrendingUp size={32} /></div>
                  <div className="text-right">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-80">{language === 'en' ? 'Plan Score' : 'Synergy Score'}</div>
                    <div className="text-3xl font-black">9.5/10</div>
                  </div>
               </div>
               <div>
                  <h4 className="text-2xl font-black leading-tight mb-2">{language === 'en' ? 'Mixed Crop Strategy' : 'Seasonal Mixed Strategy'}</h4>
                  <p className="text-sm font-medium opacity-80">
                    {language === 'en' ? 'Best plan for your soil to stop pests and grow more.' : 'Optimized for your soil to reduce pest pressure and increase yield.'}
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl">
             <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-lg"><Layers size={20} /></div>
                   <h4 className="text-2xl font-black text-slate-900">{language === 'en' ? 'Farm Map' : 'Visual Field Blueprint'}</h4>
                </div>
                <div className="flex gap-4">
                  {interPlan.zones.map((z, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-3 h-3 rounded-full" style={{ backgroundColor: z.color }} />
                       <span className="text-[10px] font-black uppercase text-slate-400">{z.cropName}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="grid grid-cols-12 gap-1 mb-12 border border-slate-100 p-1 rounded-xl bg-slate-50">
                {Array.from({ length: 48 }).map((_, i) => {
                  const col = i % 12;
                  const isCompanion = col === 9 || col === 10; 
                  const zone = isCompanion ? (interPlan.zones[1] || interPlan.zones[0]) : interPlan.zones[0];
                  
                  return (
                    <div 
                      key={i} 
                      className="aspect-square rounded-sm transition-all hover:scale-110 cursor-help"
                      style={{ backgroundColor: zone.color }}
                      title={`${zone.cropName} - ${zone.role}`}
                    />
                  );
                })}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {interPlan.zones.map((zone, i) => (
                  <div key={i} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all hover:shadow-xl hover:bg-white">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="w-4 h-12 rounded-full" style={{ backgroundColor: zone.color }} />
                        <div>
                           <h5 className="text-xl font-black text-slate-900 leading-none">{zone.cropName}</h5>
                           <span className="text-[10px] font-black uppercase text-slate-400 mt-2 block">{zone.role}</span>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <span className="text-[10px] font-black uppercase text-slate-400">{language === 'en' ? 'How much area' : 'Area Share'}</span>
                           <span className="text-sm font-black text-slate-900">{zone.percentage}%</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-[10px] font-black uppercase text-slate-400">{language === 'en' ? 'Gap size' : 'Ideal Spacing'}</span>
                           <span className="text-sm font-black text-slate-900">{zone.spacing}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-20 rounded-[3rem] border border-slate-100 text-center opacity-40">
           <Layout size={64} className="mx-auto mb-4" />
           <p className="font-black uppercase tracking-widest text-xs">Waiting for Farm Plan...</p>
        </div>
      )}
    </div>
  );
};

export default FertilizerPlanner;
