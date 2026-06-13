'use client';

import { useRouter } from 'next/navigation';
import { CircleMarker, MapContainer, TileLayer, Tooltip } from 'react-leaflet';
import type { Location } from '@/domains/locations/types/location.schema';

function computeCenter(locations: Location[]): [number, number] {
  if (locations.length === 0) {
    return [20, 0];
  }
  const lat = locations.reduce((sum, l) => sum + l.latitude, 0) / locations.length;
  const lng = locations.reduce((sum, l) => sum + l.longitude, 0) / locations.length;
  return [lat, lng];
}

interface LocationsMapProps {
  locations: Location[];
}

/** Leaflet map (OpenStreetMap tiles) with a marker per location. */
export function LocationsMap({ locations }: LocationsMapProps) {
  const router = useRouter();
  const zoom = locations.length <= 1 ? 11 : 2;

  return (
    <MapContainer
      center={computeCenter(locations)}
      zoom={zoom}
      scrollWheelZoom
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <CircleMarker
          key={location.id}
          center={[location.latitude, location.longitude]}
          radius={8}
          pathOptions={{ color: '#1f6feb', fillColor: '#1f6feb', fillOpacity: 0.85 }}
          eventHandlers={{ click: () => router.push(`/locations/${location.id}`) }}
        >
          <Tooltip>{location.name}</Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
