module.exports = (sequelize, DataTypes) => {
    const modelTable = sequelize.define('Accounts', {
        accountId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        accountName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        currentAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        accountTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
        modelName: 'Accounts',
        initialAutoIncrement: 1,
        timestamps: false,
    });
    return modelTable
}