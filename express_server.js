
const express = require("express");
const cookieParser =require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080
app.set('view engine', 'ejs');
app.use(cookieParser());
let templateVars = {
};

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "tim": {
    id: "tim", 
    email: "tim@tim.com", 
    password: "tim"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//create random 6 charactor string for shortUrl key
const possibleAll = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const possibleNum = "1234567890";

function generateRandomString(num, type) { //borrowed from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  var text = "";
  
  for (var i = 0; i < num; i++)
    text += type.charAt(Math.floor(Math.random() * type.length));
  return text;
}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.post("/logout", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.clearCookie("user_id", req.cookies.user_id);
  res.render("urls_login", templateVars);
});

app.get("/register", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  console.log(req.cookies.user_id)
  res.render('urls_register', templateVars);
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.cookies.user_id]};
  res.render("urls_show", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.render("urls_login");
});

app.post("/login", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  for(var value in users) {
    if (users[value].email === req.body.email && users[value].password === req.body.password) {
      
      let id = generateRandomString(9, possibleNum);
      users[id] = { id: id, email: req.body.email, password: req.body.password };
      res.cookie("user_id", id);
      res.redirect("/urls");
      return;
    } else { res.sendStatus(403);
    return;
    }
  }
});

app.post("/register", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  for(var value in users) {
      if (users[value].email !== req.body.email && req.body.email && req.body.password) {
        let id = generateRandomString(9, possibleNum);
        users[id] = { id: id, email: req.body.email, pasnewsword: req.body.password };
        res.cookie("user_id", id);
        res.redirect("/urls");
      
        return;
      } else { res.status(400);
         res.render("urls_register", templateVars);
      return;
        }
    }
});



app.get('/urls', (req, res) => {
  let templateVars = { urls: urlDatabase, user: users[req.cookies.user_id] };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
  // let templateVars = { user: users[req.cookies.user_id] };
  // if (req.cookies.user_id) {
    // delete urlDatabase[req.params.id];
    // res.redirect(301, "/urls");
    // } else { res.render("urls_register", templateVars); }
  });



app.post("/urls", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  console.log(req.cookies)
  if (req.cookies.user_id) {
    console.log(req.body.longURL)
    let randomKey = generateRandomString(6, possibleAll);
    urlDatabase[randomKey] = { url: "http://" + req.body.longURL, userID: req.cookies.user_id }
    console.log(urlDatabase);
    res.redirect(`/urls/${randomKey}`);
  } else { 
    res.redirect(301, "/urls"); 
  }

});

app.post('/urls/:id/delete', (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] }; 
  if (req.cookies.user_id) {
  delete urlDatabase[req.params.id];
  res.redirect(301, "/urls");
  } else { res.redirect(301, "/register"); }
});

app.post("/urls/:id/update", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  if (req.cookies.user_id) {
  urlDatabase[req.params.id] = "http://" + req.body.longURL;
  res.redirect(301, "/urls");
  } else { res.redirect(301, "/register"); }
});

app.get("/u/:shortURL", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.redirect(301, urlDatabase[req.params.shortURL]);
});

app.get("/", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.redirect(302, "/urls");
});

app.get("/urls.json", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});