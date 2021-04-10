const express = require('express');
const path = require('path')
const { auth, requiresAuth  } = require('express-openid-connect');
const mongoose = require('mongoose');
const bibtexParse = require('bibtex-parse');

/**
 * The area between here and the subsequent README contains the functionality for the
 * database. We implement mongoose, an API allowing us to use object models in
 * mongoDB.
 */
const uri = "mongodb+srv://Admin:Group8Pass9921{-3}@cluster0.p2pzh.mongodb.net/UserDataCollection?retryWrites=true&w=majority";
mongoose.connect(uri, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// This is the schema for the user profile. We should only save to the database
// after the query has ran, as this automatically returns the journal name, given the
// ISSN
var messagesSchema = new mongoose.Schema({
    username: String,
    email: String,
    queryiesByDate: [{ query: Object, date: Date}]
});

// Here we formally make our schema into a mongoose schema
var UserModel = mongoose.model('User database', messagesSchema);
// This gets assigned below
var userToSave = undefined;

// This message gets called below to add a user entry. We must always first check
// that only one or zero database entry exists at any one time. We will use email addresses
// to uniquely identify users
var addUser = function(name, email){
    
    // And here we create an instance of the schema to later save to the db.
    // Here is an example of what could go in as an element of the queryiesByDate
    // list: {query: "trialQuery", date: Date(), journal: "TestJournal"}
    userToSave = new UserModel({
        username: name,
        email: email,
        queryiesByDate: []
    })

    // This does the saving
    userToSave.save().catch(error => console.log(error));
    
}


/** README:
 *      So far, when a request is made to the domain (localhost:3000 while in development),
 *      when the user first accesses the webpage, they het home.html from the statically served
 *      webpages in ./public. To log in, try to access route localhost:3000/login, and you are
 *      redirected to login via Auth0 services, which does so over a TLS connection. After
 *      successfully logging in, it takes you back to localhost:3000, which now knows the user
 *      is logged in and provides a private HTML page stored in ./private
 */

/* Assign constants */
const PORT = 3000;
const staticFolder = "public";

// Config object associated with using the Auth0 api and service (given by Auth0)
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: 'j94jfh78owfhu3io48surs8584',
    baseURL: 'http://localhost:3000',
    clientID: 'MfVP7Bntefd8gWfydx4VWeOTPFJWxYDo',
    issuerBaseURL: 'https://dev-ic7w73x9.eu.auth0.com'
};

/* Set up the express instance, and because we are serving static 
** files, we install the express.static middleware */
const app = express();
app.use(express.static(path.join(__dirname, staticFolder)));
app.use(auth(config));
// Needed for the incoming bibtex file...
app.use(express.json({ limit: "2mb" }));

/* At this stage, the root route returns the home HTML page, and the CSS file can get
** fetched by the browser becuase we are serving the static folder. This way, all the links
** from the homepage can also be accessed */
app.get('/', (req, res) => {
    if(req.oidc.isAuthenticated()) {

        // We store the logged in homepage seperately for demonstration. Note how there
        // is no way to reach this page without being logged in. If it was in the statically 
        // served ./public directory, this would not be the case
        res.sendFile('./public/private/homeloggedin.html', { root: __dirname });
        

        // This queries the database to see if the user alrady has a file, and
        // if not we make one
        var logged_in_email = req.oidc.user.email;
        var logged_in_name = req.oidc.user.name;

        UserModel.find(function(err, userDocuments){
            
            // If we get something back for this var, meaning the collection exists
            if(userDocuments){
                
                var refined = userDocuments.filter(entry => entry.get('email') == logged_in_email);

                // If we have no entry, we make one, and if we have more than one, we throw an error
                if(refined.length < 1){
                    addUser(logged_in_name, logged_in_email)
                }else if(refined.length > 1){
                    throw new Error("ERROR - too many database entries for this email")
                }else /*if its equal to 1*/{
                    userToSave = refined[0];
                }

                // Be conscious that the else clasue above will result in the user needing to
                // first go to the homepage before going to the results. So a reload of the 
                // results route after a server restart will cause problems

            }
        });
        
    } else {
        res.sendFile('./public/home.html', { root: __dirname });
    }
})

/* This is the proof of concept to get profile data for the logged in user. If a
** non-logged in user tried to access this route they are redirected to log in */
app.get('/profile', requiresAuth(), (req, res) => {
    res.sendFile('./public/private/profile.html', { root: __dirname });
})

app.get('/profileData', requiresAuth(), (req, res) => {
    res.json(userToSave.queryiesByDate);
})

/* This is the parser route that parses the text input and returns the results as a
   response */

app.post("/unparsed", (request, response) => {
    // Parse the bibtex file
    const bibtex = bibtexParse.entries(request.body["input"]);
    // if there was an error
    if(bibtex == undefined || bibtex.length == 0) {
        response.json({
            status: "failure",
            parsed: bibtex
        });
    }
    // else if it was ok
    else {
        response.json({
            status: "success",
            parsed: bibtex,
        });
    }
});

// This route gets a post request sent to it with a body containing the
// query to be stored to the db
app.post("/uploadQueryToDatabase", express.json(),  (request, response) => {
    if(request.oidc.isAuthenticated()) {
        console.log("We have the query results:" + request.body);
        
        var queryToSave = request.body;
        var date = queryToSave.date;

        userToSave.queryiesByDate.push({query: queryToSave, date: date});
        userToSave.save().catch(error => console.log(error));

    }else{
        console.log("Dont do nothing as client is not logged in")
        console.log(toSee);
    }
})

// Start the server
app.listen(PORT);