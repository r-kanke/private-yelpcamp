if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const path = require("path");

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const campgroundRoutes = require("./routes/campgrounds.js");
const reveiwRoutes = require("./routes/reviews.js");
const userRoutes = require("./routes/users.js");
const ExpressError = require("./utils/ExpressError.js");
const User = require("./models/user.js");

const app = express();


// Setup MongoDB
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("MongoDB connection Established!!!");
    })
    .catch((err) => {
        console.log("Connection error: MongoDB!!!");
        console.log(err);
    });


// Setup ejs
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Register middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize({
    replaceWith: "_",
}));

// for security
app.use(helmet());

const scriptSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const styleSrcUrls = [
    'https://api.mapbox.com',
    'https://cdn.jsdelivr.net'
];
const connectSrcUrls = [
    'https://api.mapbox.com',
    'https://*.tiles.mapbox.com',
    'https://events.mapbox.com'
];
const fontSrcUrls = [];
const imgSrcUrls = [
    `https://res.cloudinary.com/${process.env.CLOUDINALY_CLOUD_NAME}/`,
    'https://images.unsplash.com'
];

app.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["blob:"],
        objectSrc: [],
        imgSrc: ["'self'", 'blob:', 'data:', ...imgSrcUrls],
        fontSrc: ["'self'", ...fontSrcUrls]
    }
}));

// for authentication
const secret = process.env.SECRET || "mysecret";
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret,
    },
    touchAfter: 24 * 3600, // 24 hours [sec]
});

store.on("error", e => {
    console.log("Session store error:", e);
});

const sessionConfig = {
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1week
    },
    store,
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// for flash msg
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


// Rooting
app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reveiwRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError("ページが見つかりませんでした！！！", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "問題が発生しました！！！"
    }
    res.status(statusCode).render("error.ejs", { err });
});


// Open the port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Opening port ${port}...`);
});
