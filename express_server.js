const bodyParser = require("body-parser");
// const { response, request } = require('express');
const express = require('express');
var cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

//this is saying what engine to use (view) and to look at the ejs file in views
app.set('view engine', 'ejs');

//starter url data
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//getting a random 6 character string for shortURL
function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( let i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random()*characters.length));
 }
 return result;
}

//example of an endpoint
app.get('/', (request, response) => {
  response.send('Hello!');
});

//GET 
//urls is a key for the obj template vars 
app.get('/urls', (request, response) => {
  const templateVars = { 
    urls : urlDatabase,
    user: users[request.cookies["user_id"]] //complete user object with all the keys and values
  }; 
  response.render('urls_index', templateVars);
});
//
//1. request.body - this is coming from the Form Tag
//2. request.params  - this comes from the route /test/:id - request.params.id
//3. request.cookies - this is stored in the browser and we capture it with request and write it with response.

//POST the new shortURL
app.post("/urls", (request, response) => {
  const shortURL = generateRandomString();
  //request.body is an obj so we want to get the longURL key
  const longURL = request.body.longURL;
  console.log('before: ', urlDatabase);
  //adding a new key called shortURL and making it equal to the value longURL
  urlDatabase[shortURL] = longURL;
  console.log('after: ', urlDatabase);
  // console.log(urlDatabase[shortStr]);
  // console.log(request.body);  // Log the POST request body to the console
  response.redirect(`/urls/${shortURL}`); //sending another get request 
});

app.get('/urls/new', (request, response) => {
  const templateVars = { 
    user: users[request.cookies["user_id"]]
  }; 
  console.log('url new');
  response.render('urls_new', templateVars);
});

//this comes after urls new or else it will go to this page first
//the : means getting the value of shortURL
app.get("/urls/:shortURL", (request, response) => {
  // console.log('request.params: ', request.params);
  const shortURL = request.params.shortURL;
  console.log('shortURL: ',shortURL);
  //the key longURL will get the value of longURL by urlDatabase[shortURL]
  const templateVars = { shortURL: shortURL, 
    longURL: `${urlDatabase[shortURL]}`,
    // username: request.cookies["username"]
    user: users[request.cookies["user_id"]]
  };
  response.render("urls_show", templateVars);
});

//this endpoint will get you straight to the website
app.get("/u/:shortURL", (request, response) => {
  const longURL = urlDatabase[request.params.shortURL]; //request.params
  if (longURL) {
    response.status(307).redirect(longURL);
  } else {
    response.status(404).send("404 page not found");
  }
});

//POST for deleting a URL
app.post("/urls/:shortURL/delete", (request, response) => {
  console.log('urlDatabase before: ', urlDatabase);
  const shortURL = request.params.shortURL;
  console.log('shortURL: ',shortURL);
  delete urlDatabase[shortURL];
  console.log('urlDatabase after: ', urlDatabase);
  response.redirect(`/urls`); //sending another get request 
});

//POST for updating a URL
app.post("/urls/:id", (request, response) => {
  const shortURL = request.params.id;
  urlDatabase[shortURL] = request.body.longURL;
  // console.log(request);
  response.redirect(`/urls`); //sending another get request 
});

//POST for login
app.post("/login", (request, response) => {
  console.log('request.body): ', request.body.username)
  const username = request.body.username;
  response.cookie('username', username);
  response.redirect(`/urls`);
});

//POST for logout
app.post("/logout", (request, response) => {
  response.clearCookie("user_id");
  response.redirect(`/urls`);
});

//GET for register
app.get("/register", (request, response) => {
  response.render("urls_register");
});

//starter user data
const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//POST for register
app.post("/register", (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const id = generateRandomString();
  console.log('email: ', email);
  console.log('password: ',password);
  console.log('id: ', id);
  if (email === '' || password === '') {
    return response.status(404).send("404 page not found");
  } 

  for (const userID in users) {
    console.log('userId: ', userID);
    if (users[userID].email === email) {
      return response.status(404).send("404 page not found");
    }
  }

  console.log('users: ', users);

  users[id] = {
    id,
    email,
    password
  };
  console.log('users: ', users[id].email);
  response.cookie('user_id', users[id].id);
  response.redirect(`/urls`);
});



//this shows what is being added to the urlDatabase as an object
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

