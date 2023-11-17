'use strict';
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A title is required"
                },
                notEmpty: {
                    msg: 'Please provide a value for "title"'
                }
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A description is required"
                },
                notEmpty: {
                    msg: 'Please provide a value for "description"'
                }
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "An estimated Time is required"
                },
                notEmpty: {
                    msg: 'Please provide a value for "estimatedTime"'
                }
            }
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Materials needed are required"
                },
                notEmpty: {
                    msg: 'Please provide a value for "materialsNeeded" '
                }
            }
        }
    }, { sequelize });

    //one-to-one association
    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userId',
                allowNull: false
            }
        })
    };
    return Course;
};