import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/auth"
const route = Router()

export default (app: Router) => {
    app.use("/auth", route)

    route.post("/login", controller.login)
    route.post("/verifypwd", controller.verifypwd)
}
