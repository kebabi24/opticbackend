import PayMethService from "../../services/pay-meth"
import PayMethDetailService from "../../services/pay-meth-detail"

import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import {QueryTypes} from 'sequelize'
const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const payMethServiceInstance = Container.get(PayMethService)
        const payMethDetailServiceInstance = Container.get(
            PayMethDetailService
        )
        const { PayMeth, PayMethDetails } = req.body
        const to = await payMethServiceInstance.create({...PayMeth, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        for (let entry of PayMethDetails) {
            entry = { ...entry, ctd_code: PayMeth.ct_code, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by: user_code }
            await payMethDetailServiceInstance.create(entry)
        }
        return res
            .status(201)
            .json({ message: "created succesfully", data: to })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all PayMeth endpoint")
    try {
        const payMethServiceInstance = Container.get(PayMethService)
       const payMethDetailServiceInstance = Container.get(
            PayMethDetailService
        )
        const PayMeth = await payMethServiceInstance.findOne({
            ...req.body,
        })
        console.log("hhhhhhhhhhhhhhhh")
        if (PayMeth) {
           const details = await payMethDetailServiceInstance.find({
                ctd_code: PayMeth.ct_code,
           })
            return res.status(200).json({
                message: "fetched succesfully",
                data: { PayMeth , details },
            })
       } else {
           return res.status(200).json({
                message: "not FOund",
                data: { PayMeth, details: null },
          })
       }
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  PayMeth endpoint")
    try {
        const payMethServiceInstance = Container.get(PayMethService)
        const { id } = req.params
        const PayMeth = await payMethServiceInstance.findOne({ id })
        const payMethDetailServiceInstance = Container.get(
            PayMethDetailService
        )
        const details = await payMethDetailServiceInstance.find({
            ctd_code: PayMeth.ct_code,
        })

        return res.status(200).json({
            message: "fetched succesfully",
            data: { PayMeth, details },
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}



const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all PayMeth endpoint")
    try {
        const payMethServiceInstance = Container.get(PayMethService)
        const PayMeths = await payMethServiceInstance.find({})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: PayMeths })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}



const update = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  PayMeth endpoint")
    try {
        const payMethServiceInstance = Container.get(PayMethService)
        const payMethDetailServiceInstance = Container.get(
            PayMethDetailService
        )
        const { id } = req.params
        const {PayMeth, details} = req.body
        const jb = await payMethServiceInstance.update(
            { ...req.body , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},
            { id }
        )
        await payMethDetailServiceInstance.delete({ctd_code: PayMeth.ct_code})
        for (let entry of details) {
            entry = { ...entry, ctd_code: PayMeth.ct_code, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
            await payMethDetailServiceInstance.create(entry)
        }
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: jb })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findAllwithDetails = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const sequelize = Container.get("sequelize")

    logger.debug("Calling find all purchaseOrder endpoint")
    try {
        let result = []
        //const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)

        const pos =await sequelize.query("SELECT *  FROM   PUBLIC.ct_mstr,  PUBLIC.ctd_det  where PUBLIC.ctd_det.ctd_code = PUBLIC.ct_mstr.ct_code  ORDER BY PUBLIC.ctd_det.id ASC", { type: QueryTypes.SELECT });
       console.log(pos)
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: pos })
            
            
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    } 
}
export default {
    create,
    findBy,
    findOne,
    findAll,
    update,
    findAllwithDetails,
}
