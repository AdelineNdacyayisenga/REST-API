'use strict';

const Sequelize = require('sequelize');
const bcrypt = require('bcrypt')

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A firstName is required"
                },
                notEmpty: {
                    msg: 'Please provide a value for "firstName"'
                }
            }
        },
        lastName:{
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A lastName is required"
                },
                notEmpty: {
                    msg: 'Please provide a value for "lastName"'
                }
            }
        },
        emailAddress:{
            type: Sequelize.STRING,
            allowNull: false,
            unique: {
                msg: 'The email you entered already exists'
            },
            validate: {
                notNull: {
                    msg: "An Email is required"
                },
                notEmpty: {
                    msg: 'Please provide a value an "email"'
                },
                isEmail: {
                    msg: "Please provide a valid email address"
                }
            }
        },
        password:{
            type: Sequelize.STRING,
            allowNull: false,
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('password', hashedPassword);
            },
            validate: {
                notNull: {
                    msg: "A password is required"
                },
                notEmpty: {
                    msg: 'Please provide a value for "password"'
                }
            }
        }
    }, { sequelize });
    
    //association

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: 'courseMaker',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        }); //user can be associated with many courses
    };
    return User;
};