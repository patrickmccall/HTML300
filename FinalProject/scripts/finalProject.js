var objLocation = new Object();
objLocation["latLng"] = [];
var myMap = new Object();
var marker = {};
var markers = [];
var layerGroup = new Object();

$(document).ready(function () {

  getLocation();
});

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
  minzoom: 18,
  maxzoom: 20,
  maxNativeZoom: 18
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
  $("#restaurantsHeader").on("click",resetRestaurants);
  $(".restaurants").slideDown(); 
}

function updateMapMarkers(data) {

  for (var i = 0; i < data.length; i++) {
    latLng = JSON.parse('[' + data[i].latitude + ',' + data[i].longitude + ']');
    marker = L.marker(latLng);
    marker.bindPopup(MakePopup(data[i]));
    //marker.addTo(myMap);
    //marker layer is added to the map
    //add the marker to the layer
    marker.options.title = data[i].business_id;
    markers.push(marker);

  }
  layerGroup = L.layerGroup(markers)
  layerGroup.addTo(myMap);

  //add the listener to show the inspections when the user clicks on the marker
  $(".leaflet-marker-icon").on("click", viewInspections);
}

function MakePopup(place) {
  return '<div id=' + place.business_id + '><h4>' + place.name + '</h4>' +
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
  ////console.log(data);
  ////reset the table
  //$("#restaurants").empty();
  //$("#inspections").empty();
  //$("#violations").empty();

  //loop through the data and build a table from it
  for (var i = 0; i < data.length; i++) {
    var dataRow = "";
    dataRow += '  <button class="list-group-item restaurant" business_id="' + data[i].business_id + '">';
    dataRow += '    <div class="restaurantElement" >   NAME:' + data[i].name + '</div>';
    dataRow += '    <div class="restaurantElement" >ADDRESS:' + data[i].address + '</div>';
    dataRow += '  </button>';

    $(".restaurants").append(dataRow);
  }
  // assign the event handler to the rows of the table
  $(".restaurant:not(#restaurantsHeader)").on("click", viewInspections);


  //$("#resultsTable").css("display", "inline");
  //$("#inputForm").css("display", "none");
}

function viewInspections(evt) {
  console.log(evt.target.title);
  var business_id = "";
  if (evt.currentTarget.localName == "button") {
   business_id = evt.currentTarget.attributes.business_id.value; 
  }
  else {
    business_id = evt.currentTarget.business_id;
  }
  
  
  // show the inspections table
  getInspections(business_id);
}

function makeInspectionsTable(data) {
  $(".restaurant:not(#restaurantsHeader)").slideUp();
  $(".inspections").slideUp();
  $(".inspections").empty();
  $(".violations").empty();

  //sort the data by date
  //http://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects
  data.sort(function (a, b) {
    return Date.parse(b.inspection_date) - Date.parse(a.inspection_date);
  })
  var dataRow = '<div class="list-group-item inspection active" id="inspectionsHeader" >INSPECTIONS</div>';
  //loop through the data and build a table from it
  for (var i = 0; i < data.length; i++) {
    var inspectionDate = new Date(data[i].inspection_date);
    //var inspectionDate = data[i].inspection_date;
    var day = inspectionDate.getDate();
    var monthIndex = inspectionDate.getMonth();
    var year = inspectionDate.getFullYear();
    var date = monthIndex + '/' + day + '/' + year;

    var contextClass = getContextClass(data[i].inspection_result);


    dataRow += '  <button class="list-group-item inspection ' + contextClass + '" inspection_id="' + data[i].inspection_serial_num + '">';
    dataRow += '    <div class="inspectionElement" >DATE:   ' + date + '</div>';
    dataRow += '    <div class="inspectionElement" >RESULT: ' + data[i].inspection_result + '</div>';
    dataRow += '    <div class="inspectionElement" >SCORE:  ' + data[i].inspection_score + '</div>';
    dataRow += '  </button>';


  }

  $(".inspections").append(dataRow);

  // assign the event handler to the rows of the table
  $(".inspection:not(#inspectionsHeader)").on("click", viewViolations);
  $(".inspections").slideDown();
  $(".inspection").fadeIn();
  $("#inspectionsHeader").on("click", inspectionsHeader);

  //var mostRecentInpection = $(".inspections:first-child").attr("class");
  //console.log(mostRecentInpection);
}

function viewViolations(evt) {
  var inspection_id = evt.currentTarget.attributes.inspection_id.value;
  getViolations(inspection_id);
}


function makeViolationsTable(data) {
  $(".inspection:not(#inspectionsHeader)").fadeOut();

  $(".violations").empty();

  //start off the row with the header
  var dataRow = '<div class="list-group-item violation active" id="violationsHeader">VIOLATIONS</div>';
  //loop through the data and build a table from it
  for (var i = 0; i < data.length; i++) {
    var contextClass = "";

    contextClass = getContextClass(data[i].violation_type);

    
    dataRow += '  <div class="list-group-item violation ' + contextClass + '" violation_id="' + data[i].violation_record_id + '">';
    dataRow += '    <div class="violationElement" >TYPE:   ' + data[i].violation_type + '</div>';
    dataRow += '    <div class="violationElement" >DESCRIPTION: ' + data[i].violation_description + '</div>';
    dataRow += '    <div class="violationElement" >POINTS:  ' + data[i].violation_points + '</div>';
    dataRow += '  </div>';

    //$("tr").on("click", viewDetails);

    

  }
    $(".violations").append(dataRow);
    $(".violations").fadeIn();
}

function resetRestaurants() {
  $(".restaurant").slideDown();
  $(".restaurantElement").slideDown();

  $(".inspections").fadeOut();
  $(".inspections").empty();

  $(".violations").fadeOut();
  $(".violations").empty();

  $(".leaflet-popup-content-wrapper").empty();
}

function inspectionsHeader() {
  //$(".restaurant:not(#restaurantHeader)").slideUp();
  //$(".inspections").slideDown();
  $(".inspection").slideDown();
  $(".inspectionElement").slideDown();

  $(".violations").fadeOut();
  $(".violations").empty();
}

function updateMarker() {
  $(div)
}

function getContextClass(contextClass) {
  //switch for determining the bootstrap contexual class 
  switch (contextClass) {
    case "Complete":
      return "list-group-item-success";
      break;
    case "Unsatisfactory":
      return "list-group-item-danger";
      break;
    case "Satisfactory":
      return "list-group-item-success";
      break;
    case "blue":
      return  "list-group-item-info";
      break;
    case "red":
      return "list-group-item-danger";
      break;
      
    default:
      return "list-group-item";
      break;

  }
}