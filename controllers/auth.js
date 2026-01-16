const passport = require('passport')
const validator = require('validator')
const User = require('../models/User')

 exports.getLogin = (req, res) => {
    if (req.user) {
      return res.redirect('/migraines/index/')
    }
    res.render('login', {
      title: 'Login',
      user: req.user,
      messages: res.locals.messages,
      layout: false // Do not use layout.ejs
    })
  }
  
  exports.postLogin = (req, res, next) => {
    const validationErrors = []
    
    if (req.body.email && !validator.isEmail(req.body.email)) {
      validationErrors.push({ msg: 'Please enter a valid email address.' })
    }

    if (validationErrors.length) {
      req.flash('error', validationErrors)
      return res.redirect('/login')
    }

    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    passport.authenticate('local', (err, user, info) => {
      if (err) { return next(err) }
      if (!user) {
        req.flash('error', info)
        return res.redirect('/login')
      }
      req.logIn(user, (err) => {
        if (err) { return next(err) }
        // Update user's timezone if changed
        if (req.body.timezone && user.preferences.timezone !== req.body.timezone) {
          User.findByIdAndUpdate(user._id, { 'preferences.timezone': req.body.timezone }, (err) => {
            if (err) console.error('Error updating timezone:', err)
          })
        }
        req.flash('success', { msg: 'Success! You are logged in.' })
        res.redirect(req.session.returnTo || '/migraines')
      })
    })(req, res, next)
  }
  
  exports.logout = (req, res) => {
    req.logout(() => {
      console.log('User has logged out.')
    })
    req.session.destroy((err) => {
      if (err) console.log('Error : Failed to destroy the session during logout.', err)
      req.user = null
      res.redirect('/')
    })
  }
  
  exports.getSignup = (req, res) => {
    if (req.user) {
      return res.redirect('/migraines/index')
    }
    res.render('signup', {
      title: 'Create Account',
      user: req.user,
      messages: res.locals.messages,
      layout: false // Do not use layout.ejs
    })
  }
  
  exports.postSignup = (req, res, next) => {
    const validationErrors = []
    if (!validator.isEmail(req.body.email)) validationErrors.push({ msg: 'Please enter a valid email address.' })
    if (!validator.isLength(req.body.password, { min: 8 })) validationErrors.push({ msg: 'Password must be at least 8 characters long' })
    if (req.body.password !== req.body.confirmPassword) validationErrors.push({ msg: 'Passwords do not match' })
  
    if (validationErrors.length) {
      req.flash('error', validationErrors)
      return res.redirect('../signup')
    }
    req.body.email = validator.normalizeEmail(req.body.email, { gmail_remove_dots: false })
  
    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      // Include default preferences in the signup process
      preferences: {
        defaultPainScale: 0,
        reminderFrequency: 'none',
        timezone: req.body.timezone || 'UTC'
      },
      commonMedications: [],
      commonTriggers: [],
      currentStreak: 0,
      longestStreak: 0,
      notificationSettings: {
        email: { enabled: false, frequency: 'weekly' },
        push: { enabled: false, frequency: 'daily' }
      }
    })
  
    User.findOne({$or: [
      {email: req.body.email},
      {userName: req.body.userName}
    ]}, (err, existingUser) => {
      if (err) { return next(err) }
      if (existingUser) {
        console.log('Existing user found, setting flash message')
        req.flash('error', { msg: 'Account with that email address or username already exists.' })
        return res.redirect('../signup')
      }
      user.save((err) => {
        if (err) { return next(err) }
        req.logIn(user, (err) => {
          if (err) {
            return next(err)
          }
          res.redirect('/migraines/index')
        })
      })
    })
  }