import UserService from "../../services/user"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers
    logger.debug("Calling Create user endpoint")
    try {
        const userServiceInstance = Container.get(UserService)
        const user = await userServiceInstance.create({...req.body, created_by:user_code,created_ip_adr: req.headers.origin,last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        return res
            .status(201)
            .json({ message: "created succesfully", data:  user })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  user endpoint")
    try {
        const userServiceInstance = Container.get(UserService)
        const {id} = req.params
        const user = await userServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: user  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all user endpoint")
    try {
        const userServiceInstance = Container.get(UserService)
        const users = await userServiceInstance.find({})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: users })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all user endpoint")
    try {
        const userServiceInstance = Container.get(UserService)
        const users = await userServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: users })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one by  user endpoint")
    try {
        const userServiceInstance = Container.get(UserService)
        const users = await userServiceInstance.findOne({...req.body})
        console.log(users)
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: users })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  user endpoint")
    try {
        const userServiceInstance = Container.get(UserService)
        const {id} = req.params
        const user = await userServiceInstance.update({...req.body, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: user  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const updated = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  user endpoint")
    try {
        const userServiceInstance = Container.get(UserService)
        const {id} = req.params
        const user = await userServiceInstance.updated({...req.body, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: user  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  user endpoint")
    try {
        const userServiceInstance = Container.get(UserService)
        const {id} = req.params
        const user = await userServiceInstance.delete({id})
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
    updated,
    deleteOne
}
