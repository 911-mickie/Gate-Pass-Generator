if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require('helmet');

const passport = require('passport');
const LocalStratergy = require('passport-local');
const User = require('./models/employee');
// const Employee = require('./models/employee');
require('./config/passport')(passport);

const MongoDBStore = require('connect-mongo');


const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressErrors');
const Joi = require('joi');

const approvedRoutes = require('./routes/approved')
const rejectedRoutes = require('./routes/rejected')

const gatepassRoutes = require('./routes/gatepass');
const employeeRoutes = require('./routes/employee');


const DBUrl = process.env.DB_Url || 'mongodb://localhost:27017/ioclprojectnew';
// mongodb://localhost:27017/ioclprojectnew
mongoose.connect(DBUrl, {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({ replaceWith: "_" }));

const secret = process.env.SECRET || "thisshouldbeabettersecret";

// app.use(session({

//     store: MongoDBStore.create({
//         mongoUrl: process.env.DB_Url,
//         secret,
//         ttl: 24 * 60 * 60,
//         crypto: {
//             secret: `${process.env.SECRET}` || "thisshouldbeabettersecret",
//         },
//     })
// }));

const store = new MongoDBStore({
    url: DBUrl,
    secret,
    ttl: 24 * 60 * 60,

})

// const store = MongoDBStore.create({
//     mongoUrl: process.env.DB_Url,
//     secret,
//     touchAfter: 24 * 60 * 60,
//     crypto: {
//         secret: `${process.env.SECRET}` || "thisshouldbeabettersecret",
//     },
// });



const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// passport.use(new LocalStratergy(User.authenticate()));
app.use(helmet({ crossOriginEmbedderPolicy: false }));

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            // defaultSrc: [],
            // connectSrc: ["'self'", ...connectSrcUrls],
            // scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            // styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            // workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/mickie/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/",
            ],
            // fontSrc: ["'self'", ...fontSrcUrls],
            mediaSrc: ["https://res.cloudinary.com/mickie/"],
            childSrc: ["blob:"],
        },
    })
);


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //console.log(req.session);

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/gatepass', gatepassRoutes);
app.use('/', employeeRoutes);
app.use('/approved', approvedRoutes);
app.use('/rejected', rejectedRoutes);


app.get('/', (req, res) => {
    res.render('home')
})


app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh No, something is not right'

    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
