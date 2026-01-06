# Implementation Plan - Weather & Climate Risk Advisory System

## Objective
Implement a real-time weather forecast and climate risk advisory system using Open-Meteo (Free, No API Key required) to provide farmers with actionable insights.

## features
1.  **Current Weather Display**: Temperature, condition (Sunny, Rainy, etc.), and wind speed.
2.  **Forecast**: 3-Day outlook.
3.  **Climate Risk Alerts**: Automatic warnings generated based on weather data (e.g., "High Heat Alert", "Heavy Rain Warning").

## Technology Stack
-   **API**: Open-Meteo API (https://open-meteo.com/)
-   **Frontend**: React, Axios, TailwindCSS

## Implementation Steps

### Step 1: Weather Utility (`client/src/utils/weatherUtils.js`)
-   Create helper functions to map WMO weather codes (e.g., 0, 1, 2, 3...) to user-friendly names (Clear, Cloudy, Rain) and icons.
-   Define risk thresholds (e.g., Temp > 35°C = Heat Wave).

### Step 2: Weather Widget Component (`client/src/components/WeatherAdvisoryWidget.jsx`)
-   **Fetch Data**: Use `axios` to get data from Open-Meteo.
    -   *Endpoint*: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
-   **Location**: Use Browser Geolocation (`navigator.geolocation`) to get the user's local weather. Default to a central location (e.g., Dhaka) if denied.
-   **Risk Logic**:
    -   If `precipitation_sum` > 20mm -> Show "Flood/Waterlogging Risk".
    -   If `temperature_max` > 36°C -> Show "Heat Stress Advisory".
    -   If `temperature_min` < 10°C -> Show "Cold Snap Warning".

### Step 3: Integration
-   Add `WeatherAdvisoryWidget` to:
    -   `FarmerHomePage` (Primary audience).
    -   `HomeFeedPage` (General audience).

## Detailed Workflow
1.  **User Visits Dashboard**.
2.  **Widget Loads**: Checks for location permission.
3.  **API Call**: Fetches weather data (< 200ms usually).
4.  **Render**: Displays current temp and any computed active alerts (Red/Orange badges).
