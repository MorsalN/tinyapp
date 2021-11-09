const { response, request } = require('express');
const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};


app.get('/', (request, response) => {
  response.send('Hello!');
});

app.get('/urls', (request, response) => {
  const templateVars = { urls : urlDatabase };
  response.render('urls_index', templateVars);
});

app.get('/hello', (request, response) => {
  const templateVars = { greeting: 'Hello World!' };
  response.render('hello_world', templateVars);
});

app.get("/urls/:shortURL", (request, response) => {
  const templateVars = { shortURL: request.params.shortURL, longURL: request.params.longURL};
  response.render("urls_show", templateVars);
});

app.get('/urls.json', (request, response) => {
  response.json(urlDatabase)
});

app.get('/hello', (request, response) => {
  response.send('<html><body>Hello <b>World</b></body></html>\n');
})

app.get('/set', (request, response) => {
  const a = 1;
  response.send(`a = ${a}`);
});

// app.get('/fetch', (request, response) => {
//   response.send(`a = ${a}`);
// });

app.listen(PORT, () => {
  console.log(`Example app listenting on port ${PORT}`);
});