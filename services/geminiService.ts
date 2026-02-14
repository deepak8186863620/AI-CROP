
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult, FarmerProfile, PredictedCrop, WeatherDay, EncyclopediaEntry, FertilizerPlan, IntercroppingPlan } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

const getLanguageName = (code: string) => {
  if (code === 'hi') return 'Hindi';
  if (code === 'te') return 'Telugu';
  return 'English';
};

export const analyzePlantHealth = async (imageBase64: string, lang: string = 'en'): Promise<DiagnosisResult | null> => {
  const ai = getAI();
  const langName = getLanguageName(lang);
  const prompt = `You are a Senior Plant Pathologist. Analyze this plant image. 
  IMPORTANT: Provide all text content in ${langName}.
  Return JSON:
  {
    "cropName": string,
    "healthScore": number,
    "detectedIssues": string[],
    "treatmentPlan": string[],
    "prevention": string[],
    "riskLevel": "Low" | "Medium" | "High"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: imageBase64, mimeType: 'image/jpeg' } },
          { text: prompt }
        ]
      },
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            cropName: { type: Type.STRING },
            healthScore: { type: Type.NUMBER },
            detectedIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            treatmentPlan: { type: Type.ARRAY, items: { type: Type.STRING } },
            prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
            riskLevel: { type: Type.STRING },
          },
          required: ["cropName", "healthScore", "detectedIssues", "treatmentPlan", "prevention", "riskLevel"]
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    return null;
  }
};

export const getIntercroppingPlan = async (profile: FarmerProfile): Promise<IntercroppingPlan | null> => {
  const ai = getAI();
  const langName = getLanguageName(profile.language);
  const currentMonth = new Date().toLocaleString('en-us', { month: 'long' });
  
  const prompt = `Act as an Agricultural ROI Architect. Suggest a Seasonal Mixed Cropping (Intercropping) plan for ${profile.fieldSize} acres of ${profile.soilType} soil.
  
  CONTEXT:
  - Current Month: ${currentMonth}
  - Location: ${profile.location?.address || 'India'}
  
  REQUIREMENTS:
  1. Identify a Main Crop and at least one high-profit Companion Crop suitable for the current season.
  2. The combination must maximize Net Profit and maximize Soil Nutrient Efficiency.
  3. All descriptive text MUST be in ${langName}.
  
  Return JSON:
  - combinationName: Catchy name for the pair
  - profitMultiplier: Estimated ROI increase (e.g. "+35%")
  - reasoning: Detailed biological/economic advantage in ${langName}
  - sowingPattern: Specific row ratio (e.g., "8 Rows Wheat : 2 Rows Mustard")
  - zones: Array of objects { cropName, percentage, color (Hex), spacing, role ("Main Crop" or "Companion") }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            combinationName: { type: Type.STRING },
            profitMultiplier: { type: Type.STRING },
            reasoning: { type: Type.STRING },
            sowingPattern: { type: Type.STRING },
            zones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  cropName: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  color: { type: Type.STRING },
                  spacing: { type: Type.STRING },
                  role: { type: Type.STRING }
                },
                required: ["cropName", "percentage", "color", "spacing", "role"]
              }
            }
          },
          required: ["combinationName", "profitMultiplier", "reasoning", "sowingPattern", "zones"]
        }
      }
    });
    return JSON.parse(response.text || "null");
  } catch (error) {
    return null;
  }
};

export const getWeeklyWeatherForecast = async (lat: number, lng: number, language: string, season: string): Promise<WeatherDay[]> => {
  const ai = getAI();
  const langName = getLanguageName(language);
  const prompt = `Generate a 7-day agri weather forecast for Lat: ${lat}, Lng: ${lng}.
  MANDATORY: Return specific HEX colors for UI mapping. All text in ${langName}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING },
              temp: { type: Type.NUMBER },
              condition: { type: Type.STRING },
              color: { type: Type.STRING },
              impact: { type: Type.STRING },
            },
            required: ["day", "temp", "condition", "color", "impact"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};

export const predictCrops = async (profile: FarmerProfile & { nutrients?: any, envContext?: any }): Promise<PredictedCrop[]> => {
  const ai = getAI();
  const langName = getLanguageName(profile.language);
  
  const prompt = `Act as an Elite Agronomist. Predict top 3 crops for ${profile.soilType} soil in ${profile.envContext?.season} season.
  Suggest a high-profit companion mixed-crop for each recommendation.
  IMPORTANT: Use Indian Rupee (₹) symbol for all financial data (input costs and market prices). 
  Assume Indian farming context. Return JSON Array in ${langName}.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              probability: { type: Type.NUMBER },
              yieldEstimate: { type: Type.STRING },
              profitPotential: { type: Type.STRING },
              riskFactor: { type: Type.STRING },
              suitableSeason: { type: Type.STRING },
              rainfallRequirement: { type: Type.STRING },
              historicalTrend: { type: Type.STRING },
              why: { type: Type.STRING },
              inputCostPerAcre: { type: Type.STRING },
              marketPriceForecast: { type: Type.STRING },
              nutrientRequirement: {
                type: Type.OBJECT,
                properties: { n: { type: Type.STRING }, p: { type: Type.STRING }, k: { type: Type.STRING } },
                required: ["n", "p", "k"]
              },
              harvestWindow: { type: Type.STRING },
              resilienceScore: { type: Type.NUMBER },
              plantingCombination: { type: Type.STRING },
              sowingMethod: { type: Type.STRING },
              idealSpacing: { type: Type.STRING },
              companionCrops: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: [
              "name", "probability", "yieldEstimate", "profitPotential", "riskFactor", 
              "suitableSeason", "why", "inputCostPerAcre", "marketPriceForecast", 
              "nutrientRequirement", "harvestWindow", "resilienceScore",
              "plantingCombination", "sowingMethod", "idealSpacing", "companionCrops"
            ]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};

export const getSmartResponse = async (query: string, language: string) => {
  const ai = getAI();
  const langName = getLanguageName(language);
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are Samarth AI. Answer concisely and helpfuly in ${langName}: "${query}".`,
  });
  return response.text;
};

export const getEncyclopediaEntry = async (query: string, lang: string = 'en'): Promise<EncyclopediaEntry | null> => {
  const ai = getAI();
  const langName = getLanguageName(lang);
  const prompt = `Agri Encyclopedia for "${query}" in ${langName}. JSON format required.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { 
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          classification: { type: Type.STRING },
          lifeCycle: { type: Type.STRING },
          controlMethods: { type: Type.ARRAY, items: { type: Type.STRING } },
          organicSolutions: { type: Type.ARRAY, items: { type: Type.STRING } },
          imagePrompt: { type: Type.STRING },
        },
        required: ["title", "description", "classification"]
      }
    }
  });
  return JSON.parse(response.text || "null");
};

export const getFertilizerPlan = async (crop: string, profile: FarmerProfile): Promise<FertilizerPlan | null> => {
  const ai = getAI();
  const langName = getLanguageName(profile.language);
  const prompt = `Fertilizer Schedule for ${crop} in ${profile.soilType} soil. Text in ${langName}. JSON format required.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            crop: { type: Type.STRING },
            totalDuration: { type: Type.STRING },
            stages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stage: { type: Type.STRING },
                  timing: { type: Type.STRING },
                  npk: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  organicAlternative: { type: Type.STRING },
                  organicInstructions: { type: Type.STRING },
                  organicBenefits: { type: Type.STRING },
                  instructions: { type: Type.STRING },
                },
                required: ["stage", "timing", "npk", "dosage", "organicAlternative", "organicInstructions", "organicBenefits", "instructions"]
              }
            }
          },
          required: ["crop", "totalDuration", "stages"]
        }
      }
    });
    return JSON.parse(response.text || "null");
  } catch (error) {
    return null;
  }
};

export const getActionableSignals = async (profile: FarmerProfile): Promise<any> => {
  const ai = getAI();
  const langName = getLanguageName(profile.language);
  const prompt = `Analyze farm: ${JSON.stringify(profile)}. Provide 2 signals in ${langName}.`;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING },
            },
            required: ["title", "description", "priority"]
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};
