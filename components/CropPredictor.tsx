
import React, { useState, useEffect } from 'react';
import { 
  Sprout, TrendingUp, Info, ChevronRight, Loader2, Sparkles, 
  Droplets, FlaskConical, BarChart3, CloudRain, Calendar,
  ArrowUpRight, Target, ShieldCheck, Coins, Zap, Activity,
  Maximize2, ChevronDown, ChevronUp, Beaker, LayoutGrid, Layers, MapPin,
  IndianRupee, Database
} from 'lucide-react';
import { predictCrops } from '../services/geminiService';
import { FarmerProfile, PredictedCrop, Language } from '../types';
import { GlobalEnv } from '../App';
import { TRANSLATIONS } from '../constants';

interface Props {
  profile: FarmerProfile;
  language: Language;
  globalEnv: GlobalEnv;
  onEnvUpdate: (updates: Partial<GlobalEnv>) => void;
}

const CropPredictor: React.FC<Props> = ({ profile, language, globalEnv, onEnvUpdate }) => {
  const [predictions, setPredictions] = useState<PredictedCrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const t = TRANSLATIONS[language];
  
  const [nutrients, setNutrients] = useState({ n: 45, p: 30, k: 25 });
  const [simSeason, setSimSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>(globalEnv.season);

  const fetchPredictions = async () => {
    setLoading(true);
    onEnvUpdate({ season: simSeason });
    const data = await predictCrops({ 
      ...profile, 
      nutrients, 
      envContext: { 
        season: simSeason, 
        moistureBias: globalEnv.moistureBias, 
        tempBias: globalEnv.tempBias 
      } 
    });
    setPredictions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchPredictions();
  }, [profile]);

  return (
    <div className="space-y-8 pb-32">
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <Activity size={240} />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-emerald-600">
                <Sparkles size={12} className="animate-pulse" /> Precision Intelligence
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                Crop Optimization Engine
              </h2>
              <p className="text-slate-500 font-medium text-lg italic">
                Environment: {globalEnv.season} Season | Location: {profile.location?.address || 'Auto-Detected'}
              </p>
            </div>
            
            <button 
              onClick={() => setAdjusting(!adjusting)}
              className={`group px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-xl ${
                adjusting ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              <Beaker size={18} className={adjusting ? 'animate-bounce' : ''} /> 
              {adjusting ? 'Lock Settings' : 'Refine Environment'}
            </button>
          </div>

          {adjusting && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-in slide-in-from-top-4 duration-500">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target Season</label>
                <select 
                  value={simSeason} 
                  onChange={e => setSimSeason(e.target.value as any)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Kharif">Kharif (Monsoon)</option>
                  <option value="Rabi">Rabi (Winter)</option>
                  <option value="Zaid">Zaid (Summer)</option>
                </select>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex justify-between">
                  <span>Nitrogen (N)</span>
                  <span className="text-emerald-600 font-bold">{nutrients.n}%</span>
                </label>
                <input type="range" min="0" max="100" value={nutrients.n} onChange={e => setNutrients({...nutrients, n: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex justify-between">
                  <span>Phosphorus (P)</span>
                  <span className="text-blue-600 font-bold">{nutrients.p}%</span>
                </label>
                <input type="range" min="0" max="100" value={nutrients.p} onChange={e => setNutrients({...nutrients, p: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex justify-between">
                  <span>Potassium (K)</span>
                  <span className="text-amber-600 font-bold">{nutrients.k}%</span>
                </label>
                <input type="range" min="0" max="100" value={nutrients.k} onChange={e => setNutrients({...nutrients, k: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500" />
              </div>
              <div className="flex items-end col-span-full">
                <button onClick={fetchPredictions} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl">
                  Recalibrate Intelligent Logic
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center text-center">
          <Loader2 className="animate-spin text-emerald-500 mb-8" size={80} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-pulse">Scanning Advanced Agronomy Datasets...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {predictions.map((crop, idx) => (
            <div key={idx} className="group bg-white rounded-[4rem] border border-slate-100 shadow-xl overflow-hidden hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-700">
              <div className="p-8 md:p-12">
                <div className="flex flex-col lg:flex-row gap-12">
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-52 h-52 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle cx="104" cy="104" r="92" stroke="currentColor" strokeWidth="18" fill="transparent" className="text-slate-50" />
                        <circle cx="104" cy="104" r="92" stroke="currentColor" strokeWidth="18" fill="transparent" strokeDasharray={578} strokeDashoffset={578 - (578 * crop.probability) / 100} className="text-emerald-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-slate-900 tracking-tighter">{crop.probability}%</span>
                        <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1">Suitability</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                       <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                         {crop.suitableSeason} Season
                       </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-10">
                    <div>
                      <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-4">{crop.name}</h3>
                      <p className="text-xl text-slate-600 leading-relaxed font-medium italic">"{crop.why}"</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                      <DataPoint icon={<IndianRupee />} label={t.inputCost} val={crop.inputCostPerAcre} />
                      <DataPoint icon={<ArrowUpRight />} label="Market ROI" val={crop.marketPriceForecast} />
                      <DataPoint icon={<Calendar />} label="Harvesting" val={crop.harvestWindow} />
                      <DataPoint icon={<ShieldCheck />} label="Resilience" val={`${crop.resilienceScore}/100`} />
                    </div>

                    {/* Advanced Planting Section */}
                    <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 space-y-8">
                       <div className="flex items-center gap-3">
                         <div className="p-3 bg-white rounded-2xl shadow-sm"><Layers className="text-emerald-600" size={20} /></div>
                         <h4 className="text-lg font-black text-slate-900">Advanced Sowing Strategy</h4>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-4">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <span>Methodology</span>
                             <span className="text-emerald-600">{crop.sowingMethod}</span>
                           </div>
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <span>Ideal Spacing</span>
                             <span className="text-emerald-600">{crop.idealSpacing}</span>
                           </div>
                         </div>
                         <div className="p-5 bg-white rounded-3xl border border-slate-100">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3 flex items-center gap-2">
                              <LayoutGrid size={14} /> Planting Combination
                            </h5>
                            <p className="text-sm font-bold text-slate-800 leading-snug">{crop.plantingCombination}</p>
                         </div>
                       </div>

                       <div className="flex flex-wrap gap-2">
                          {crop.companionCrops.map((c, i) => (
                            <span key={i} className="px-3 py-1.5 bg-white border border-slate-100 rounded-xl text-[10px] font-bold text-slate-500 shadow-sm">
                              +{c}
                            </span>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 flex justify-center">
                   <button 
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                    className="flex items-center gap-4 px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all active:scale-95"
                   >
                     {expandedIdx === idx ? 'Close Details' : 'Deep Blueprint Analysis'}
                     <Maximize2 size={18} />
                   </button>
                </div>
              </div>
              
              {expandedIdx === idx && (
                <div className="bg-slate-50 p-12 border-t border-slate-100 animate-in slide-in-from-bottom-8 duration-500">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-6">
                         <h5 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                           <Activity className="text-emerald-500" /> Historical Trend
                         </h5>
                         <p className="text-slate-600 leading-relaxed font-medium">{crop.historicalTrend}</p>
                      </div>
                      <div className="space-y-6">
                         <h5 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                           <FlaskConical className="text-blue-500" /> Nutrient Map
                         </h5>
                         <div className="grid grid-cols-3 gap-4">
                            <NutrientBadge label="N" val={crop.nutrientRequirement.n} />
                            <NutrientBadge label="P" val={crop.nutrientRequirement.p} />
                            <NutrientBadge label="K" val={crop.nutrientRequirement.k} />
                         </div>
                      </div>
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Data Source Transparency Info */}
      <div className="mt-12 p-8 bg-emerald-50/50 rounded-[3rem] border border-emerald-100/50 flex flex-col md:flex-row items-center gap-6 animate-in fade-in delay-500 duration-1000">
         <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg">
            <Database size={24} />
         </div>
         <div>
            <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest mb-1 flex items-center gap-2">
               Intelligence Transparency
            </h4>
            <p className="text-xs text-emerald-700/80 font-medium leading-relaxed italic">
               Predictions are synthesized by **Gemini 3 Pro** reasoning across global agronomic research, 
               historical crop cycles, and real-time environmental data parameters. 
               This is an AI simulation intended for planning and decision-support only.
            </p>
         </div>
      </div>
    </div>
  );
};

const NutrientBadge = ({ label, val }: any) => (
  <div className="p-4 bg-white rounded-2xl border border-slate-100 text-center shadow-sm">
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</div>
    <div className="text-lg font-black text-slate-900">{val}</div>
  </div>
);

const DataPoint = ({ icon, label, val }: any) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
       {React.cloneElement(icon, { size: 14 })}
       {label}
    </div>
    <div className="text-lg font-black text-slate-800 leading-none">{val}</div>
  </div>
);

export default CropPredictor;
