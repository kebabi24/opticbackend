import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/employe"
const route = Router()

export default (app: Router) => {
    app.use("/employes", route)

    route.get("/", controller.findAll)
    route.post("/", controller.create)
    route.post("/C", controller.createC)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
    route.post("/finddet", controller.findByDet)
    route.put("/:id", controller.update)
 
}
