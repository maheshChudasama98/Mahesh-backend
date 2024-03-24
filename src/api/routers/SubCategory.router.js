const Token = require("../../middlewares/TokenMiddleware")
const subCategoryController = require("../controllers/SubCategory.controller")
module.exports = (app) => {
    app.post("/api/account-category-sub/modify", Token, subCategoryController.SubCategoryModifyController)
    app.post("/api/account-category-sub/list", Token, subCategoryController.SubCategoryFetchListController)
    app.delete("/api/account-category-sub/remove/:id", Token, subCategoryController.SubCategoryDeleteController)
}