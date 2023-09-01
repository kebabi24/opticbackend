import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/inventory-transaction"
const route = Router()

export default (app: Router) => {
    app.use("/inventory-transactions", route)

    route.get("/", controller.findAll)
    route.post("/", controller.create)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
    route.put("/:id", controller.update)
    route.delete("/:id", controller.deleteOne)
    route.post("/rct-unp", controller.rctUnp)
    route.post("/iss-unp", controller.issUnp)
    route.post("/iss-tr", controller.issTr)
    route.post("/iss-chl", controller.issChl)
    route.post('/inventoryOfDate', controller.inventoryToDate)
    route.post('/inventoryactivity', controller.inventoryActivity)
    route.post('/inventorybyloc', controller.inventoryByLoc)
    route.post('/inventorybystatus', controller.inventoryByStatus)
    route.post('/inventoryofsecurity', controller.inventoryOfSecurity)
    route.post("/rct-wo", controller.rctWo)
    route.post("/iss-wo", controller.issWo)
    route.post("/zakat", controller.zakatBy)
    route.post('/cyc-rcnt', controller.cycRcnt);
    route.post('/acscyc-rcnt', controller.acscycRcnt);
    route.post('/glscyc-rcnt', controller.glscycRcnt);
  
    
}
