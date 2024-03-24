const Token = require("../../middlewares/TokenMiddleware")
const timelogController = require("../controllers/Timelog.controller")
module.exports = (app) => {
    app.post("/api/timelog/modify", Token, timelogController.TimelogModifyController)
    app.post("/api/timelog/list", Token, timelogController.TimelogFetchListController)
    app.post("/api/timelog/diagram", Token, timelogController.TimelogDiagramController)
    app.delete("/api/timelog/remove/:id", Token, timelogController.TimelogDeleteController)
}