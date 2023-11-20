'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const { User } = require('../models');

//Middleware to authenticate the request using Basic Authentication

exports.authenticateUser = async (req, res, next) => {
    let message;

    const credentials = auth(req);

    console.log(credentials);
    //if user is available
    if(credentials) {
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name //printed out the credentials to know the variable name
            }
        });

        //if user successfully retrieved
        if(user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            //if passwords match
            if(authenticated) {
                console.log(`Authentication successful for emailAddress: ${user.emailAddress}`);
                req.currentUser = user;
            } else {
                message = `Authentication failure for emailAddress: ${user.emailAddress}`;
            }
        } else {
            message = `user not found for emailAddress: ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied'});
    } else {
        next();
    }
}
