export const getWeatherDescription = (code) => {
    // WMO Weather interpretation codes (WW)
    // Code 0: Clear sky
    // Code 1, 2, 3: Mainly clear, partly cloudy, and overcast
    // Code 45, 48: Fog and depositing rime fog
    // Code 51, 53, 55: Drizzle: Light, moderate, and dense intensity
    // Code 56, 57: Freezing Drizzle: Light and dense intensity
    // Code 61, 63, 65: Rain: Slight, moderate and heavy intensity
    // Code 66, 67: Freezing Rain: Light and heavy intensity
    // Code 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
    // Code 77: Snow grains
    // Code 80, 81, 82: Rain showers: Slight, moderate, and violent
    // Code 85, 86: Snow showers slight and heavy
    // Code 95 *: Thunderstorm: Slight or moderate
    // Code 96, 99 *: Thunderstorm with slight and heavy hail

    if (code === 0) return { label: "Clear Sky", icon: "☀️", color: "text-yellow-500" };
    if ([1, 2, 3].includes(code)) return { label: "Partly Cloudy", icon: "pV", color: "text-blue-400" };
    if ([45, 48].includes(code)) return { label: "Foggy", icon: "🌫️", color: "text-gray-400" };
    if ([51, 53, 55, 56, 57].includes(code)) return { label: "Drizzle", icon: "🌦️", color: "text-blue-300" };
    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return { label: "Rainy", icon: "🌧️", color: "text-blue-600" };
    if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: "Snowy", icon: "❄️", color: "text-indigo-200" };
    if ([95, 96, 99].includes(code)) return { label: "Thunderstorm", icon: "⛈️", color: "text-purple-600" };

    return { label: "Unknown", icon: "❓", color: "text-gray-500" };
};

export const getClimateRisk = (currentWeather, dailyForecast) => {
    const risks = [];

    // Check Current or Today's Forecast
    const maxTemp = dailyForecast.temperature_2m_max[0];
    const minTemp = dailyForecast.temperature_2m_min[0];
    const rainSum = dailyForecast.precipitation_sum[0];
    const windSpeed = currentWeather.windspeed;

    // Heat Risk
    if (maxTemp >= 36) {
        risks.push({
            type: "High Heat",
            message: `Extreme heat (${maxTemp}°C). Irrigate crops frequently to prevent wilting.`,
            severity: "high",
            color: "red"
        });
    } else if (maxTemp >= 32) {
        risks.push({
            type: "Heat Advisory",
            message: `High temperature (${maxTemp}°C). Ensure livestock has shade and water.`,
            severity: "medium",
            color: "orange"
        });
    }

    // Cold Risk
    if (minTemp <= 10) {
        risks.push({
            type: "Cold Snap",
            message: `Low temperature (${minTemp}°C). Protect sensitive seedlings from frost.`,
            severity: "medium",
            color: "blue"
        });
    }

    // Rain/Flood Risk
    if (rainSum >= 50) {
        risks.push({
            type: "Heavy Rain Alert",
            message: `Heavy rainfall expected (${rainSum}mm). Ensure drainage systems are clear.`,
            severity: "high",
            color: "red"
        });
    } else if (rainSum >= 20) {
        risks.push({
            type: "Rain Advisory",
            message: `Moderate rain (${rainSum}mm). Delay applying fertilizers/pesticides.`,
            severity: "low",
            color: "yellow"
        });
    }

    // Wind Risk
    if (windSpeed > 40) {
        risks.push({
            type: "High Wind Warning",
            message: `Strong winds (${windSpeed} km/h). Secure tall crops (e.g. maize/banana) and greenhouse structures.`,
            severity: "high",
            color: "red"
        });
    }

    return risks;
};
