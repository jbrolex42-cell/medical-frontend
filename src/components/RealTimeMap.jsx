import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function RealTimeMap({ emergencies, ambulances }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef({});

  useEffect(() => {
    if (map.current) return;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [36.8219, -1.2921], // Nairobi
      zoom: 12
    });

    map.current.addControl(new mapboxgl.NavigationControl());
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add emergency markers
    emergencies.forEach(emergency => {
      const el = document.createElement('div');
      el.className = 'emergency-marker';
      el.style.cssText = `
        width: 20px;
        height: 20px;
        background: ${getTriageColor(emergency.triage_category)};
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        animation: pulse 2s infinite;
      `;

      const marker = new mapboxgl.Marker(el)
        .setLngLat([emergency.longitude, emergency.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div style="padding: 10px;">
            <h4 style="margin: 0 0 5px 0;">Emergency #${emergency.id}</h4>
            <p style="margin: 0; font-size: 12px; color: #666;">
              ${emergency.symptoms?.substring(0, 50)}...
            </p>
            <span style="
              display: inline-block;
              margin-top: 5px;
              padding: 2px 8px;
              background: ${getTriageColor(emergency.triage_category)};
              color: white;
              border-radius: 12px;
              font-size: 11px;
              text-transform: uppercase;
            ">
              ${emergency.triage_category}
            </span>
          </div>
        `))
        .addTo(map.current);

      markers.current[`emergency-${emergency.id}`] = marker;
    });

    // Add ambulance markers
    ambulances.forEach(ambulance => {
      if (!ambulance.latitude || !ambulance.longitude) return;
      
      const el = document.createElement('div');
      el.className = 'ambulance-marker';
      el.style.cssText = `
        width: 30px;
        height: 30px;
        background: ${ambulance.status === 'available' ? '#22c55e' : '#eab308'};
        border-radius: 50%;
        border: 3px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
      `;
      el.innerHTML = '🚑';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([ambulance.longitude, ambulance.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`
          <div style="padding: 10px;">
            <h4 style="margin: 0;">${ambulance.vehicle_number}</h4>
            <p style="margin: 5px 0; font-size: 12px;">
              Driver: ${ambulance.driver_name || 'Unassigned'}
            </p>
            <span style="
              display: inline-block;
              padding: 2px 8px;
              background: ${ambulance.status === 'available' ? '#22c55e' : '#eab308'};
              color: white;
              border-radius: 12px;
              font-size: 11px;
              text-transform: capitalize;
            ">
              ${ambulance.status}
            </span>
          </div>
        `))
        .addTo(map.current);

      markers.current[`ambulance-${ambulance.id}`] = marker;
    });
  }, [emergencies, ambulances]);

  const getTriageColor = (category) => {
    const colors = {
      critical: '#dc2626',
      urgent: '#f97316',
      moderate: '#eab308',
      minor: '#22c55e'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div 
      ref={mapContainer} 
      style={{ width: '100%', height: '100%', borderRadius: '12px' }}
    />
  );
}