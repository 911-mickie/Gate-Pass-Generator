const { gatepassSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressErrors');
const Gatepass = require('./models/gatepass')

module.exports.isLoggedIn = (req, res, next) => {
    // console.log("req.user...", req.user);
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateGatepass = (req, res, next) => {

    const { error } = gatepassSchema.validate(req.body);
    if (res.error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

