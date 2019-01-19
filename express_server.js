
const express = require("express");
// const cookieParser =require("cookie-parser");
const cookieSession = require('cookie-session');
const app = express();
app.use(cookieSession({
  name: 'session',
  keys: ["key1", "key2"],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
const bcrypt = require('bcrypt');
const PORT = 8080; // default port 8080
app.set('view engine', 'ejs');
// app.use(cookieParser());
// let templateVars = {
// };

const urlDatabase = {
  "b2xVn2": {url: "http://www.lighthouselabs.ca", userID: "dan" },
  "9sm5xK": {url: "http://www.google.com", userID: "368466822" },
  "zZOJFS": {url:  "http://www.amazon.ca", userID: "368466822" },
   "aaaaaa": {url: "http://gmail.com", userID: "tim" }
};

const users = { 
  
  
  "368466822": { 
    id: "368466822",
    email: 'nomore2pick@gmail.com',
    password: '$2b$10$NgKYiA7h5iC/VKotyDpXK.voW/4pg9A2YT.fJNlys80txvZ083mDm' }
  
};

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
  let templateVars = { user: users[req.session.user_id] };
  req.session = null; 
  res.render("urls_login", templateVars);

});



app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id, longURL: urlDatabase[req.params.id], user: users[req.session.user_id]};
  if (req.session.user_id) {  
  res.render("urls_show", templateVars);
  } else { res.render("urls_login", templateVars); }
});

app.get("/login", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  console.log()
  res.render("urls_login");
});

app.post("/login", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  let user;
  for(var value in users) {
    if (users[value].email === req.body.email) {
      if (bcrypt.compareSync(req.body.password, users[value].password)) {
        user = users[value];
      }
  console.log(users[value].password)
}    
  }
    if (user) {
      console.log('help');
      req.session.user_id = user.id;
      res.redirect("/urls");
      return;
    } else { res.render("urls_login", templateVars);
    return;
    }
  console.log(user.id)
});

app.get("/register", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  console.log(users)
  res.render('urls_register', templateVars);
});

app.post("/register", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
  for(var value in users) {
      if (users[value].email !== req.body.email && req.body.email && req.body.password) {
        let id = generateRandomString(9, possibleNum);
        // console.log(id);
        
        users[id] = { id: id, email: req.body.email, password: hashedPassword };
        req.session.user_id = users[id].id;
        res.redirect(301, "/urls");
        console.log("id", getUrlsForUserById("tim"))
        console.log(typeof "tim")
        console.log("get for user", req.session.user_id)
        console.log(typeof req.session.user_id)
      
        console.log("get url", getUrlsForUserById("968751411"));
        return;
      } else { res.status(400);
         res.render("urls_register", templateVars);
      return;
        }
    }
});

app.get('/urls', (req, res) => {
  let templateVars = { userUrls: getUrlsForUserById(req.session.user_id), user: users[req.session.user_id] };
  if (req.session.user_id) {
  res.render('urls_index', templateVars);
  } else { res.send("You are not logged in, please login"); }
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  if (!req.session.user_id) {  
    res.render("urls_new", templateVars);
  } else { res.render("urls_login", templateVars); }
});

app.post("/urls", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  if (req.session.user_id) {
    let randomKey = generateRandomString(6, possibleAll);
    urlDatabase[randomKey] = { url: "http://" + req.body.longURL, userID: req.session.user_id };
    res.redirect(`/urls/${randomKey}`);

  } else { 
    res.render("urls_login", templateVars); 
  }

});

app.post('/urls/:id/delete', (req, res) => {
  let templateVars = { user: users[req.session.user_id] }; 
  if (req.session.user_id === urlDatabase[req.params.id].userID) {
  delete urlDatabase[req.params.id];
  res.redirect(301, "/urls");
  } else { res.redirect(301, "/urls"); }
});

app.post("/urls/:id/update", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  if (req.session.user_id) {
  urlDatabase[req.params.id] = "http://" + req.body.longURL;
  res.redirect(301, "/urls");
  } else { res.redirect(301, "/register"); }
});

app.get("/u/:shortURL", (req, res) => {
  // let templateVars = { user: users[req.session.user_id] };
  console.log(req.params.shortURL);
  res.redirect(301, urlDatabase[req.params.shortURL].url);
});

app.get("/", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  if (req.session.user_id) {
    res.redirect(301, "/urls");
    } else { res.redirect(301, "/login"); }
  res.redirect(302, "/urls");
});

app.get("/urls.json", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  let templateVars = { user: users[req.session.user_id] };
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

function getUrlsForUserById (user) {
  let usersShorUrls = {};
  for (let shortUrl in urlDatabase) {
    if (urlDatabase[shortUrl].userID === user) {
    usersShorUrls[shortUrl] = urlDatabase[shortUrl];
    }
  }
  return usersShorUrls;
}

// make this geturls to work with /urls