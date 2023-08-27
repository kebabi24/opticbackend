import ReasonService from "../../services/reason"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers
    logger.debug("Calling Create site endpoint")
    try {
        const reasonServiceInstance = Container.get(ReasonService)
        const reason = await reasonServiceInstance.create({...req.body, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        return res
            .status(201)
            .json({ message: "created succesfully", data:  reason })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  site endpoint")
    try {
        const reasonServiceInstance = Container.get(ReasonService)
        const {id} = req.params
        const reason = await reasonServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: reason  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.headers.origin)

    logger.debug("Calling find all site endpoint")
    try {
        const reasonServiceInstance = Container.get(ReasonService)
        const reasons = await reasonServiceInstance.find({})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: reasons })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all site endpoint")
    try {
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
        const reasonServiceInstance = Container.get(ReasonService)
        const reasons = await reasonServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: reasons })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all site endpoint")
    try {
        const reasonServiceInstance = Container.get(ReasonService)
        const reasons = await reasonServiceInstance.findOne({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: reasons })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  site endpoint")
    try {
        const reasonServiceInstance = Container.get(ReasonService)
        const {id} = req.params
        const reason = await reasonServiceInstance.update({...req.body, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: reason  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  site endpoint")
    try {
        const reasonServiceInstance = Container.get(ReasonService)
        const {id} = req.params
        const reason = await reasonServiceInstance.delete({id})
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
    findOne,
    findAll,
    findBy,
    findByOne,
    update,
    deleteOne
}
