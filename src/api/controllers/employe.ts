import EmployeService from "../../services/employe"
import EmployeAvailabilityService from "../../services/employe-availability"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create code endpoint")
    try {
        const employeServiceInstance = Container.get(EmployeService)
        const employe = await employeServiceInstance.create({...req.body, created_by: user_code, last_modified_by: user_code})
        return res
            .status(201)
            .json({ message: "created succesfully", data:  employe })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const createC = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        
        const empAvailabilityServiceInstance = Container.get(
            EmployeAvailabilityService
        )
        const { emp, empDetail } = req.body
        console.log(emp)
        const empdet = await empAvailabilityServiceInstance.delete({empd_addr: emp})
        for (let entry of empDetail) {
            entry = { ...entry, empd_addr: emp,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by: user_code }
            await empAvailabilityServiceInstance.create(entry)
        }
        return res
            .status(201)
            .json({ message: "created succesfully", data: empDetail })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  code endpoint")
    try {
        const employeServiceInstance = Container.get(EmployeService)
        const {id} = req.params
        const employe = await employeServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: employe  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all code endpoint")
    try {
        const employeServiceInstance = Container.get(EmployeService)
        const employe = await employeServiceInstance.find({})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: employe })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all code endpoint")
    try {
        const employeServiceInstance = Container.get(EmployeService)
        const employe = await employeServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: employe })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByDet = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all empdet endpoint")
    try {
        const empDetServiceInstance = Container.get(EmployeAvailabilityService)
        const employe = await empDetServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: employe })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  code endpoint")
    try {
        const employeServiceInstance = Container.get(EmployeService)
        const {id} = req.params
        const employe = await employeServiceInstance.update({...req.body, last_modified_by: user_code},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: employe  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  code endpoint")
    try {
        const employeServiceInstance = Container.get(EmployeService)
        const {id} = req.params
        const employe = await employeServiceInstance.delete({id})
        return res
            .status(200)
            .json({ message: "deleted succesfully", data: id  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
export default {
    create,
    createC,
    findOne,
    findAll,
    findBy,
    findByDet,
    update,
    deleteOne
}

