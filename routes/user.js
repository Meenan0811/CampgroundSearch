const express = require('express')
const router = express.Router();
const User = require('../models/user');
const { remove } = require('../models/user');
const catchAsync = require('../helpers/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');
const user = require('../controllers/user');



router.get('/register', user.getUser);

router.post('/register', catchAsync(user.addUser))

router.get('/login', user.login)

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), user.loginVal)

router.get('/logout', user.logOut)

module.exports = router;





// --------Note about upcoming code change due to update---------------
// router.get('/logout', (req, res, next) => {
//     req.logout(function (err) {
//         if (err) {
//             return next(err);
//         }
//         req.flash('success', 'Goodbye!');
//         res.redirect('/campgrounds');
//     });
// }); 






// const { storeReturnTo } = require('../middleware');
// Then, in the same file, add the storeReturnTo middleware function before the passport.authenticate middleware in the /login POST route.

// router.post('/login',
//     // use the storeReturnTo middleware to save the returnTo value from session to res.locals
//     storeReturnTo,
//     // passport.authenticate logs the user in and clears req.session
//     passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
//     // Now we can use res.locals.returnTo to redirect the user after login
//     (req, res) => {
//         req.flash('success', 'Welcome back!');
//         const redirectUrl = res.locals.returnTo || '/campgrounds'; // update this line to use res.locals.returnTo now
//         res.redirect(redirectUrl);
//     });