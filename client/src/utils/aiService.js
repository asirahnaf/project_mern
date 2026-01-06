// Simulated AI Service for Crop Disease Detection
// In a real production app, this would call a Python/TensorFlow API.

const DISEASE_DATABASE = [
    {
        name: "Late Blight",
        crop: "Potato / Tomato",
        severity: "Critical",
        confidence: 0.94,
        symptoms: ["Dark, water-soaked spots on leaves", "White fungal growth on undersides", "Rotting tubers"],
        treatments: [
            "Apply fungicides containing mancozeb or chlorothalonil immediately.",
            "Destroy and remove all infected plant debris relative to the farm.",
            "Improve air circulation and avoid overhead irrigation to reduce humidity."
        ]
    },
    {
        name: "Rice Blast",
        crop: "Rice",
        severity: "High",
        confidence: 0.89,
        symptoms: ["Diamond-shaped lesions on leaves", "Gray or white centers with brown borders", "Stunted plant growth"],
        treatments: [
            "Use resistant rice varieties.",
            "Apply systemic fungicides like tricyclazole or isoprothiolane.",
            "Avoid excessive nitrogen fertilizer application."
        ]
    },
    {
        name: "Wheat Rust",
        crop: "Wheat",
        severity: "Moderate",
        confidence: 0.92,
        symptoms: ["Orange or reddish-brown pustules on leaves", "Yellowing of leaves", "Reduced grain yield"],
        treatments: [
            "Plant rust-resistant wheat varieties.",
            "Remove volunteer wheat plants and weeds.",
            "Apply foliar fungicides at the first sign of infection."
        ]
    },
    {
        name: "Powdery Mildew",
        crop: "Multiple (Cucumber, Squash)",
        severity: "Moderate",
        confidence: 0.96,
        symptoms: ["White powdery spots on leaves and stems", "Leaves curling or turning yellow", "Premature leaf drop"],
        treatments: [
            "Apply sulfur-based fungicides.",
            "Use neem oil or baking soda solution sprays.",
            "Prune overcrowded areas to increase airflow."
        ]
    },
    {
        name: "Healthy Crop",
        crop: "Unknown",
        severity: "None",
        confidence: 0.98,
        symptoms: ["Vibrant green leaves", "Strong stems", "No visible spots or pests"],
        treatments: [
            "Continue regular watering schedule.",
            "Maintain current fertilization plan.",
            "Monitor weekly for any changes."
        ]
    }
];

export const analyzeCropImage = async (imageFile) => {
    return new Promise((resolve) => {
        // Simulate network/processing delay (1.5 - 3 seconds)
        const delay = Math.floor(Math.random() * 1500) + 1500;

        setTimeout(() => {
            // For this MVP, we pick a random disease to simulate detection.
            // In a real version, we'd send 'imageFile' to a backend.
            const randomIndex = Math.floor(Math.random() * DISEASE_DATABASE.length);
            resolve(DISEASE_DATABASE[randomIndex]);
        }, delay);
    });
};
