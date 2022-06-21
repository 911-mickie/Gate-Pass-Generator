const mongoose = require('mongoose');
const employee = require('./employee');
const Schema = mongoose.Schema;


const VisitorSchema = new Schema({

    name: String,
    areaToVisit: String,
    purpose: String,
    phoneNumber: Number,
    aadharNumber: Number,

    visitorAddress: String,
    visitorCity: String,
    visitorState: String,

    visitingDept: {
        type: String,
        enum: ['HR', 'IT', 'FINANCE']
    },

    author: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
    },

    approved: {
        type: Boolean,
        default: false,
    },

    rejected: {
        type: Boolean,
        default: false,
    },


}, { strict: false });

module.exports = mongoose.model('Gatepass', VisitorSchema);
