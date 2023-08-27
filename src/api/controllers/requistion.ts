import RequisitionService from "../../services/requisition"
import RequisitionDetailService from "../../services/requisition-detail"

import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const requisitionServiceInstance = Container.get(RequisitionService)
        const requisitionDetailServiceInstance = Container.get(
            RequisitionDetailService
        )
        const { requisition, requisitionDetail } = req.body
        const requi = await requisitionServiceInstance.create({...requisition, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        for (let entry of requisitionDetail) {
            entry = { ...entry, rqd_nbr: requi.rqm_nbr }
            await requisitionDetailServiceInstance.create(entry)
        }
        return res
            .status(201)
            .json({ message: "created succesfully", data: requi })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all requisition endpoint")
    try {
        const requisitionServiceInstance = Container.get(RequisitionService)
        const requisitionDetailServiceInstance = Container.get(
            RequisitionDetailService
        )
        const requisition = await requisitionServiceInstance.findOne({
            ...req.body,
       })
        if (requisition) {
            const details = await requisitionDetailServiceInstance.find({
                rqd_nbr: requisition.rqm_nbr,
            })
            return res.status(200).json({
                message: "fetched succesfully",
                data: { requisition, details },
            })
        } else {
            return res.status(202).json({
                message: "not FOund",
                data: { requisition: null, details: null },
            })
        }
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findByAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all requisition endpoint")
    try {
        const requisitionServiceInstance = Container.get(RequisitionService)
        
        const requisitions = await requisitionServiceInstance.find({
            ...req.body,
        })
        return res.status(202).json({
            message: "sec",
            data:  requisitions ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findNotByAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const Sequelize = require('sequelize');
        const Op = Sequelize.Op;
    console.log(req.body)
    logger.debug("Calling find by  all requisition endpoint")
    try {
        const requisitionServiceInstance = Container.get(RequisitionService)
        
        const requisitions = await requisitionServiceInstance.find({
            ... {
                rqm_aprv_stat: {
                  [Op.ne]: "3"
                },
                rqm_open: true 
              }
           ,
        })
        return res.status(202).json({
            message: "sec",
            data:  requisitions ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  requisition endpoint")
    try {
        const requisitionServiceInstance = Container.get(RequisitionService)
        const { id } = req.params
        const requisition = await requisitionServiceInstance.findOne({ id })
        const requisitionDetailServiceInstance = Container.get(
            RequisitionDetailService
        )
        const details = await requisitionDetailServiceInstance.find({
            rqd_nbr: requisition.rqm_nbr,
        })
        

        return res.status(200).json({
            message: "fetched succesfully",
            data: { requisition, details },
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all code endpoint")
    try {
        let result=[]
        const requisitionServiceInstance = Container.get(RequisitionService)
        const requisitionDetailServiceInstance = Container.get(
            RequisitionDetailService
        )
        const requisitions = await requisitionServiceInstance.find({})
        for(const req of requisitions){
            const details = await requisitionDetailServiceInstance.find({
                rqd_nbr: req.rqm_nbr,
            })
            result.push({id: req.id ,req, details})
        }
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: result })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  requisition endpoint")
    try {
        const requisitionServiceInstance = Container.get(RequisitionService)
        const { id } = req.params
        console.log(req.body)
        const requisition = await requisitionServiceInstance.update(
            { ...req.body, last_modified_by: user_code },
            { id }
        )
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: requisition })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const updatedet = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  inventoryStatus endpoint")
    try {
        const requisitionServiceInstance = Container.get(RequisitionService)
        
        const requisitionDetailServiceInstance = Container.get(
            RequisitionDetailService
        )
        const {requisition, details} = req.body
        const { id } = req.params
        
        const requ = await requisitionServiceInstance.update(
            { ...req.body , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},
            { id }
        )
        await requisitionDetailServiceInstance.delete({rqd_nbr: requisition.rqm_nbr})
        for (let entry of details) {
            entry = { ...entry, rqd_nbr: requisition.rqm_nbr, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
            await requisitionDetailServiceInstance.create(entry)
        }
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: requ })
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
    updatedet,
    findByAll,
    findNotByAll,
}
