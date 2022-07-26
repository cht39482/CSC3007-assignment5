psiScale = d3.scaleLinear()
    .domain([0, 250])
    .range([0, 1])
var url = new URL('https://api.data.gov.sg/v1/environment/psi')
async function getRecords(url) {
    const request = await fetch(url);
    var data = await request.json();
    return { "region_metadata": data.region_metadata, "psi": data.items[0].readings.psi_twenty_four_hourly };
}
let tiles = new L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
    detectRetina: true,
    maxZoom: 18,
    minZoom: 11,
    //Do not remove this attribution
    attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;">' +
        'New OneMap | Map data © contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
});
let map = new L.Map("map", {
    center: [1.347833, 103.809357],
    zoom: 12,
    maxBounds: L.latLngBounds(L.latLng(1.1, 103.5), L.latLng(1.5, 104.3))
}).addLayer(tiles);
getRecords(url).then(data => {
    data.region_metadata.forEach((region, i) => {
        var psiVal = data.psi[region.name];
        console.log(region.name)
        var long = region.label_location.longitude;
        var latt = region.label_location.latitude;
        L.circle([latt, long], {
            color: 'green',
            fillColor: d3.interpolateOrRd(psiScale(psiVal)),
            fillOpacity: 0.5,
            radius: 1500
        }).addTo(map);
        var label = L.divIcon({
            className:"label",
            html: `<span>${psiVal}</span>`,
            iconSize: [20, 20],
        })
        L.marker([latt, long], { icon: label }).addTo(map);
    });
})
