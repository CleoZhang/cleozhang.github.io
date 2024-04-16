module.exports = (sequelize, DataTypes) => {

    // Revenue and expense categories table.
    const RECategories = sequelize.define("RECategories", {
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

    RECategories.associate = (models) => {
        RECategories.hasMany(models.RETypes, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false,
            }
        })
        models.RETypes.belongsTo(RECategories);
    }
    return RECategories;
}