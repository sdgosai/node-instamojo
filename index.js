const bodyParser = require('body-parser');
const path = require('path');
const expressSession = require('express-session')
const flash = require('connect-flash')
const app = require('express')();
require('dotenv').config()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(expressSession({
    secret: 'secret-1',
    resave: true,
    maxAge: 3600000,
    saveUninitialized: true
})
);

// Add flash ...
app.use(flash())
app.use((req, res, next) => {
    res.locals.error = req.flash('error')
    res.locals.link = req.flash('link')
    next();
})

const viewPath = path.join(__dirname + '/src/views');
app.set('view engine', 'ejs')
app.set('views', viewPath)

// Router require ...
const paymentRoutes = require('./src/routes/index.routes')
app.use('/', paymentRoutes)

app.listen(process.env.PORT, () => {
    console.log(`node application live at ${process.env.PORT} ✅`);
})