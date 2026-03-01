
'use client';

import React, { useEffect, useRef } from 'react';
import L, { LatLngExpression, LatLngBounds, LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { NearbyPlace } from '@/types';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl.src,
    iconUrl: iconUrl.src,
    shadowUrl: shadowUrl.src,
  });
}

const placeIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

type MapComponentProps = {
  route: LatLngExpression[] | null;
  initialCenter: LatLng | null;
  places: NearbyPlace[];
};

export default function MapComponent({ route, initialCenter, places }: MapComponentProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstance = React.useRef<L.Map | null>(null);
  const routePolyline = React.useRef<L.Polyline | null>(null);
  const placesLayer = React.useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
          center: initialCenter || [40.7128, -74.0060],
          zoom: initialCenter ? 13 : 12,
          zoomControl: false,
      });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapInstance.current);

      L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

      placesLayer.current = L.layerGroup().addTo(mapInstance.current);
    }
  }, []);

  useEffect(() => {
    if (mapInstance.current && initialCenter) {
      mapInstance.current.flyTo(initialCenter, 13);
    }
  }, [initialCenter]);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    if (routePolyline.current) {
      routePolyline.current.remove();
    }

    if (route && route.length > 0) {
      routePolyline.current = new L.Polyline(route, {
        color: 'hsl(var(--primary))',
        weight: 5,
      }).addTo(map);

      const bounds = new LatLngBounds(route as [number, number][]);
      map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [route]);

  useEffect(() => {
    const layer = placesLayer.current;
    if (!layer) return;

    layer.clearLayers();

    if (places && places.length > 0) {
      places.forEach(place => {
        if (place.lat && place.lon) {
          const marker = L.marker([place.lat, place.lon], { icon: placeIcon })
            .bindPopup(place.tags?.name || 'Unnamed Place');
          layer.addLayer(marker);
        }
      });
    }
  }, [places]);

  return <div ref={mapRef} className="w-full h-full z-0" />;
}
