'use strict';

//imports
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('./models');

//ROUTES

//Route that returns all properties and values of currently authenticated user with 200 code
router.get('/users', (req, res) => {
    //res.json();
});

//Route that will create a new user
router.post('/users', (req, res) => {
    //res.status(201).json();
});