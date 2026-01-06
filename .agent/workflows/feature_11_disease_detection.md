# Implementation Plan - Crop Disease Detection System (Image-Based)

## Objective
Implement a system where farmers can upload crop images to detect diseases and receive treatment recommendations.

## Strategy
Since training a custom Machine Learning model requires significant dataset and compute resources, we will implement the **interface and workflow** using a **Simulated AI Service** for this MVP. This ensures the features work reliably for demonstration without needing expensive external API keys or heavy local models.
*Note: The system is designed so you can easily swap the "Simulated AI" with a real TensorFlow.js model or Python API later.*

## Features
1.  **Image Upload Portal**: Drag-and-drop secure upload for farmers.
2.  **Analysis Engine**: Simulates processing (loading states, analyzing delay).
3.  **Result & Advisory**: Displays detected disease (e.g., "Tomato Early Blight") and specific treatment advice.

## Technology Stack
-   **Frontend**: React, TailwindCSS (for UI).
-   **Storage**: Browser Local Preview (for MVP speed) / Server Upload (optional).
-   **AI Simulation**: Mock service returning realistic agricultural disease data.

## Implementation Steps

### Step 1: AI Service Mock (`client/src/utils/aiService.js`)
-   Create a function `analyzeCropImage(file)` that:
    -   Takes an image file.
    -   Waits 2-3 seconds (simulating processing).
    -   Returns a result from a predefined curated list of crop diseases (e.g., Potato Blight, Rice Blast, Wheat Rust, Healthy).
    -   Provides confidence scores and treatment plans.

### Step 2: Detection Page (`client/src/pages/farmer/DiseaseDetectionPage.jsx`)
-   **Upload Component**: A clean UI to select or drop images.
-   **Preview**: Show the selected image.
-   **Action**: "Detect Disease" button.
-   **Results View**:
    -   **Diagnosis Card**: Disease Name, Confidence Score (e.g., 94%).
    -   **Treatment Card**: Step-by-step cure instructions.

### Step 3: Route Integration
-   Add `/farmer/:id/disease-detection` to the Farmer Layout.
-   Add a link in the Farmer Sidebar.

## Data Structure (Simulated Response)
```json
{
  "disease": "Late Blight",
  "crop": "Potato",
  "confidence": 0.95,
  "status": "Critical",
  "treatments": [
    "Apply fungicides containing mancozeb or chlorothalonil.",
    "Destroy infected plant debris immediately.",
    "Improve air circulation between plants."
  ]
}
```
