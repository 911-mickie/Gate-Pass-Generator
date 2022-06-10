const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');



const Gatepass = require('../models/gatepass')
const User = require('../models/employee')


const { isLoggedIn, validateGatepass } = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
    const gatepass = await Gatepass.find({});
    res.render('gatepass/index', { gatepass });
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('gatepass/new');
})


router.post('/', isLoggedIn, validateGatepass, catchAsync(async (req, res, next) => {
    const gatepass = new Gatepass(req.body.gatepass);
    //assign the admin here
    gatepass.author = req.user._id;
    await gatepass.save();
    req.flash('success', 'Successfully created a new Gatepass!')
    res.redirect(`/gatepass/${gatepass._id}`)
}))

router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const gatepass = await (Gatepass.findById(req.params.id)).populate('author');

    // console.log(gatepass);
    if (!gatepass) {
        req.flash('error', 'Cannot find that gatepass')
        return res.redirect('/gatepass');
    }
    res.render('gatepass/show', { gatepass });
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {

    const gatepass = await Gatepass.findById(req.params.id);
    if (!gatepass) {
        req.flash('error', 'Cannot find that gatepass')
        return res.redirect('/gatepass');
    }

    res.render('gatepass/edit', { gatepass });
}))


router.put('/:id', validateGatepass, isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const gatepass = await Gatepass.findByIdAndUpdate(id, { ...req.body.gatepass });
    req.flash('success', 'Successfully updated the Gatepass!')
    res.redirect(`/gatepass/${gatepass._id}`)
}));



router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {

    const { id } = req.params;
    await Gatepass.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the Gatepass!')
    res.redirect('/gatepass');
}))



module.exports = router;