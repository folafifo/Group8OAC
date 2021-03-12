const express = require('express');
const path = require('path')
const { auth, requiresAuth  } = require('express-openid-connect');

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

/* At this stage, the root route returns the home HTML page, and the CSS file can get
** fetched by the browser becuase we are serving the static folder. This way, all the links
** from the homepage can also be accessed */
app.get('/', (req, res) => {
    if(req.oidc.isAuthenticated()) {

        // We store the logged in homepage seperately for demonstration. Note how there
        // is no way to reach this page without being logged in. If it was in the statically 
        // served ./public directory, this would not be the case
        res.sendFile('./private/homeloggedin.html', { root: __dirname });
    } else {
        res.sendFile('./public/home.html', { root: __dirname });
    }
})

/* This is the proof of concept to get profile data for the logged in user. If a
** non-logged in user tried to access this route they are redirected to log in */
app.get('/profile', requiresAuth(), (req, res) => {
    res.send(JSON.stringify(req.oidc.user));
})

// Start the server
app.listen(PORT);