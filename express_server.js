const bodyParser = require("body-parser");
const { response, request } = require('express');
const express = require('express');
const app = express();
const PORT = 8080;
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

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

app.get('/', (request, response) => {
  response.send('Hello!');
});

app.get('/urls', (request, response) => {
  const templateVars = { urls : urlDatabase };
  response.render('urls_index', templateVars);
});

app.post("/urls", (request, response) => {
  const shortStr = generateRandomString();
  urlDatabase[shortStr] = request.body['longURL'];
  // console.log(request.body);  // Log the POST request body to the console
  response.redirect(`/urls/${shortStr}`);         // Respond with 'Ok' (we will replace this)
});

app.get('/urls/new', (request, response) => {
  console.log('url new');
  response.render('urls_new');
});

app.get("/urls/:shortURL", (request, response) => {
  const shortURL = request.params.shortURL;
  const templateVars = { shortURL: shortURL, longURL: `${urlDatabase[shortURL]}`};
  response.render("urls_show", templateVars);
});

app.get('/hello', (request, response) => {
  const templateVars = { greeting: 'Hello World!' };
  response.render('hello_world', templateVars);
});


app.get("/u/:shortURL", (request, response) => {
  const longURL = urlDatabase[request.params.shortURL];
  if (longURL) {
    response.redirect(longURL);
  } else {
    response.status(404).send("404 page not found");
  }
});


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

