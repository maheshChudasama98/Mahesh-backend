module.exports = (sequelize, DataTypes) => {
    const modelTable = sequelize.define('ManyCategory', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true
        },
    }, {
        modelName: 'ManyCategory',
        initialAutoIncrement: 1,
        timestamps: false,
    });
    return modelTable
}