
var locations = '{"locations":[' +
'{"name":"Arc De Triumph","coordinates":"48.873954, 2.295038"},' +
'{"name":"Stonehenge","coordinates":"51.179050, -1.826215" },' +
'{"name":"Bosporus Bridge","coordinates":"41.045990, 29.034033" },' +
'{"name":"General Sherman Tree","coordinates":"36.581974, -118.751421" },' +
'{"name":"Philippe The Original","coordinates":"34.059989, -118.237016" },' +
'{"name":"Sasebo, Japan","coordinates":"33.191988, 129.711714" }' +
']}';



var leafletMap;

$(document).ready(function () {
    setupPlaces();

    $("select").on("change", goToSelectedPlace);

    buildMap("48.873954, 2.295038");
})



function setupPlaces() {

    //get the locations
    places = JSON.parse(locations);
    var name = "";
    var coordinates = "";

    for (var i = 0; i < places["locations"].length; i++) {
        console.log(places["locations"][i].name);
        name = places["locations"][i].name;
        coordinates = places["locations"][i].coordinates;

        $("#places").append('<option value="' + coordinates + '" name="' + name + '">' + name + '</option>');


    }
    //set the first option as the selected option
    $("option").first().attr('selected', 'selected');
            
        
        
}

function goToSelectedPlace(evt) {
    var coordinates = evt.currentTarget.value;

    //var leafletMap = L.map('leaflet-map'); //The id of the div
    var latLng = JSON.parse("[" + coordinates + "]");

    leafletMap.setView(latLng, 16);

    var marker = L.marker(latLng);
    marker.bindPopup(JSON.stringify(latLng));
    marker.addTo(leafletMap);
}


function buildMap(coordinates) {
    leafletMap = L.map('leaflet-map'); //The id of the div
    var latLng = JSON.parse("[" + coordinates + "]");

    leafletMap.setView(latLng, 13);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
        attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
        maxzoom: 19
    }).addTo(leafletMap);

    var marker = L.marker(latLng);
    marker.bindPopup(JSON.stringify(latLng));
    marker.addTo(leafletMap);
    
    //marker.bindPopup("<b>" + evt.currentTarget.html + "</b><br>I am a popup.");
    
}