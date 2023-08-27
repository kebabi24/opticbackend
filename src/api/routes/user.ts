import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/user"
const route = Router()

export default (app: Router) => {
    app.use("/users", route)

    route.get("/", controller.findAll)
    route.post("/", controller.create)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
    route.post("/findone", controller.findByOne)
    route.put("/up:id", controller.updated)
    route.put("/:id", controller.update)
    route.delete("/:id", controller.deleteOne)
}
