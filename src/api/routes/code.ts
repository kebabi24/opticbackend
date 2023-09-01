import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import controller from "../controllers/code"
const route = Router()

export default (app: Router) => {
    app.use("/codes", route)

    route.get("/", controller.findAll)
    route.get("/check", controller.findCheck)
    route.get("/conge", controller.findConge)
    route.get("/module", controller.findModule)
    route.get("/trans", controller.findTrans)
    route.get("/rev", controller.findRev)
    route.get("/typestk", controller.findTypeStk)
    route.get("/parttype", controller.findPartType)
    route.get("/draw", controller.findDraw)
    route.get("/promo", controller.findPromo)
    route.get("/upc", controller.findUpc)
    route.get("/dsgngrp", controller.findDsgnGrp)
    route.post("/", controller.create)
    route.get("/:id", controller.findOne)
    route.post("/find", controller.findBy)
    route.put("/:id", controller.update)
    route.delete("/:id", controller.deleteOne)
}
