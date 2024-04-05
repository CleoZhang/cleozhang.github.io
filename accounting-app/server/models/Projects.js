module.exports = (sequelize, DataTypes) => {

    const Projects = sequelize.define("Projects", {
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
        },
        shortname: {
            type:  DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });

    return Projects
}