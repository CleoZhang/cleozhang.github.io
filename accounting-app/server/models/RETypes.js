module.exports = (sequelize, DataTypes) => {

    // Revenue and expense types table.
    return RETypes = sequelize.define("RETypes", {
        id: {
            type:  DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type:  DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
}