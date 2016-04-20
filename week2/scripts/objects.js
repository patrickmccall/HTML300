
//empty array of recordings
var recordings = [];
var recordingId = 0;

$(document).ready(function () {
  returnToInputForm()

  $("thead").append("")
}
  )


function addObject() {
  //get the form values and assign them to the variables
  var recordId = $("#recordId").val();
  var album = $("#album").val();
  var artist = $("#artist").val();
  var year = $("#year").val();
  var label = $("#label").val();
  var runningLength = $("#running-length").val();

  //create a recording object and then assign the variables to the appropriate properties
  var recording = new Object();
  recording['id'] = recordId;
  recording['album'] = album;
  recording['artist'] = artist;
  recording['year'] = year;
  recording['label'] = label;
  recording['runningLength'] = runningLength;

  if (recordId == "NEW") {
    //new record
    //add the recording to the object array
    recordings.push(recording);
    recordingId++;
  }
  else {
    //edit existing record
    //use the splice function to substitute in the new record for the old one
    recordings.splice(recordId, 1, recording);
  }
  //console.log(recording.album);

  //update the table with the complete array
  updateTable(recordings);
  //increment the recording id

}

function returnToInputForm() {
  //console.log("returnToInputForm");
  $("#resultsTable").css("display", "none");
  $("#inputForm").css("display", "inline");
  $("#recordId").val("NEW");
  $("#recordId").css("display", "none");
}

function updateTable(data) {
  //console.log(data);
  //reset the table
  $("#tableBody").empty();

  //loop through the data and build a table from it
  for (var i = 0; i < data.length; i++) {
    var dataRow = "";
    dataRow += '<tr>';
    dataRow += '  <td>' + data[i].artist + '</td>';
    dataRow += '  <td>' + data[i].album + '</td>';
    dataRow += '  <td>' + data[i].year + '</td>';
    dataRow += '  <td>' + data[i].label + '</td>';
    dataRow += '  <td>' + data[i].runningLength + '</td>';
    dataRow += '  <td><button type="button" name="edit" onclick="editRecord(' + i + ')">edit</button></td>';
    dataRow += '  <td><button type="button" name="delete" onclick="deleteRecord(' + i + ')">delete</button></td>';
    dataRow += '</tr>';
    $("#tableBody").append(dataRow);
  }
  $("#resultsTable").css("display", "inline");
  $("#inputForm").css("display", "none");
}

function deleteRecord(i) {
  //use the splice method on the array to remove the item by index 
  recordings.splice(i, 1);
  //update the table
  updateTable(recordings);
}

function editRecord(i) {
  $("#resultsTable").css("display", "none");
  $("#inputForm").css("display", "inline");
  $("#album").val(recordings[i].album);
  $("#artist").val(recordings[i].artist);
  $("#year").val(recordings[i].year);
  $("#label").val(recordings[i].label);
  $("#running-length").val(recordings[i].runningLength);
  $("#recordId").val(i);
}