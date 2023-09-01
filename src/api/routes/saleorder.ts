import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/saleorder"
const route = Router()

export default (app: Router) => {
    app.use("/saleorders", route)

    route.post("/", controller.create)
    route.post("/direct", controller.createdirect)
    route.post("/avoir", controller.avoir)
    route.get("/", controller.findAll)
    route.get("/allwithdetail", controller.findAllwithDetails)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
    route.post("/finddet", controller.findDetail)
    route.post("/findsoddet", controller.findsodDetail)
    route.post("/findrange", controller.findByrange)
    route.post("/findcustca", controller.findcustca)
    route.post("/finddaterange", controller.findrange)
    route.post("/findactivity", controller.getActivity)
    route.post("/findca", controller.getCA)
    route.put("/:id", controller.update)
    route.put("/So/:id", controller.updateSo)
    route.post("/findAll", controller.findByAll)  
    route.post("/findAlladr", controller.findByAllAdr)  
    route.post("/findGls", controller.findGlsAll)  
    
}
