'use client';

// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
// import { MlsMapModalCard } from './MlsMapModalCard';

// const containerStyle = {
//   width: '100%',
//   height: '1000px',
//   borderRadius: '30px',
// };

// const mapStyles = [
//   {
//     featureType: "poi.park",
//     elementType: "geometry",
//     stylers: [{ color: "#a6e6a3" }],
//   },
//   {
//     featureType: "water",
//     elementType: "geometry.fill",
//     stylers: [{ color: "#aadaff" }],
//   },
//   {
//     featureType: "road",
//     elementType: "geometry",
//     stylers: [{ visibility: "on" }],
//   },
//   {
//     featureType: "transit",
//     elementType: "geometry",
//     stylers: [{ visibility: "on" }],
//   },
// ];

// type LatLng = { lat: number; lng: number };
// interface MapProps {
//   markers?: Array<LatLng & { price?: number; [key: string]: any }>;
//   onMarkerHover?: (data: any | null) => void;
// }

// export const GoogleMapComponent = ({ markers = [], onMarkerHover }: MapProps) => {
//   const [active, setActive] = useState<any | null>(null);
//   // const { isLoaded } = useJsApiLoader({
//   //   googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
//   // });

//   const mapRef = useRef<google.maps.Map | null>(null);
//   const overlaysRef = useRef<google.maps.OverlayView[]>([]);
//   const boundsFittedRef = useRef(false);

//   const defaultCenter: LatLng = markers[0] ?? { lat: 8.5590016, lng: 77.0059895 };

//   // Create floating price labels as overlays
//   const createPriceOverlay = useCallback(
//     (map: google.maps.Map, m: any) => {
//       const div = document.createElement('div');
//       const price = Number(m.price || 0);
//       div.innerText = price >= 1_000_000
//         ? `$${(price / 1_000_000).toFixed(2)}m`
//         : `$${Math.round(price / 1000)}k`;

//       Object.assign(div.style, {
//         background: '#8B5C28',
//         color: 'white',
//         padding: '2px 6px',
//         borderRadius: '4px',
//         fontSize: '12px',
//         fontWeight: 'bold',
//         boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
//         whiteSpace: 'nowrap',
//         cursor: 'pointer',
//         position: 'absolute' as const,
//       });

//       div.onmouseover = () => {
//         setActive(m);
//         onMarkerHover?.(m);
//       };
//       div.onclick = () => {
//         setActive(m);
//       };

//       const overlay = new google.maps.OverlayView();
//       overlay.onAdd = function () {
//         // Use overlayMouseTarget so the div can receive pointer events and avoid TS error
//         this.getPanes()?.overlayMouseTarget?.appendChild(div);
//       };
//       overlay.draw = function () {
//         const pos = this.getProjection()?.fromLatLngToDivPixel(
//           new google.maps.LatLng(m.lat, m.lng)
//         );
//         if (pos) {
//           div.style.left = `${pos.x}px`;
//           div.style.top = `${pos.y}px`;
//         }
//       };
//       overlay.onRemove = function () {
//         div.parentNode?.removeChild(div);
//       };
//       overlay.setMap(map);

//       return overlay;
//     },
//     [onMarkerHover]
//   );

//   const handleOnLoad = useCallback(
//     (map: google.maps.Map) => {
//       mapRef.current = map;

//       // Fit map bounds to markers once
//       if (markers.length && !boundsFittedRef.current) {
//         const bounds = new google.maps.LatLngBounds();
//         markers.forEach((m) => bounds.extend(m));
//         map.fitBounds(bounds);
//         boundsFittedRef.current = true;
//       }

//       // Clear old overlays
//       overlaysRef.current.forEach((o) => o.setMap(null));
//       overlaysRef.current = [];

//       // Create new overlays
//       markers.forEach((m) => {
//         const ov = createPriceOverlay(map, m);
//         overlaysRef.current.push(ov);
//       });
//     },
//     [markers, createPriceOverlay]
//   );

//   useEffect(() => {
//     if (!mapRef.current || boundsFittedRef.current) return;
//     if (markers.length) {
//       const bounds = new google.maps.LatLngBounds();
//       markers.forEach((m) => bounds.extend(m));
//       mapRef.current.fitBounds(bounds);
//       boundsFittedRef.current = true;
//     }
//   }, [markers]);

//   // if (!isLoaded) return <p>Loading map...</p>;

//   return (
//     <GoogleMap
//       mapContainerStyle={containerStyle}
//       center={defaultCenter}

//       zoom={7}
//       onLoad={handleOnLoad}
//       options={{
//         mapTypeId: 'roadmap', // key: default Google look
//         styles: mapStyles,     // no custom styling
//         streetViewControl: false,
//         mapTypeControl: false,
//         fullscreenControl: false,
//         zoomControl: true,
//       }}
//     >
//       {active && (
//         <InfoWindow
//           position={{ lat: active.lat, lng: active.lng }}
//           onCloseClick={() => setActive(null)}
//         >
//           <div style={{ minWidth: 295, minHeight: 220 }} className="black-div">
//             <MlsMapModalCard item={active} />
//           </div>
//         </InfoWindow>
//       )}
//     </GoogleMap>
//   );
// };














// remove useJsApiLoader import
// import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api';
import { GoogleMap } from '@react-google-maps/api';
import { MlsMapModalCard } from './MlsMapModalCard';
import { useCallback, useEffect, useRef, useState } from 'react';
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: 0,
};

const mapStyles = [
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#a6e6a3" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#aadaff" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ visibility: "on" }],
  },
];

type LatLng = { lat: number; lng: number };
interface MapProps {
  markers?: Array<LatLng & { price?: number;[key: string]: any }>;
  onMarkerHover?: (data: any | null) => void;
}
// ...
export const GoogleMapComponent = ({ markers = [], onMarkerHover }: MapProps) => {
  const [active, setActive] = useState<any | null>(null);
  const [cardPos, setCardPos] = useState<{ x: number; y: number } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // no loader here anymore
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const overlaysRef = useRef<google.maps.OverlayView[]>([]);
  const boundsFittedRef = useRef(false);
  // Track which markers already have overlays so infinite-scroll appends only
  // add the new ones (no flicker, no churn on existing pins).
  const drawnKeysRef = useRef<Set<string>>(new Set());
  // Detects a new search "session" (filters changed → fresh markers list).
  const sessionKeyRef = useRef<string | null>(null);

  const getMarkerKey = (m: any, i: number) =>
    String(m?.mls_listingkey ?? m?.id ?? `${m?.lat},${m?.lng}-${i}`);

  // Stable ref so the `center` prop never changes identity between renders.
  // A new object every render causes react-google-maps to call map.setCenter()
  // on every hover/state update, snapping the map back mid-pan.
  const initialCenter = useRef<LatLng>(markers[0] ?? { lat: 47.6062, lng: -122.3321 });

  const createPriceOverlay = useCallback(
    (map: google.maps.Map, m: any) => {
      const div = document.createElement('div');
      const price = Number(m.price || 0);
      div.innerText = price >= 1_000_000
        ? `$${(price / 1_000_000).toFixed(2)}m`
        : `$${Math.round(price / 1000)}k`;

      Object.assign(div.style, {
        background: '#8B5C28',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 'bold',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        position: 'absolute' as const,
      });

      div.onmouseover = () => {
        setActive(m);
        onMarkerHover?.(m);
      };
      div.onclick = () => {
        setActive(m);
        // compute pixel position of marker within the map container
        if (mapRef.current && mapContainerRef.current) {
          const proj = overlay.getProjection();
          if (proj) {
            const px = proj.fromLatLngToContainerPixel(new google.maps.LatLng(m.lat, m.lng));
            if (px) setCardPos({ x: px.x, y: px.y });
          }
        }
      };

      const overlay = new google.maps.OverlayView();
      overlay.onAdd = function () {
        // Use overlayMouseTarget so the div can receive pointer events and avoid TS error
        this.getPanes()?.overlayMouseTarget?.appendChild(div);
      };
      overlay.draw = function () {
        const pos = this.getProjection()?.fromLatLngToDivPixel(
          new google.maps.LatLng(m.lat, m.lng)
        );
        if (pos) {
          div.style.left = `${pos.x}px`;
          div.style.top = `${pos.y}px`;
        }
      };
      overlay.onRemove = function () {
        div.parentNode?.removeChild(div);
      };
      overlay.setMap(map);

      return overlay;
    },
    [onMarkerHover]
  );
  const handleOnLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMapReady(true);
  }, []);

  // Reactive draw: re-runs on every markers change so infinite-scroll appends
  // immediately push new pins onto the map without redrawing existing ones.
  useEffect(() => {
    if (!mapReady) return;
    const map = mapRef.current;
    if (!map) return;

    // Detect a fresh search session (filters changed, list rebuilt from page 1)
    // by comparing the first marker's stable key. On change, wipe + redraw.
    const firstKey = markers[0] ? getMarkerKey(markers[0], 0) : null;
    if (firstKey !== sessionKeyRef.current) {
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];
      drawnKeysRef.current = new Set();
      sessionKeyRef.current = firstKey;
      boundsFittedRef.current = false;
    }

    const seen = drawnKeysRef.current;
    markers.forEach((m, i) => {
      const key = getMarkerKey(m, i);
      if (seen.has(key)) return;
      const ov = createPriceOverlay(map, m);
      overlaysRef.current.push(ov);
      seen.add(key);
    });

    if (!boundsFittedRef.current && markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach((m) => bounds.extend(m));
      map.fitBounds(bounds);
      boundsFittedRef.current = true;
    }
  }, [markers, mapReady, createPriceOverlay]);


  return (
    <div ref={mapContainerRef} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialCenter.current}
        zoom={7}
        onLoad={handleOnLoad}
        options={{
          mapTypeId: mapType,
          styles: mapType === 'roadmap' ? mapStyles : [],
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: true,
        }}
      />
      {/* Satellite / Map toggle */}
      <div style={{ position: 'absolute', bottom: 24, left: 12, zIndex: 10, display: 'flex', gap: 2, background: '#ffffff', border: '1px solid #e7e4de', overflow: 'hidden' }}>
        {(['roadmap', 'satellite'] as const).map((type) => (
          <button
            key={type}
            onClick={() => {
              setMapType(type);
              mapRef.current?.setMapTypeId(type);
            }}
            style={{
              padding: '5px 10px',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              border: 'none',
              background: mapType === type ? '#c2a878' : 'transparent',
              color: mapType === type ? '#ffffff' : '#8a8780',
              transition: 'background 0.2s, color 0.2s',
            }}
          >
            {type === 'roadmap' ? 'Map' : 'Satellite'}
          </button>
        ))}
      </div>
      {active && cardPos && (() => {
        const CARD_W = 280;
        const CARD_H = 264; // 160px image + ~104px info
        const MARGIN = 4;
        const OFFSET = 20;
        const containerW = mapContainerRef.current?.offsetWidth ?? 9999;
        const containerH = mapContainerRef.current?.offsetHeight ?? 9999;

        // Clamp horizontally so card never exits left or right of map container
        const left = Math.max(MARGIN, Math.min(cardPos.x, containerW - CARD_W - MARGIN));

        // Prefer above marker; flip below if too close to top edge
        const topIfAbove = cardPos.y - OFFSET - CARD_H;
        const top = topIfAbove >= MARGIN
          ? topIfAbove
          : Math.min(cardPos.y + OFFSET, containerH - CARD_H - MARGIN);

        return (
          <div style={{ position: 'absolute', left, top, zIndex: 1000, pointerEvents: 'auto' }}>
            <MlsMapModalCard item={active} onClose={() => { setActive(null); setCardPos(null); }} />
          </div>
        );
      })()}
    </div>
  );
};
