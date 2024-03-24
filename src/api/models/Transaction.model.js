module.exports = (sequelize, DataTypes) => {
    const modelTable = sequelize.define('Transaction', {
        transactionId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        transactionType: {
            type: DataTypes.ENUM,
            values: ['Income', 'Expense', 'Transfer'],
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        lastAmount: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        accountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        subCategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdByUserId: {
            type: DataTypes.INTEGER,
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
        modelName: 'Transaction',
        initialAutoIncrement: 1,
        timestamps: false,
    });
    return modelTable
}