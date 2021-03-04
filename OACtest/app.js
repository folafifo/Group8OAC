function handleInput() {
    var issn = document.getElementById('issn').value
    run(issn)
}

async function get(url) {
   

    const response =    await fetch(url, {
        'method': 'GET',

    })

    let data = await response.json()
    return data;
}

async function run(issn) {
    let url = `https://api.journalcheckertool.org/tj/${issn}`
    let result = await get(url)
    console.log(result)
    
}