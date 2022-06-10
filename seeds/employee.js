const express = require('express')
const app = express()
const mongoose = require('mongoose');

const Gatepass = require('../models/gatepass');
const Employee = require('../models/employee');
const User = require('../models/user');


mongoose.connect('mongodb://localhost:27017/ioclprojectnew', {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Employee.deleteMany({});

    const pass = new Employee({
        empName: 'Mickie',
        empID: 4,
        empDept: 'HR',
        empGrade: 'A',
        approver: true,

    })
    await pass.save();

};

seedDB().then(() => {
    mongoose.connection.close();
});