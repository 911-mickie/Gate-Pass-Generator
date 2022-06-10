const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const EmployeeSchema = new Schema({

    username: String,
    empID: Number,
    empDept: {
        type: String,
        enum: ['HR', 'IT', 'FINANCE']
    },
    empGrade: String,

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    }

}, { strict: false });

EmployeeSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Employee', EmployeeSchema);