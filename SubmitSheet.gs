function doGet() {
  const d = new Date();
  const fileName = `Created: ${formatDate(d)}`;
  console.log(fileName);   

  const destFolder = DriveApp.getFolderById("/*ID Removed*/");
  const newID = DriveApp.getFileById("/*ID Removed*/").makeCopy(fileName, destFolder).getId();

  const file = DriveApp.getFileById(newID);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
  
  const url = `https://docs.google.com/spreadsheets/d/${newID}/edit`;

  const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Emergency Department Assignment Sheet</title>
    <script>
    var formSubmitted = false;
      function submitForm() {
        var submitButton = document.getElementById("submit-button");
        google.script.run.withSuccessHandler(function(date) {
          if (!date) {  
            alert("Please enter the date in cell B2 before submitting. Make sure press the Enter button after entering the date.");
          } else {
            submitButton.value = "Submit Successful!";
            submitButton.disabled = true;
            google.script.run.addConditionalFormatting(date, '${newID}', '${url}');
            formSubmitted = true;
          }
        }).getCellValue('${newID}', 'B2');
      }  

      window.addEventListener('beforeunload', function(event) {
          exitPage(event);
        });

        function exitPage(event) {
          if (!formSubmitted) {
            event.preventDefault();
            event.returnValue = 'Are you sure? If you leave without submitting, your data will be lost!';

            google.script.run.withSuccessHandler(function(response) {
              if (response && response.deleted) {
                console.log("Sheet Deleted!");
              } else {
                console.log("Sheet Deletion Failed!");
              }
            }).deleteSheet('${newID}', '${fileName}');
          }
        }
    </script>

    <style>
      html, body {
        height: 100%;
        margin: 0;
        padding: 0;
      }

      iframe {
        width: 100%;
        height: 95%;
        border: none;
      }

      #submit-button {
        background-color: #008000;
        color: #FFFFFF;
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        cursor: pointer;
      }

      #submit-button:hover {
        background-color: #006400;
      }
    </style>
  </head>
  <body>
    <iframe src="${url}" frameborder="0" scrolling="yes"></iframe>
    <form>      
      <input id="submit-button" type="button" value="Click here to submit" onclick="submitForm()">
    </form>
    <script>
      window.addEventListener('unload', exitPage);
    </script>
  </body>
</html>`

  return HtmlService.createHtmlOutput(html);
}

function addConditionalFormatting(date, newID, url) {
  var dORn = ""; 
  date[0] == 0 ? dORn = "Day" : dORn = "Night";
  console.log("dORn: " + dORn);
  let fileName = `${date[1]} - ${dORn}`;  
  const spreadsheet = SpreadsheetApp.openById(newID);
  spreadsheet.rename(fileName);
  console.log(`Renamed file to "${fileName}`);
  const sheets = spreadsheet.getSheets();
  date = new Date(date[1]);
  
  for (var i = 0; i < sheets.length; i++) {
  const range = sheets[i].getRange("A1:E46");
  var values = range.getDisplayValues();
  var rules = [];
  
  for (var row = 0; row < values.length; row++) {
    for (var col = 0; col < values[row].length; col++) {
      var cellValue = values[row][col];
      var cell = sheets[i].getRange(row + 1, col + 1);
      var rule;

      if (cell.getA1Notation() === "B2" || cell.getA1Notation() === "B3" ) {
      // Rule for cell B2 & B3 
      rule = SpreadsheetApp.newConditionalFormatRule()
        .whenFormulaSatisfied(`=${cell.getA1Notation()} <> date(${date.getFullYear()}, ${date.getMonth() + 1}, ${date.getDate()})`)
        .setFontColor('#FF0000')
        .setRanges([cell])
        .build();
    } else {
      // Rules for other cells
      if (cellValue === '' || cellValue === undefined) {
        rule = SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(`=ISBLANK(${cell.getA1Notation()}) = FALSE`)
          .setFontColor('#FF0000')
          .setRanges([cell])
          .build();
      } else {
        rule = SpreadsheetApp.newConditionalFormatRule()
          .whenFormulaSatisfied(`=${cell.getA1Notation()} <> "${cellValue}"`)
          .setFontColor('#FF0000')
          .setRanges([cell])
          .build();
      }
    }
      rules.push(rule);   
    } //col loop (inner)
  } //row loop (outer) 
  sheets[i].setConditionalFormatRules(rules);
  } //sheet loop
  console.log("Set conditional formatting");
  sendEmail(url, fileName);
} //end function

function getCellValue(sheetId, cell) {
  var value = "";
  var sheets = SpreadsheetApp.openById(sheetId).getSheets();
  for (var i = 0; i < sheets.length; i++) {
   value = sheets[i].getRange(cell).getDisplayValue();
     if (value !== "" && value !== undefined) {
      value = [i, value];
      break;
    }
  }
  return value;
}

function sendEmail(sheetUrl, subject) {  
  MailApp.sendEmail({
    to: /*Email Removed*/,
    subject: subject,
    body: "Please find the link to the Google Sheet: " + sheetUrl
  });
  console.log("Sent Email!");
}

function deleteSheet(id, fileName) {
  try {
    DriveApp.getFileById(id).setTrashed(true);
    console.log(`Sent "${fileName}" to the trash`);
    return { deleted: true };
  } catch (error) {
    console.error(error);
    return { deleted: false }; 
  }
}

function formatDate(date) {
  let options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  return date.toLocaleString('en-US', options).replaceAll("/", "-").replaceAll(":", "-").replaceAll(", ", "-");
}
