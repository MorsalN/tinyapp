//Requires
const bodyParser = require("body-parser");
const express = require('express');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
// const { request } = require("express");
const app = express();
const PORT = 8080;

//Use
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}))

//Set
//What engine to use (View) and what extention files to look at
app.set('view engine', 'ejs');

//1. request.body - this is coming from the Form Tag
//2. request.params  - this comes from the route /test/:id - request.params.id
//3. request.cookies - this is stored in the browser and we capture it with request and write it with response.

//Starter URL Data
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

const urlDatabase = {
  b6UTxQ: {
      longURL: "https://www.tsn.ca",
      userID: "aJ48lW"
  },
  i3BoGr: {
      longURL: "https://www.google.ca",
      userID: "aJ48lW"
  }
};

//Starter User Data
const users = { 
  "aJ48lW": {
    id: "aJ48lW", 
    email: "user@example.com", 
    password: "123"
  },
  "2": {
    id: "2", 
    email: "user2@example.com", 
    password: "123"
  }
}

//Getting Random 6 Character String for shortURL
function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( let i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random()*characters.length));
 }
 return result;
}

//Handle Registration Errors (If User Exists)
function handleRegistration(email, response) {
  for (const userID in users) {
    console.log('userID: ', userID);
    if (users[userID].email === email) {
      return response.status(404).send("404 page not found");
    }
  }
};

//Handle url for User
const urlsForUser = function(id) {
  const results = {};
  const keys = Object.keys(urlDatabase);
  for (const shortURL of keys) {
    const url = urlDatabase[shortURL];
    if(url.userID === id) {
      results[shortURL] = url;
    }
  }
  return results;
}

//Home Endpoint
app.get('/', (request, response) => {
  response.send('Hello!');
});


/**
 * GET /urls Endpoint
 * URL is a key for the obj template vars
 * user is equal to a specific user from the users database using a randomly generated id when registering
 */
app.get('/urls', (request, response) => {

  console.log('request session urls: ',request.session.userID);
  if (!request.session.userID) {
    const templateVars = { 
      urls : urlDatabase,
      user: users[request.session.userID]
    }; 
    return response.render('must_login', templateVars);
  }
  // console.log('request.cookies: ',request.cookies);
  // console.log('request.cookies[userid]: ',request.cookies['user_id']);

  const templateVars = { 
    urls : urlsForUser(request.session.userID),
    user: users[request.session.userID]
  }; 
  response.render('urls_index', templateVars);
});


/**
 * POST /urls Endpoint for New shortURL
 * Adding new key shortURL and making it equal to the value longURL
 */
app.post("/urls", (request, response) => {
  const shortURL = generateRandomString();


  const userObj = users[request.session.userID]; //users
  const longURL = request.body.longURL;
  console.log('before: ', urlDatabase);
  urlDatabase[shortURL] = {};
  urlDatabase[shortURL].longURL = longURL;
  urlDatabase[shortURL].userID = userObj.id;
  console.log('after: ', urlDatabase);
  response.redirect(`/urls/${shortURL}`);
 });
 

/**
 * GET /urls/new Endpoint
 * Forbidden to Create New URL if user doesn't exist
 * If user exists in users databases allow them to Create New URL
 */
app.get('/urls/new', (request, response) => {

  if (!request.session.userID) {
    return response.status(403).send("403 Forbidden");
  }
  
  const email = users[request.session.userID].email;
  for (const userID in users) {

    if (users[userID].email === email) {
      const templateVars = { 
        user: users[request.session.userID] //???
      }; 
      return response.render('urls_new', templateVars);
    } 
  }
});


/**
 * GET /urls/:shortURL Endpoint
 * : means getting the value of shortURL
 * Key longURL will get the value of longURL by urlDatabase[shortURL]
 */
app.get("/urls/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  console.log('shortURL: ',shortURL);
  const templateVars = { 
    shortURL: shortURL, 
    longURL: urlDatabase[shortURL].longURL,
    user: users[request.session.userID]
  };
  response.render("urls_show", templateVars);
});


/**
 * GET /u/:shortURL Endpoint
 * Endpoint brings you straight to the website
 */
app.get("/u/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  if (longURL) {
    response.status(307).redirect(longURL);
  } else {
    response.status(404).send("404 page not found");
  }
});


/**
 * POST /urls/:shortURL/delete Endpoint
 * Deletes website from urlDatabase if permitted
 */
app.post("/urls/:shortURL/delete", (request, response) => {
  // console.log('urlDatabase before: ', urlDatabase);
  const shortURL = request.params.shortURL;
  const shortURLObj = urlDatabase[shortURL];

  if (shortURLObj.userID === request.session.userID) {
    delete urlDatabase[shortURL];
    // console.log('urlDatabase after: ', urlDatabase);
    return response.redirect(`/urls`);
  } else {
    return response.status(403).send("403 Forbidden");
  }
});


/**
 * POST /urls/:id Endpoint
 * Updating a URL
 */
app.post("/urls/:id", (request, response) => {
// console.log('urlID', urlID);
// console.log('id from browser', IDfromBrowser);
  const shortURL = request.params.id;
  const urlID = urlDatabase[shortURL].userID;
  const IDfromBrowser = request.session.userID;

  if (urlID === IDfromBrowser) {
    const shortURL = request.params.id;
    urlDatabase[shortURL].longURL = request.body.longURL;
    response.redirect(`/urls`);
  } else {
    const templateVars = { 
      urls : urlDatabase,
      user: users[request.session.userID]
    }; 
    return response.render('must_login', templateVars);
  }
});

/**
 * GET /login Endpoint
 */
app.get("/login", (request, response) => {
  const templateVars = { 
    // user: users[request.cookies["user_id"]]
    user: null
  }; 
  response.render("login", templateVars);
});

/**
 * POST /login Endpoint
 */
app.post("/login", (request, response) => {
  console.log('request.body.email: ', request.body.email)
  const email = request.body.email;
  const password = request.body.password;

  for (const userID in users) {
    // console.log('userID email: ', users[userID].email);
    
    if (users[userID].email === email) {
      // if (users[userID].password === password) {
        bcrypt.compare(password, users[userID].password, (err, success) => {
          if (!success) {
            return response.status(403).send("403 Forbidden");
          }
          // console.log('checked email');
          console.log('checked password');
          console.log('users[userID].id:', users[userID].id);

          request.session.userID = users[userID].id;
          // response.cookie('user_id', users[userID].id);
          response.redirect(`/urls`);
        })
      }
  }
});


/**
 * POST /logut Endpoint
 */
app.post("/logout", (request, response) => {
  request.session = null;
  // response.clearCookie("user_id");
  response.redirect(`/login`);
});

/**
 * GET /register Endpoint
 */
app.get("/register", (request, response) => {
  const templateVars = { 
  user: users[request.session.userID]
  }; 
  response.render("urls_register", templateVars);
});

/**
 * POST /register Endpoint
 */
app.post("/register", (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const id = generateRandomString();
  console.log('email: ', email);
  console.log('password: ', password);
  console.log('id: ', id);
  if (email === '' || password === '') {
    return response.status(404).send("404 page not found - Missing Email or Password");
  } 
  handleRegistration(email, response);

  const hashedPassword = bcrypt.genSalt(10, (err, salt) => {
    console.log('my salt: ', salt);
    bcrypt.hash(password, salt, (error, hash) => {
    console.log('my hash: ', hash);
    users[id] = {
      id,
      email,
      password: hash,
    };
    console.log('users: ', users[id].email);
    request.session.userID = users[id].id;
    // response.cookie('user_id', users[id].id);
    console.log('url database:', urlDatabase)
    console.log('users:', users);
    response.redirect(`/urls`);
    })
  })

});





//Shows what is being added to the urlDatabase as an object
app.get('/urls.json', (request, response) => {
  response.json(urlDatabase)
});

app.get('/hello', (request, response) => {
  response.send('<html><body>Hello <b>World</b></body></html>\n');
})

app.listen(PORT, () => {
  console.log(`Example app listenting on port ${PORT}`);
});


// app.get('/set', (request, response) => {
//   const a = 1;
//   response.send(`a = ${a}`);
// });

// app.get('/fetch', (request, response) => {
//   response.send(`a = ${a}`);
// });


// app.get('/hello', (request, response) => {
//   const templateVars = { greeting: 'Hello World!' };
//   response.render('hello_world', templateVars);
// });

