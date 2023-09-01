import CustomerService from "../../services/customer"
import DailySalesService from "../../services/dailysales"
import DailySalesAccessoireService from "../../services/dailysales-accessoire"
import SaleShiperService from '../../services/sale-shiper';
import InvoiceOrderService from "../../services/invoice-order"
import AccountReceivableService from "../../services/account-receivable"
import accountShiperService from "../../services/account-shiper"
import costSimulationService from '../../services/cost-simulation';
import itemService from '../../services/item';
import locationDetailService from '../../services/location-details';
import locationAccessoireService from '../../services/location-accessoire';
import locationGlassesService from '../../services/location-glasses';
import GlassesService from '../../services/glasses';
import AccessoireService from '../../services/accessoire';
import PenicheService from '../../services/peniche';
import AccountShiperService from "../../services/account-shiper"
import {  Sequelize } from 'sequelize';


import inventoryTransactionService from '../../services/inventory-transaction';
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import {QueryTypes} from 'sequelize'
import { DATE, Op } from 'sequelize';
import { isNull } from "lodash"


const createdirect = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const saleOrderServiceInstance = Container.get(DailySalesService)
        const saleOrderAccessoireServiceInstance = Container.get(
            DailySalesAccessoireService
        )
        const costSimulationServiceInstance = Container.get(costSimulationService);
        const locationDetailServiceInstance = Container.get(locationAccessoireService);
        const inventoryTransactionServiceInstance = Container.get(inventoryTransactionService);
        const accountShiperServiceInstance = Container.get(AccountShiperService)
        const itemServiceInstance = Container.get(AccessoireService);
        const { saleOrder, saleOrderDetail } = req.body
        const so = await saleOrderServiceInstance.create({...saleOrder,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        const as = await accountShiperServiceInstance.create({as_cust:saleOrder.ds_cust,as_amt: saleOrder.ds__dec01, as_effdate: new Date(),as_ship: so.ds_nbr,as_curr: "DA",as_pay_method:"ES", as_type:"P",created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        
        for (let entry of saleOrderDetail) {
            entry = { ...entry, dsd_nbr: so.ds_nbr, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
            await saleOrderAccessoireServiceInstance.create(entry)
        }

/*kamel*/
console.log(so.ds_nbr)
for (const item of saleOrderDetail) {
    const {  ...remain } = item;
    console.log(remain)
    const sctdet = await costSimulationServiceInstance.findOne({ sct_part: remain.dsd_part, sct_site: remain.dsd_site,  sct_sim: 'STDCG' });
    const pt = await itemServiceInstance.findOne({ acs_part: remain.dsd_part });
    console.log(remain.dsd_part, remain.dsd_site)
    
    console.log(remain.qty_oh)
    console.log(sctdet.sct_cst_tot)
    await inventoryTransactionServiceInstance.create({
      tr_status: remain.dsd_status,
      tr_expire: remain.dsd_expire,
      tr_line: remain.dsd_line,
      tr_part: remain.dsd_part,
      tr_prod_line: pt.pt_prod_line,
      tr_qty_loc: - Number(remain.dsd_qty_ship),
      tr_um: remain.dsd_um,
      tr_um_conv: remain.dsd_um_conv,
      tr_ship_type: remain.dsd_type,
      tr_price: remain.dsd_price,
      tr_site: remain.dsd_site,
      tr_loc: remain.dsd_loc,
      tr_serial: remain.dsd_serial,
      tr_nbr: so.ds_nbr,
      tr_lot: null,
      tr_addr: so.ds_cust,
      tr_effdate: so.ds_ord_date,
      tr_ds_job: null,
      tr_curr: so.ds_curr,
      tr_ex_rate: so.ds_ex_rate,
      tr_ex_rate2: so.ds_ex_rate2,
      tr_rmks: so.ds_rmks,
      tr_type:'ISS-SO',
      tr_qty_chg:  Number(remain.dsd_qty_ord),
      tr_loc_begin: Number(remain.qty_oh),
      tr_gl_amt: Number(remain.dsd_qty_ord) * (sctdet.sct_cst_tot),
      tr_date: new Date(),
      tr_mtl_std: sctdet.sct_mtl_tl,
      tr_lbr_std: sctdet.sct_lbr_tl, 
      tr_bdn_std: sctdet.sct_bdn_tl, 
      tr_ovh_std: sctdet.sct_ovh_tl,
      tr_sub_std: sctdet.sct_sub_tl,
      created_by:user_code,created_ip_adr: req.headers.origin,
      last_modified_by:user_code,last_modified_ip_adr: req.headers.origin
      });
      
      if(remain.dsd_type != 'M') {
      const ld = await locationDetailServiceInstance.findOne({lda_part: remain.dsd_part, lda_lot: remain.dsd_serial, lda_site: remain.dsd_site,lda_loc: remain.dsd_loc})
      if(ld) await locationDetailServiceInstance.update({lda_qty_oh : Number(ld.lda_qty_oh) - (Number(remain.dsd_qty_ord)* Number(remain.dsd_um_conv)), lda_expire: remain.dsd_expire, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ld.id})
      else await locationDetailServiceInstance.create({lda_part: remain.dsd_part,lda_date: new Date(), lda_lot:remain.dsd_serial, lda_site: remain.dsd_site,lda_loc: remain.dsd_loc, lda_qty_oh : - (Number(remain.dsd_qty_ord)* Number(remain.dsd_um_conv)), lda_expire: remain.dsd_expire, lda_status: remain.dsd_status, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
      }
  }

/*kamel*/


        return res
            .status(201)
            .json({ message: "created succesfully", data: so })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all purchaseOrder endpoint")
    try {
        const saleOrderServiceInstance = Container.get(DailySalesService)
        const saleOrderDetailServiceInstance = Container.get(
            SaleOrderDetailService
        )
        const saleOrder = await saleOrderServiceInstance.findOne({
            ...req.body,
        })
        if (saleOrder) {
            const details = await saleOrderDetailServiceInstance.find({
                sod_nbr: saleOrder.ds_nbr,
            })
            return res.status(200).json({
                message: "fetched succesfully",
                data: { saleOrder, details },
            })
        } else {
            return res.status(202).json({
                message: "not FOund",
                data: { saleOrder:null, details: null },
            })
        }
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findDetail = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all purchaseOrder endpoint")
    try {
        const saleOrderServiceInstance = Container.get(DailySalesService)
        const saleOrderAccessoireServiceInstance = Container.get(
            DailySalesAccessoireService
        )
        const saleOrder = await saleOrderServiceInstance.findOne({
            ...req.body,
        })
        if (saleOrder) {
            const detailsacs = await saleOrderAccessoireServiceInstance.find({
                dsd_nbr: saleOrder.ds_nbr,
            })
            let result = []
            var i = 1
            for (let ac of detailsacs) {
                let obj = {
                    id: i,
                    nbr  : saleOrder.ds_nbr,
                    type : "Accessoire",
                    desc : ac.accessoire.acs_desc1,
                    price: ac.dsd_sales_price,
                    oeil: ""
                }
                result.push(obj)
                i = i + 1
            }
            console.log(result)
            return res.status(200).json({
                message: "fetched succesfully",
                data:  result ,
            })

        } else {
            return res.status(202).json({
                message: "not FOund",
                data: { saleOrder:null, details: null },
            })
        }
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  saleOrder endpoint")
    try {
        const saleOrderServiceInstance = Container.get(DailySalesService)
        const { id } = req.params
        const saleOrder = await saleOrderServiceInstance.findOne({ id })
        const saleOrderAccessoireServiceInstance = Container.get(
            DailySalesAccessoireService
        )

        
        const detailsacs = await saleOrderAccessoireServiceInstance.find({
            dsd_nbr: saleOrder.ds_nbr,
        })

        return res.status(200).json({
            message: "fetched succesfully",
            data: { saleOrder, detailsacs },
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findByAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all requisition endpoint")
    try {
        const saleOrderServiceInstance = Container.get(DailySalesService)
        
        const sos = await saleOrderServiceInstance.findadd({...req.body })
            // Will escape title and validate DESC against a list of valid direction parameters
            
        //console.log(sos)    
        return res.status(202).json({
            message: "sec",
            data:  sos ,
        })
        
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all purchaseOrder endpoint")
    try {
        let result = []
        const saleOrderServiceInstance = Container.get(DailySalesService)
        const saleOrderDetailServiceInstance = Container.get(
            DailySalesAccessoireService
        )
        const sos = await saleOrderServiceInstance.find({})
        for(const so of sos){
            const details = await saleOrderDetailServiceInstance.find({
                dsd_nbr: so.ds_nbr,
            })
            result.push({id:so.id, so, details})
    
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

    logger.debug("Calling update one  inventoryStatus endpoint")
    try {
        const saleOrderServiceInstance = Container.get(DailySalesService)
        const saleOrderDetailServiceInstance = Container.get(
            DailySalesAccessoireService
        )
        const { id } = req.params
        const {saleOrder, saleOrderDetail} = req.body
        console.log(id)
        const so = await saleOrderServiceInstance.update(
            { ...saleOrder , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},
            { id }
        )
        console.log(saleOrder.ds_nbr)
        await saleOrderDetailServiceInstance.delete({dsd_nbr: saleOrder.ds_nbr})
        for (let entry of saleOrderDetail) {
            entry = { ...entry, dsd_nbr: saleOrder.ds_nbr, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
            await saleOrderDetailServiceInstance.create(entry)
        }
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: so })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const updateSo = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling update one  project endpoint")
    try {
        const saleOrderServiceInstance = Container.get(DailySalesService)
        const { id } = req.params
        
        const So = await saleOrderServiceInstance.update(
            { ...req.body , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},
            { id }
        )
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: So })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findAllwithDetails = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const sequelize = Container.get("sequelize")

    logger.debug("Calling find all purchaseOrder endpoint")
    try {
        let result = []
        //const saleOrderServiceInstance = Container.get(PurchaseOrderService)

        const sos =await sequelize.query("SELECT *  FROM   PUBLIC.ds_mstr, PUBLIC.pt_mstr, PUBLIC.sod_det  where PUBLIC.sod_det.sod_nbr = PUBLIC.ds_mstr.ds_nbr and PUBLIC.sod_det.sod_part = PUBLIC.pt_mstr.pt_part ORDER BY PUBLIC.sod_det.id DESC", { type: QueryTypes.SELECT });
       
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: sos })
            
            
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    } 
}

export default {
    createdirect,
    findBy,
    findDetail,
    findByAll,
    findOne,
    findAll,
    update,
    updateSo,
    findAllwithDetails,
 
}
