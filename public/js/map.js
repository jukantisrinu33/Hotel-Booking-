
mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    center: cordinates, // starting position [longitude, latitude]
    zoom: 9 // starting zoom
});


const marker1 = new mapboxgl.Marker({color:"red"})
.setLngLat(cordinates)
.addTo(map);