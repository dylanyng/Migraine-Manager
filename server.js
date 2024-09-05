const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')
const flash = require('express-flash')
const errorHandler = require('./middleware/errorHandler')
const logger = require('morgan')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const migraineRoutes = require('./routes/migraines')

require('dotenv').config({path: './config/.env'})

// Passport config
require('./config/passport')(passport)

connectDB()

app.set('layout', 'layout');
app.set('view engine', 'ejs')
app.use(methodOverride('_method'))
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(logger('dev'))
app.use(express.json())

// Sessions
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
  )
  
// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())
// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.messages = req.flash()
  next()
})
  
app.use('/', mainRoutes)
app.use('/migraines', migraineRoutes)

// Error handler
app.use(errorHandler)
 
app.listen(process.env.PORT, ()=>{
    console.log('Server is running, you better catch it!')
})    