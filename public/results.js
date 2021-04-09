// Arrays of raw results from API call
var results = []
var undefined = []

// Boolean to signal 1 or more bibliography entries without journals
var missingJournals = false
var missingFunder = false
var missingInst = false

// Arrays of sorted results from API call.
// Matching indices imply corresponding queries.
var journalsArr = []
var tjArr = []
var fully_oaArr = []
var taArr = []
var self_archivingArr = []

/* Array that holds whether a particular journal/organization has already been seen
   to prevent duplication when printing
*/
var hasSeenArr = {}
var invalidEntries = {failures: {}}


// Array to keep track of whether journals are OA ("yes"|"no"|"maybe")
var journalsOA = []

// Strings for printing as HTML elements
var journalStr, tjStr, foaStr, taStr, saStr

// HTML elements
var element = document.getElementById("myResults")
var section, paragraph, bold
var journalNode, tjNode, foaNode, taNode, saNode

window.onload = async function() {

    let urls = JSON.parse(localStorage.getItem("urls"))
    for (let index = 0; index < urls.length; index++) {
        let url = urls[index];
        let result = await get(url)
        if(result['request']['journal'].length >= 1 && 
            result['request']['funder'].length >= 1 && 
            result['request']['institution'].length >= 1){
                results.push(result)
                console.log("Sucess:")
                console.log(result)
        } else if(result['request']['journal'].length >= 1){
            results.push(result)
            console.log("No F/I:")
            console.log(result)
            if(result['request']['funder'].length < 1){
                missingFunder = true
            }
            if(result['request']['institution'].length < 1){
                missingInst = true
            }
        } else{
            console.log("Failure J:")
            console.log(url)
            missingJournals = true
            let temp = url.split("=")[1]
            let key = temp.substring(0,temp.length-4)
            if(!invalidEntries.failures[key]) {
                invalidEntries.failures[key] = "No results were retrieved"
            }
        }
    }

    populateArrays()
    writeToPage()
}

// Function performs Get Request from API
async function get(url) {


    const response =    await fetch(url, {
        'method': 'GET',
  
    })
  
    let data = await response.json()
    return data;
}

// Function populates results information arrays
async function populateArrays() {

    for (let index = 0; index < results.length; index++) {
        if (!hasSeenArr[results[index]['request']['journal'][0]['title']]){
            hasSeenArr[results[index]['request']['journal'][0]['title']] = true;
        }
        journalsArr[index] = results[index]['request']['journal'][0]['title']
        tjArr[index] = results[index]['results'][0]['compliant']
        fully_oaArr[index] = results[index]['results'][1]['compliant']
        taArr[index] = results[index]['results'][2]['compliant']
        self_archivingArr[index] = results[index]['results'][3]['compliant']
        if(fully_oaArr[index] == "yes"){
            journalsOA[index] = "yes"
        }
        else if(tjArr[index] == "yes" || taArr[index] == "yes" || self_archivingArr[index] == "yes"){
            journalsOA[index] = "maybe"
        }
        else{
            journalsOA[index] = "no"
        }
    }

}

// Functions writes results to HTML page
async function writeToPage(){

    if(missingJournals ||  missingFunder || missingInst){
        document.getElementById("warningTitle").removeAttribute("hidden")
        document.getElementById("warningDivider").removeAttribute("hidden")
        document.getElementById("warningBreak").removeAttribute("hidden")
    }
    if(missingJournals){
        document.getElementById("journalWarning1").removeAttribute("hidden")
        document.getElementById("journalWarning2").removeAttribute("hidden")
    }
    if(missingFunder){
        document.getElementById("funderWarning1").removeAttribute("hidden")
    }
    if(missingInst){
        document.getElementById("instWarning1").removeAttribute("hidden")
    }

    // Calculate percentages of OA and possible future OA journals
    let percOA = calculatePercentageOA()
    let percMaybeOA = calculatePercentageMaybeOA()

    // Write these percentages to the page
    document.getElementById("fullyOAPerc").innerHTML = (await percOA).toString() + "%"
    document.getElementById("fullyOA").innerHTML = "of journals are Fully Open-Access compliant with your funder and institution"

    document.getElementById("maybeOAPerc").innerHTML = (await percMaybeOA).toString() + "%"
    document.getElementById("maybeOA").innerHTML = "of journals that are not already Fully Open-Access are on track to becoming Open-Access compliant in the future."

    // Write information from each journal to page
    for (let index = 0; index < results.length; index++) {
        if(hasSeenArr[results[index]['request']['journal'][0]['title']]) {
            hasSeenArr[results[index]['request']['journal'][0]['title']] = false;
            journalStr = (journalsArr[index])
            tjStr = ("- Transformative Journal: " + tjArr[index])
            foaStr = ("- Fully Open-Access: " + fully_oaArr[index])
            taStr = ("- Transformative Agreement: " + taArr[index])
            saStr = ("- Self-Archiving: " + self_archivingArr[index])

            section = document.createElement("div")

            style="color: green;"

            paragraph = document.createElement("p")

            if(journalsOA[index] == "yes"){
                paragraph.setAttribute("style", "color: green;")
            } else if(journalsOA[index] == "maybe"){
                paragraph.setAttribute("style", "color: orange;")
            } else{
                paragraph.setAttribute("style", "color: red;")
            }

            bold = document.createElement("b")
            journalNode = document.createTextNode(journalStr)
            bold.appendChild(journalNode)
            paragraph.appendChild(bold)
            section.appendChild(paragraph)

            paragraph = document.createElement("p")
            tjNode = document.createTextNode(tjStr)
            paragraph.appendChild(tjNode)
            section.appendChild(paragraph)

            paragraph = document.createElement("p")
            foaNode = document.createTextNode(foaStr)
            paragraph.appendChild(foaNode)
            section.appendChild(paragraph)

            paragraph = document.createElement("p")
            taNode = document.createTextNode(taStr)
            paragraph.appendChild(taNode)
            section.appendChild(paragraph)

            paragraph = document.createElement("p")
            saNode = document.createTextNode(saStr)
            paragraph.appendChild(saNode)
            section.appendChild(paragraph)

            element.appendChild(section)
        }
    }
    let counter = 1
    let elem = document.getElementById("myFailures")
    let section1 = document.createElement("div")
    Object.keys(invalidEntries.failures).map((key) => {
        let words = document.createElement("p")
        words.setAttribute("style", "margin-bottom: 0")
        let temper = document.createTextNode(counter++ + ". " + key)
        words.appendChild(temper)
        section1.appendChild(words)
    });
    elem.appendChild(section1)

}

// Finds percentage of journals in our results that are fully OA
async function calculatePercentageOA(){
    
    let counter = 0

    for (let index = 0; index < fully_oaArr.length; index++) {
        if(fully_oaArr[index] == "yes"){
            counter++
        }
    }

    return (counter / fully_oaArr.length) * 100
}

// Finds percentage of journals in our results that may be OA in the future
async function calculatePercentageMaybeOA(){
    
    let maybeOA = new Array(results.length)
    let maybeCounter = 0
    let alreadyCounter = 0

    // Find number of journals that may become OA in the future
    // Use array to make sure not to count them twice
    for (let index = 0; index < tjArr.length; index++) {
        maybeOA[index] = tjArr[index]
    }

    for (let index = 0; index < taArr.length; index++) {
        if(maybeOA[index] != "yes"){
            maybeOA[index] = taArr[index]
        }
    }

    for (let index = 0; index < self_archivingArr.length; index++) {
        if(maybeOA[index] != "yes"){
            maybeOA[index] = self_archivingArr[index]
        }
    }
    
    // Find number already fully OA
    for (let index = 0; index < fully_oaArr.length; index++) {
        if(fully_oaArr[index] == "yes"){
            alreadyCounter++
        }
    }

    // Calculate number that may be OA in the future
    for (let index = 0; index < maybeOA.length; index++) {
        if(maybeOA[index] == "yes"){
            maybeCounter++
        }
    }

    // Calculate number that may be OA in the future, excluding those that are already fully OA
    if(maybeCounter > 0){
        return ((maybeCounter - alreadyCounter) / (fully_oaArr.length - alreadyCounter)) * 100
    }
    else{
        return 0
    }
}