
export type Language = 'en' | 'hi' | 'te';

export interface HistoryEvent {
  id: string;
  timestamp: string;
  type: 'DIAGNOSIS' | 'NPK_UPDATE' | 'CROP_CHANGE' | 'ONBOARDING' | 'AI_CONSULT';
  title: string;
  details: string;
  metadata?: any;
}

export interface FarmerProfile {
  email: string;
  language: Language;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  fieldSize: number; // in acres
  soilType: string;
  waterSource: string;
  currentCrop?: string;
  onboarded: boolean;
  lastSync: string;
  history: HistoryEvent[];
}

export interface Reminder {
  id: string;
  cropName: string;
  stage: string;
  dosage: string;
  npk: string;
  scheduledDate: string; // ISO string
  isApplied: boolean;
  priority: 'High' | 'Medium' | 'Low';
}

export interface FieldZone {
  cropName: string;
  percentage: number;
  color: string;
  spacing: string;
  role: 'Main Crop' | 'Companion' | 'Boundary';
}

export interface IntercroppingPlan {
  combinationName: string;
  profitMultiplier: string;
  reasoning: string;
  zones: FieldZone[];
  sowingPattern: string;
}

export interface PredictedCrop {
  name: string;
  probability: number;
  yieldEstimate: string;
  profitPotential: 'High' | 'Medium' | 'Low';
  riskFactor: string;
  suitableSeason: string;
  rainfallRequirement: string;
  historicalTrend: string;
  why: string;
  inputCostPerAcre: string;
  marketPriceForecast: string;
  nutrientRequirement: { n: string; p: string; k: string };
  harvestWindow: string;
  resilienceScore: number;
  plantingCombination?: string;
  sowingMethod: string;
  idealSpacing: string;
  companionCrops: string[];
}

export interface WeatherDay {
  day: string;
  temp: number;
  condition: string;
  color: string;
  impact: string;
}

// Added FertilizerStage to provide typing for fertilizer application stages
export interface FertilizerStage {
  stage: string;
  timing: string;
  npk: string;
  dosage: string;
  organicAlternative: string;
  organicInstructions: string;
  organicBenefits: string;
  instructions: string;
}

export interface FertilizerPlan {
  crop: string;
  totalDuration: string;
  stages: FertilizerStage[];
}

export interface EncyclopediaEntry {
  title: string;
  description: string;
  classification: 'Harmful' | 'Beneficial' | 'Neutral' | 'Plant';
  lifeCycle?: string;
  controlMethods?: string[];
  organicSolutions?: string[];
  imagePrompt?: string;
}

export interface DiagnosisResult {
  cropName: string;
  healthScore: number;
  detectedIssues: string[];
  treatmentPlan: string[];
  prevention: string[];
  riskLevel: 'Low' | 'Medium' | 'High';
}
