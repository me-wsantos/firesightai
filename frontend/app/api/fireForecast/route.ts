/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { fetchWeatherApi } from 'openmeteo';

export async function POST(request: NextRequest) {
  const { lat, long, startDate, startHour } = await request.json();

  if (!lat || !long || !startDate || !startHour) {
    console.error("Missing required parameters: latitude, longitude, or start_date");
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const params = {
    "latitude": lat,
    "longitude": long,
    "start_date": startDate,
    "end_date": startDate,
    "daily": ["soil_temperature_0_to_7cm_mean", "soil_moisture_0_to_7cm_mean", "shortwave_radiation_sum"],
	  "hourly": ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "surface_pressure", "et0_fao_evapotranspiration", "vapour_pressure_deficit", "boundary_layer_height"]
  };

  const url = "https://historical-forecast-api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();

  const hourly = response.hourly()!;
  const daily = response.daily()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    hourly: {
      time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
        (_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
      ),
      temperature_2m: hourly.variables(0)!.valuesArray()!,
      relative_humidity_2m: hourly.variables(1)!.valuesArray()!,
      wind_speed_10m: hourly.variables(2)!.valuesArray()!,
      surface_pressure: hourly.variables(3)!.valuesArray()!,
      et0_fao_evapotranspiration: hourly.variables(4)!.valuesArray()!,
      vapour_pressure_deficit: hourly.variables(5)!.valuesArray()!,
      boundary_layer_height: hourly.variables(6)!.valuesArray()!,
    },
    daily: {
      time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
      ),
      soil_temperature_0_to_7cm_mean: daily.variables(0)!.valuesArray()!,
      soil_moisture_0_to_7cm_mean: daily.variables(1)!.valuesArray()!,
      shortwave_radiation_sum: daily.variables(2)!.valuesArray()!,
    },
  };

  // Convert the weather data to a more usable format
  const temperatures: number[] | { "0": number } = weatherData.hourly.temperature_2m != null ? Object.values(weatherData.hourly.temperature_2m) : Array(23).fill(0);
  const humidities: number[] | { "0": number } = weatherData.hourly.relative_humidity_2m != null ? Object.values(weatherData.hourly.relative_humidity_2m) : Array(23).fill(0);
  const windSpeeds: number[] | { "0": number } = weatherData.hourly.wind_speed_10m != null ? Object.values(weatherData.hourly.wind_speed_10m) : Array(23).fill(0);
  const surfacePressures: number[] | { "0": number } = weatherData.hourly.surface_pressure != null ? Object.values(weatherData.hourly.surface_pressure) : Array(23).fill(0);
  const evapotranspirations: number[] | { "0": number } = weatherData.hourly.et0_fao_evapotranspiration != null ? Object.values(weatherData.hourly.et0_fao_evapotranspiration) : Array(23).fill(0);
  const vapourPressureDeficits: number[] | { "0": number } = weatherData.hourly.vapour_pressure_deficit != null ? Object.values(weatherData.hourly.vapour_pressure_deficit) : Array(23).fill(0);
  const boundaryLayerHeights: number[] | { "0": number } = weatherData.hourly.boundary_layer_height != null ? Object.values(weatherData.hourly.boundary_layer_height) : Array(23).fill(0);
  const soilTemperature0to7cm: number[] | { "0": number } = weatherData.daily.soil_temperature_0_to_7cm_mean != null ? Object.values(weatherData.daily.soil_temperature_0_to_7cm_mean) : Array(23).fill(0);
  const soilMoisture0to7cm: number[] | { "0": number } = weatherData.daily.soil_moisture_0_to_7cm_mean != null ? Object.values(weatherData.daily.soil_moisture_0_to_7cm_mean) : Array(23).fill(0);
  const shortwaveRadiationSum: number[] | { "0": number } = weatherData.daily.shortwave_radiation_sum != null ? Object.values(weatherData.daily.shortwave_radiation_sum) : Array(23).fill(0);

  const dataPrediction = {
    latitude: lat,
    longitude: long,
    temperature_2m: Array.isArray(temperatures) ? temperatures[startHour] : 0,
    relative_humidity_2m: Array.isArray(humidities) ? humidities[startHour] : 0,
    wind_speed_10m: Array.isArray(windSpeeds) ? windSpeeds[startHour] : 0,
    surface_pressure: Array.isArray(surfacePressures) ? surfacePressures[startHour] : 0,
    et0_fao_evapotranspiration: Array.isArray(evapotranspirations) ? evapotranspirations[startHour] : 0,
    soil_temperature_0_to_7cm: Array.isArray(soilTemperature0to7cm) ? (Number.isNaN(soilTemperature0to7cm[0]) ? 0 : soilTemperature0to7cm[0]) : 0,
    soil_moisture_0_to_7cm: Array.isArray(soilMoisture0to7cm) ? (Number.isNaN(soilMoisture0to7cm[0]) ? 0 : soilMoisture0to7cm[0]) : 0,
    vapour_pressure_deficit: Array.isArray(vapourPressureDeficits) ? vapourPressureDeficits[startHour] : 0,
    shortwave_radiation_instant: Array.isArray(shortwaveRadiationSum) ? (Number.isNaN(shortwaveRadiationSum[0]) ? 0 : shortwaveRadiationSum[0]) : 0,
    boundary_layer_height: Array.isArray(boundaryLayerHeights) ? boundaryLayerHeights[startHour] : 0,
  }

  const prediction = await getFirePrediction(dataPrediction);
  return NextResponse.json({...dataPrediction, prediction});
}

async function getFirePrediction(params: any) {
  
  const apiUrl = "https://fire-endpoint.azurewebsites.net/api/fire_prediction?code=G-evRK89sNgAmVjKwFNHAZ7u6uxerG5ItEqN-XU2xV_7AzFuCpUWBw==";
  const data = await axios.get(apiUrl, {params});

  if (data.status !== 200) {
    throw new Error("Failed to fetch fire prediction data");
  }

  const fireData = data.data.Results[0];
  return fireData;
}