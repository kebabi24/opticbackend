import AffectEmployeService from "../../services/affect-employe"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create code endpoint")
    try {
        const affectEmployeServiceInstance = Container.get(AffectEmployeService)
        const { affectEmp, empDetail } = req.body

        for (let entry of empDetail) {
            
            
            await affectEmployeServiceInstance.create({...entry,pme_pm_code: affectEmp.pme_pm_code, pme_inst: affectEmp.pme_inst, pme_task: affectEmp.pme_task,
                pme_start_date: affectEmp.pme_start_date,pme_end_date: affectEmp.pme_end_date, pme_start_time: affectEmp.pme_start_time, pme_end_time: affectEmp.pme_end_time, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})

            
        }
      //  const affectemploye = await affectEmployeServiceInstance.create({...req.body, created_by: user_code, last_modified_by: user_code})
        return res
            .status(201)
            .json({ message: "created succesfully", data:  affectEmp })
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
        const affectEmployeServiceInstance = Container.get(AffectEmployeService)
        const {id} = req.params
        const employe = await affectEmployeServiceInstance.findOne({id})
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
        const affectEmployeServiceInstance = Container.get(AffectEmployeService)
        const employe = await affectEmployeServiceInstance.find({})
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
        const affectEmployeServiceInstance = Container.get(AffectEmployeService)
        const employe = await affectEmployeServiceInstance.find({...req.body})
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
        const affectEmployeServiceInstance = Container.get(AffectEmployeService)
        const {id} = req.params
        const employe = await affectEmployeServiceInstance.update({...req.body, last_modified_by: user_code},{id})
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
        const affectEmployeServiceInstance = Container.get(AffectEmployeService)
        const {id} = req.params
        const employe = await affectEmployeServiceInstance.delete({id})
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
    update,
    deleteOne
}

