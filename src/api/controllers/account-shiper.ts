import AccountShiperService from "../../services/account-shiper"
import BankDetailService from "../../services/bank-detail"
import SaleOrderService from "../../services/saleorder"
import CustomerService from "../../services/customer"
import PenicheService from "../../services/peniche"

import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create account endpoint")
    try {
        console.log(req.body)
        const accountShiperServiceInstance = Container.get(AccountShiperService)
        const customerServiceInstance = Container.get(CustomerService)
        const penicheServiceInstance = Container.get(PenicheService)
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const accountShiper = await accountShiperServiceInstance.create({...req.body,as_nbr: req.body.pshnbr,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        const cm = await customerServiceInstance.findOne({cm_addr: req.body.as_cust})
        if(cm) await customerServiceInstance.update({cm_balance : Number(cm.cm_balance) + Number(req.body.as_amt)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: cm.id})
        const so = await saleOrderServiceInstance.findOne({so_nbr: req.body.as_ship})
        if (Number(so.so__dec02) + Number(req.body.as_amt) >= Number(so.so__dec01) ) { 
           await saleOrderServiceInstance.update({so__dec02 : Number(so.so__dec02) + Number(req.body.as_amt), so_stat : "C" , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: so.id})
        } else {
            await saleOrderServiceInstance.update({so__dec02 : Number(so.so__dec02) + Number(req.body.as_amt), last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: so.id})
      

        }
        if(req.body.as_open){
            console.log("herrrrrrrrrrrrrrrrrrrrrrrrrrrrr",req.body.as_ship)
            const pen = await penicheServiceInstance.findOne({pen_nbr: req.body.as_ship})
            if (pen) await penicheServiceInstance.update({pen_used: false,pen_nbr: null, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: pen.id})
      

        }
        
        return res
            .status(201)
            .json({ message: "created succesfully", data:  accountShiper })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const createP = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers
    let nbr : String;
    let open: Boolean;
    logger.debug("Calling Create account endpoint")
    try {
       
        const accountShiperServiceInstance = Container.get(AccountShiperService)
        const bankDetailServiceInstance = Container.get(BankDetailService)
        const customerServiceInstance = Container.get(CustomerService)
        const bankdet = await bankDetailServiceInstance.findOne({bkd_bank: req.body.as_bank, bkd_pay_method: req.body.as_pay_method, bkd_module : "AR"})
        if (bankdet) {
            nbr = req.body.as_ship.concat(bankdet.bkd_next_ck.toString());
            await bankDetailServiceInstance.update({bkd_next_ck: bankdet.bkd_next_ck + 1  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: bankdet.id})
        }
        const accountShiper = await accountShiperServiceInstance.create({...req.body, as_nbr : nbr, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        const bl = await accountShiperServiceInstance.findOne({as_nbr: req.body.as_ship, as_type: "I"})
        if (Number(bl.as_applied) + Number(req.body.as_amt) >= Number(bl.as_amt) ) { open = false}
        if(bl) await accountShiperServiceInstance.update({as_applied : Number(bl.as_applied) + Number(req.body.as_applied), as_open : open  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: bl.id})
        const cm = await customerServiceInstance.findOne({cm_addr: req.body.as_cust})
        if(cm) await customerServiceInstance.update({cm_ship_balance : Number(cm.cm_ship_balance) - Number(req.body.as_applied)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: cm.id})
        return res
            .status(201)
            .json({ message: "created succesfully", data:  accountShiper })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}


const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  account endpoint")
    try {
        const AccountShiperServiceInstance = Container.get(AccountShiperService)
        const {id} = req.params
        const accountShiper = await AccountShiperServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: accountShiper  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all account endpoint")
    try {
        const AccountShiperServiceInstance = Container.get(AccountShiperService)
        const accountShipers = await AccountShiperServiceInstance.find({})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: accountShipers })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all account endpoint")
    try {
        const AccountShiperServiceInstance = Container.get(AccountShiperService)
        const accountShipers = await AccountShiperServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: accountShipers })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  account endpoint")
    try {
        const AccountShiperServiceInstance = Container.get(AccountShiperService)
        const {id} = req.params
        const accountShiper = await AccountShiperServiceInstance.update({...req.body, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: accountShiper  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  account endpoint")
    try {
        const AccountShiperServiceInstance = Container.get(AccountShiperService)
        const {id} = req.params
        const accountShiper = await AccountShiperServiceInstance.delete({id})
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
    createP,
    findOne,
    findAll,
    findBy,
    update,
    deleteOne
}
