module.exports = (sequelize, DataTypes) => {

    return BusinessUnits = sequelize.define("BusinessUnits", {
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