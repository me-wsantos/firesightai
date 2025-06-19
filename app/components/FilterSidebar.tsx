"use client";

import { Calendar } from 'lucide-react';
import useAppContext from '../context/appContext';
import { Card } from './Card';
import Loading from './Loading';
import { Calendar as CalendarComponent } from './calendar';
import { Popover } from './popover';

export const FilterSidebar = () => {
  const { dataPrediction, isLoading, activeMap } = useAppContext();

  const {
    latitude,
    longitude,
    temperature_2m,
    wind_speed_10m,
    relative_humidity_2m,
    prediction,
    surface_pressure,
    et0_fao_evapotranspiration,
    soil_temperature_0_to_7cm,
    soil_moisture_0_to_7cm,
    vapour_pressure_deficit,
    shortwave_radiation_instant,
    boundary_layer_height
  } = dataPrediction;

  const getRiskText = () => {
    if (prediction >= .9) return 'Critical Risk';
    if (prediction >= .7) return 'High Risk';
    if (prediction >= .5) return 'Medium Risk';
    return 'Low Risk';
  };

  const getRiskColor = () => {
    if (prediction >= .9) return 'text-red-400';
    if (prediction >= .7) return 'text-orange-400';
    if (prediction >= .5) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="w-96 bg-slate-800 border-r border-slate-700 p-6 space-y-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Filter</h2>
      </div>

      <Card className="bg-slate-700 border-slate-600 p-4">
        <h3 className="font-medium mb-3 text-white flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Select Date
        </h3>
        <Popover>
            <CalendarComponent/>
        </Popover>
      </Card>


      { activeMap === 'predictive' && 
        <Card className="bg-slate-700 border-slate-600 p-6">


          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="mb-8 text-gray-400">Updating data...</div>
              <Loading isLoading={isLoading} />
            </div>
          ) :
            <>
              <div className="text-center mb-4">
                <h3 className={`text-lg font-semibold mb-2 ${getRiskColor()}`}>
                  { getRiskText() } 
                </h3>
                <div className="text-5xl font-bold mb-2 text-gray-300">
                  { prediction ? (prediction * 100 > 100 ? 100 : prediction * 100).toFixed(0) : 0 }<span className="text-2xl text-slate-300"> %</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Latitude:</span>
                  <span className="font-mono text-sm text-slate-300">
                    {latitude && latitude.toFixed(4)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Longitude:</span>
                  <span className="font-mono text-sm text-slate-300">
                    {longitude && longitude.toFixed(4)}
                  </span>
                </div>

                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Temperature:</span>
                  <span className="font-semibold  text-sm text-slate-300">
                    {temperature_2m && temperature_2m.toFixed(0)} °C
                  </span>
                </div>

                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Wind Speed:</span>
                  <span className="text-slate-300 text-sm">{wind_speed_10m && wind_speed_10m.toFixed(0)} km/h</span>
                </div>

                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Humidity:</span>
                  <span className="text-slate-300 text-sm">{relative_humidity_2m} %</span>
                </div>

                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Evapotranspiration (ET₀):</span>
                  <span className="text-slate-300 text-sm">{et0_fao_evapotranspiration && et0_fao_evapotranspiration.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Soil Temperature (0-7 cm):</span>
                  <span className="text-slate-300 text-sm">{soil_temperature_0_to_7cm && soil_temperature_0_to_7cm.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Surface pressure:</span>
                  <span className="text-slate-300 text-sm">{surface_pressure && surface_pressure.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Soil Moisture (0-7 cm):</span>
                  <span className="text-slate-300 text-sm">{soil_moisture_0_to_7cm && soil_moisture_0_to_7cm.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Vapour Pressure Deficit:</span>
                  <span className="text-slate-300 text-sm">{vapour_pressure_deficit && vapour_pressure_deficit.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Shortwave Radiation Sum:</span>
                  <span className="text-slate-300 text-sm">{shortwave_radiation_instant && shortwave_radiation_instant.toFixed(1)}</span>
                </div>
                
                <div className="flex justify-between items-center hover:bg-gray-600 px-2 my-0">
                  <span className="text-slate-400 text-sm">Boundary Layer Height PBL:</span>
                  <span className="text-slate-300 text-sm">{boundary_layer_height && boundary_layer_height.toFixed(0)}</span>
                </div>
              </div>
            </>
          }
        </Card>
      }

    </div>
  );
};