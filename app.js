require('dotenv').config()
const express = require('express');
const app = express();
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3000
const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
//Database connection
const url = "mongodb+srv://admin:iTCn5lfkJVVeS2B3@cluster0.kcw0y.mongodb.net/coffee?retryWrites=true&w=majority";
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
}).catch(err => {
    console.log('Connection failed...')
});
//Session Store
let mongoStore = new MongoDbStore({
                    mongooseConnection: connection,
                    collection: 'sessions'
                })
//Session Config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store: mongoStore,
    saveUninitialized:false,
    cookie: { maxAge: 1000 * 60* 60* 24}// 24 hours

}))
//Express-Flash middleware
app.use(flash())
//Load Assests
app.use(express.static('public'))
app.use(express.json())
//Global middleware
app.use((req, res, next)=> {
    res.locals.session = req.session
    next()
})
//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// Routes
require('./routes/web')(app)

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});