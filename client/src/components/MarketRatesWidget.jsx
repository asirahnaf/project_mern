import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTag, FaArrowUp, FaLeaf } from "react-icons/fa";

const MarketRatesWidget = () => {
    const [rates, setRates] = useState([]);

    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Public endpoint
                const response = await axios.get("http://localhost:5050/api/market/prices");
                setRates(response.data);
            } catch (error) {
                console.error("Failed to fetch market rates:", error);
            }
        };

        fetchRates();
    }, []);

    if (rates.length === 0) return null; // Don't show if empty

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3 text-green-800">
                <FaLeaf />
                <h3 className="font-bold text-lg">Daily Market Rates</h3>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Official
                </span>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                {rates.map((rate, index) => (
                    <div
                        key={index}
                        className="min-w-[140px] bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col items-center flex-shrink-0"
                    >
                        <span className="text-sm font-medium text-gray-600 capitalize">{rate.cropName}</span>
                        <div className="flex items-center gap-1 my-1">
                            <FaTag className="text-xs text-green-500" />
                            <span className="text-xl font-bold text-gray-800">Tk {rate.pricePerKg}</span>
                        </div>
                        <span className="text-xs text-gray-400">per kg</span>
                    </div>
                ))}
            </div>
            <p className="text-xs text-right text-gray-400 mt-2">
                *Prices are updated daily by administration
            </p>
        </div>
    );
};

export default MarketRatesWidget;
