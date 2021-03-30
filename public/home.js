// Grab file and send to server for parsing
let parsedData = "";

// Grabs the BibTeX file uploaded by the user and calls the runParser() function
async function grabFile() {
  var x = document.getElementById("inputBibFile");
  // Don't allow another file upload while processing the current one
  x.disabled = true;
  var reader = new FileReader();

  // error handling if they click upload without selecting a file
  if (x.files[0] == null) {
    alert("Please input a BibTeX file")
  }
  else {
    // error handling if file uploaded is too big (number below in bytes)
    if (x.files[0].size > 2000000) {
      alert("Please input a BibTeX file")
    } 
    // else if the file is a reasonable size
    else {
      // run the FileReader instance to convert the file to plaintext
      reader.readAsText(x.files[0])
      reader.onload = async function () {
        // get the result of the file read and send it to the parser
        var input = reader.result;
        runParser(input);
      };
    }
  }
  x.disabled = false;
}

// Grabs the text inputted by the user and calls the runParser() function
async function grabText() {
  var input = document.getElementById("inputBibText").value;
  if (String(input).length > 20000) {
    alert("The input is too large... Please try again")
  }
  else if (input === "") {
    alert("Please input a BibTeX file")
  }
  else {
    runParser(input);
  }
}

// Sends the BibTeX text to the server for parsing and waits for response
async function runParser(input) {
  const data = { input };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  const response = await fetch("/unparsed", options).catch(err => {alert(err)});
  const jsonResponse = await response.json();

  /* THIS IS WHERE THE PARSER RETURNS
     The 'jsonResponse' contains:
      {
          status: "failure",
          parsed: bibtex
      }
      'status' is either success if parsed or failure if there was a problem
      'parsed' will contain an array of the bibtex entries iff the status is success
  */
  if (jsonResponse["status"] == "failure") {
    alert("You submitted an incorrectly formatted/invalid BibTeX file");
  } else {
    // console logging the results for now, but will change when the JCT API caller is working
    jsonResponse["parsed"].forEach((element) => {
      console.log(element);
    });
  }
}
