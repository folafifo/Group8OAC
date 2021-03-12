const express = require('express');
const path = require('path')

// Assign constants
const PORT = 3000;
const staticFolder = "OAC";

/* Set up the express instance, and because we are serving static 
** files, we install the express.static middleware */
const app = express();
app.use(express.static(path.join(__dirname, staticFolder)));

/* At this stage, the root route returns the home HTML page, and the CSS file can get
** fetched by the browser becuase we are serving the static folder. This way, all the links
** from the homepage can also be accessed */
app.get('/', (req, res) => {
    res.sendFile('./OAC/home.html', { root: __dirname });
})

// Start the server
app.listen(PORT);