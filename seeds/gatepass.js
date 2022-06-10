const express = require('express')
const app = express()
const mongoose = require('mongoose');

const Gatepass = require('../models/gatepass');
// const Employee = require('../models/employee');
const User = require('../models/employee');


mongoose.connect('mongodb://localhost:27017/ioclprojectnew', {
    useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Gatepass.deleteMany({});

    const pass = new Gatepass({
        author: '62a1d71d2310c6cb94c4232e',
        name: 'Sagnik',
        areaToVisit: 'Admin Building',
        purpose: 'To work on the project',
        phoneNumber: '1203994',
        aadharNumber: '2155436',

        visitorAddress: 'Somewhere on Earth',
        visitorCity: 'Somewhere in India',
        visitorState: 'Knowhere',

        visitingDept: 'FINANCE',

    })
    await pass.save();

};

seedDB().then(() => {
    mongoose.connection.close();
});