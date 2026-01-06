import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchEquipment } from '../../features/equipment/equipmentSlice';
import { FaSearch, FaTractor } from 'react-icons/fa';

const RentalMarketplace = () => {
    const dispatch = useDispatch();
    const { items, loading } = useSelector((state) => state.equipment);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('All');

    useEffect(() => {
        dispatch(fetchEquipment({ search: searchTerm, category }));
    }, [dispatch, searchTerm, category]);

    const categories = ['All', 'Tractor', 'Harvester', 'Planter', 'Irrigation', 'Tool', 'Other'];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Equipment Rental</h1>
                    <p className="text-gray-600">Find and rent agricultural machinery near you.</p>
                </div>
                <Link
                    to="/rental/dashboard"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                    My Rentals & Listings
                </Link>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">
                <div className="relative w-full md:w-1/2 lg:w-1/3">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search equipment..."
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-green-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-200 ${category === cat
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading equipment...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <Link key={item._id} to={`/rental/${item._id}`} className="group">
                            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 overflow-hidden h-full flex flex-col">
                                <div className="h-48 bg-gray-200 relative">
                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <FaTractor size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold text-gray-700 shadow-sm">
                                        {item.category}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-green-600 transition">
                                        {item.name}
                                    </h3>
                                    <div className="text-gray-500 text-sm mb-4 line-clamp-2">
                                        {item.description}
                                    </div>
                                    <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100">
                                        <div>
                                            <span className="text-lg font-bold text-green-700">{item.dailyRate} BDT</span>
                                            <span className="text-xs text-gray-500"> /day</span>
                                        </div>
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {item.location}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {!loading && items.length === 0 && (
                <div className="text-center py-20">
                    <FaTractor className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-xl font-semibold text-gray-600">No equipment found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
};

export default RentalMarketplace;
