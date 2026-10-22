import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function LiveEmergencyMap({
  center = [37.7749, -122.4194],
  accuracy = 10,
  breadcrumbs = [],
  victimName = 'Victim',
  status = 'active',
  interactive = true,
  height = '360px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix default Leaflet icon paths
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    // Initialize map if not yet created
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: false
      }).setView(center, 16);

      // CartoDB Dark Matter / Stadia / OSM Dark tiles for emergency control room aesthetics
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Custom pulsing SOS marker
    const isPulsing = status === 'active';
    const customIcon = L.divIcon({
      className: 'custom-sos-marker',
      html: `
        <div class="relative flex items-center justify-center">
          ${isPulsing ? '<span class="absolute w-8 h-8 rounded-full bg-red-500 animate-ping opacity-75"></span>' : ''}
          <div class="w-6 h-6 rounded-full ${status === 'resolved' ? 'bg-emerald-500' : 'bg-red-600'} border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs">
            !
          </div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Marker
    if (!markerRef.current) {
      markerRef.current = L.marker(center, { icon: customIcon }).addTo(map);
      markerRef.current.bindPopup(`<b>${victimName}</b><br/>Emergency Location<br/>Accuracy: ±${accuracy}m`);
    } else {
      markerRef.current.setLatLng(center);
      markerRef.current.setIcon(customIcon);
      markerRef.current.setPopupContent(`<b>${victimName}</b><br/>Emergency Location<br/>Accuracy: ±${accuracy}m`);
    }

    // Accuracy Circle
    if (!accuracyCircleRef.current) {
      accuracyCircleRef.current = L.circle(center, {
        radius: Math.max(accuracy, 15),
        color: status === 'resolved' ? '#10B981' : '#EF4444',
        fillColor: status === 'resolved' ? '#10B981' : '#EF4444',
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 4'
      }).addTo(map);
    } else {
      accuracyCircleRef.current.setLatLng(center);
      accuracyCircleRef.current.setRadius(Math.max(accuracy, 15));
      accuracyCircleRef.current.setStyle({
        color: status === 'resolved' ? '#10B981' : '#EF4444',
        fillColor: status === 'resolved' ? '#10B981' : '#EF4444'
      });
    }

    // Breadcrumb Polyline Trail
    if (breadcrumbs.length > 0) {
      const latlngs = breadcrumbs.map(b => [b.lat, b.lng]);
      if (!polylineRef.current) {
        polylineRef.current = L.polyline(latlngs, {
          color: '#F59E0B',
          weight: 4,
          opacity: 0.85,
          dashArray: '6, 8'
        }).addTo(map);
      } else {
        polylineRef.current.setLatLngs(latlngs);
      }
    }

    // Center map smoothly
    map.panTo(center, { animate: true });

    // Handle container resize
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

  }, [center[0], center[1], accuracy, breadcrumbs, status, victimName]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-700/60 shadow-xl bg-slate-900">
      <div ref={mapContainerRef} style={{ height }} className="w-full z-0" />
      
      {/* Live Badge Overlay */}
      <div className="absolute top-3 left-3 z-[400] flex items-center space-x-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs shadow-md">
        <span className={`w-2.5 h-2.5 rounded-full ${status === 'active' ? 'bg-red-500 animate-ping' : status === 'acknowledged' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
        <span className="font-semibold tracking-wide text-slate-200">
          {status === 'active' ? 'LIVE GPS STREAMING' : status === 'acknowledged' ? 'RESPONDER EN ROUTE' : 'RESOLVED'}
        </span>
        <span className="text-slate-400">| ±{accuracy}m</span>
      </div>

      {/* Map Controls Helper */}
      <div className="absolute bottom-2 right-2 z-[400] bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] text-slate-400 border border-slate-800">
        OpenStreetMap & CartoDB
      </div>
    </div>
  );
}
