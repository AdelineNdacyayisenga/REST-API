'use strict';

const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        firstName: {
            type: Sequelize.STRING,
        },
        lastName:{
            type: Sequelize.STRING,
        },
        emailAddress:{
            type: Sequelize.STRING,
        },
        password:{
            type: Sequelize.STRING,
        }
    }, { sequelize });
    
    //association

    User.associate = (models) => {
        User.hasMany(models.Course, {
            foreignKey: {
                fieldname: 'userId',
                allowNull: false
            }
        }); //user can be associated with many courses
    };
    return User;
};