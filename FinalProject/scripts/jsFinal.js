var objLocation = new Object;
objLocation["latLng"] = [];
var myMap = new Object;
var marker;
var markers = [];
var layerGroup = new Object;

$(document).ready(function () {
  
  getLocation();
  
})

function getLocation() {
  var navGeoLoc = navigator.geolocation;
  if (navGeoLoc) {
    navGeoLoc.getCurrentPosition(
        function successCallback(position) {
          //console.log('Position at ' + new Date(position.timestamp));
          //console.log(' Latitude: ' + position.coords.latitude + '°');
          //console.log(' Longitude: ' + position.coords.longitude + '°');
          //console.log(' Accuracy: ' + position.coords.accuracy + 'm');

          objLocation = position;
          var coordinates = [position.coords.latitude, position.coords.longitude]
          objLocation["latLng"] = coordinates
          
          initializeMap();
         
          getBusinesses(objLocation.coords.latitude,objLocation.coords.longitude);
        },
        function errorCallback(error) {
          var message;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = "Geolocation permission denied.";
              break;
            case error.POSITION_UNAVAILABLE:
              message = "Geolocation position unavailable.";
              break;
            case error.TIMEOUT:
              message = "Geolocation timed out.";
              break;
          }
          message += '\n' + error.message;
          console.log(message);
        },
        {
          enableHighAccuracy: false,
          maximumAge: 86400000, //1 day
          timeout: 60000 //1 min
        });
  }
  else {
    console.log('No geolocation support');
  }
}

function initializeMap() {
  myMap = L.map('leaflet-map')

  myMap.setView(objLocation.latLng, 18);

  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
  attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxzoom: 19
}).addTo(myMap);

  //add the listener
  myMap.on('moveend', moveEnd);
}

function getBusinesses(lat, lng) {
  $.ajax(
  {
    crossDomain: true,
    type: 'POST',
    url: 'https://healthinspectionmap.azurewebsites.net/HealthInspections.asmx/GetBusinesses',
    data: { latitude: lat , longitude: lng },
    contentType: "application/json; charset=utf-8",
    dataType: 'jsonp',
    success: updateMapMarkers
    , error: logAjaxError
  });

  function logAjaxError(jqXHR, textStatus, errorThrown) {
    console.log('AJAX error. Status:', textStatus, 'error:', errorThrown);
  }

}

function updateMapMarkers(data) {

  for (var i = 0; i < data.length; i++) {
    latLng = JSON.parse('[' + data[i].latitude + ',' + data[i].longitude + ']');
    marker = new L.marker(latLng);

    marker.bindPopup(MakePopup(data[i]));
    //marker.addTo(myMap);
    //marker layer is added to the map
    //add the marker to the layer
    markers.push(marker);
    
  }
  layerGroup = L.layerGroup(markers)
  layerGroup.addTo(myMap);
}

function MakePopup(place) {
  return '<h4>' + place.name + '</h4>' +
          '<h5>' + place.address + '</h5>'
}

function moveEnd() {
  console.log("move end");
  var currentLocation = myMap.getCenter();
  
  // remove the marker layer 
  myMap.removeLayer(layerGroup);
  markers = [];
  // add the businesses to the map
  getBusinesses(currentLocation.lat, currentLocation.lng );
}

//latitude: objLocation.coords.latitude , longitude: objLocation.coords.longitude },