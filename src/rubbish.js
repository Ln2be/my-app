// // i don't want to use react-leaflet
// useEffect(() => {
//   var map = L.map("map").setView([18.079, -15.9652], 14);

//   const circle = L.circle([18.079, -15.9652], {
//     radius: 20000,
//   });
//   const mapBounds = circle.addTo(map).getBounds();

//   // Add the geoSON data

//   map.removeLayer(circle);
//   map.setMaxBounds(mapBounds);
//   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     // tileSize: 512,
//     bounds: mapBounds,
//   }).addTo(map);

//   L.geoJSON(DATA, {
//     pointToLayer: (f, l) => {
//       const myIcon = L.divIcon({
//         className: f.properties.class,
//         // html: f.properties.class,
//       });
//       // return L.marker(l);
//       return showDe(f, l, myIcon);
//     },
//   }).addTo(map);

//   L.marker([18.079, -15.9652]).addTo(map);

//   return () => {
//     map.remove();
//   };
// });
