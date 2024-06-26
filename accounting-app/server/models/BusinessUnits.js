module.exports = (sequelize, DataTypes) => {

    const BusinessUnits = sequelize.define("BusinessUnits", {
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

    BusinessUnits.associate = (models) => {
        BusinessUnits.hasMany(models.GeneralLedgerEntries, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false,
            }
        })
        models.GeneralLedgerEntries.belongsTo(BusinessUnits);
    }
    return BusinessUnits;
}