import React, { useState, useEffect } from "react";
import MainContainer from "../container/MainContainer";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import axios from "axios";
import { useSelector } from "react-redux";

const AnalyticsPage = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5050/api/product/all");
                if (response.data && response.data.data) {
                    setProducts(response.data.data);
                    if (response.data.data.length > 0) {
                        setSelectedProduct(response.data.data[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching products", error);
            }
        };
        fetchProducts();
    }, []);

    const formatData = (history) => {
        if (!history) return [];
        return history.map((entry) => ({
            date: new Date(entry.date).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            price: entry.price,
        }));
    };

    return (
        <div className="w-full mt-24 min-h-screen bg-gray-50 p-6">
            <MainContainer>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Market Analytics</h1>
                    <p className="text-gray-600">Track real-time price trends for agricultural produce.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar / List */}
                    <div className="md:col-span-1 bg-white p-4 rounded-xl shadow-sm h-fit">
                        <h3 className="font-semibold text-lg mb-4 text-gray-700">Select Crop</h3>
                        <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto">
                            {products.map((product) => (
                                <button
                                    key={product._id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`p-3 text-left rounded-lg transition-all ${selectedProduct?._id === product._id
                                        ? "bg-green-100 text-green-700 border-l-4 border-green-600"
                                        : "hover:bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-xs text-gray-400">Current: ₹{product.pricePerKg}/kg</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Chart Area */}
                    <div className="md:col-span-3 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        {selectedProduct ? (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                                        <p className="text-sm text-gray-500">Price History Visualization</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Current Price</p>
                                        <p className="text-3xl font-bold text-green-600">₹{selectedProduct.pricePerKg}</p>
                                    </div>
                                </div>

                                <div className="h-[400px] w-full">
                                    {selectedProduct.priceHistory && selectedProduct.priceHistory.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart
                                                data={formatData(selectedProduct.priceHistory)}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                                <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                                                <YAxis stroke="#9ca3af" fontSize={12} />
                                                <Tooltip
                                                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                                />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="price"
                                                    stroke="#16a34a"
                                                    strokeWidth={3}
                                                    activeDot={{ r: 8 }}
                                                    dot={{ fill: '#16a34a', strokeWidth: 2 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <p>No price history data available for this crop yet.</p>
                                            <p className="text-sm mt-2">Price updates will appear here.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                Select a crop to view analytics
                            </div>
                        )}
                    </div>
                </div>
            </MainContainer>
        </div>
    );
};

export default AnalyticsPage;
