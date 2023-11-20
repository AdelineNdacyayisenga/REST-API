'use strict';

//imports
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('./models');
const { Course } = require('./models');
const { asyncHandler } = require('./middleware/async-handler');
const { authenticateUser } = require('./middleware/auth-user');

//USER ROUTES

//Route that returns all properties and values of currently authenticated user
//200 code. To access user details, you have to be authenticated
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = req.currentUser;

    //const users = await User.findAll();
    res.json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
        
    });
}));

//get users list (PERSONAL FOR TESTING)
router.get('/usersList', asyncHandler(async (req, res) => {
    const users = await User.findAll();
    res.json({
        users
    })
}));

//Route that will create a new user
router.post('/users', asyncHandler(async (req, res) => {
    try {
        await User.create(req.body);
        res.status(201).location('/').end();
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
    const courses = await Course.findAll(
        { //returns user related to the course
            include: [
                {
                    model: User,
                    as: 'courseMaker',
                    attributes: ['id', 'firstName', 'lastName', 'emailAddress']
                }
            ],
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        }
    );
    if(courses) {
        res.json(courses);
    } else {
        res.status(404).json({message: "Courses not found"})
    }
}));

// Get route that returns the corresponding course with user associated with that course
//200 status code
router.get('/courses/:id', asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        include: [
            {
                model: User,
                as: 'courseMaker',
                attributes: ['id', 'firstName', 'lastName', 'emailAddress']
            }
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    const course = courses.find(course => course.id == req.params.id);
    if (course) {
        res.json(course);
    } else {
        res.status(404).json({message: "Course not found"});
    } 
}));

//create a new course; set location header to the URI for the newly created course
//201 status code (no content returned). Authentication is required to create a course
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    try {
        
        const course = await Course.create(req.body);

        res.status(201).location(`/courses/${course.id}`).end();
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

//update the corresponding course. Authentication is required to update a course and you have to be the course's maker to update it
//204 status code (no content)
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        //to update the course, you have to be the owner
        if(course.userId == req.currentUser.id) {
            try {
                await course.update(req.body);
                res.status(204).end();
            } catch (error) {
                if(error.name === 'SequelizeValidationError') {
                    const errors = error.errors.map(err => err.message);
                    res.status(400).json({ errors });
                } else {
                    throw error;
                }
            }
        } else {
            res.status(403).json({ message: "To update the course, you have to be the owner" });
        }
         
    } else {
        res.status(404).json({ message: "Course Not Found" });
    }
}));

//delete corresponding course. Authentication is required to delete a course and you have to be the course's maker to delete it
//204 returned (no content)
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);

    if (course) {
        if(course.userId == req.currentUser.id) {
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(403).json({ message: "To delete the course, you have to be the owner"});
        }
        
    } else {
        res.status(404).json({message: "Course not found"});
    }
}));

module.exports = router;