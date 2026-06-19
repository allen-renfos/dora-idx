import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { useCallback, useRef, useState } from 'react';

interface Coordinate {
  lat: number;
  lng: number;
}

interface LocalInformationProps {
  coordinates: Coordinate;
}

const containerStyle = {
  width: '100%',
  height: '460px',
};

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#f4f2ec' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a8780' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#e7e4de' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#8a8780' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#555350' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#c2a878' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#efebe4' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#e2ead9' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a5e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#e7e4de' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#8a8780' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#f0e7d6' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#e7d9bf' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#957a4b' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#8a8780' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#efebe4' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#c2a878' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#cfdde6' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#7a93a3' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#faf9f6' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ color: '#f4f2ec' }] },
];

const LocalInformation = ({ coordinates }: LocalInformationProps) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: ['places'],
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const switchType = (type: 'roadmap' | 'satellite') => {
    setMapType(type);
    mapRef.current?.setMapTypeId(type);
  };

  if (!isLoaded) {
    return (
      <div style={{ height: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f2ec' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, border: '2px solid #c2a878', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ color: '#8a8780', fontSize: 13, letterSpacing: '0.05em' }}>Loading map…</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={coordinates}
        zoom={14}
        onLoad={onLoad}
        options={{
          mapTypeId: mapType,
          styles: mapType === 'roadmap' ? darkMapStyles : [],
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          fullscreenControlOptions: { position: 7 },
          zoomControl: true,
          zoomControlOptions: { position: 7 },
          scaleControl: false,
        }}
      >
        <Marker
          position={coordinates}
          zIndex={100}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#c2a878',
            fillOpacity: 1,
            strokeColor: '#fff',
            strokeWeight: 2,
            scale: 10,
          }}
        />
      </GoogleMap>

      {/* Map / Satellite tab toggle */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        display: 'flex',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #e7e4de',
        overflow: 'hidden',
        backdropFilter: 'blur(6px)',
        zIndex: 10,
      }}>
        {(['roadmap', 'satellite'] as const).map((type) => {
          const active = mapType === type;
          return (
            <button
              key={type}
              onClick={() => switchType(type)}
              style={{
                padding: '6px 16px',
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                border: 'none',
                borderRight: type === 'roadmap' ? '1px solid #e7e4de' : 'none',
                background: active ? '#c2a878' : 'transparent',
                color: active ? '#ffffff' : '#555350',
                transition: 'background 0.18s, color 0.18s',
                fontFamily: 'var(--font-lato), sans-serif',
              }}
            >
              {type === 'roadmap' ? 'Map' : 'Satellite'}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LocalInformation;
