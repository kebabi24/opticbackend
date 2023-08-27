import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/ps"
const route = Router()

export default (app: Router) => {
    app.use("/pss", route)

    route.get("/", controller.findAll)
    route.post("/", controller.create)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
    route.post("/price", controller.findPrice)
    route.put("/:id", controller.update)
    route.delete("/:id", controller.deleteOne)
}
