module.exports = (sequelize, DataTypes) => {

    const Users = sequelize.define("Users", {
        username: {
            type:  DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        password: {
            type:  DataTypes.STRING,
            allowNull: false,
        },
        isAdmin: {
            type:  DataTypes.BOOLEAN,
            allowNull: false,
        },
    });

    return Users
}