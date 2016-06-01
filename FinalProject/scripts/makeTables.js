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
  $("#restaurants tr").on("click", viewDetails);


  //$("#resultsTable").css("display", "inline");
  //$("#inputForm").css("display", "none");
}

function viewDetails(evt) {
  console.log(evt.currentTarget.id);
  var business_id = evt.currentTarget.id;
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
