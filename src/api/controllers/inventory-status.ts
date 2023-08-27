import InventoryStatusService from "../../services/inventory-status"
import InventoryStatusDetailService from "../../services/inventory-status-details"

import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const inventoryStatusServiceInstance = Container.get(InventoryStatusService)
        const inventoryStatusDetailServiceInstance = Container.get(
            InventoryStatusDetailService
        )
        const { inventoryStatus, inventoryStatusDetails } = req.body
        const status = await inventoryStatusServiceInstance.create({...inventoryStatus, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        for (let entry of inventoryStatusDetails) {
            entry = { ...entry, isd_status: status.is_status, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by: user_code }
            await inventoryStatusDetailServiceInstance.create(entry)
        }
        return res
            .status(201)
            .json({ message: "created succesfully", data: status })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all inventoryStatus endpoint")
    try {
        const inventoryStatusServiceInstance = Container.get(InventoryStatusService)
       const inventoryStatusDetailServiceInstance = Container.get(
            InventoryStatusDetailService
        )
        const inventoryStatus = await inventoryStatusServiceInstance.findOne({
            ...req.body,
        })
        if (inventoryStatus) {
           const details = await inventoryStatusDetailServiceInstance.find({
                isd_status: inventoryStatus.is_status,
           })
            return res.status(200).json({
                message: "fetched succesfully",
                data: { inventoryStatus , details },
            })
       } else {
           return res.status(200).json({
                message: "not FOund",
                data: { inventoryStatus, details: null },
          })
       }
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  inventoryStatus endpoint")
    try {
        const inventoryStatusServiceInstance = Container.get(InventoryStatusService)
        const { id } = req.params
        const inventoryStatus = await inventoryStatusServiceInstance.findOne({ id })
        const inventoryStatusDetailServiceInstance = Container.get(
            InventoryStatusDetailService
        )
        const details = await inventoryStatusDetailServiceInstance.find({
            isd_status: inventoryStatus.is_status,
        })

        return res.status(200).json({
            message: "fetched succesfully",
            data: { inventoryStatus, details },
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}



const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all inventoryStatus endpoint")
    try {
        const inventoryStatusServiceInstance = Container.get(InventoryStatusService)
        const requisitions = await inventoryStatusServiceInstance.find({})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: requisitions })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAllDetails = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all inventoryStatus endpoint")
    try {
        const inventoryStatusDetailServiceInstance = Container.get(InventoryStatusDetailService)
        const details = await inventoryStatusDetailServiceInstance.findOne({ ...req.body,})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: details })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  inventoryStatus endpoint")
    try {
        const inventoryStatusServiceInstance = Container.get(InventoryStatusService)
        const inventoryStatusDetailServiceInstance = Container.get(
            InventoryStatusDetailService
        )
        const { id } = req.params
        const {status, details} = req.body
        const inventoryStatus = await inventoryStatusServiceInstance.update(
            { ...req.body , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},
            { id }
        )
        await inventoryStatusDetailServiceInstance.delete({isd_status: status.is_status})
        for (let entry of details) {
            entry = { ...entry, isd_status: status.is_status, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
            await inventoryStatusDetailServiceInstance.create(entry)
        }
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: inventoryStatus })
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
    findAllDetails,
    update,
}
