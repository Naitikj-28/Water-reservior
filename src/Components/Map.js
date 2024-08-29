import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const damLocations = {
  'Krishna Raja Sagara Dam': [12.4255, 76.5724],
  'Hemavathi Dam': [12.8138, 76.0218],
  'Kabini Dam': [11.9735, 76.3528],
  'Harangi Dam': [12.491667, 75.905556]
};

const alidadeSatelliteURL = 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}';

function CenterMap({ coords }) {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom()); 
    }
  }, [coords, map]);

  return null;
}

function MapData({ selectedDam }) {
  const selectedDamCoords = damLocations[selectedDam];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={selectedDamCoords || [12.4255, 76.5724]} 
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={alidadeSatelliteURL}
          minZoom={0}
          maxZoom={20}
          attribution='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          ext='jpg'
        />
        {selectedDamCoords && (
          <>
            <Marker
              position={selectedDamCoords}
              icon={new L.Icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>{selectedDam}</Popup>
            </Marker>
            <CenterMap coords={selectedDamCoords} />
          </>
        )}
      </MapContainer>
    </div>
  );
}

export default MapData;
