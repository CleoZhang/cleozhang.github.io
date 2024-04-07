module.exports = (sequelize, DataTypes) => {

    return Users = sequelize.define("Users", {
        id: {
            type:  DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        username: {
            type:  DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type:  DataTypes.STRING,
            allowNull: false,
        },
        isAdmin: {
            type:  DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
    });
}