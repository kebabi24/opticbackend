import LocationGlassesService from "../../services/location-glasses"
import InventoryStatusDetailService from "../../services/inventory-status-details"

import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import { localeData } from "moment"
import { DATE, Op, Sequelize } from 'sequelize';
const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const locationGlasses = await locationGlassesServiceInstance.create({...req.body,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        return res
            .status(201)
            .json({ message: "created succesfully", data:  locationGlasses })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const {id} = req.params
        const locationGlasses = await locationGlassesServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationGlasses  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const locationGlassess = await locationGlassesServiceInstance.find({})
        //console.log(locationGlassess)
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationGlassess })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const locationGlassess = await locationGlassesServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationGlassess })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findStk = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        let A = req.body.obj.sph;
        let B = req.body.obj.cyl;
        const locationGlassess = await locationGlassesServiceInstance.findSpecial({
            where: {
                [Op.or]: [{
                    ldg_part: req.body.obj.part,
            ldg_sph:  A, 
            
            ldg_cyl: B,
            
            ldg_add:  req.body.obj.add,
             },
                {
                    ldg_part: req.body.obj.part,
                    ldg_sph:  Number(A) + Number(B), 
            
                    ldg_cyl: - Number(B),
                    
                    ldg_add:  req.body.obj.add,
                    
                }
            ]

             },
             raw: true,
            })
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationGlassess })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const locationGlassess = await locationGlassesServiceInstance.findOne({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationGlassess })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByOneStatus = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const inventoryStatusDetailServiceInstance = Container.get(InventoryStatusDetailService)
        const locationGlassess = await locationGlassesServiceInstance.findOne({...req.body})

        console.log(locationGlassess)
        if (locationGlassess) {
            const trstatus = await inventoryStatusDetailServiceInstance.findOne({
                isd_status: locationGlassess.ldg_status, isd_tr_type: 'ISS-SO'
            })
            return res.status(200).json({
                message: "fetched succesfully",
                data: { locationGlassess, trstatus },
            })
        } else {
            
            return res.status(200).json({
                message: "not FOund",
                data: { locationGlassess: null, trstatus: null },
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
    logger.debug("Calling find by  all locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        
        const locationGlassess = await locationGlassesServiceInstance.find({
            ...req.body,
        })
        return res.status(202).json({
            message: "sec",
            data:  locationGlassess ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findByFifo = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all locationGlasses endpoint")
  
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const locationGlassess = await locationGlassesServiceInstance.findfifo({...req.body.obj, ldg__log01: true })
      const result = []
        var rest = Number(req.body.qty)
        var qty = locationGlassess.ldg_qty_oh
        for (const det of locationGlassess) {
            if (rest > 0) {
if (det.ldg_qty_oh >= rest) {


    const result_body = {
        ldg_loc : det.ldg_loc,
        ldg_part : det.ldg_part,
        pt_desc1: det.item.pt_desc1,        
        pt_um: det.item.pt_um,
        ldg_qty_oh: rest,
        ldg_lot   : det.ldg_lot,
        ldg_site : det.ldg_site,
        ldg_ref : det.ldg_ref
      
      };
      result.push(result_body)
    rest = rest - det.ldg_qty_oh
    }
    else {
        const result_body = {
            ldg_loc : det.ldg_loc,
            ldg_part : det.ldg_part,
            pt_desc1: det.item.pt_desc1,        
            pt_um: det.item.pt_um,
            ldg_qty_oh: det.ldg_qty_oh,
            ldg_lot   : det.ldg_lot,
            ldg_site : det.ldg_site,
            ldg_ref : det.ldg_ref
          
          
          };
          rest = rest - det.ldg_qty_oh
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

    logger.debug("Calling update one  locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const {id} = req.params
        const locationGlasses = await locationGlassesServiceInstance.update({...req.body,last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: locationGlasses  })
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
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        
        const locationGlassess = await locationGlassesServiceInstance.find({
             ...req.body.obj
                ,
                
                ldg_status: {
                  [Op.ne]: req.body.status
                }
                
              
           ,
        })
        console.log(req.body.obj)
        return res.status(202).json({
            message: "sec",
            data:  locationGlassess ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}


const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  locationGlasses endpoint")
    try {
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const {id} = req.params
        const locationGlasses = await locationGlassesServiceInstance.delete({id})
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
    findStk,
    findByOne,
    findByOneStatus,
    update,
    deleteOne,
    findByAll,
    findOtherStatus,
    findByFifo
}
