import LocationAccessoireService from "../../services/location-accessoire"
import InventoryStatusDetailService from "../../services/inventory-status-details"

import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import { localeData } from "moment"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create locationAccessoire endpoint")
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        const locationAccessoire = await locationAccessoireServiceInstance.create({...req.body,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        return res
            .status(201)
            .json({ message: "created succesfully", data:  locationAccessoire })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  locationAccessoire endpoint")
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        const {id} = req.params
        const locationAccessoire = await locationAccessoireServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationAccessoire  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all locationAccessoire endpoint")
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        const locationAccessoires = await locationAccessoireServiceInstance.find({})
        //console.log(locationAccessoires)
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationAccessoires })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationAccessoire endpoint")
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        const locationAccessoires = await locationAccessoireServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationAccessoires })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationAccessoire endpoint")
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        const locationAccessoires = await locationAccessoireServiceInstance.findOne({...req.body})
        console.log(locationAccessoires)
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationAccessoires })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByOneStatus = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationAccessoire endpoint")
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        const inventoryStatusDetailServiceInstance = Container.get(InventoryStatusDetailService)
        const locationAccessoires = await locationAccessoireServiceInstance.findOne({...req.body})

        console.log(locationAccessoires)
        if (locationAccessoires) {
            const trstatus = await inventoryStatusDetailServiceInstance.findOne({
                isd_status: locationAccessoires.lda_status, isd_tr_type: 'ISS-SO'
            })
            return res.status(200).json({
                message: "fetched succesfully",
                data: { locationAccessoires, trstatus },
            })
        } else {
            
            return res.status(200).json({
                message: "not FOund",
                data: { locationAccessoires: null, trstatus: null },
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
    logger.debug("Calling find by  all locationAccessoire endpoint")
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        
        const locationAccessoires = await locationAccessoireServiceInstance.find({
            ...req.body,
        })
        return res.status(202).json({
            message: "sec",
            data:  locationAccessoires ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findByFifo = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationAccessoire endpoint")
  
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        const locationAccessoires = await locationAccessoireServiceInstance.findfifo({...req.body.obj, lda__log01: true })
      const result = []
        var rest = Number(req.body.qty)
        var qty = locationAccessoires.lda_qty_oh
        for (const det of locationAccessoires) {
            if (rest > 0) {
if (det.lda_qty_oh >= rest) {


    const result_body = {
        lda_loc : det.lda_loc,
        lda_part : det.lda_part,
        acs_desc1: det.item.acs_desc1,        
        acs_um: det.item.acs_um,
        lda_qty_oh: rest,
        lda_lot   : det.lda_lot,
        lda_site : det.lda_site,
        lda_ref : det.lda_ref
      
      };
      result.push(result_body)
    rest = rest - det.lda_qty_oh
    }
    else {
        const result_body = {
            lda_loc : det.lda_loc,
            lda_part : det.lda_part,
            acs_desc1: det.item.acs_desc1,        
            acs_um: det.item.acs_um,
            lda_qty_oh: det.lda_qty_oh,
            lda_lot   : det.lda_lot,
            lda_site : det.lda_site,
            lda_ref : det.lda_ref
          
          
          };
          rest = rest - det.lda_qty_oh
          result.push(result_body)
    }

}


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

    logger.debug("Calling update one  locationAccessoire endpoint")
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        const {id} = req.params
        const locationAccessoire = await locationAccessoireServiceInstance.update({...req.body,last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationAccessoire  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}


const findOtherStatus = async (req: Request,res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const Sequelize = require('sequelize');
        const Op = Sequelize.Op;
    console.log(req.body.status)
    logger.debug("Calling find by  all details endpoint")
    try {
        console.log("here", req.body)
        const {detail} = req.body.obj
        console.log(detail)
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        
        const locationAccessoires = await locationAccessoireServiceInstance.find({
             ...req.body.obj
                ,
                
                lda_status: {
                  [Op.ne]: req.body.status
                }
                
              
           ,
        })
        console.log(req.body.obj)
        return res.status(202).json({
            message: "sec",
            data:  locationAccessoires ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}


const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  locationAccessoire endpoint")
    try {
        const locationAccessoireServiceInstance = Container.get(LocationAccessoireService)
        const {id} = req.params
        const locationAccessoire = await locationAccessoireServiceInstance.delete({id})
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
    findByOneStatus,
    update,
    deleteOne,
    findByAll,
    findOtherStatus,
    findByFifo
}
