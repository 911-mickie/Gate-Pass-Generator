const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const Gatepass = require('../models/gatepass')
const Employee = require('../models/employee')


router.get('/', catchAsync(async (req, res) => {
    const gatepass = await (Gatepass.find({ approved: true }));
    // gatepass.author = req.user._id;
    res.render('gatepass/approvedIndex', { gatepass });
}))


router.get('/:id', catchAsync(async (req, res) => {

    const { id } = req.params;
    const gatepass = await (Gatepass.findById(req.params.id)).populate('author');

    if (!gatepass) {
        req.flash('error', 'Cannot find that gatepass')
        return res.redirect('/gatepass');
    }
    console.log(gatepass);
    res.render('gatepass/approved', { gatepass, id });
}))


router.patch('/:id', catchAsync(async (req, res) => {

    const { id } = req.params;

    Gatepass.findById(id, function (err, gatepass) {
        gatepass.approve = !gatepass.approve;
        gatepass.save(function (err, gatepass) {
            if (err) {
                console.log(err);
            } else {
                res.render('gatepass/approved', { gatepass })
            }
        })
    });
}));

// router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
//     const gatepass = await (Gatepass.findById(req.params.id)).populate('author');

//     // console.log(gatepass);
//     if (!gatepass) {
//         req.flash('error', 'Cannot find that gatepass')
//         return res.redirect('/gatepass');
//     }
//     res.render('gatepass/show', { gatepass });
// }))



// router.put('/:id', async (req, res) => {
//     res.send("IT WORKED!")
// })



module.exports = router;


// router.put('/:id', validateGatepass, isAdmin, isLoggedIn, catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const gatepass = await Gatepass.findByIdAndUpdate(id, { ...req.body.gatepass });
//     req.flash('success', 'Successfully updated the Gatepass!')
//     res.redirect(`/gatepass/${gatepass._id}`)
// }));

// Book.findOne({ _id: req.params.id }, function(err, book) {
//     book.sold = !book.sold;
//     book.save(function(err, updatedBook) {
//
//     });


// app.put("/todo/update/:id", function (req, res) {
//   Todo.findById(req.params.id, function (err, todo) {
//     todo.done = !todo.done;
//     todo.save(function (err, updatedTodo) {
//       if (err) {
//         console.log(err);
//       } else {
//         res.redirect("/")
//       }
//     })
//   })
// });