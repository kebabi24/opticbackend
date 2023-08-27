import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/glasses"
const route = Router()

export default (app: Router) => {
    app.use("/glassess", route)

    route.post("/", controller.create)
    route.post("/find", controller.findBy)
    route.post("/findOne", controller.findByOne)
    route.get("/:id", controller.findOne)
    route.get("/", controller.findAll)
    route.post("/findprod", controller.findProd)
    route.post("/stk", controller.findAllwithstk)
    route.put("/:id", controller.update)
    route.post("/findstk", controller.findAllwithDetails)
    route.post("/findprice", controller.findPriceDetails)
}
