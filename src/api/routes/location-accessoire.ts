import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/location-accessoire"
const route = Router()

export default (app: Router) => {
    app.use("/location-accessoires", route)

    route.get("/", controller.findAll)
    route.post("/", controller.create)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
    route.post("/findonestatus", controller.findByOneStatus)
    route.post("/findone", controller.findByOne) 
    route.post("/findfifo", controller.findByFifo)
    route.post("/findother", controller.findOtherStatus)
    route.put("/:id", controller.update)
    route.delete("/:id", controller.deleteOne)
}
