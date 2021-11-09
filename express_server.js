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

function generateRandomString() {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( let i = 0; i < 6; i++ ) {
    result += characters.charAt(Math.floor(Math.random()*characters.length));
 }
//  console.log(result);
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
  response.redirect(longURL);
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




//////

// const bodyParser = require("body-parser");
// const { response, request } = require('express');
// const express = require('express');
// const app = express();
// const PORT = 8080;
// app.use(bodyParser.urlencoded({extended: true}));

// app.set('view engine', 'ejs');

// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

// function generateRandomString() {
//   let result = '';
//   let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//   for ( let i = 0; i < 6; i++ ) {
//     result += characters.charAt(Math.floor(Math.random()*characters.length));
//  }
// //  console.log(result);
//  return result;
// }

// app.get('/', (request, response) => {
//   response.send('Hello!');
// });

// app.get('/urls', (request, response) => {
//   const templateVars = { urls : urlDatabase };
//   response.render('urls_index', templateVars);
// });

// app.post("/urls", (request, response) => {
//   const shortStr = generateRandomString();
//   urlDatabase[shortStr] = request.body['longURL'];
//   // console.log(request.body);  // Log the POST request body to the console
//   response.send("Ok");         // Respond with 'Ok' (we will replace this)
// });


// app.get("/urls/:shortURL", (request, response) => {
//   const shortURL = 'b2xVn2';
//   const templateVars = { shortURL: shortURL, longURL: `${urlDatabase.b2xVn2}`};
//   response.render("urls_show", templateVars);
// });

// app.get('/hello', (request, response) => {
//   const templateVars = { greeting: 'Hello World!' };
//   response.render('hello_world', templateVars);
// });

// app.get('/urls/new', (request, response) => {
//   response.render('urls_new');
// });


// /////
// app.get("/u/:shortURL", (request, response) => {
//   const longURL = urlDatabase[request.params.shortURL];
//   response.redirect(longURL);
// });


// app.get('/urls.json', (request, response) => {
//   response.json(urlDatabase)
// });

// app.get('/hello', (request, response) => {
//   response.send('<html><body>Hello <b>World</b></body></html>\n');
// })

// app.get('/set', (request, response) => {
//   const a = 1;
//   response.send(`a = ${a}`);
// });

// // app.get('/fetch', (request, response) => {
// //   response.send(`a = ${a}`);
// // });

// app.listen(PORT, () => {
//   console.log(`Example app listenting on port ${PORT}`);
// });