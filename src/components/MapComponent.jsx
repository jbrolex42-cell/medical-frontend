import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Ambulance, MapPin, Navigation, Hospital, User } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN';

export default function MapComponent({ 
  center = [36.8219, -1.2921], 
  zoom = 12,
  markers = [],
  route = null,
  showTraffic = false,
  interactive = true,
  onMarkerClick = null,
  style = 'mapbox://styles/mapbox/streets-v11'
}) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const routeRef = useRef(null);

  // Initialize map
  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style,
      center,
      zoom,
      interactive,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.AttributionControl(), 'bottom-right');

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update center
  useEffect(() => {
    if (!map.current) return;
    map.current.setCenter(center);
  }, [center]);

  // Add/update markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    markers.forEach((marker, idx) => {
      const el = document.createElement('div');
      el.className = 'marker';
      
      // Create custom marker based on type
      const markerContent = getMarkerContent(marker.type || 'default');
      el.innerHTML = ReactDOMServer.renderToString(markerContent);
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div style="padding: 8px;">
          <p style="font-weight: bold; margin: 0;">${marker.title || 'Location'}</p>
          ${marker.description ? `<p style="font-size: 12px; color: #666; margin: 4px 0 0;">${marker.description}</p>` : ''}
        </div>`
      );

      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .setPopup(popup)
        .addTo(map.current);

      if (onMarkerClick) {
        el.addEventListener('click', () => onMarkerClick(marker));
      }

      markersRef.current.push(mapMarker);
    });
  }, [markers]);

  // Add route line
  useEffect(() => {
    if (!map.current || !route) return;

    // Remove existing route
    if (routeRef.current) {
      map.current.removeLayer('route');
      map.current.removeSource('route');
    }

    map.current.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: route.map(p => [p.lng, p.lat])
        }
      }
    });

    map.current.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3b82f6',
        'line-width': 4,
        'line-opacity': 0.8
      }
    });

    routeRef.current = true;
  }, [route]);

  const getMarkerContent = (type) => {
    const colors = {
      ambulance: 'bg-red-600',
      patient: 'bg-blue-600',
      hospital: 'bg-green-600',
      default: 'bg-gray-600'
    };
    
    const icons = {
      ambulance: <Ambulance size={20} className="text-white" />,
      patient: <User size={20} className="text-white" />,
      hospital: <Hospital size={20} className="text-white" />,
      default: <MapPin size={20} className="text-white" />
    };

    return (
      <div className={`w-10 h-10 ${colors[type] || colors.default} rounded-full flex items-center justify-center shadow-lg border-2 border-white`}>
        {icons[type] || icons.default}
      </div>
    );
  };

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: '200px' }}
    />
  );
}

// Mini map for cards
export function MiniMap({ center, marker }) {
  return (
    <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-blue-400 to-green-400" />
      <div className="relative z-10 text-center">
        <MapPin className="mx-auto mb-1 text-red-600" size={24} />
        <p className="text-xs text-gray-600 font-medium">Map View</p>
        <p className="text-xs text-gray-400">{center[1].toFixed(4)}, {center[0].toFixed(4)}</p>
      </div>
    </div>
  );
}