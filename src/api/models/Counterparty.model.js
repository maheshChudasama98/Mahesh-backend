require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
    const ModelTable = sequelize.define('Counterparty', {
        partyId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        FullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        partyType: {
            type: DataTypes.ENUM,
            values: ['Creditor', 'Debtor', 'Both', 'Other'],
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        address: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
        imagePath: {
            type: DataTypes.STRING(2000),
        },
        createdByUserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: sequelize.NOW,
        },
    }, {
        modelName: 'Counterparty',
        initialAutoIncrement: 1,
        timestamps: false,
    });
    return ModelTable
}