const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Gatepass = require('../models/gatepass')
const Employee = require('../models/employee')


router.get('/', catchAsync(async (req, res) => {
    const gatepass = await (Gatepass.find({ rejected: true }));
    // gatepass.author = req.user._id;
    res.render('gatepass/rejectedIndex', { gatepass });
}))


router.get('/:id', catchAsync(async (req, res) => {

    const { id } = req.params;
    const gatepass = await (Gatepass.findById(req.params.id)).populate('author');

    if (!gatepass) {
        req.flash('error', 'Cannot find that gatepass')
        return res.redirect('/gatepass');
    }
    // console.log(gatepass);
    res.render('gatepass/rejected', { gatepass, id });
}))


router.patch('/:id', catchAsync(async (req, res) => {

    const { id } = req.params;

    Gatepass.findById(id, function (err, gatepass) {
        gatepass.rejected = !gatepass.rejected;
        gatepass.save(function (err, gatepass) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/rejected')
            }
        })
    });
}));


module.exports = router;

