var objLocation = new Object;
objLocation["latLng"] = [];
var myMap = new Object;
var marker = {};
var markers = [];
var layerGroup = new Object;

$(document).ready(function () {

  getLocation();
  //jquery ui accordion
  $("#accordion").accordion({
    collapsible: true
  });
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
          var objBounds = myMap.getBounds();
          getBusinessesByBounds(objBounds._northEast.lat,
                                objBounds._northEast.lng,
                                objBounds._southWest.lat,
                                objBounds._southWest.lng);
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

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
  attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
  maxzoom: 19
}).addTo(myMap);

  //add the listener
  myMap.on('moveend', moveEnd);
}

function getBusinessesByBounds(neLat, neLng, swLat, swLng) {
  $.ajax(
  {
    crossDomain: true,
    type: 'POST',
    url: 'https://healthinspectionmap.azurewebsites.net/HealthInspections.asmx/GetBusinessesByBounds',
    data: {
      nelatitude: neLat,
      nelongitude: neLng,
      swLatitude: swLat,
      swLongitude: swLng
    },
    contentType: "application/json; charset=utf-8",
    dataType: 'jsonp',
    success: ajaxBusinessesSuccess
    //updateMapMarkers,
    //        makeResultsTable

    , error: logAjaxError
  });

  function logAjaxError(jqXHR, textStatus, errorThrown) {
    console.log('AJAX error. Status:', textStatus, 'error:', errorThrown);
  }

}

function ajaxBusinessesSuccess(data) {
  updateMapMarkers(data);
  makeResultsTable(data)
  $(".results").css("height", .5 * (data.length) + "em")
}

function updateMapMarkers(data) {

  for (var i = 0; i < data.length; i++) {
    latLng = JSON.parse('[' + data[i].latitude + ',' + data[i].longitude + ']');
    marker = L.marker(latLng);
    marker.bindPopup(MakePopup(data[i]));
    //marker.addTo(myMap);
    //marker layer is added to the map
    //add the marker to the layer
    markers.push(marker);

  }
  layerGroup = L.layerGroup(markers)
  layerGroup.addTo(myMap);

  //add the listener to show the inspections when the user clicks on the marker
  $(".leaflet-marker-icon").on("click", viewInspections);
}

function MakePopup(place) {
  return '<div><h4 id=' + place.business_id + '>' + place.name + '</h4>' +
          '<h5>' + place.address + '</h5></div>'
}

//function called when the map changes position
function moveEnd() {
  console.log("move end");
  var currentLocation = myMap.getCenter();

  // remove the marker layer 
  myMap.removeLayer(layerGroup);
  markers = [];
  // add the businesses to the map
  // figure out the bounds of the new map
  var objBounds = myMap.getBounds();
  getBusinessesByBounds(objBounds._northEast.lat,
                        objBounds._northEast.lng,
                        objBounds._southWest.lat,
                        objBounds._southWest.lng);
}

// get the cooreponding inspections for the selected business
function getInspections(business_id) {
  $.ajax(
  {
    crossDomain: true,
    type: 'POST',
    url: 'https://healthinspectionmap.azurewebsites.net/HealthInspections.asmx/GetInspectionsByBusinessId',
    data: {
      businessId: business_id
    },
    contentType: "application/json; charset=utf-8",
    dataType: 'jsonp',
    success: ajaxInspectionsSuccess
    , error: logAjaxError
  });

  function logAjaxError(jqXHR, textStatus, errorThrown) {
    console.log('AJAX error. Status:', textStatus, 'error:', errorThrown);
  }

}

// callback when getInspections returns data
function ajaxInspectionsSuccess(data) {
  makeInspectionsTable(data)
}

function getViolations(inspection_id) {
  $.ajax(
  {
    crossDomain: true,
    type: 'POST',
    url: 'https://healthinspectionmap.azurewebsites.net/HealthInspections.asmx/GetViolationsByInspectionId',
    data: {
      InspectionId: inspection_id
    },
    contentType: "application/json; charset=utf-8",
    dataType: 'jsonp',
    success: ajaxViolationsSuccess
    //updateMapMarkers,
    //        makeResultsTable

    , error: logAjaxError
  });

  function logAjaxError(jqXHR, textStatus, errorThrown) {
    console.log('AJAX error. Status:', textStatus, 'error:', errorThrown);
  }

}

//function ajaxInspectionsSuccess(data) {
//  makeInspectionsTable(data);
//}

function ajaxViolationsSuccess(data) {
  makeViolationsTable(data);

}


function makeResultsTable(data) {
  //console.log(data);
  //reset the table
  $("#restaurants").empty();
  $("#inspections").empty();
  $("#violations").empty();

  //loop through the data and build a table from it
  for (var i = 0; i < data.length; i++) {
    var dataRow = "";
    dataRow += '<tr id = "' + data[i].business_id + '">';
    dataRow += '  <td id = "' + data[i].business_id + '">' + data[i].name + '</td>';
    dataRow += '  <td>' + data[i].address + '</td>';
    //dataRow += '  <td>' + data[i].runningLength + '</td>';
    //dataRow += '  <td><button type="button" name="edit" onclick="editRecord(' + i + ')">edit</button></td>';
    //dataRow += '  <td><button type="button" name="delete" onclick="deleteRecord(' + i + ')">delete</button></td>';
    dataRow += '</tr>';
    //$("tr").on("click", viewDetails);
    $("#restaurants").append(dataRow);
  }
  // assign the event handler to the rows of the table
  $("#restaurants tr").on("click", viewInspections);


  //$("#resultsTable").css("display", "inline");
  //$("#inputForm").css("display", "none");
}

function viewInspections(evt) {
  console.log(evt.currentTarget.id);
  var business_id = evt.currentTarget.id;
  // change the label of the top level accordion
  $("#results").html(evt.currentTarget.id)

  // show the inspections table
  getInspections(business_id);
}

function makeInspectionsTable(data) {
  $("#inspections").empty();
  $("#violations").empty();

  //sort the data by date
  //http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
  data.sort(function (a, b) {
    return Date.parse(b.inspection_date) - Date.parse(a.inspection_date);
  })

  //loop through the data and build a table from it
  for (var i = 0; i < data.length; i++) {
    var inspectionDate = new Date(data[i].inspection_date);
    //var inspectionDate = data[i].inspection_date;
    var day = inspectionDate.getDate();
    var monthIndex = inspectionDate.getMonth();
    var year = inspectionDate.getFullYear();
    var date = monthIndex + '/' + day + '/' + year;


    var dataRow = "";
    dataRow += '<tr id = "' + data[i].inspection_serial_num + '">';
    dataRow += '  <td>' + date + '</td>';
    dataRow += '  <td>' + data[i].inspection_result + '</td>';
    dataRow += '  <td>' + data[i].inspection_score + '</td>';
    //dataRow += '  <td>' + data[i].runningLength + '</td>';
    //dataRow += '  <td><button type="button" name="edit" onclick="editRecord(' + i + ')">edit</button></td>';
    //dataRow += '  <td><button type="button" name="delete" onclick="deleteRecord(' + i + ')">delete</button></td>';
    dataRow += '</tr>';
    //$("tr").on("click", viewDetails);
    $("#inspections").append(dataRow);
  }
  // assign the event handler to the rows of the table
  $("#inspections tr").on("click", viewViolations);

  // collapse the top level accordion by clicking on the inspections
  $("#inspectionsHeader").click();
}

function viewViolations(evt) {
  var inspection_id = evt.currentTarget.id;
  getViolations(inspection_id);
}
function makeViolationsTable(data) {

  $("#violations").empty();

  //sort the data by date
  //http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
  //data.sort(function (a, b) {
  //  return Number.parse(b.violation_points) - Number.parse(a.violation_points);
  //})

  //loop through the data and build a table from it
  for (var i = 0; i < data.length; i++) {

    var dataRow = "";
    dataRow += '<tr id = "' + data[i].violation_record_id + '">';
    dataRow += '  <td>' + data[i].violation_type + '</td>';
    dataRow += '  <td>' + data[i].violation_description + '</td>';
    dataRow += '  <td>' + data[i].violation_points + '</td>';
    //dataRow += '  <td>' + data[i].runningLength + '</td>';
    //dataRow += '  <td><button type="button" name="edit" onclick="editRecord(' + i + ')">edit</button></td>';
    //dataRow += '  <td><button type="button" name="delete" onclick="deleteRecord(' + i + ')">delete</button></td>';
    dataRow += '</tr>';
    //$("tr").on("click", viewDetails);
    $("#violations").append(dataRow);
  }

}
