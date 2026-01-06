import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEquipmentById, createBooking } from '../../features/equipment/equipmentSlice';
import { FaUser, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const EquipmentDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentEquipment, loading, error } = useSelector((state) => state.equipment);
    const { user } = useSelector((state) => state.auth);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        dispatch(fetchEquipmentById(id));
    }, [dispatch, id]);

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!startDate || !endDate) {
            return toast.error('Please select both start and end dates');
        }

        // Basic validation
        if (new Date(startDate) >= new Date(endDate)) {
            return toast.error('End date must be after start date');
        }

        // Check if dates are in the past
        if (new Date(startDate) < new Date().setHours(0, 0, 0, 0)) {
            return toast.error("Start date cannot be in the past");
        }

        const result = await dispatch(createBooking({
            equipmentId: id,
            startDate,
            endDate
        }));

        if (createBooking.fulfilled.match(result)) {
            navigate('/rental/dashboard');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading details...</div>;
    if (!currentEquipment) return <div className="p-8 text-center text-red-500">Equipment not found</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Section */}
                <div className="space-y-4">
                    <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                        {currentEquipment.images && currentEquipment.images.length > 0 ? (
                            <img
                                src={currentEquipment.images[0]}
                                alt={currentEquipment.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image Available
                            </div>
                        )}
                    </div>
                    {/* Thumbnail gallery could go here */}
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-sm font-semibold text-green-600 uppercase tracking-wide">
                                    {currentEquipment.category}
                                </span>
                                <h1 className="text-3xl font-bold text-gray-900 mt-1">{currentEquipment.name}</h1>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-green-700">{currentEquipment.dailyRate} BDT</div>
                                <span className="text-gray-500 text-sm">per day</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 text-gray-600">
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt />
                                <span>{currentEquipment.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaUser />
                                <span>Owned by {currentEquipment.owner?.name || 'Unknown'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="prose text-gray-600">
                        <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                        <p>{currentEquipment.description}</p>
                    </div>

                    {/* Booking Card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-green-600" />
                            Book this Equipment
                        </h3>
                        {user?.role === 'farmer' ? (
                            <form onSubmit={handleBooking} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                        <input
                                            type="date"
                                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                                            value={startDate}
                                            onChange={(e) => setStartDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                        <input
                                            type="date"
                                            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md active:scale-[0.98]"
                                >
                                    Request Booking
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    You won't be charged immediately. The owner needs to confirm availability.
                                </p>
                            </form>
                        ) : (
                            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-600">
                                Only farmers can rent equipment.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetails;
