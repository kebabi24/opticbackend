import GlassesService from "../../services/glasses"
import GlassesDetailService from "../../services/glasses-detail"
import TaxeService from "../../services/taxe"

import GlassesLocationService from "../../services/location-glasses"
import LocationGlassesService from "../../services/location-glasses"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import { DATE, Op, Sequelize } from 'sequelize';
import {QueryTypes} from 'sequelize'
import sequelize from '../../loaders/sequelize';
import { isNull } from "lodash";
const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create glasses endpoint ")
    try {
        const glassesServiceInstance = Container.get(GlassesService)
        const glassesDetailServiceInstance = Container.get(GlassesDetailService)
        const { Glasses, GlassesDetail } = req.body
        const glasses = await glassesServiceInstance.create({...Glasses, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        console.log(GlassesDetail)
        for (let entry of GlassesDetail) {
            entry = { ...entry, glsd_part: Glasses.gls_part, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by: user_code }
            await glassesDetailServiceInstance.create(entry)
        }
        return res
            .status(201)
            .json({ message: "created succesfully", data: { glasses } })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all glasses endpoint")
    try {
        const glassesServiceInstance = Container.get(GlassesService)
        const glassess = await glassesServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: glassess })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all glasses endpoint")
    try {
        const glassesServiceInstance = Container.get(GlassesService)
        const glassess = await glassesServiceInstance.findOne({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: glassess })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  code endpoint")
    try {
        const glassesServiceInstance = Container.get(GlassesService)
        const glassesDetailServiceInstance = Container.get(GlassesDetailService)
        const {id} = req.params
        const glasses = await glassesServiceInstance.findOne({id})
        console.log(glasses.gls_part, "hhhhhhhhhhh")
        const details = await glassesDetailServiceInstance.find({
            glsd_part: glasses.gls_part,
        })
//console.log(details)
        return res.status(200).json({
            message: "fetched succesfully",
            data: { glasses, details },
        })
       
       
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all code endpoint")
    try {
        const glassesServiceInstance = Container.get(GlassesService)
        const codes = await glassesServiceInstance.find({})
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
        const glassesServiceInstance = Container.get(GlassesService)
        
        const codes = await glassesServiceInstance.find({
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
        const glassesServiceInstance = Container.get(GlassesService)
        const locationGlassesServiceInstance = Container.get(LocationGlassesService)
        const glassess = await glassesServiceInstance.find({...req.body})
        console.log(glassess)
        const result = [];
        for (const glasses of glassess) {
            const res = await locationGlassesServiceInstance.findSpecial({
                where: { ldg_part: glasses.gls_part},
                attributes: ['ldg_part', [Sequelize.fn('sum', Sequelize.col('ldg_qty_oh')), 'total']],
            group: ['ldg_part'],
            raw: true,
          });
          
          //accessoires.total_qty = res.total_qty;
          const qty = res[0] ? (res[0].total ? res[0].total : 0) : 0;
         glasses.gls_ord_max = qty
         result.push(glasses)
          
        }
        console.log(glassess)
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

    logger.debug("Calling update one  inventoryStatus endpoint")
    try {
        const glassesServiceInstance = Container.get(GlassesService)
        const glassesDetailServiceInstance = Container.get(
            GlassesDetailService
        )
        const { id } = req.params
        const {glasses, details} = req.body
        const glasse = await glassesServiceInstance.update(
            { ...glasses , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},
            { id }
        )
        await glassesDetailServiceInstance.delete({glsd_part: glasses.gls_part})
        for (let entry of details) {
            entry = { ...entry, glsd_part: glasses.gls_part, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
            await glassesDetailServiceInstance.create(entry)
        }
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: glasse })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAllwithDetails = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const sequelize = Container.get("sequelize")
    
    logger.debug("Calling find all glasses detail endpoint")
    try {
        const glassesServiceInstance = Container.get(GlassesService)
        const glassesDetailServiceInstance = Container.get(GlassesDetailService)
        const glassesLocationServiceInstance = Container.get(GlassesLocationService)
        const taxeServiceInstance = Container.get(TaxeService)
        //console.log(req.body.obj.sph)
        //const saleOrderServiceInstance = Container.get(PurchaseOrderService)
console.log(req.body.obj)

        let A = Number(req.body.obj.sph);
        let B = Number(req.body.obj.cyl);
        let C = (req.body.obj.add);
        let D = Number(A) + Number(B);
        let E = 0 - Number(B);
        let rev = req.body.obj.rev;
  console.log("je suis la",A,B,C,D,E)
  console.log(A + B,  0-B)

  if (rev != "M") {

  if(C != null) {
        //const sos =await sequelize.query("SELECT *  FROM   PUBLIC.gls_mstr,  PUBLIC.ldg_det  where PUBLIC.ldg_det.ldg_part = PUBLIC.gls_mstr.gls_part ", { type: QueryTypes.SELECT });
        const glasses = await glassesDetailServiceInstance.findSpecialgls({
             
                [Op.or]: [{
            glsd_sph_max:    {[Op.gte]: A}, 
            glsd_sph_min: {[Op.lte]: A},

            glsd_cyl_max: {[Op.gte]: B},
            glsd_cyl_min: {[Op.lte]: B},

            glsd_add_max: {[Op.gte]: C},
            glsd_add_min: {[Op.lte]: C},
                   },
                {
            glsd_sph_max:    {[Op.gte]: D}, 
            glsd_sph_min: {[Op.lte]: D},
            glsd_cyl_max: {[Op.gte]: E},
            glsd_cyl_min: {[Op.lte]: E},
            glsd_add_max: {[Op.gte]: C},
            glsd_add_min: {[Op.lte]: C}, 
                 
                },
                
            ]

             ,
           //  raw: true,
          });
          let result= [];
          let obj;
          var i = 1;
          for(let gls of glasses) {
        
            const taxes = await taxeServiceInstance.findOne({tx2_tax_code:gls.glass.gls_taxc })
        
               obj= {
                id : i,
                part :   gls.glsd_part,
                desc :   gls.glass.gls_desc1,
                  um :   gls.glass.gls_um,
                site :   gls.glass.gls_site,
                loc  :   gls.glass.gls_loc,
             taxable :   gls.glass.gls_taxable,
                taxc :   gls.glass.gls_taxc,
           taux_taxe :   taxes.tx2_tax_pct,
                vend :   gls.glass.gls_vend,
                rev  :   gls.glass.gls_rev,
           part_type :   gls.glass.gls_part_type,
                draw :   gls.glass.gls_draw,
            dsgn_grp :   gls.glass.gls_dsgn_grp,
               promo :   gls.glass.gls_promo,
               upc   :   gls.glass.gls_upc,
               price :   gls.glsd_sales_price,
              uprice :   gls.glsd_price,
              rc     :   gls.glass.gls_batch,
              indice :   gls.glass.gls_net_wt,
                 qty :   0,
                 sph :   A,
                 cyl :   B,
                 add :   D, 


               } 
               result.push(obj)
                    i= i + 1;



          }
          console.log("here",result)
          return res
              .status(200)
              .json({ message: "fetched succesfully", data: result })
            
        }
        else {

            const glasses = await glassesDetailServiceInstance.findSpecialgls({
             
                [Op.or]: [{
            glsd_sph_max:    {[Op.gte]: A}, 
            glsd_sph_min: {[Op.lte]: A},

            glsd_cyl_max: {[Op.gte]: B},
            glsd_cyl_min: {[Op.lte]: B},

                   },
                {
            glsd_sph_max:    {[Op.gte]: D}, 
            glsd_sph_min: {[Op.lte]: D},
            glsd_cyl_max: {[Op.gte]: E},
            glsd_cyl_min: {[Op.lte]: E},
                 
                }
            ]

             ,
           //  raw: true,
          });
          console.log(glasses)
          let result= [];
          let obj;
          var i = 1;
          for(let gls of glasses) {
            const taxes = await taxeServiceInstance.findOne({tx2_tax_code:gls.glass.gls_taxc })
               obj= {
                id : i,
                part :   gls.glsd_part,
                desc :   gls.glass.gls_desc1,
                um   :   gls.glass.gls_um,
                site :   gls.glass.gls_site,
                loc  :   gls.glass.gls_loc,
             taxable :   gls.glass.gls_taxable,
                taxc :   gls.glass.gls_taxc,
           taux_taxe :   taxes.tx2_tax_pct,
                vend :   gls.glass.gls_vend,
                rev  :   gls.glass.gls_rev,
           part_type :   gls.glass.gls_part_type,
                draw :   gls.glass.gls_draw,
            dsgn_grp :   gls.glass.gls_dsgn_grp,
               promo :   gls.glass.gls_promo,
               upc   :   gls.glass.gls_upc,
               price :   gls.glsd_sales_price,
              uprice :   gls.glsd_price,
                 qty :   0,
                 sph :   A,
                 cyl :   B,
                 add :   D, 
               } 
               result.push(obj)
                    i= i + 1;



          }
          console.log("here",result)
         
         // console.log("here",glasses)
          return res
              .status(200)
              .json({ message: "fetched succesfully", data: result })
            
        }
    }
    else {

        console.log("rani hnaaaaaaaaaaaaaaaaaaaaaa")
        /*************************************STK*************************************** */
       // console.log(A,B,D,E)
        const glasses = await glassesLocationServiceInstance.findSpecialgls({
             

            [Op.or]: [{
        ldg_sph : A, 
        
        ldg_cyl:  B,

               },
            {
        ldg_sph: D, 
        ldg_cyl:  E,
             
            }
        ]

         ,
       //  raw: true,
      });
      //console.log(glasses[0].glass)
      let result= [];
      let obj;
      var i = 1;
      for(let gls of glasses) {
        const taxes = await taxeServiceInstance.findOne({tx2_tax_code:gls.glass.gls_taxc })
        console.log(gls.ldg_part,gls.ldg_sph,gls.ldg_cyl)
        const item = await glassesDetailServiceInstance.findOne({
            

                glsd_part   : gls.ldg_part,
                glsd_sph_max: {[Op.gte]: gls.ldg_sph}, 
                glsd_sph_min: {[Op.lte]: gls.ldg_sph},
    
                glsd_cyl_max: {[Op.gte]: gls.ldg_cyl},
                glsd_cyl_min: {[Op.lte]: gls.ldg_cyl},
    
           
               //  raw: true,


          })
        //  console.log("item", item)
        var sales_price : 0
        var unprice : 0
        if (item != null) {
            sales_price =   item.glsd_sales_price,
            unprice   =   item.glsd_price
    
        }
           obj= {
            id : i,
            part :   gls.ldg_part,
            desc :   gls.glass.gls_desc1,
            um   :   gls.glass.gls_um,
            site :   gls.glass.gls_site,
            loc  :   gls.glass.gls_loc,
         taxable :   gls.glass.gls_taxable,
            taxc :   gls.glass.gls_taxc,
       taux_taxe :   taxes.tx2_tax_pct,  
            vend :   gls.glass.gls_vend,
            rev  :   gls.glass.gls_rev,
       part_type :   gls.glass.gls_part_type,
            draw :   gls.glass.gls_draw,
        dsgn_grp :   gls.glass.gls_dsgn_grp,
           promo :   gls.glass.gls_promo,
           upc   :   gls.glass.gls_upc,
           price :   sales_price,
        uprice   :   unprice,
             qty :   gls.ldg_qty_oh,
             lot :   gls.ldg_lot,
             sph :   gls.ldg_sph,
             cyl :   gls.ldg_cyl,
             add :   gls.ldg_add, 
          expire :   gls.ldg_expire,


           } 
           result.push(obj)
                i= i + 1;



      }
     // console.log("here",result)
     
     // console.log("here",glasses)
      return res
          .status(200)
          .json({ message: "fetched succesfully", data: result })
        

        /*************************************STK*************************************** */
    }  
            
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    } 
}
const findPriceDetails = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const sequelize = Container.get("sequelize")
    
    logger.debug("Calling find all glasses detail endpoint")
    try {
        const glassesServiceInstance = Container.get(GlassesService)
        const glassesDetailServiceInstance = Container.get(GlassesDetailService)
        let result = []
        //console.log(req.body.obj.sph)
        //const saleOrderServiceInstance = Container.get(PurchaseOrderService)
console.log(req.body.obj)
        let part =  req.body.obj.part
        let A = Number(req.body.obj.sph);
        let B = Number(req.body.obj.cyl);
        console.log(part)
        //const sos =await sequelize.query("SELECT *  FROM   PUBLIC.gls_mstr,  PUBLIC.ldg_det  where PUBLIC.ldg_det.ldg_part = PUBLIC.gls_mstr.gls_part ", { type: QueryTypes.SELECT });
        const glasses = await glassesDetailServiceInstance.find({
            glsd_part: part ,
            glsd_sph_max:    {[Op.gte]: A}, 
            glsd_sph_min: {[Op.lte]: A},

            glsd_cyl_max: {[Op.gte]: B},
            glsd_cyl_min: {[Op.lte]: B},

            

             });
          console.log("here",glasses)
          return res
              .status(200)
              .json({ message: "fetched succesfully", data: glasses })
            
            
            
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
    update,
    findAllwithDetails,
    findPriceDetails
}
