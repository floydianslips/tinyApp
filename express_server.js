
const express = require("express");
const cookie =require("cookie-parser")
const app = express();
const PORT = 8080; // default port 8080
app.set('view engine', 'ejs');

//create random 6 charactor string for shortUrl key
function generateRandomString() { //borrowed from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 6; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.post("/login" , (req, res) => {
  let userName = req.body.userName;
  res.cookie("username", userName);
  console.log("username", userName);
  res.redirect(301, "/urls");
});

app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id]};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let randomKey = generateRandomString();
  urlDatabase[randomKey] = "http://" + req.body.longURL;
  res.redirect(`/urls/${randomKey}`);
  console.log(urlDatabase);
});

app.post('/urls/:id/delete', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect(301, "/urls");
});

app.post("/urls/:id/update", (req, res) => {
  // let shortURL = urlDatabase[0];
  urlDatabase[req.params.id] = "http://" + req.body.longURL;
  res.redirect(301, "/urls");
});

app.get("/u/:shortURL", (req, res) => {
  res.redirect(301, urlDatabase[req.params.shortURL]);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

