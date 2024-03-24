const { sequelize, DataTypes } = require('../../configs/Database.config')

const db = {}

// All modal include here  
db.UserTypesModel = require("./UserTypes.model")(sequelize, DataTypes)
db.UserModel = require("./Users.model")(sequelize, DataTypes)
db.EducationModel = require("./Education.model")(sequelize, DataTypes)
db.ExperienceModel = require("./Experience.model")(sequelize, DataTypes)
db.ProjectsModel = require("./Projects.model")(sequelize, DataTypes)
db.CompaniesModel = require("./Companies.model")(sequelize, DataTypes)
db.SkillsModel = require("./Skills.model")(sequelize, DataTypes)
db.CategoryModel = require("./Category.model")(sequelize, DataTypes)
db.TimeLogsModel = require("./TimeLogs.model")(sequelize, DataTypes)

// Money View Tables
db.AccountTypeModel = require("./AccountType.model")(sequelize, DataTypes)
db.AccountsModel = require("./Accounts.model")(sequelize, DataTypes)
db.MainCategoryModel = require("./MainCategory.model")(sequelize, DataTypes)
db.SubCategoryModel = require("./SubCategory.model")(sequelize, DataTypes)
db.ManyCategory = require("./ManyCategory.model")(sequelize, DataTypes)
db.TransactionModel = require("./Transaction.model")(sequelize, DataTypes)
db.CounterpartyModel = require("./Counterparty.model")(sequelize, DataTypes)

// Join Models here 
db.UserTypesModel.hasOne(db.UserModel, { foreignKey: 'userTypeId' }); // One to One 
db.UserModel.belongsTo(db.UserTypesModel, { foreignKey: 'userTypeId' });

db.UserModel.hasMany(db.EducationModel, { foreignKey: 'createdByUserId' }); // One to Many
db.EducationModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.UserModel.hasMany(db.ExperienceModel, { foreignKey: 'createdByUserId' }); // One to Many
db.ExperienceModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.UserModel.hasMany(db.ProjectsModel, { foreignKey: 'createdByUserId' }); // One to Many
db.ProjectsModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.UserModel.hasMany(db.CompaniesModel, { foreignKey: 'createdByUserId' }); // One to Many
db.CompaniesModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.UserModel.hasMany(db.SkillsModel, { foreignKey: 'createdByUserId' }); // One to Many
db.SkillsModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.CategoryModel.hasMany(db.TimeLogsModel, { foreignKey: 'categoryId' }); // One to Many
db.TimeLogsModel.belongsTo(db.CategoryModel, { foreignKey: 'categoryId' });

db.UserModel.hasMany(db.TimeLogsModel, { foreignKey: 'createdByUserId' }); // One to Many
db.TimeLogsModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.UserModel.hasMany(db.CategoryModel, { foreignKey: 'createdByUserId' }); // One to Many
db.CategoryModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

//  Money View Tables join Models
db.AccountTypeModel.hasOne(db.AccountsModel, { foreignKey: 'accountTypeId' }); // One to One 
db.AccountsModel.belongsTo(db.AccountTypeModel, { foreignKey: 'accountTypeId' });

db.UserModel.hasMany(db.AccountsModel, { foreignKey: 'createdByUserId' }); // One to Many 
db.AccountsModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.UserModel.hasMany(db.MainCategoryModel, { foreignKey: 'createdByUserId' }); // One to Many 
db.MainCategoryModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.UserModel.hasMany(db.SubCategoryModel, { foreignKey: 'createdByUserId' }); // One to Many 
db.SubCategoryModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.MainCategoryModel.belongsToMany(db.SubCategoryModel, { through: db.ManyCategory, foreignKey: 'categoryId', }); // Many to Many 
db.SubCategoryModel.belongsToMany(db.MainCategoryModel, { through: db.ManyCategory, foreignKey: 'subCategoryId', });

db.AccountsModel.hasMany(db.TransactionModel, { foreignKey: 'accountId' }); // One to Many 
db.TransactionModel.belongsTo(db.AccountsModel, { foreignKey: 'accountId' });

db.MainCategoryModel.hasMany(db.TransactionModel, { foreignKey: 'categoryId' }); // One to Many 
db.TransactionModel.belongsTo(db.MainCategoryModel, { foreignKey: 'categoryId' });

db.SubCategoryModel.hasMany(db.TransactionModel, { foreignKey: 'subCategoryId' }); // One to Many 
db.TransactionModel.belongsTo(db.SubCategoryModel, { foreignKey: 'subCategoryId' });

db.UserModel.hasMany(db.TransactionModel, { foreignKey: 'createdByUserId' }); // One to Many 
db.TransactionModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

db.UserModel.hasMany(db.CounterpartyModel, { foreignKey: 'createdByUserId' }); // One to Many 
db.CounterpartyModel.belongsTo(db.UserModel, { foreignKey: 'createdByUserId' });

module.exports = db