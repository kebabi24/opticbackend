import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/dailysales"
const route = Router()

export default (app: Router) => {
    app.use("/dailysaless", route)

    route.post("/direct", controller.createdirect)
    route.get("/", controller.findAll)
    route.get("/allwithdetail", controller.findAllwithDetails)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
    route.post("/finddet", controller.findDetail)
    route.put("/:id", controller.update)
    route.put("/So/:id", controller.updateSo)
    route.post("/findAll", controller.findByAll)  
    
}
