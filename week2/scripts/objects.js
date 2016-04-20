
//empty array of recordings
var recordings = [];


$(document).ready(function () {
  ResetValues();
  $("#resultsTable").css("display", "none");

  $("thead").append("")
}
  )


function addObject() {
  //get the form values and assign them to the variables
  var album = $("#album").val();
  var artist = $("#artist").val();
  var year = $("#year").val();
  var label = $("#label").val();
  var runningLength = $("#running-length").val();

  //create a recording object and then assign the variables to the appropriate properties
  var recording = new Object();
  recording['album'] =album;
  recording['artist'] = artist;
  recording['year'] = year;
  recording['label'] = label;
  recording['runningLength'] = runningLength;

  //console.log(recording.album);
  //add the recording to the object array
  recordings.push(recording);
  //update the table with the complete array
  updateTable(recordings);

}

function returnToInputForm() {
  //console.log("returnToInputForm");
  $("#resultsTable").css("display", "none");
  $("#inputForm").css("display", "inline");
}

function updateTable(data) {
  //console.log(data);
  //reset the table
  $("#tableBody").empty();

  for (var i = 0; i < data.length; i++) {
    var dataRow = "";
    dataRow += '<tr>';
    dataRow += '  <td>' + data[i].artist + '</td>';
    dataRow += '  <td>' + data[i].album + '</td>';
    dataRow += '  <td>' + data[i].year + '</td>';
    dataRow += '  <td>' + data[i].label + '</td>';
    dataRow += '  <td>' + data[i].runningLength + '</td>';
    dataRow += '</tr>';
    $("#tableBody").append(dataRow);
  }
  $("#resultsTable").css("display", "inline");
  $("#inputForm").css("display", "none");
}


function UpdateValues() {
  var inputValue;
  var sumSquaredDifferences = 0;

  inputValue = $("#inputValue").val();
  console.log(inputValue);

  //test that the input is a valid entry
  if ($.isNumeric(inputValue)) {
    //convert it to a number
    inputValue = Number(inputValue);

    //add it to the inputArray, we'll need it later
    inputArray.push(inputValue);

    //console.log("success");
    //Keep track of the counts and update the page
    valueCount++;
    //console.log("count: " + valueCount);
    $("#count").html(valueCount);

    //do the same for the running total (sum) of the values
    valueSum += inputValue;
    //console.log("  sum: " + valueSum);
    $("#sum").html(valueSum);

    //compute the average using the two variables sum divided by count
    valueAverage = valueSum / valueCount;
    //console.log("  avg: " + valueAverage);
    $("#average").html(valueAverage);

    //standard deviation
    //http://www.mathsisfun.com/data/standard-deviation-formulas.html
    //Work out the Mean (the simple average of the numbers)
    valueAverage

    //for each number: subtract the Mean and square the result
    for (var i in inputArray) {
      //console.log(i + " before : " + inputArray[i]);
      meanSquaredArray.push(Math.pow((inputArray[i] - valueAverage), 2));
      //console.log(i + " after : " + inputArray[i]);
    }
    //Then work out the mean of those squared differences 
    for (var i in meanSquaredArray) {
      //console.log(i + " sum before : " + meanSquaredArray[i]);
      sumSquaredDifferences += meanSquaredArray[i];
      //console.log(i + " sum after : " + meanSquaredArray[i]);
    }
    meanSquaredArray = [];
    standardDeviation = Math.sqrt((sumSquaredDifferences / valueCount));
    $("#standardDeviation").html(standardDeviation);


    //median
    //http://caseyjustus.com/finding-the-median-of-an-array-with-javascript
    //sort the array and pick the middle number
    inputArray.sort(function (a, b) { return a - b; });
    var half = Math.floor(inputArray.length / 2);

    if (inputArray.length % 2) {
      $("#median").html(inputArray[half]);
    }
    else {
      $("#median").html((inputArray[half - 1] + inputArray[half]) / 2.0);
    }
  }
    //it's not valid, let the user know
  else {
    //console.log("fail");
    alert("please enter a number");

  }
}

function ResetValues() {
  valueCount = 0;
  valueSum = 0;
  valueAverage = "";
  inputArray = [];
  meanSquaredArray = [];
  standardDeviation = 0;
  $("#inputValue").val(null);

  $("#count").html(valueCount);
  $("#sum").html(valueSum);
  $("#average").html(valueAverage);
  $("#standardDeviation").html(null);
  $("#median").html(null);
}

function Validate() {
  inputValue = $("#inputValue").val();
  //console.log("validate");
  if ($.isNumeric(inputValue)) {
    console.log("validateTrue");
    $("#inputValue").removeClass("error");
  }
  else
    $("#inputValue").addClass("error");
  console.log("validateFalse");
}