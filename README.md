# Samarth Kisan: Precision Agricultural Intelligence Platform

Samarth Kisan is a world-class, multilingual, multimodal AI co-pilot designed to empower Indian farmers with data-driven strategic intelligence. It leverages the latest Gemini 3.0 models to provide personalized agronomic advice, real-time pest diagnosis, and profit-focused field planning.

---

## 🛠️ Technical Stack & Architecture

This application is built using a modern, lightweight, and high-performance stack designed for reliability in low-bandwidth rural environments.

### 1. Core Frontend Framework
- **React (v19):** The foundational UI library. It enables a component-based architecture for complex features like the **Field Blueprint Grid** and the **Dynamic Dashboard**.
- **TypeScript:** Provides strict type safety across the application. By defining interfaces for `FarmerProfile`, `DiagnosisResult`, and `IntercroppingPlan`, we eliminate runtime errors and ensure consistent data flow between the AI and the UI.
- **Tailwind CSS:** A utility-first CSS framework used for high-fidelity styling. It powers the platform's **Glassmorphic** interface, **Mesh Gradients**, and responsive layouts that look professional on both basic mobile devices and high-end tablets.

### 2. AI & Intelligence Layer (Google Gemini API)
- **@google/genai SDK:** The primary interface for accessing Google's most advanced reasoning models.
- **Gemini 3.0 Pro (`gemini-3-pro-preview`):** Used for high-reasoning tasks like **Crop Prediction** and **Intercropping Strategy**. It analyzes complex agricultural variables to suggest profit-maximizing decisions.
- **Gemini 3.0 Flash (`gemini-3-flash-preview`):** Powers the high-speed **Voice Assistant**, **Weather Forecasting**, and **Encyclopedia** queries, providing near-instant responses.
- **Multimodal Vision:** Enables the **Pest Diagnostic** feature. The AI "sees" uploaded plant photos to identify pathogens and suggest organic or chemical treatments.
- **Structured JSON Outputs:** Uses the Gemini `responseSchema` (OpenAPI 3.0 compatible) to ensure the AI returns machine-readable data, allowing for complex UI components like the 12-column sowing grid.

### 3. Native Browser Integrations
- **Web Speech API (STT & TTS):** Provides the **Multilingual Voice Assistant**.
  - *SpeechRecognition:* Converts spoken Hindi, Telugu, or English into text commands.
  - *SpeechSynthesis:* Reads back AI advice, making the platform accessible to farmers regardless of literacy levels.
- **Geolocation API:** Automatically detects field coordinates to pull hyper-local **Weather Data** and localized market trends without manual entry.
- **MediaDevices (Camera):** Interacts with the device's camera for real-time leaf and pest identification.
- **LocalStorage:** Provides "offline-first" persistence for the **Farmer Profile** and **Operational Reminders**, ensuring critical farm data is available even during intermittent internet connectivity.

### 4. Module & Asset Management
- **ESM.sh / Import Maps:** Allows for modern ES6 module imports directly in the browser without a heavy build step, significantly reducing the initial load time for rural users.
- **Lucide React:** A comprehensive library of high-quality vector icons used for intuitive navigation and data visualization (e.g., pH levels, moisture icons, ROI charts).

---

## 🌟 Core Features & Functionality

### 🌾 Precision Agronomy Engine (`CropPredictor`)
- **Soil Simulation:** Allows users to simulate Nitrogen (N), Phosphorus (P), and Potassium (K) levels using interactive sliders.
- **Dynamic Recalibration:** When soil values change, the AI recalculates suitability scores for top crops based on real-time environmental context.

### 🐛 Multimodal Diagnostic (`VisionDiagnostic`)
- **Visual Pathologist:** Identifies plant diseases from photos and provides a multi-step treatment plan divided into **Chemical** and **Organic** protocols.

### 💰 Profit Booster & Intercropping (`FertilizerPlanner`)
- **Visual Field Blueprint:** Generates a color-coded grid showing the exact row-ratio (e.g., 9:1 for Wheat and Mustard) to maximize land use and pest disruption.
- **ROI Advantage:** Calculates single-crop vs. mixed-crop profit multipliers to justify strategic transitions.

### 🗣️ Samarth AI Assistant (`VoiceAssistant`)
- **Persistent Co-pilot:** A floating interface that maintains a "Reasoning Log" of farm activities and provides instant answers to agricultural queries in three languages.

---

## 🚀 Getting Started

1. **API Key:** The platform requires `process.env.API_KEY` to be configured.
2. **Permissions:** The app requests **Camera**, **Microphone**, and **Location** access for its core functions.
3. **Onboarding:** Calibration starts with a 5-step onboarding process to map the specific soil and water profile of the user's field.

---
*Developed with a mission to bring high-compute reasoning to the humble soil.*