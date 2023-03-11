const express = require("express");
const session = require("express-session");
const allRoutes = require("./controllers")
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const app = express();
const PORT = process.env.PORT || 3000;
const { User, Comment } = require("./models")
const exphbs = require("express-handlebars");
const hbs = exphbs.create({});
app.engine('handlebars', hbs.engine);
app.set("view engine", "handlebars");
app.use(express.static("public"));



const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 2
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })

};

app.use(session(sess));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(allRoutes);
app.get("/sessions", (req, res) => {
  res.json(req.session)
});


sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log("Listening on PORT " + PORT);
  });
});
