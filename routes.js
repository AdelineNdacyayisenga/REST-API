'use strict';

//imports
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('./models');
const { Course } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');

//USER ROUTES

//Route that returns all properties and values of currently authenticated user
//200 code
router.get('/users', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json(users);
}));

//Route that will create a new user
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).location('/').json({
            message: "User account successfully created"
        });
    } catch(error) {
        console.log('ERROR', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors }); //display array of errors
        } else {
            throw error; //pass to the global error handler
        }
    } 
}));

//COURSE ROUTES

//Get route that returns all courses with User associated with each course
//200 status code
router.get('/courses', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({ //returns user related to the course
        include: [
            {
                model: User,
            }
        ]
    });
    if(courses) {
        res.json(courses);
    } else {
        res.status(404).json({message: "Courses not found"})
    }
}));

// Get route that returns the corresponding course with user associated with that course
//200 status code
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    const course = courses.find(course => course.id == req.params.id);
    if (course) {
        res.json(course);
    } else {
        res.status(404).json({message: "Course not found"});
    } 
}));

//create a new course; set location header to the URI for the newly created course
//201 status code (no content returned)
router.post('/courses', asyncHandler(async (req, res) => {
    try {
        await Course.create(req.body);
        res.status(201).location('/courses').json({
            message: "Course successfully created"
        });
    } catch(error) {
        console.log('ERROR', error.name);

        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors }); //display array of errors
        } else {
            throw error; //pass to the global error handler
        }
    }
}));

//update the corresponding course
//204 status code (no content)
router.put('/courses/:id', asyncHandler(async (req, res) => {

}));

//delete corresponding course
//204 returned (no content)
router.delete('/courses/:id', asyncHandler(async (req, res) => {

}));


module.exports = router;