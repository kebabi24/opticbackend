import PenicheService from "../../services/peniche"
import CustomerService from "../../services/customer"
import SaleOrderService from "../../services/saleorder"
import AddressService from "../../services/address"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create peniche endpoint")
    try {
        const penicheServiceInstance = Container.get(PenicheService)
        const peniche = await penicheServiceInstance.create({...req.body, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        return res
            .status(201)
            .json({ message: "created succesfully", data:  peniche })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  peniche endpoint")
    try {
        const penicheServiceInstance = Container.get(PenicheService)
        const {id} = req.params
        const peniche = await penicheServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: peniche  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all peniche endpoint")
    try {
        const penicheServiceInstance = Container.get(PenicheService)
        const customerServiceInstance = Container.get(CustomerService)
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const addressServiceInstance = Container.get(AddressService)
        const peniches = await penicheServiceInstance.find({})
        for(let pen of peniches) {
            if (pen.pen_nbr != null) {
                const so = await saleOrderServiceInstance.findOne({so_nbr : pen.pen_nbr})
                console.log(so.customer.cm_addr)
                const address = await addressServiceInstance.findOne({ad_addr :so.customer.cm_addr })
                pen.pen_phys_addr = address.ad_name
                pen.pen_user1 = so.customer.cm_addr
            }
        }
      //  console.log(peniches)
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: peniches })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all peniche endpoint")
    try {
        const penicheServiceInstance = Container.get(PenicheService)
        const peniches = await penicheServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: peniches })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all peniche endpoint")
    try {
        const penicheServiceInstance = Container.get(PenicheService)
        const peniches = await penicheServiceInstance.findOne({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: peniches })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}



const findByAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all peniche endpoint")
    try {
        const penicheServiceInstance = Container.get(PenicheService)
        
        const peniches = await penicheServiceInstance.find({
            ...req.body,
        })
        return res.status(202).json({
            message: "sec",
            data:  peniches ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  peniche endpoint")
    try {
        const penicheServiceInstance = Container.get(PenicheService)
        const {id} = req.params
        const peniche = await penicheServiceInstance.update({...req.body, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: peniche  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  peniche endpoint")
    try {
        const penicheServiceInstance = Container.get(PenicheService)
        const {id} = req.params
        const peniche = await penicheServiceInstance.delete({id})
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
    deleteOne,
    findByAll
}
