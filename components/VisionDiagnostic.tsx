
import React, { useState, useRef } from 'react';
import { Camera, RefreshCcw, AlertCircle, CheckCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { analyzePlantHealth } from '../services/geminiService';
import { DiagnosisResult, Language } from '../types';
import { TRANSLATIONS } from '../constants';
import { dbService } from '../services/dbService';

const VisionDiagnostic: React.FC<{ language: Language; userEmail: string }> = ({ language, userEmail }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[language];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      setImage(reader.result as string);
      setLoading(true);
      const diagnosis = await analyzePlantHealth(base64, language);
      
      if (diagnosis) {
        setResult(diagnosis);
        // Persist diagnostic result to user history
        dbService.addHistoryEvent(userEmail, {
          type: 'DIAGNOSIS',
          title: `Health Sync: ${diagnosis.cropName}`,
          details: `Health Score: ${diagnosis.healthScore}% - ${diagnosis.riskLevel} Risk.`,
          metadata: diagnosis
        });
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => fileInputRef.current?.click();
  const reset = () => { setImage(null); setResult(null); setLoading(false); };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{t.diagnosis} Core</h2>
        <p className="text-slate-500 font-medium italic">Gemini-Powered Visual Pathologist</p>
      </div>

      {!image ? (
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={triggerUpload} 
            className="w-full aspect-video flex flex-col items-center justify-center gap-6 border-4 border-dashed border-emerald-100 rounded-[3rem] p-12 bg-white hover:bg-emerald-50 hover:border-emerald-300 transition-all group relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 mesh-gradient opacity-5 group-hover:opacity-10 transition-opacity" />
            <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center shadow-2xl text-white group-hover:scale-110 transition-transform">
              <Camera size={48} />
            </div>
            <div className="text-center">
              <span className="font-black text-2xl text-slate-900 block mb-2">Capture Field Sample</span>
              <p className="text-slate-400 font-medium text-sm">Upload a leaf or crop photo for deep reasoning.</p>
            </div>
            <input type="file" accept="image/*" capture="environment" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="relative rounded-[3rem] overflow-hidden aspect-square bg-slate-100 shadow-2xl border-8 border-white">
            <img src={image} alt="Crop Sample" className="w-full h-full object-cover" />
            <button onClick={reset} className="absolute top-6 right-6 bg-white p-4 rounded-3xl shadow-2xl text-slate-900 hover:scale-110 transition-all">
              <RefreshCcw size={24} />
            </button>
          </div>

          {loading ? (
            <div className="h-full bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-center space-y-8">
              <Loader2 className="animate-spin text-emerald-600" size={80} />
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Analyzing Biomass...</h3>
                <p className="text-slate-400 font-medium italic">Running pest/disease reasoning patterns.</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-8">
              <div className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                <div className="mesh-gradient absolute inset-0 opacity-20" />
                <div className="relative z-10 flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-4xl font-black tracking-tighter leading-none mb-3">{result.cropName}</h3>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${result.riskLevel === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      <AlertCircle size={12} /> {result.riskLevel} Risk
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-5xl font-black text-emerald-400 leading-none">{result.healthScore}%</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Health Matrix</div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                    <h4 className="text-emerald-400 font-black uppercase tracking-widest text-[10px] mb-4 flex items-center gap-2">
                       <ShieldCheck size={14} /> Intelligence Protocol
                    </h4>
                    <ul className="space-y-3">
                      {result.treatmentPlan.map((step, i) => (
                        <li key={i} className="text-sm font-medium text-slate-300 flex gap-3 leading-relaxed italic">
                          <span className="text-emerald-500">[{i+1}]</span> {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl flex items-center gap-6">
                 <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl"><Sparkles size={32} /></div>
                 <div>
                   <h5 className="text-xl font-black text-slate-900">Diagnosis Persisted</h5>
                   <p className="text-sm text-slate-400 font-medium italic">This result has been saved to your farm timeline for future comparison.</p>
                 </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default VisionDiagnostic;
