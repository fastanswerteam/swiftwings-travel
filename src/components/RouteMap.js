'use client';
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function RouteMap({ departure, arrival }) {
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  if (!departure && !arrival) return null;

  const points = [departure, arrival].filter(Boolean).map((p) => [p.lat, p.lng]);
  const center = points.length === 2
    ? [(points[0][0] + points[1][0]) / 2, (points[0][1] + points[1][1]) / 2]
    : points[0];
  const zoom = points.length === 2 ? 4 : 8;

  return (
    <div className="rounded-2xl overflow-hidden shadow-lg" style={{ height: '320px' }}>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {departure && (
          <Marker position={[departure.lat, departure.lng]}>
            <Popup>{departure.name || 'Departure'}</Popup>
          </Marker>
        )}
        {arrival && (
          <Marker position={[arrival.lat, arrival.lng]}>
            <Popup>{arrival.name || 'Arrival'}</Popup>
          </Marker>
        )}
        {points.length === 2 && (
          <Polyline positions={points} pathOptions={{ color: '#2B5CE6', weight: 3, dashArray: '6 8' }} />
        )}
      </MapContainer>
    </div>
  );
}