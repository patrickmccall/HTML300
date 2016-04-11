var valueCount = 0;
var valueSum = 0;
var valueAverage = "";

$(document).ready(ResetValues)


function UpdateValues() {
  var inputValue;

  inputValue = $("#inputValue").val();
  console.log(inputValue);

  //test that the input is a valid entry
  if ($.isNumeric(inputValue)) {
    //convert it to a number
    inputValue = Number(inputValue);
    //console.log("success");
    //Keep track of the counts and update the page
    valueCount++;
    console.log("count: " + valueCount);
    $("#count").html(valueCount);

    //do the same for the running total (sum) of the values
    valueSum += inputValue;
    console.log("  sum: " + valueSum);
    $("#sum").html(valueSum);

    //finally compute the average using the two variables sum divided by count
    valueAverage = valueSum / valueCount;
    console.log("  avg: " + valueAverage);
    $("#average").html(valueAverage);
  }
  //it's not valid, let the user know
  else {
    console.log("fail");
    //alert("please enter a number")

  }
}

function ResetValues() {
  valueCount = 0;
  valueSum = 0;
  valueAverage = "";

  $("#count").html(valueCount);
  $("#sum").html(valueSum);
  $("#average").html(valueAverage);
}