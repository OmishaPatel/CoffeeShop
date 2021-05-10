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
const passport = require('passport')
const Emitter = require('events')

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
// Event emitters
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)
//Session Config
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    store: mongoStore,
    saveUninitialized:false,
    cookie: { maxAge: 1000 * 60* 60* 24}// 24 hours

}))
//Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())
//Express-Flash middleware
app.use(flash())
//Load Assests
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
//Global middleware
app.use((req, res, next)=> {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})
//set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

// Routes
require('./routes/web')(app)

const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})

// Socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // Join the client by order id
    console.log(socket.id)
    socket.on('join', (roomName) => {
        console.log(roomName)
        socket.join(roomName)
    })
})

eventEmitter.on('orderUpdated',(data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})
eventEmitter.on('orderPlaced',(data) => {
    io.to(`adminRoom`).emit('orderPlaced', data)
})