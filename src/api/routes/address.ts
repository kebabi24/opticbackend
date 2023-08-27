import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/address"
const route = Router()

export default (app: Router) => {
    app.use("/addresses", route)
    route.get("/", controller.findAll)
    route.post("/", controller.create)
    route.post("/find", controller.findBy)
    route.put("/:id", controller.update)
}
