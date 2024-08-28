// src/components/GoogleMap/GoogleMap.js
import React, { useEffect } from 'react';
import './GoogleMap.css';

const GoogleMap = () => {
  useEffect(() => {
    const initMap = async () => {
      await customElements.whenDefined('gmp-map');

      const map = document.querySelector('gmp-map');
      const marker = document.querySelector('gmp-advanced-marker');
      const placePicker = document.querySelector('gmpx-place-picker');
      const infowindow = new window.google.maps.InfoWindow();

      map.innerMap.setOptions({
        mapTypeControl: false,
      });

      placePicker.addEventListener('gmpx-placechange', () => {
        const place = placePicker.value;

        if (!place.location) {
          window.alert(`No details available for input: '${place.name}'`);
          infowindow.close();
          marker.position = null;
          return;
        }

        if (place.viewport) {
          map.innerMap.fitBounds(place.viewport);
        } else {
          map.center = place.location;
          map.zoom = 17;
        }

        marker.position = place.location;
        infowindow.setContent(
          `<strong>${place.displayName}</strong><br>
           <span>${place.formattedAddress}</span>`
        );
        infowindow.open(map.innerMap, marker);
      });
    };

    document.addEventListener('DOMContentLoaded', initMap);

    return () => {
      document.removeEventListener('DOMContentLoaded', initMap);
    };
  }, []);

  return (
    <>
      <gmpx-api-loader key={""} solution-channel="GMP_GE_mapsandplacesautocomplete_v1">
      </gmpx-api-loader>
      <gmp-map center="40.749933,-73.98633" zoom="13" map-id="118fe9ff761eb2ae">
        <div slot="control-block-start-inline-start" className="place-picker-container">
          <gmpx-place-picker placeholder="Enter an address"></gmpx-place-picker>
        </div>
        <gmp-advanced-marker></gmp-advanced-marker>
      </gmp-map>
    </>
  );
};

export default GoogleMap;
