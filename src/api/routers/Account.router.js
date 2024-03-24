const Token = require("../../middlewares/TokenMiddleware")
const accountController = require("../controllers/Accounts.controller")
module.exports = (app) => {
    app.post("/api/account/modify", Token, accountController.AccountModifyController)
    app.post("/api/account/list", Token, accountController.AccountFetchListController)
    app.delete("/api/account/remove/:id", Token, accountController.AccountDeleteController)
}