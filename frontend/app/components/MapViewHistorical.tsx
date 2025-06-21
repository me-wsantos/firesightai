/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState, useRef } from 'react';
import useAppContext from '../context/appContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Loading from './Loading';

const coordinates = [
  { id: 1, title: "World", coordinates: "-180,-90,180,90" },
  { id: 2, title: "Canada", coordinates: "-150,40,-49,79" },
  { id: 3, title: "Alaska", coordinates: "-180,50,-139,72" },
  { id: 4, title: "USA", coordinates: "-160.5,17.5,-63.8,50" },
  { id: 5, title: "Central America", coordinates: "-119.5,7,-58.5,33.5" },
  { id: 6, title: "South America", coordinates: "-112,-60,-26,13" },
  { id: 7, title: "Europe", coordinates: "-26,34,35,82" },
  { id: 8, title: "North and Central Africa", coordinates: "-27,-10,52,37.5" },
  { id: 9, title: "Southern Africa", coordinates: "10,-36,58.5,-4" },
  { id: 10, title: "Russia and Asia", coordinates: "26,9,180,83.5" },
  { id: 11, title: "South Asia", coordinates: "54,5.5,102,40" },
  { id: 12, title: "South East Asia", coordinates: "88,-12,163,31" },
  { id: 13, title: "Australia and New Zealand", coordinates: "110,-55,180,-10" },
]

export const MapViewHistorical = () => {
  const { startDate } = useAppContext();
  const mapRef = useRef(null);
  const map = useRef<L.Map | null>(null);

  const markersLayer = useRef<L.LayerGroup<any> | null>(null);
  interface FireData {
    latitude: number;
    longitude: number;
    frp: number;
    bright_ti4: number;
    confidence: string;
    acq_date: string; // Added property for acquisition date
    acq_time: string; // Added property for acquisition time
    satellite: string; // Added property for satellite
    daynight: string; // Added property for day/night period
  }

  const [fireData, setFireData] = useState<FireData[]>([]);
  const [loading, setLoading] = useState(false);
  const [region, setRegion] = useState(4);
  const [selectedRegion, setSelectedRegion] = useState(coordinates[region - 1].coordinates);

  // States to store selected coordinates
  const [selectedLatitude, setSelectedLatitude] = useState<number | null>(null);
  const [selectedLongitude, setSelectedLongitude] = useState<number | null>(null);
  const [selectedFireData, setSelectedFireData] = useState<FireData | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create map
    map.current = L.map(mapRef.current).setView([0, 0], 2);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Create layer group for markers
    markersLayer.current = L.layerGroup().addTo(map.current);

    return () => {
      map.current?.remove();
    };
  }, [region]);

  // Function to determine fire color
  const getFireColor = (frp: number) => {
    if (frp > 10) return '#ff0000';
    if (frp > 5) return '#ff6600';
    if (frp > 2) return '#ffaa00';
    return '#ffff00';
  };

  // Function to determine marker radius
  const getFireRadius = (frp: number) => {
    return Math.max(5, Math.min(15, frp * 0.5));
  };

  // Function to center the map on specific coordinates
  const centerMapOnFire = (latitude: number | React.SetStateAction<null>, longitude: number | React.SetStateAction<null>, fireInfo: FireData) => {
    if (map.current) {
      // Update states
      setSelectedLatitude(latitude as number);
      setSelectedLongitude(longitude as number | null);
      setSelectedFireData(fireInfo);

      // Center and zoom the map
      map.current.setView([latitude as number, longitude as number], 12, {
        animate: true,
        duration: 1
      });

      // Optional: Add a temporary highlight marker
      const highlightMarker = L.circleMarker([latitude as number, longitude as number], {
        radius: 20,
        fillColor: '#00ff00',
        color: '#000',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.3
      }).addTo(map.current);

      // Remove the highlight marker after 3 seconds
      setTimeout(() => {
        if (map.current) {
          map.current.removeLayer(highlightMarker);
        }
      }, 3000);
    }
  };

  // Update markers when data changes
  useEffect(() => {
    if (!map.current || !markersLayer.current || fireData.length === 0) return;

    // Clear existing markers
    markersLayer.current.clearLayers();

    // Add new markers
    fireData.forEach((fire, index) => {
      const marker = L.circleMarker([fire.latitude, fire.longitude], {
        radius: getFireRadius(fire.frp),
        fillColor: getFireColor(fire.frp),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      });

      // Create popup
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="min-width: 200px;">
          <h4 style="margin: 0 0 10px 0;">🔥 Fire Detected</h4>
          <table style="width: 100%; font-size: 12px;">
            <tr><td><strong>Date:</strong></td><td>${fire.acq_date}</td></tr>
            <tr><td><strong>Time:</strong></td><td>${fire.acq_time}</td></tr>
            <tr><td><strong>Coordinates:</strong></td><td>${fire.latitude.toFixed(2)}, ${fire.longitude.toFixed(2)}</td></tr>
            <tr><td><strong>Intensity (FRP):</strong></td><td>${fire.frp} MW</td></tr>
            <tr><td><strong>Temperature:</strong></td><td>${fire.bright_ti4} K</td></tr>
            <tr><td><strong>Confidence:</strong></td><td>${fire.confidence}</td></tr>
            <tr><td><strong>Satellite:</strong></td><td>${fire.satellite}</td></tr>
            <tr><td><strong>Period:</strong></td><td>${fire.daynight === 'D' ? 'Day' : 'Night'}</td></tr>
          </table>
        </div>
      `;

      marker.bindPopup(popupContent);

      // Add event when opening the popup
      marker.on('popupopen', () => {
        const btn = document.getElementById(`centerMapBtn-${index}`);
        if (btn) {
          btn.addEventListener('click', () => {
            centerMapOnFire(fire.latitude, fire.longitude, fire);
            marker.closePopup();
          });
        }
      });

      markersLayer.current?.addLayer(marker);
    });

    // Adjust map bounds to show all markers
    if (fireData.length > 0) {
      const bounds = L.latLngBounds(
        fireData.map(fire => [fire.latitude, fire.longitude])
      );
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [fireData]);

  // Update region
  useEffect(() => {
    const fetchFireData = async () => {
      setLoading(true);
      try {
        const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY;
        const response = await fetch(`https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/VIIRS_SNPP_NRT/${selectedRegion}/1/${startDate}`);
        const text = await response.text();

        // Process CSV
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const obj: Record<string, string> = {};
          headers.forEach((header, index) => {
            obj[header] = values[index];
          });
          return obj;
        }).filter(item => item.latitude && item.longitude);

        // Convert numeric values
        const processedData = data.map(item => ({
          ...item,
          latitude: parseFloat(item.latitude),
          longitude: parseFloat(item.longitude),
          frp: parseFloat(item.frp) || 0,
          bright_ti4: parseFloat(item.bright_ti4) || 0,
          confidence: item.confidence || 'N/A',
          acq_date: item.acq_date || 'Unknown', // Ensure acq_date is included
          acq_time: item.acq_time || 'Unknown', // Ensure acq_time is included
          satellite: item.satellite || 'Unknown', // Ensure satellite is included
          daynight: item.daynight || 'Unknown' // Ensure daynight is included
        }));

        setFireData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFireData();
  }, [region, startDate]);

  return (
    <div>
      <div style={{ position: 'relative', height: '80vh' }}>

        {/* Region selector */}
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 1000,
          background: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          color: '#333',
        }}>
          <select
            value={region}
            onChange={(e) => [setRegion(parseInt(e.target.value)), setSelectedRegion(coordinates[parseInt(e.target.value) - 1].coordinates)]}
            style={{ padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            {coordinates.map(coord => (
              <option key={coord.id} value={coord.id}>{coord.title}</option>
            ))}
          </select>
          {loading && <span style={{ marginLeft: '10px' }}>Loading...</span>}
        </div>
      
        <div style={{ position: 'absolute', height: '80vh', top: '200px', left: '500px', zIndex: 1000, }}>
            <Loading isLoading={loading} />
        </div>

        {/* Information panel for selected coordinates */}
        {selectedLatitude && selectedLongitude && (
          <div style={{
            position: 'absolute',
            top: '70px',
            right: '10px',
            zIndex: 1000,
            color: '#333',
            background: 'white',
            padding: '15px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            maxWidth: '300px'
          }}>
            <h4 style={{ margin: '0 0 10px 0' }}>📍 Selected Location</h4>
            <p style={{ margin: '5px 0' }}><strong>Latitude:</strong> {selectedLatitude.toFixed(4)}</p>
            <p style={{ margin: '5px 0' }}><strong>Longitude:</strong> {selectedLongitude.toFixed(4)}</p>
            {selectedFireData && (
              <>
                <p style={{ margin: '5px 0' }}><strong>Intensity:</strong> {selectedFireData.frp} MW</p>
                <p style={{ margin: '5px 0' }}><strong>Date:</strong> {selectedFireData.acq_date}</p>
              </>
            )}
          </div>
        )}

        {/* Map */}
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

        {/* Legend */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          background: 'white',
          padding: '10px',
          color: '#333',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          zIndex: 1000,
          fontSize: '12px'
        }}>
          <strong>Intensity (FRP - MW) </strong>
          <div style={{ marginTop: '5px' }}>
            <div>🔴 &gt; 10 MW - Very High</div>
            <div>🟠 5-10 MW - High</div>
            <div>🟡 2-5 MW - Medium</div>
            <div>🟡 &lt; 2 MW - Low</div>
          </div>
        </div>
      </div>

    </div>
  );
};
