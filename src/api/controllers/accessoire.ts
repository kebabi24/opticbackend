import AccessoireService from "../../services/accessoire"
import LocationAccessoireService from "../../services/location-accessoire"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import { DATE, Op, Sequelize } from 'sequelize';
import sequelize from '../../loaders/sequelize';
import { isNull } from "lodash";
const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create accessoire endpoint ")
    try {
        const accessoireServiceInstance = Container.get(AccessoireService)
        const accessoire = await accessoireServiceInstance.create({...req.body, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        return res
            .status(201)
            .json({ message: "created succesfully", data: { accessoire } })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all accessoire endpoint")
    try {
        const accessoireServiceInstance = Container.get(AccessoireService)
        const accessoires = await accessoireServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: accessoires })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all accessoire endpoint")
    try {
        const accessoireServiceInstance = Container.get(AccessoireService)
        const accessoires = await accessoireServiceInstance.findOne({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: accessoires })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  code endpoint")
    try {
        const accessoireServiceInstance = Container.get(AccessoireService)
        const {id} = req.params
        const accessoire = await accessoireServiceInstance.findOne({id})
        console.log("ere")
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: accessoire  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all code endpoint")
    try {
        const accessoireServiceInstance = Container.get(AccessoireService)
        const codes = await accessoireServiceInstance.find({})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: codes })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findProd = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all code endpoint")
    const Sequelize = require('sequelize');
        const Op = Sequelize.Op;
    console.log(req.body.pmcode)
    
    try {
        const accessoireServiceInstance = Container.get(AccessoireService)
        
        const codes = await accessoireServiceInstance.find({
            ... {
            
                  acs_pm_code:  "M"
             
                
              }
           ,
        })
         

        return res
            .status(200)
            .json({ message: "fetched succesfully", data: codes })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAllwithstk = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all code endpoint")
    try {
        const accessoireServiceInstance = Container.get(AccessoireService)
        const locationDetailServiceInstance = Container.get(LocationAccessoireService)
        const accessoires = await accessoireServiceInstance.find({})
        const result = [];
        for (const accessoire of accessoires) {
            const res = await locationDetailServiceInstance.findSpecial({
                where: { lda_part: accessoire.acs_part, lda_lot:null},
                attributes: ['lda_part', [Sequelize.fn('sum', Sequelize.col('lda_qty_oh')), 'total']],
            group: ['lda_part'],
            raw: true,
          });
          
          //accessoires.total_qty = res.total_qty;
          const qty = res[0] ? (res[0].total ? res[0].total : 0) : 0;
         accessoire.acs_ord_max = qty
         result.push(accessoire)
          
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

    logger.debug("Calling update one  code endpoint")
    try {
        const accessoireServiceInstance = Container.get(AccessoireService)
        const {id} = req.params
        const accessoire = await accessoireServiceInstance.update({...req.body, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: accessoire  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}



export default {
    create,
    findBy,
    findByOne,
    findOne,
    findAll,
    findProd,
    findAllwithstk,
    update
}
