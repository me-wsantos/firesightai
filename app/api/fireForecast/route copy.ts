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
    "daily": ["precipitation_sum", "temperature_2m_max"],
    "hourly": ["temperature_2m", "relative_humidity_2m", "precipitation", "surface_pressure", "wind_speed_10m", "cloud_cover", "evapotranspiration", "soil_temperature_0cm"]
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
      temperature2m: hourly.variables(0)!.valuesArray()!,
      relativeHumidity2m: hourly.variables(1)!.valuesArray()!,
      precipitation: hourly.variables(2)!.valuesArray()!,
      surfacePressure: hourly.variables(3)!.valuesArray()!,
      windSpeed10m: hourly.variables(4)!.valuesArray()!,
      cloudCover: hourly.variables(5)!.valuesArray()!,
      evapotranspiration: hourly.variables(6)!.valuesArray()!,
      soilTemperature0cm: hourly.variables(7)!.valuesArray()!,
    },
    daily: {
      time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
        (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
      ),
      precipitationSum: daily.variables(0)!.valuesArray()!,
      temperature2mMax: daily.variables(1)!.valuesArray()!,
    },
  };

  const dataPrediction = {
    latitude: lat,
    longitude: long,
    temperature_2m: weatherData.hourly.temperature2m[startHour],
    relative_humidity_2m: weatherData.hourly.relativeHumidity2m[startHour],
    precipitation: weatherData.hourly.precipitation[startHour],
    wind_speed_10m: weatherData.hourly.windSpeed10m[startHour],
    cloud_cover: weatherData.hourly.cloudCover[startHour],
    surface_pressure: 991.3,
    pressure_msl: 1010.8,
    et0_fao_evapotranspiration: weatherData.hourly.evapotranspiration[startHour],
    soil_temperature_0_to_7cm: weatherData.hourly.soilTemperature0cm[startHour],
    daily_precipitation_sum: weatherData.daily.precipitationSum[0],
    daily_temperature_2m_max: weatherData.daily.temperature2mMax[0]
  }

  const prediction = await getFirePrediction(dataPrediction);
  return NextResponse.json({...dataPrediction, prediction});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getFirePrediction(params: any) {
  const apiUrl = "https://fire-endpoint.azurewebsites.net/api/fire_prediction?code=G-evRK89sNgAmVjKwFNHAZ7u6uxerG5ItEqN-XU2xV_7AzFuCpUWBw==";
  const data = await axios.get(apiUrl, {params});

  if (data.status !== 200) {
    throw new Error("Failed to fetch fire prediction data");
  }

  const fireData = data.data.Results[0];
  return fireData;
}