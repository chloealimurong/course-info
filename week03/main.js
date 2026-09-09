

const mapElement = document.querySelector('#map');
var map = L.map(mapElement, { maxZoom: 18, zoomSnap: 0 }).setView([39.95, -75.16], 12);

const mapboxKey = 'pk.eyJ1IjoiY2hsb2VhbGltdXJvbmciLCJhIjoiY210dWR0cjcyMDBiNjM0cHFvN2p4b2RpMiJ9.EHtMZkiC7TklHIn836JPoQ';
const mapboxStyle = 'mapbox/streets-v12';

L.tileLayer(`https://api.mapbox.com/styles/v1/${mapboxStyle}/tiles/512/{z}/{x}/{y}{r}?access_token=${mapboxKey}`, {
  tileSize: 512,
  zoomOffset: -1,
  detectRetina: true,
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

fetch('practice_files/pa_pres_results.geojson')
  .then(response => response.json())
  .then(data => {
    L.geoJSON(data, {
      style: feature => {
        const party = feature.properties.party;
        return {
          color: '#333',
          weight: 1,
          fillColor: party === 'REPUBLICAN' ? '#e74c3c' : party === 'DEMOCRAT' ? '#3498db' : '#999',
          fillOpacity: 0.6
        };
      },
      onEachFeature: (feature, layer) => {
        const { name, party, candidate, candidatevotes, totalvotes } = feature.properties;
        const pct = ((candidatevotes / totalvotes) * 100).toFixed(1);
        layer.bindPopup(`<b>${name} County</b><br>${candidate} (${party})<br>${pct}% of vote`);
      }
    }).addTo(map);
        map.fitBounds(L.geoJSON(data).getBounds());
  })
  .catch(err => console.error('Error loading geojson:', err));