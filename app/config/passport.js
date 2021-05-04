const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')
function init(passport){
    passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done)=> {
        // Login
        //Check if email exists
        const user = await User.findOne({email: email})
        if(!user){
            return done(null, false, {message: 'No username/email found'})
        }
        bcrypt.compare(password, user.password).then(match => {
            if(match){
                return done(null, user, {message: 'Log in successful'})
            }
            return done(null, false, {message: 'Wrong username or password'})
        }).catch(err =>{
            return done(null, false, {message: 'Something went wrong'})
        })
    }))
    // storing user into session
    passport.serializeUser((user, done)=> {
        done(null, user._id)
    })
    // fetching single user from database by id
    passport.deserializeUser((id, done)=> {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}
module.exports = init