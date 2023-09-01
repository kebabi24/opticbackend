import VisiteService from "../../services/visite"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const visiteServiceInstance = Container.get(VisiteService)
        const { visite, soNbr } = req.body
        const vis = await visiteServiceInstance.create({...visite,vis_so_nbr:soNbr ,vis_ord_date: new Date(),created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        
        return res
            .status(201)
            .json({ message: "created succesfully", data: vis })
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
        const visiteServiceInstance = Container.get(VisiteService)
        const {id} = req.params
        const visite = await visiteServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data:  visite  })
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
        const visiteServiceInstance = Container.get(VisiteService)
        const visites = await visiteServiceInstance.find({})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data:  visites })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all site endpoint")
    try {
        const visiteServiceInstance = Container.get(VisiteService)
        const visites = await visiteServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data:  visites })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all site endpoint")
    try {
        const visiteServiceInstance = Container.get(VisiteService)
        const visites = await visiteServiceInstance.findOne({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data:  visites })
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
        const visiteServiceInstance = Container.get(VisiteService)
        const {id} = req.params
        const visite = await visiteServiceInstance.update({...req.body, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data:  visite  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  site endpoint")
    try {
        const visiteServiceInstance = Container.get(VisiteService)
        const {id} = req.params
        const visite = await visiteServiceInstance.delete({id})
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
