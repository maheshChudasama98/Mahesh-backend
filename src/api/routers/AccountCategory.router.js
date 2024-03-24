const Token = require("../../middlewares/TokenMiddleware")
const accountCategoryController = require("../controllers/AccountsCategory.controller")
module.exports = (app) => {
    app.post("/api/account-category/modify", Token, accountCategoryController.AccountCategoryModifyController)
    app.post("/api/account-category/list", Token, accountCategoryController.AccountCategoryFetchListController)
    app.delete("/api/account-category/remove/:id", Token, accountCategoryController.AccountCategoryDeleteController)
}