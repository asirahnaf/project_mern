import React, { useState } from "react";
import { FaCloudUploadAlt, FaMicroscope, FaNotesMedical, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { analyzeCropImage } from "../../utils/aiService";
import { toast } from "react-hot-toast";

const DiseaseDetectionPage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null); // Reset previous result
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) {
            toast.error("Please select an image first.");
            return;
        }

        setAnalyzing(true);
        try {
            // Call our simulated AI service
            const data = await analyzeCropImage(selectedImage);
            setResult(data);
            toast.success("Analysis Complete!");
        } catch (error) {
            console.error("Analysis failed:", error);
            toast.error("Analysis failed. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="w-full bg-slate-50 min-h-screen p-8">
            <h1 className="text-3xl font-bold text-teal-800 mb-2 flex items-center gap-3">
                <FaMicroscope /> Crop Doctor AI
            </h1>
            <p className="text-gray-600 mb-8 max-w-2xl">
                Upload a photo of your infected crop. Our AI system will analyze symptoms, detect the disease, and suggest immediate treatments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Upload Section */}
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 flex flex-col items-center justify-center">
                    {previewUrl ? (
                        <div className="relative w-full max-h-[400px] overflow-hidden rounded-xl mb-6 shadow-md">
                            <img src={previewUrl} alt="Crop Preview" className="w-full object-cover" />
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-teal-300 border-dashed rounded-xl cursor-pointer bg-teal-50 hover:bg-teal-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <FaCloudUploadAlt className="text-5xl text-teal-600 mb-3" />
                                <p className="mb-2 text-sm text-center text-teal-700 font-semibold">Click to upload or drag and drop</p>
                                <p className="text-xs text-teal-500">JPG, PNG (Max 5MB)</p>
                            </div>
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    )}

                    <button
                        onClick={handleAnalyze}
                        disabled={!selectedImage || analyzing}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${analyzing
                                ? "bg-gray-400 cursor-not-allowed text-gray-100"
                                : "bg-teal-700 hover:bg-teal-800 text-white hover:scale-[1.02]"
                            }`}
                    >
                        {analyzing ? (
                            <>Processing Image...</>
                        ) : (
                            <>
                                <FaNotesMedical /> Analyze Crop Health
                            </>
                        )}
                    </button>
                    {analyzing && <p className="mt-3 text-sm text-gray-500 animate-pulse">This usually takes about 5 seconds...</p>}
                </div>

                {/* Results Section */}
                <div className="flex flex-col gap-6">
                    {!result && !analyzing && (
                        <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center text-gray-400">
                            <FaMicroscope className="text-6xl mb-4 opacity-20" />
                            <h3 className="text-xl font-medium">Ready to Diagnose</h3>
                            <p>Upload an image to see the analysis report here.</p>
                        </div>
                    )}

                    {analyzing && (
                        <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-600 mb-4"></div>
                            <h3 className="text-xl font-medium text-teal-800">Analyzing biological markers...</h3>
                        </div>
                    )}

                    {result && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                            {/* Diagnosis Card */}
                            <div className={`rounded-xl p-6 border-l-8 shadow-sm ${result.name === 'Healthy Crop' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                                }`}>
                                <h2 className="text-sm font-bold uppercase tracking-wider opacity-70 mb-1">Diagnosis Result</h2>
                                <h3 className={`text-3xl font-extrabold mb-2 ${result.name === 'Healthy Crop' ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {result.name}
                                </h3>
                                <div className="flex items-center gap-4 text-sm font-medium">
                                    <span className="bg-white/60 px-3 py-1 rounded-full">Confidence: {(result.confidence * 100).toFixed(0)}%</span>
                                    {result.severity !== 'None' && (
                                        <span className="flex items-center gap-1 text-red-700">
                                            <FaExclamationTriangle /> Severity: {result.severity}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Details & Treatment */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FaNotesMedical className="text-teal-600" />
                                    Treatment & Advisory
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-500 uppercase mb-2">Symptoms Detected</h5>
                                        <ul className="space-y-1">
                                            {result.symptoms.map((sym, i) => (
                                                <li key={i} className="flex items-start gap-2 text-gray-700">
                                                    <span className="mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0"></span>
                                                    {sym}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4">
                                        <h5 className="text-sm font-semibold text-gray-500 uppercase mb-2">Recommended Cure</h5>
                                        <ul className="space-y-2">
                                            {result.treatments.map((treat, i) => (
                                                <li key={i} className="flex items-start gap-3 bg-teal-50 p-3 rounded-lg text-teal-900 border border-teal-100">
                                                    <FaCheckCircle className="mt-1 text-teal-600 flex-shrink-0" />
                                                    {treat}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DiseaseDetectionPage;
