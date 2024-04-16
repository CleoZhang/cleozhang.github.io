module.exports = (sequelize, DataTypes) => {

    return GeneralLedgerEntries = sequelize.define("GeneralLedgerEntries", {
        id: {
            type:  DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        date: {
            type:  DataTypes.DATEONLY,
            allowNull: false
        },
        voucher: {
            type:  DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        payableAmount: {
            type:  DataTypes.DECIMAL,
            allowNull: true
        },
        payableTaxAmount: {
            type:  DataTypes.DECIMAL,
            allowNull: true
        },
        invoiceAmount: {
            type:  DataTypes.DECIMAL,
            allowNull: true
        },
        invoiceTaxRate: {
            type:  DataTypes.DECIMAL,
            allowNull: true
        },
        invoiceTaxAmount: {
            type:  DataTypes.DECIMAL,
            allowNull: true
        },
        paymentAmount: {
            type:  DataTypes.DECIMAL,
            allowNull: true
        }
    });
}