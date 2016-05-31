function makeResultsTable(data) {
  //console.log(data);
  //reset the table
  $("#restaurants").empty();

  //loop through the data and build a table from it
  for (var i = 0; i < data.length; i++) {
    var dataRow = "";
    dataRow += '<tr>';
    dataRow += '  <td>' + data[i].name + '</td>';
    dataRow += '  <td>' + data[i].address + '</td>';
    //dataRow += '  <td>' + data[i].runningLength + '</td>';
    //dataRow += '  <td><button type="button" name="edit" onclick="editRecord(' + i + ')">edit</button></td>';
    //dataRow += '  <td><button type="button" name="delete" onclick="deleteRecord(' + i + ')">delete</button></td>';
    dataRow += '</tr>';
    $("#restaurants").append(dataRow);
  }
  //$("#resultsTable").css("display", "inline");
  //$("#inputForm").css("display", "none");
}