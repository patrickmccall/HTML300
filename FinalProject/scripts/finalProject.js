var leafletMap;

$(document).ready(function () {
  GetData();
}
  )
;


function GetData() {
  $.ajax(
    {
      crossDomain: true,
      type: 'POST',
      url: 'https://healthinspectionmap.azurewebsites.net/HealthInspections.asmx/GetBusinesses1',
      data: JSON.parse("{}"),

      contentType: "application/json; charset=utf-8",
      dataType: 'jsonp',
      //data: {
      //  skip: 1,
      //  limit: 2
      //},
      success: function logListResult(data) {
        //console.log('Data received:', data);
        buildMap(data);
      },
      error: logAjaxError
    });


  function logAjaxError(jqXHR, textStatus, errorThrown) {
    console.log('AJAX error. Status:', textStatus, 'error:', errorThrown);


  }
}

function buildMap(places) {
  if (places.length > 0) {


    leafletMap = L.map('leaflet-map'); //The id of the div
    //var place = JSON.parse(places[0]);
    var place = places[0];
    var latLng = JSON.parse('[' + place.latitude + ',' + place.longitude + ']');

    leafletMap.setView(latLng, 18);

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxzoom: 19
    }).addTo(leafletMap);

    for (var i = 0; i < places.length; i++) {
      latLng = JSON.parse('[' + places[i].latitude + ',' + places[i].longitude + ']');
      var marker = L.marker(latLng);
      marker.bindPopup(MakePopup(places[i]));
      marker.addTo(leafletMap);
    }



    //marker.bindPopup("<b>" + evt.currentTarget.html + "</b><br>I am a popup.");
  }
}

function MakePopup(place) {
  return  '<h4>' + place.name +  '</h4>' + 
          '<h5>' + place.address +  '</h5>'
}