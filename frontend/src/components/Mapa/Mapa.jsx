import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import styles from './Mapa.module.css';
import L from 'leaflet'; 
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

function MapClickHandler({ onMapClick }) {
    useMapEvents({
        click(e) {
            onMapClick(e.latlng);
        },
    });
    return null;
}

function Mapa({ onMapClick, posicoesDestinos = [] }) {
    const posicaoInicial = [-25.0945, -50.1633];

    return (
        <div className={styles.mapContainer}>           
            <MapContainer center={posicaoInicial} zoom={13} scrollWheelZoom={true} className={styles.map}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={onMapClick} />

                {posicoesDestinos.map((pos, idx) => (
                    (pos.lat && pos.lon) && (
                        <Marker key={idx} position={[pos.lat, pos.lon]}>
                            <Popup>
                                {idx + 1}. {pos.cidade || pos.nome}
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
}

export default Mapa;