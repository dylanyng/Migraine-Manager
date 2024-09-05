const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth') 
const homeController = require('../controllers/home')
const userController = require('../controllers/user')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', (req, res, next) => homeController.getIndex(req, res, next));
router.get('/login', (req, res, next) => authController.getLogin(req, res, next));
router.post('/login', (req, res, next) => authController.postLogin(req, res, next));
router.get('/logout', (req, res, next) => authController.logout(req, res, next));
router.get('/signup', (req, res, next) => authController.getSignup(req, res, next));
router.post('/signup', (req, res, next) => authController.postSignup(req, res, next));
// Route for updating user profiles
router.put('/update-profile', ensureAuth, (req, res, next) => userController.updateProfile(req, res, next));

module.exports = router