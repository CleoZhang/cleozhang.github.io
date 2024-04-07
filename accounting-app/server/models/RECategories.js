module.exports = (sequelize, DataTypes) => {

    // Revenue and expense categories table.
    return RECategories = sequelize.define("RECategories", {
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