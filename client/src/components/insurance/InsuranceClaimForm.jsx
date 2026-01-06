import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const InsuranceClaimForm = () => {
    const [formData, setFormData] = useState({
        cropName: '',
        incidentDate: '',
        description: '',
        claimAmount: '',
        incidentImage: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // In a real app, handle image upload to cloud here first, getting URL
            // For now, assume incidentImage is a string URL or just text description of image location if we don't implement full upload logic

            const res = await axios.post('http://localhost:5050/api/insurance/claims', formData, {
                withCredentials: true
            });

            if (res.status === 201) {
                toast.success('Claim submitted successfully');
                // Navigate back to list
                navigate(-1);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Error submitting claim');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Submit Crop Insurance Claim</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Crop Name</label>
                    <input
                        type="text"
                        name="cropName"
                        value={formData.cropName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                        required
                        placeholder="e.g. Wheat, Corn"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Incident Date</label>
                    <input
                        type="date"
                        name="incidentDate"
                        value={formData.incidentDate}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Claim Amount ($)</label>
                    <input
                        type="number"
                        name="claimAmount"
                        value={formData.claimAmount}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                        required
                        min="0"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Description of Incident</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                        required
                        placeholder="Describe what happened (e.g. flood damage, pest infestation)..."
                    ></textarea>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                    <input
                        type="text"
                        name="incidentImage"
                        value={formData.incidentImage}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                        placeholder="http://..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Submitting...' : 'Submit Claim'}
                </button>
            </form>
        </div>
    );
};

export default InsuranceClaimForm;
