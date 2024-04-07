module.exports = (sequelize, DataTypes) => {

    return GeneralAccounts = sequelize.define("GeneralAccounts", {
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