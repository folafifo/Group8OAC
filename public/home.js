// Grab file and send to server for parsing
let parsedData = "";

// Grabs the BibTeX file uploaded by the user and calls the runParser() function
async function grabFile() {
  var x = document.getElementById("inputBibFile");
  x.disabled = true;
  var reader = new FileReader();
  reader.readAsText(x.files[0]);
  reader.onload = async function () {
    var input = reader.result;
    runParser(input);
  };
}

async function grabText() {
  var input = document.getElementById('inputBibText').value;
  runParser(input);
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
  const response = await fetch("/unparsed", options);
  const json1 = await response.json();
  // console logging the results for now, but will change when the JCT API caller is working
  console.log(json1["parsed"][0]);
  console.log(json1["parsed"][1]);
}
