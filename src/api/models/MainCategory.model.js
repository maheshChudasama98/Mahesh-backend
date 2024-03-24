require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
    const ModelTable = sequelize.define('MainCategory', {
        categoryId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        categoryColor: {
            type: DataTypes.STRING,
        },
        categoryIcon: {
            type: DataTypes.STRING,
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
        modelName: 'MainCategory',
        initialAutoIncrement: 1,
        timestamps: false,
    });
    return ModelTable
}