import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyRentals, addEquipment } from '../../features/equipment/equipmentSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const RentalDashboard = () => {
    const dispatch = useDispatch();
    const { myRentals } = useSelector((state) => state.equipment);
    const [activeTab, setActiveTab] = useState('rentals'); // 'rentals' or 'listings'

    // Listing Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Other',
        dailyRate: '',
        location: '',
        images: [] // Handle image URL input for simplicity first
    });
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        if (activeTab === 'rentals') {
            dispatch(fetchMyRentals());
        }
    }, [dispatch, activeTab]);

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const dataToSend = {
            ...formData,
            images: imageUrl ? [imageUrl] : []
        };
        const result = await dispatch(addEquipment(dataToSend));
        if (addEquipment.fulfilled.match(result)) {
            setShowAddForm(false);
            // Reset form
            setFormData({ name: '', description: '', category: 'Other', dailyRate: '', location: '', images: [] });
            setImageUrl('');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Rental Dashboard</h1>

            <div className="flex gap-4 border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('rentals')}
                    className={`pb-3 px-4 font-medium transition ${activeTab === 'rentals' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                >
                    My Rentals
                </button>
                <button
                    onClick={() => setActiveTab('listings')}
                    className={`pb-3 px-4 font-medium transition ${activeTab === 'listings' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500'
                        }`}
                >
                    List Equipment
                </button>
            </div>

            {activeTab === 'rentals' && (
                <div className="space-y-4">
                    {myRentals.length === 0 ? (
                        <div className="text-gray-500 py-8">You haven't rented any equipment yet.</div>
                    ) : (
                        myRentals.map((rental) => (
                            <div key={rental._id} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{rental.equipment?.name || 'Unknown Equipment'}</h3>
                                    <div className="text-gray-500 text-sm">
                                        {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-lg">{rental.totalCost} BDT</div>
                                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${rental.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                            rental.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                        }`}>
                                        {rental.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'listings' && (
                <div>
                    {!showAddForm ? (
                        <div className="text-center py-10 bg-gray-50 rounded-xl border-dashed border-2 border-gray-300">
                            <h3 className="text-lg font-medium text-gray-700 mb-2">Earn by renting your equipment</h3>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                            >
                                List New Equipment
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
                            <h2 className="text-xl font-bold mb-4">List New Equipment</h2>
                            <form onSubmit={handleAddSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Equipment Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded p-2"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Category</label>
                                        <select
                                            className="w-full border rounded p-2"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            {['Tractor', 'Harvester', 'Planter', 'Irrigation', 'Tool', 'Other'].map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Daily Rate (BDT)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full border rounded p-2"
                                            value={formData.dailyRate}
                                            onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border rounded p-2"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                                    <input
                                        type="url"
                                        className="w-full border rounded p-2"
                                        placeholder="https://test.com/image.jpg"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full border rounded p-2"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddForm(false)}
                                        className="w-1/3 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                                    >
                                        Create Listing
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default RentalDashboard;
