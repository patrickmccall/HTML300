var valueCount = 0;
var valueSum = 0;
var valueAverage = "";
var standardDeviation = 0;
var median = 0;

var inputArray = [];
var meanSquaredArray = [];

var numbers = [];
var strings = [];

$(document).ready(function () {
  ResetValues();
  //wire up form validator
  //$("#inputValue").on("keydown", Validate);
}
  )
;

function UpdateValues() {
  var textInput;
  var textInputArr = [];

  var sumSquaredDifferences = 0;

  //take what the user enters in the form
  textInput = $("#textInput").val();
  console.log(textInput);

  //take the input and split it into an array so we can look at the individual values
  textInputArr = textInput.split(" ");

  //examine each element of the array of input
  for (var i = 0; i < textInputArr.length; i++) {

    //check whether it's a number
    if ($.isNumeric(textInputArr[i])) {
      //convert it to a number
      textInputArr[i] = Number(textInputArr[i]);

      //add it to the numbers array, we'll need it later
      numbers.push(textInputArr[i]);

      //Keep track of the counts and update the page
      valueCount++;
      //do the same for the running total (sum) of the values
      valueSum += textInputArr[i];

      //compute the average using the two variables sum divided by count
      valueAverage = valueSum / valueCount;

    }
    else if (typeof (textInputArr[i]) == 'string') {
      //add it to the strings array, we'll need it later (well, maybe)
      strings.push(textInputArr[i]);
    }
    else {
      //ignore it
    }
  }

  //update the page with the totals  REFACTOR THIS!
  //console.log("count: " + valueCount);
  $("#count").html(valueCount);
  //console.log("  sum: " + valueSum);
  $("#sum").html(valueSum);
  //console.log("  avg: " + valueAverage);
  $("#average").html(valueAverage);
  $("#concatString").html(strings.join(" "));
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