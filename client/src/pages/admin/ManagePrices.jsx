import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaEdit, FaSave } from "react-icons/fa";

const ManagePrices = () => {
    const [prices, setPrices] = useState([]);
    const [formData, setFormData] = useState({
        cropName: "",
        pricePerKg: "",
        category: "vegetable"
    });

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const response = await axios.get("http://localhost:5050/api/admin/prices", {
                withCredentials: true
            });
            setPrices(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load market prices");
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5050/api/admin/prices", formData, {
                withCredentials: true
            });
            toast.success("Market price updated successfully");
            setFormData({ cropName: "", pricePerKg: "", category: "vegetable" });
            fetchPrices(); // Refresh list
        } catch (error) {
            console.error(error);
            toast.error("Failed to update price");
        }
    };

    // Helper to pre-fill form for editing
    const handleEdit = (price) => {
        setFormData({
            cropName: price.cropName,
            pricePerKg: price.pricePerKg,
            category: price.category
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Form Section */}
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
                    <h2 className="text-xl font-bold mb-4 text-green-800">Set Daily Market Price</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Crop Name</label>
                            <input
                                type="text"
                                name="cropName"
                                value={formData.cropName}
                                onChange={handleInputChange}
                                placeholder="e.g. Potato, Rice"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price (BDT / Kg)</label>
                            <input
                                type="number"
                                name="pricePerKg"
                                value={formData.pricePerKg}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                            >
                                <option value="vegetable">Vegetable</option>
                                <option value="fruit">Fruit</option>
                                <option value="grain">Grain</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <FaSave className="mr-2" /> Save Price
                        </button>
                    </form>
                </div>
            </div>

            {/* List Section */}
            <div className="lg:col-span-2">
                <h2 className="text-xl font-bold mb-4">Current Market Prices</h2>
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price/Kg</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {prices.length > 0 ? prices.map((price) => (
                                <tr key={price._id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {price.cropName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                        {price.category}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                                        Tk {price.pricePerKg}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(price.updatedAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(price)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <FaEdit />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        No prices set yet. Add one from the form.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default ManagePrices;
