import React, { useEffect, useState } from "react";
import axios from "axios";
import { getWeatherDescription, getClimateRisk } from "../utils/weatherUtils";
import { FaMapMarkerAlt, FaTemperatureHigh, FaWind, FaTint, FaExclamationTriangle } from "react-icons/fa";

const WeatherAdvisoryWidget = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState("Detecting Location...");

    useEffect(() => {
        // 1. Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeather(position.coords.latitude, position.coords.longitude);
                },
                (err) => {
                    console.error("Geolocation denied or error:", err);
                    // Default to Dhaka, Bangladesh if permission denied
                    setLocationName("Dhaka (Default)");
                    fetchWeather(23.8103, 90.4125);
                }
            );
        } else {
            setLocationName("Dhaka (Default)");
            fetchWeather(23.8103, 90.4125);
        }
    }, []);

    const fetchWeather = async (lat, lon) => {
        try {
            // Fetch readable location name (Reverse Geocoding optional, or just show Lat/Lon)
            // For simplicity/speed, we'll try to guess or just set generic, but let's try a simple reverse geocoding if possible?
            // Actually Open-Meteo doesn't give city name. We'll stick to coordinates or "Local Weather".
            // But we can approximate.

            const response = await axios.get(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
            );

            setWeatherData(response.data);
            if (locationName === "Detecting Location...") {
                setLocationName("Local Weather");
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching weather:", err);
            setError("Failed to load weather data.");
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="w-full bg-white rounded-xl shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
        </div>
    );

    if (error) return (
        <div className="w-full bg-red-50 rounded-xl p-4 text-red-700 text-sm">
            {error}
        </div>
    );

    if (!weatherData) return null;

    const current = weatherData.current_weather;
    const daily = weatherData.daily;
    const weatherInfo = getWeatherDescription(current.weathercode);
    const risks = getClimateRisk(current, daily);

    // Determine widget background based on risk
    const hasHighRisk = risks.some(r => r.severity === 'high');
    const widgetBg = hasHighRisk ? "bg-red-50 border-red-100" : "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100";

    return (
        <div className={`w-full rounded-xl shadow-sm border p-6 mb-6 ${widgetBg}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {weatherInfo.icon} {weatherInfo.label}
                    </h2>
                    <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{locationName}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-4xl font-bold text-gray-800">{Math.round(current.temperature)}°C</span>
                    <p className="text-xs text-gray-500">
                        H: {Math.round(daily.temperature_2m_max[0])}° L: {Math.round(daily.temperature_2m_min[0])}°
                    </p>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/60 rounded-lg p-3 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                        <FaWind />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Wind Speed</p>
                        <p className="font-semibold text-gray-700">{current.windspeed} km/h</p>
                    </div>
                </div>
                <div className="bg-white/60 rounded-lg p-3 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                        <FaTint />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Precipitation</p>
                        <p className="font-semibold text-gray-700">{daily.precipitation_sum[0]} mm</p>
                    </div>
                </div>
            </div>

            {/* Risk Advisory Section */}
            {risks.length > 0 ? (
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <FaExclamationTriangle className="text-orange-500" />
                        Farm Advisories
                    </h3>
                    {risks.map((risk, index) => (
                        <div key={index} className={`p-3 rounded-lg border-l-4 text-sm ${risk.color === 'red' ? 'bg-red-100 border-red-500 text-red-800' :
                                risk.color === 'orange' ? 'bg-orange-100 border-orange-500 text-orange-800' :
                                    risk.color === 'blue' ? 'bg-blue-100 border-blue-500 text-blue-800' :
                                        'bg-yellow-100 border-yellow-500 text-yellow-800'
                            }`}>
                            <span className="font-bold block mb-1">{risk.type}</span>
                            {risk.message}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-green-100 text-green-800 p-3 rounded-lg text-sm border-l-4 border-green-500">
                    <span className="font-bold">✅ Good Growing Conditions</span>
                    <br /> No significant weather risks detected today.
                </div>
            )}
        </div>
    );
};

export default WeatherAdvisoryWidget;
