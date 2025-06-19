"use client"

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import useAppContext from '../context/appContext';
import { fireForecastService } from '../service';

export const MapViewPredictive = () => {
  const {
    latitude,
    longitude,
    startDate,
    startHour,
    setLatitude,
    setLongitude,
    setDataPrediction,
    setIsLoading
  } = useAppContext();

  const mapRef = useRef(null);
  const map = useRef<L.Map | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersLayer = useRef<L.LayerGroup<any> | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any = await fireForecastService({
        startDate,
        startHour,
        lat: latitude,
        long: longitude,
      });
      setDataPrediction(data.data)
      setIsLoading(false);
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, startDate, startHour]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create map
    map.current = L.map(mapRef.current).setView([latitude, longitude], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Create layer group for markers
    markersLayer.current = L.layerGroup().addTo(map.current);

    return () => {
      map.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function onMapClick(e: any) {
    const { lat, lng } = e.latlng
    const popup = L.popup();

    setLatitude(lat);
    setLongitude(lng);

    if (!map.current) return;

    popup
      .setLatLng(e.latlng)
      .setContent(`🔥 Fire prediction on the map at Lat.: ${latitude.toFixed(2)} | Long.: ${longitude.toFixed(2)}`)
      .openOn(map.current);
  }

  useEffect(() => {
    if (!map.current) return;

    map.current?.on('click', onMapClick);

    // Optional: Add a temporary highlight marker
    L.circleMarker([latitude as number, longitude as number], {
      radius: 20,
      fillColor: '#cc0000',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.3
    }).addTo(map.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude]);

  return (
    <>
      <div style={{ position: 'relative', height: '80vh' }}>
        {/* Map */}
        <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
      </div>
    </>
  );
};
