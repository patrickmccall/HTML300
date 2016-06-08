$(document).ready(function () {
  //let's add some event handlers to the controls
  $(".controls").on("change", getValue);
}
  )
;


function getValue(evt) {
  //console.log(evt.currentTarget.value);
  //console.log(evt);
  var control = $(evt.currentTarget.id).selector;
  var controlType = $(evt.currentTarget.type).selector;
  var controlName = $(evt.currentTarget.name).selector;
  //var controlType = $(evt.)
  //console.log(control);
  //console.log(controlType);
  var controlValue = "";
  if (controlType == "checkbox") {
    console.log( $("#" + control).prop("checked"));
    controlValue = $("#" + control).prop("checked");
  } else {
    console.log($("#" + control).val());
    controlValue = $("#" + control).val().toString();
  }
  $("[controlLabel=" + controlName + "]").html(controlValue.toString());
}