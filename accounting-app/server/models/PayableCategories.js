module.exports = (sequelize, DataTypes) => {

    // Payable categories table.
    const PayableCategories = sequelize.define("PayableCategories", {
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

    PayableCategories.associate = (models) => {
        PayableCategories.hasMany(models.GeneralLedgerEntries, {
            onDelete: "cascade",
            foreignKey: {
                allowNull: false,
            }
        })
        models.GeneralLedgerEntries.belongsTo(PayableCategories);
    }
    return PayableCategories;
}