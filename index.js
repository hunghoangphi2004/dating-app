require("dotenv").config();
const express = require("express")
const app = express();
const port = process.env.PORT;
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash"); 
// const adminRoutes = require("./routes/admin/index.routes");
const clientRoutes = require("./routes/client/index.routes");
const expressLayouts = require("express-ejs-layouts");

app.set("view engine", "ejs");
app.set("views", "./views")

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`${__dirname}/public`))

app.use(expressLayouts);
app.set("layout", "layouts/default");

app.use(cookieParser('SFSDFSDFAFSD'));

app.use(session({
    secret: "secret-key",   
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));

app.use(flash());

database.connectDB();

// adminRoutes(app);
clientRoutes(app);

app.get('/{*any}', (req, res) => {
  res.status(404).render("client/pages/errors/404", {
        layout: false,
        title: "404",
    })
});

app.listen(port, ()=>{
    console.log(`Run on port ${port}`);
})


