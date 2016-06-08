var settings = {
  name: ""
};

$(document).ready(function () {

  $("#submit").on("click", UpdateSettings);


  //check if there is something in local storage and get it
  // but only if we're on the hello page
  var url = window.location.pathname ;
  if (url == "/week7/hello-page.html" ) {
    GetSettings();
  }


  //wire up the other buttons
  $("#editSettings").on("click", GoTo);
  $("#clearSettings").on("click", GoTo);
})

function UpdateSettings(evt) {
  var name = $("#name").val();
  //console.log(name);
  if (name == "") {
    //console.log("empty");

  }
  else {
    //console.log("not empty")
    settings["name"] = name;
    localStorage.setItem("settingsKey",JSON.stringify(settings));
    //console.log(JSON.stringify(settings));
    var value = localStorage.getItem("settingsKey");
    //console.log(JSON.parse(value));
  }
  location.href = "hello-page.html";
}
function GetSettings() {

  var value = localStorage.getItem("settingsKey");
  var settings = "";
  if (value != null) {
    settings = JSON.parse(value);
    $("#name").html("Welcome "  + settings["name"]);
  }
  else {
    //there's nothing, so go to the settings input page
    location.href = "form-page.html";
  }

}

function ClearSettings() {
  localStorage.clear();
  }

function GoTo(evt) {
  //console.log(evt.target.id);
  var caller = evt.target.id;

  switch (caller) {
    case "editSettings":
      location.href = "form-page.html";
    case "clearSettings":
      ClearSettings();
      $("#name").html("Name Setting Not Set");
    default: location.href = "#";

  }

}
