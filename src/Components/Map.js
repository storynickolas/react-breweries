import React from "react";
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'


function MapBox({location, setSelected}) {

  function ChangeView({ center, zoom }) {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  }

  return (
    <MapContainer center={[location[0].latitude, location[0].longitude]} zoom={12} scrollWheelZoom={false} >
      <ChangeView center={[location[0].latitude, location[0].longitude]} zoom={12} />
    <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location.map(element => {
          return (<Marker key={element.latitude} position={[element.latitude, element.longitude]}
            icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}
            eventHandlers={{
              click: () => {
                setSelected(element)
              },
            }}
            >
          <Popup>
            {element.name}
          </Popup>
        </Marker>)
        })
      }
    </MapContainer>
  )
}

export default MapBox;