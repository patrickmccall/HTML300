var valueCount = 0;
var valueSum = 0;
var valueAverage = "";
var standardDeviation = 0;
var median = 0;

var inputArray = [];
var meanSquaredArray = [];

$(document).ready(function () {
  ResetValues();
  //wire up form validator
  //$("#inputValue").on("keydown", Validate);
  }
  )


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
    standardDeviation = Math.sqrt((sumSquaredDifferences/valueCount));
    $("#standardDeviation").html(standardDeviation);


    //median
    //http://caseyjustus.com/finding-the-median-of-an-array-with-javascript
    //sort the array and pick the middle number
    inputArray.sort(function (a, b) { return a - b; });
    var half = Math.floor(inputArray.length / 2);

    if (inputArray.length % 2) {
      $("#median").html( inputArray[half]);
    }
    else {
      $("#median").html( (inputArray[half - 1] + inputArray[half]) / 2.0);
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