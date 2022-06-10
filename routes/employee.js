const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const bcrypt = require('bcrypt');
const passport = require('passport');
const Gatepass = require('../models/gatepass')
const Employee = require('../models/employee')


router.get('/login', (req, res) => res.render('users/login'))


router.get('/register', (req, res) => {
    res.render('users/register');
})


router.post('/register', (req, res) => {
    const { empID, username, email, password, empDept } = req.body;

    const newUser = new Employee({
        empID,
        empDept,
        username,
        email,
        password
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
                .save()
                .then(user => {
                    req.flash(
                        'success',
                        'You are now registered and can log in'
                    );
                    res.redirect('/login');
                })
                .catch(err => console.log(err));
        });
    });
});




router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/gatepass',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// // Logout
// router.get('/logout', (req, res) => {
//     req.logout();
//     req.flash('success', 'GoodBye');
//     res.redirect('/gatepass');
// });

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Goodbye!');
        res.redirect('/gatepass');
    })

})

module.exports = router;
