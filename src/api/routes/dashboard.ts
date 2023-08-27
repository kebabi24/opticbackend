import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/dashboard"
const route = Router()

export default (app: Router) => {
    app.use("/dashboards", route)

    route.get("/daysales", controller.daySales)
    

}
