'use strict';
module.exports = (sequelize, DataTypes) => {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        password: DataTypes.STRING
    });

    User.associate = function(models) {
        models.User.hasMany(models.Blog);
    };

    return User;
};