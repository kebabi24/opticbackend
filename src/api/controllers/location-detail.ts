import LocationDetailService from "../../services/location-details"
import InventoryStatusDetailService from "../../services/inventory-status-details"

import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import { localeData } from "moment"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create locationDetail endpoint")
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        const locationDetail = await locationDetailServiceInstance.create({...req.body,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        return res
            .status(201)
            .json({ message: "created succesfully", data:  locationDetail })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  locationDetail endpoint")
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        const {id} = req.params
        const locationDetail = await locationDetailServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationDetail  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all locationDetail endpoint")
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        const locationDetails = await locationDetailServiceInstance.find({})
        console.log(locationDetails)
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationDetails })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationDetail endpoint")
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        const locationDetails = await locationDetailServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationDetails })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationDetail endpoint")
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        const locationDetails = await locationDetailServiceInstance.findOne({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationDetails })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByOneStatus = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationDetail endpoint")
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        const inventoryStatusDetailServiceInstance = Container.get(InventoryStatusDetailService)
        const locationDetails = await locationDetailServiceInstance.findOne({...req.body})

        console.log(locationDetails)
        if (locationDetails) {
            const trstatus = await inventoryStatusDetailServiceInstance.findOne({
                isd_status: locationDetails.ld_status, isd_tr_type: 'ISS-SO'
            })
            return res.status(200).json({
                message: "fetched succesfully",
                data: { locationDetails, trstatus },
            })
        } else {
            
            return res.status(200).json({
                message: "not FOund",
                data: { locationDetails: null, trstatus: null },
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
    logger.debug("Calling find by  all locationDetail endpoint")
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        
        const locationDetails = await locationDetailServiceInstance.find({
            ...req.body,
        })
        return res.status(202).json({
            message: "sec",
            data:  locationDetails ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findByFifo = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationDetail endpoint")
  
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        const locationDetails = await locationDetailServiceInstance.findfifo({...req.body.obj, ld__log01: true })
      const result = []
        var rest = Number(req.body.qty)
        var qty = locationDetails.ld_qty_oh
        for (const det of locationDetails) {
            if (rest > 0) {
if (det.ld_qty_oh >= rest) {


    const result_body = {
        ld_loc : det.ld_loc,
        ld_part : det.ld_part,
        pt_desc1: det.item.pt_desc1,        
        pt_um: det.item.pt_um,
        ld_qty_oh: rest,
        ld_lot   : det.ld_lot,
        ld_site : det.ld_site,
        ld_ref : det.ld_ref
      
      };
      result.push(result_body)
    rest = rest - det.ld_qty_oh
    }
    else {
        const result_body = {
            ld_loc : det.ld_loc,
            ld_part : det.ld_part,
            pt_desc1: det.item.pt_desc1,        
            pt_um: det.item.pt_um,
            ld_qty_oh: det.ld_qty_oh,
            ld_lot   : det.ld_lot,
            ld_site : det.ld_site,
            ld_ref : det.ld_ref
          
          
          };
          rest = rest - det.ld_qty_oh
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

    logger.debug("Calling update one  locationDetail endpoint")
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        const {id} = req.params
        const locationDetail = await locationDetailServiceInstance.update({...req.body,last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationDetail  })
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
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        
        const locationdetails = await locationDetailServiceInstance.find({
             ...req.body.obj
                ,
                
                ld_status: {
                  [Op.ne]: req.body.status
                }
                
              
           ,
        })
        console.log(req.body.obj)
        return res.status(202).json({
            message: "sec",
            data:  locationdetails ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}


const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  locationDetail endpoint")
    try {
        const locationDetailServiceInstance = Container.get(LocationDetailService)
        const {id} = req.params
        const locationDetail = await locationDetailServiceInstance.delete({id})
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
