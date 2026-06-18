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
  { elementType: 'geometry', stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1f2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8a9bb0' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#2a3040' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#9e9e9e' }] },
  { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#bdbdbd' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#EDB75E' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1e2535' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#1a2d20' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a5e' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c3347' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212637' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#38404f' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#3c4a6e' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#2a3550' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#EDB75E' }] },
  { featureType: 'road.local', elementType: 'labels.text.fill', stylers: [{ color: '#808b9a' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0d1b2a' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#4a6274' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#0d1b2a' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#1e2535' }] },
  { featureType: 'landscape.man_made', elementType: 'geometry.fill', stylers: [{ color: '#222838' }] },
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
      <div style={{ height: 460, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#1a1f2e' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, border: '2px solid #EDB75E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ color: '#8a9bb0', fontSize: 13, letterSpacing: '0.05em' }}>Loading map…</span>
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
            fillColor: '#EDB75E',
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
        background: 'rgba(17,21,32,0.92)',
        border: '1px solid #2e3548',
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
                borderRight: type === 'roadmap' ? '1px solid #2e3548' : 'none',
                background: active ? '#EDB75E' : 'transparent',
                color: active ? '#0b0c0f' : '#8a9bb0',
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
