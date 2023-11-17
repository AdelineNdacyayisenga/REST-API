'use strict';

//imports
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');

//ROUTES

//Route that returns all properties and values of currently authenticated user with 200 code
router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}));

//Route that will create a new user
router.post('/users', asyncHandler(async (req, res) => {
    res.status(201).location('/').json({
        message: "User account successfully created"
    }).end();
}));

module.exports = router;