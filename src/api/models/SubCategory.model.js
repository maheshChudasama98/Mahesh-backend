require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
    const ModelTable = sequelize.define('SubCategory', {
        subCategoryId: {
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
        categoryIcon: {
            type: DataTypes.STRING,
        },
        categoryId: {
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
        modelName: 'SubCategory',
        initialAutoIncrement: 1,
        timestamps: false,
    });
    return ModelTable
}