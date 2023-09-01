import CustomerService from "../../services/customer"
import SaleOrderService from "../../services/saleorder"
import SaleOrderDetailService from "../../services/saleorder-detail"
import SaleOrderGlassesService from "../../services/saleorder-glasses"
import SaleOrderAccessoireService from "../../services/saleorder-accessoire"
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
import VisiteService from "../../services/visite"
import CodeService from "../../services/code"

import inventoryTransactionService from '../../services/inventory-transaction';
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import {QueryTypes} from 'sequelize'
import { DATE, Op } from 'sequelize';
import { isNull } from "lodash"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const locationDetailServiceInstance = Container.get(locationDetailService);
        const locationAccessoireServiceInstance = Container.get(locationAccessoireService);
        const locationGlassesServiceInstance = Container.get(locationGlassesService);
        const costSimulationServiceInstance = Container.get(costSimulationService);
        const inventoryTransactionServiceInstance = Container.get(inventoryTransactionService);
        const itemServiceInstance = Container.get(itemService);
        const glassesServiceInstance = Container.get(GlassesService);
        const accessoireServiceInstance = Container.get(AccessoireService);
        const penicheServiceInstance = Container.get(PenicheService);
        const customerServiceInstance = Container.get(CustomerService);
        const accountShiperServiceInstance = Container.get(AccountShiperService)
       
        const saleOrderDetailServiceInstance = Container.get(
            SaleOrderDetailService
        )
        const saleOrderGlassesServiceInstance = Container.get(
            SaleOrderGlassesService
        )
        const saleOrderAccessoireServiceInstance = Container.get(
            SaleOrderAccessoireService
        )
        const { saleOrder, saleOrderDetail, saleOrderGlasses, saleOrderAccessoire } = req.body
       
        const pen = await penicheServiceInstance.findOne({ pen_used: false, pen_nbr : null });
        if (pen) await penicheServiceInstance.update({pen_used : true, pen_nbr: saleOrder.so_nbr, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: pen.id})
        let open = true
        if(Number(saleOrder.so__dec01) - Number(saleOrder.so__dec02) <= 0 ) {
            open = false  
        }
        const so = await saleOrderServiceInstance.create({...saleOrder,so__log01: open, so_stat: "O", so_ord_date: new Date(), so_fob: pen.pen_pen,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        await penicheServiceInstance.update({pen_used : true, pen_nbr: so.so_nbr, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: pen.id})
    
        //  const cm = await customerServiceInstance.findOne({cm_addr: saleOrder.so_cust})
        //if(cm) await customerServiceInstance.update({cm_balance : Number(cm.cm_balance) - Number(saleOrder.so__dec01)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: cm.id})
        // const as = await accountShiperServiceInstance.create({
            
        //     as_ship : saleOrder.so_nbr,
        //     as_cust : saleOrder.so_cust,
        //     as_curr : "DA",
        //     as_effdate : saleOrder.so_ord_date,
        //     as_type : "P",
        //     as_pay_method : saleOrder.so_cr_terms,
        //     as_amt : saleOrder.so__dec02,
        //     as_applied : saleOrder.so__dec02,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
       // const cm = await customerServiceInstance.findOne({cm_addr: req.body.as_cust})
       // if(cm) await customerServiceInstance.update({cm_balance : Number(cm.cm_balance) + Number(req.body.as_amt)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: cm.id})
        
          //if(!isNull(saleOrder.so_fob)) {
               
          //}     
          const cm = await customerServiceInstance.findOne({cm_addr: saleOrder.so_cust})
        if(cm) await customerServiceInstance.update({cm_balance : Number(cm.cm_balance) + Number(saleOrder.so__dec01)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: cm.id})
       
        if (saleOrderDetail.length > 0) {
            for (let entry of saleOrderDetail) {
                entry = { ...entry, sod_nbr: so.so_nbr,sod_due_date: so.so_ord_date,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
                await saleOrderDetailServiceInstance.create(entry)
           
            }
            /**********************stk*************************/
            for (const item of saleOrderDetail) {
                const {  ...remain } = item;
                console.log(remain)
                const sctdet = await costSimulationServiceInstance.findOne({ sct_part: remain.sod_part, sct_site: remain.sod_site,  sct_sim: 'STDCG' });
                const pt = await itemServiceInstance.findOne({ pt_part: remain.sod_part });
                console.log(remain.sod_part, remain.sod_site)
                
                console.log(remain.qty_oh)
                console.log(sctdet.sct_cst_tot)
                await inventoryTransactionServiceInstance.create({
                  tr_status: remain.sod_status,
                  tr_expire: remain.sod_expire,
                  tr_line: remain.sod_line,
                  tr_part: remain.sod_part,
                  tr_prod_line: pt.pt_prod_line,
                  tr_qty_loc: - Number(remain.sod_qty_ship),
                  tr_um: remain.sod_um,
                  tr_um_conv: remain.sod_um_conv,
                  tr_ship_type: remain.sod_type,
                  tr_price: remain.sod_price,
                  tr_site: remain.sod_site,
                  tr_loc: remain.sod_loc,
                  tr_serial: remain.sod_serial,
                  tr_nbr: so.so_nbr,
                  tr_lot: null,
                  tr_addr: so.so_cust,
                  tr_effdate: so.so_ord_date,
                  tr_so_job: null,
                  tr_ref: remain.sod_ref,
                  tr_curr: so.so_curr,
                  tr_ex_rate: so.so_ex_rate,
                  tr_ex_rate2: so.so_ex_rate2,
                  tr_rmks: so.so_rmks,
                  tr_type:'ISS-SO',
                  tr_qty_chg:  Number(remain.sod_qty_ord),
                  tr_loc_begin: Number(remain.qty_oh),
                  tr_gl_amt: Number(remain.sod_qty_ord) * (sctdet.sct_cst_tot),
                  tr_date: new Date(),
                  tr_mtl_std: sctdet.sct_mtl_tl,
                  tr_lbr_std: sctdet.sct_lbr_tl, 
                  tr_bdn_std: sctdet.sct_bdn_tl, 
                  tr_ovh_std: sctdet.sct_ovh_tl,
                  tr_sub_std: sctdet.sct_sub_tl,
                  created_by:user_code,created_ip_adr: req.headers.origin,
                  last_modified_by:user_code,last_modified_ip_adr: req.headers.origin
                  });
                  
                  if(remain.sod_type != 'M') {
                  const ld = await locationDetailServiceInstance.findOne({ld_part: remain.sod_part, ld_lot: remain.sod_serial, ld_site: remain.sod_site,ld_loc: remain.sod_loc,ld_ref: remain.sod_ref})
                  if(ld) {await locationDetailServiceInstance.update({ld_qty_oh : Number(ld.ld_qty_oh) - (Number(remain.sod_qty_ord)* Number(remain.sod_um_conv)), ld_expire: remain.sod_expire, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ld.id})
                 console.log("rani hnnnnnnnnnnnnnnnnnnnnnnnald.ld_qty_oh") 
                 }else await locationDetailServiceInstance.create({ld_part: remain.sod_part,ld_date: new Date(), ld_lot:remain.sod_serial, ld_site: remain.sod_site,ld_loc: remain.sod_loc, ld_ref: remain.sod_ref, ld_qty_oh : - (Number(remain.sod_qty_ord)* Number(remain.sod_um_conv)), ld_expire: remain.sod_expire, ld_status: remain.sod_status, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
                  }
              }
            
            /**********************stk*************************/
       }    
       if (saleOrderGlasses.length > 0) {
       
            for (let entry of saleOrderGlasses) {
                const pt = await glassesServiceInstance.findOne({ gls_part: entry.sodg_part });
                            
                entry = { ...entry, sodg_for: pt.gls_vend,sodg_due_date: so.so_ord_date,sodg_nbr: so.so_nbr,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
                await saleOrderGlassesServiceInstance.create(entry)
            }

                        /**********************stk*************************/
                        for (const item of saleOrderGlasses) {
                            const {  ...remain } = item;
                            console.log(remain)
                            const sctdet = await costSimulationServiceInstance.findOne({ sct_part: remain.sodg_part, sct_site: remain.sodg_site,  sct_sim: 'STDCG' });
                            const pt = await glassesServiceInstance.findOne({ gls_part: remain.sodg_part });
                            console.log(remain.sodg_part, remain.sodg_site)
                            
                            console.log(remain.qty_oh)
                            console.log(sctdet.sct_cst_tot)
                            await inventoryTransactionServiceInstance.create({
                              tr_status: remain.sodg_status,
                              tr_expire: remain.sodg_expire,
                              tr_line: remain.sodg_line,
                              tr_part: remain.sodg_part,
                              tr_prod_line: pt.pt_prod_line,
                              tr_qty_loc: - Number(remain.sodg_qty_ord),
                              tr_um: remain.sodg_um,
                              tr_um_conv: remain.sodg_um_conv,
                              tr_ship_type: remain.sodg_type,
                              tr_price: remain.sodg_price,
                              tr_site: remain.sodg_site,
                              tr_loc: remain.sodg_loc,
                              tr_serial: remain.sodg_serial,
                              tr_dec01: remain.sodg_cyl,
                              tr_dec02: remain.sodg_sph,
                              tr_dec03: remain.sodg_add,
                              tr_nbr: so.so_nbr,
                              tr_lot: null,
                              tr_addr: so.so_cust,
                              tr_effdate: so.so_ord_date,
                              tr_so_job: null,
                              tr_ref: remain.sodg_ref,
                              tr_curr: so.so_curr,
                              tr_ex_rate: so.so_ex_rate,
                              tr_ex_rate2: so.so_ex_rate2,
                              tr_rmks: so.so_rmks,
                              tr_type:'ISS-SO',
                              tr_qty_chg:  Number(remain.sodg_qty_ord),
                              tr_loc_begin: Number(remain.qtyoh),
                              tr_gl_amt: Number(remain.sodg_qty_ord) * (sctdet.sct_cst_tot),
                              tr_date: new Date(),
                              tr_mtl_std: sctdet.sct_mtl_tl,
                              tr_lbr_std: sctdet.sct_lbr_tl, 
                              tr_bdn_std: sctdet.sct_bdn_tl, 
                              tr_ovh_std: sctdet.sct_ovh_tl,
                              tr_sub_std: sctdet.sct_sub_tl,
                              created_by:user_code,created_ip_adr: req.headers.origin,
                              last_modified_by:user_code,last_modified_ip_adr: req.headers.origin
                              });
                              
                              if(remain.sodg_type != 'M') {
                              const ld = await locationGlassesServiceInstance.findOne({ldg_part: remain.sodg_part, ldg_lot: remain.sodg_serial, ldg_site: remain.sodg_site,ldg_loc: remain.sodg_loc,ldg_ref: remain.sodg_ref, ldg_sph: remain.sodg_sph, ldg_cyl: remain.sodg_cyl, ldg_add: remain.sodg_add })
                              if(ld) await locationGlassesServiceInstance.update({ldg_qty_oh : Number(ld.ldg_qty_oh) - (Number(remain.sodg_qty_ord)* Number(remain.sodg_um_conv)), ldg_expire: remain.sodg_expire, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ld.id})
                              else await locationGlassesServiceInstance.create({ldg_part: remain.sodg_part,ldg_date: new Date(), ldg_lot:remain.sodg_serial, ldg_site: remain.sodg_site,ldg_loc: remain.sodg_loc, ldg_ref: remain.sodg_ref, ldg_qty_oh : - (Number(remain.sodg_qty_ord)* Number(remain.sodg_um_conv)), ldg_expire: remain.sodg_expire, ldg_status: remain.sodg_status, ldg_sph: remain.sodg_sph, ldg_cyl: remain.sodg_cyl, ldg_add: remain.sodg_add, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
                              }
                          }
                        
                        /**********************stk*************************/
        }
        if (saleOrderAccessoire.length > 0) {
            for (let entry of saleOrderAccessoire) {
                entry = { ...entry, soda_nbr: so.so_nbr,soda_due_date: so.so_ord_date,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
                await saleOrderAccessoireServiceInstance.create(entry)
            }
             /**********************stk*************************/
             for (const item of saleOrderAccessoire) {
                const {  ...remain } = item;
                console.log(remain)
                const sctdet = await costSimulationServiceInstance.findOne({ sct_part: remain.soda_part, sct_site: remain.soda_site,  sct_sim: 'STDCG' });
                const pt = await accessoireServiceInstance.findOne({ acs_part: remain.soda_part });
                console.log(remain.soda_part, remain.soda_site)
                
                console.log(remain.qty_oh)
                console.log(sctdet.sct_cst_tot)
                await inventoryTransactionServiceInstance.create({
                  tr_status: remain.soda_status,
                  tr_expire: remain.soda_expire,
                  tr_line: remain.soda_line,
                  tr_part: remain.soda_part,
                  tr_prod_line: pt.pt_prod_line,
                  tr_qty_loc: - Number(remain.soda_qty_ord),
                  tr_um: remain.soda_um,
                  tr_um_conv: remain.soda_um_conv,
                  tr_ship_type: remain.soda_type,
                  tr_price: remain.soda_price,
                  tr_site: remain.soda_site,
                  tr_loc: remain.soda_loc,
                  tr_serial: remain.soda_serial,
                  tr_nbr: so.so_nbr,
                  tr_lot: null,
                  tr_addr: so.so_cust,
                  tr_effdate: so.so_ord_date,
                  tr_so_job: null,
                  tr_ref: remain.soda_ref,
                  tr_curr: so.so_curr,
                  tr_ex_rate: so.so_ex_rate,
                  tr_ex_rate2: so.so_ex_rate2,
                  tr_rmks: so.so_rmks,
                  tr_type:'ISS-SO',
                  tr_qty_chg:  Number(remain.soda_qty_ord),
                  tr_loc_begin: Number(remain.qty_oh),
                  tr_gl_amt: Number(remain.soda_qty_ord) * (sctdet.sct_cst_tot),
                  tr_date: new Date(),
                  tr_mtl_std: sctdet.sct_mtl_tl,
                  tr_lbr_std: sctdet.sct_lbr_tl, 
                  tr_bdn_std: sctdet.sct_bdn_tl, 
                  tr_ovh_std: sctdet.sct_ovh_tl,
                  tr_sub_std: sctdet.sct_sub_tl,
                  created_by:user_code,created_ip_adr: req.headers.origin,
                  last_modified_by:user_code,last_modified_ip_adr: req.headers.origin
                  });
                  
                  if(remain.soda_type != 'M') {
                  const ld = await locationAccessoireServiceInstance.findOne({lda_part: remain.soda_part, lda_lot: remain.soda_serial, lda_site: remain.soda_site,lda_loc: remain.soda_loc,lda_ref: remain.soda_ref})
                  if(ld) await locationAccessoireServiceInstance.update({lda_qty_oh : Number(ld.lda_qty_oh) - (Number(remain.soda_qty_ord)* Number(remain.soda_um_conv)), lda_expire: remain.soda_expire, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ld.id})
                  else await locationAccessoireServiceInstance.create({lda_part: remain.soda_part,lda_date: new Date(), lda_lot:remain.soda_serial, lda_site: remain.soda_site,lda_loc: remain.soda_loc, lda_ref: remain.soda_ref, lda_qty_oh : - (Number(remain.soda_qty_ord)* Number(remain.soda_um_conv)), lda_expire: remain.soda_expire, lda_status: remain.soda_status, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
                  }
              }
            
            /**********************stk*************************/
        }    
        return res
            .status(201)
            .json({ message: "created succesfully", data: so })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const createdirect = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const saleOrderAccessoireServiceInstance = Container.get(
            SaleOrderAccessoireService
        )
        const costSimulationServiceInstance = Container.get(costSimulationService);
        const locationDetailServiceInstance = Container.get(locationAccessoireService);
        const inventoryTransactionServiceInstance = Container.get(inventoryTransactionService);
        const accountShiperServiceInstance = Container.get(AccountShiperService)
        const itemServiceInstance = Container.get(AccessoireService);
        const { saleOrder, saleOrderDetail } = req.body
        const so = await saleOrderServiceInstance.create({...saleOrder,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        const as = await accountShiperServiceInstance.create({as_cust:saleOrder.so_cust,as_amt: saleOrder.so__dec01, as_effdate: new Date(),as_ship: so.so_nbr,as_curr: "DA",as_pay_method:"ES", as_type:"P",created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        
        for (let entry of saleOrderDetail) {
            entry = { ...entry, soda_nbr: so.so_nbr, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
            await saleOrderAccessoireServiceInstance.create(entry)
        }

/*kamel*/
console.log(so.so_nbr)
for (const item of saleOrderDetail) {
    const {  ...remain } = item;
    console.log(remain)
    const sctdet = await costSimulationServiceInstance.findOne({ sct_part: remain.soda_part, sct_site: remain.soda_site,  sct_sim: 'STDCG' });
    const pt = await itemServiceInstance.findOne({ acs_part: remain.soda_part });
    console.log(remain.soda_part, remain.soda_site)
    
    console.log(remain.qty_oh)
    console.log(sctdet.sct_cst_tot)
    await inventoryTransactionServiceInstance.create({
      tr_status: remain.soda_status,
      tr_expire: remain.soda_expire,
      tr_line: remain.soda_line,
      tr_part: remain.soda_part,
      tr_prod_line: pt.pt_prod_line,
      tr_qty_loc: - Number(remain.soda_qty_ship),
      tr_um: remain.soda_um,
      tr_um_conv: remain.soda_um_conv,
      tr_ship_type: remain.soda_type,
      tr_price: remain.soda_price,
      tr_site: remain.soda_site,
      tr_loc: remain.soda_loc,
      tr_serial: remain.soda_serial,
      tr_nbr: so.so_nbr,
      tr_lot: null,
      tr_addr: so.so_cust,
      tr_effdate: so.so_ord_date,
      tr_so_job: null,
      tr_curr: so.so_curr,
      tr_ex_rate: so.so_ex_rate,
      tr_ex_rate2: so.so_ex_rate2,
      tr_rmks: so.so_rmks,
      tr_type:'ISS-SO',
      tr_qty_chg:  Number(remain.soda_qty_ord),
      tr_loc_begin: Number(remain.qty_oh),
      tr_gl_amt: Number(remain.soda_qty_ord) * (sctdet.sct_cst_tot),
      tr_date: new Date(),
      tr_mtl_std: sctdet.sct_mtl_tl,
      tr_lbr_std: sctdet.sct_lbr_tl, 
      tr_bdn_std: sctdet.sct_bdn_tl, 
      tr_ovh_std: sctdet.sct_ovh_tl,
      tr_sub_std: sctdet.sct_sub_tl,
      created_by:user_code,created_ip_adr: req.headers.origin,
      last_modified_by:user_code,last_modified_ip_adr: req.headers.origin
      });
      
      if(remain.soda_type != 'M') {
      const ld = await locationDetailServiceInstance.findOne({lda_part: remain.soda_part, lda_lot: remain.soda_serial, lda_site: remain.soda_site,lda_loc: remain.soda_loc})
      if(ld) await locationDetailServiceInstance.update({lda_qty_oh : Number(ld.lda_qty_oh) - (Number(remain.soda_qty_ord)* Number(remain.soda_um_conv)), lda_expire: remain.soda_expire, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ld.id})
      else await locationDetailServiceInstance.create({lda_part: remain.soda_part,lda_date: new Date(), lda_lot:remain.soda_serial, lda_site: remain.soda_site,lda_loc: remain.soda_loc, lda_qty_oh : - (Number(remain.soda_qty_ord)* Number(remain.soda_um_conv)), lda_expire: remain.soda_expire, lda_status: remain.soda_status, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
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
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const saleOrderDetailServiceInstance = Container.get(
            SaleOrderDetailService
        )
        const saleOrder = await saleOrderServiceInstance.findOne({
            ...req.body,
        })
        if (saleOrder) {
            const details = await saleOrderDetailServiceInstance.find({
                sod_nbr: saleOrder.so_nbr,
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
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const saleOrderDetailServiceInstance = Container.get(
            SaleOrderDetailService
        )
        const saleOrderGlassesServiceInstance = Container.get(
            SaleOrderGlassesService
        )
        const saleOrderAccessoireServiceInstance = Container.get(
            SaleOrderAccessoireService
        )
        const saleOrder = await saleOrderServiceInstance.findOne({
            ...req.body,
        })
        if (saleOrder) {
            const details = await saleOrderDetailServiceInstance.find({
                sod_nbr: saleOrder.so_nbr,
            })
            const detailsgls = await saleOrderGlassesServiceInstance.find({
                sodg_nbr: saleOrder.so_nbr,
            })
            const detailsacs = await saleOrderAccessoireServiceInstance.find({
                soda_nbr: saleOrder.so_nbr,
            })
            let result = []
            var i = 1
            for (let mn of details) {
            let obj = {
                id : i,
                nbr  : saleOrder.so_nbr,
                type : "Monture",
                desc : mn.item.pt_desc1,
                price: mn.sod_sales_price,
                oeil: ""
            }
            result.push(obj)
            i = i + 1
            }

            for (let gls of detailsgls) {
                let obj = {
                    id : i,
                    nbr  : saleOrder.so_nbr,
                    type : "Verre",
                    desc : gls.glass.gls_desc1,
                    price: gls.sodg_sales_price,
                    oeil: gls.sodg_contr_id
                }
                result.push(obj)
                i = i + 1
            }
            for (let ac of detailsacs) {
                let obj = {
                    id: i,
                    nbr  : saleOrder.so_nbr,
                    type : "Accessoire",
                    desc : ac.accessoire.acs_desc1,
                    price: ac.soda_sales_price,
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
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const { id } = req.params
        const saleOrder = await saleOrderServiceInstance.findOne({ id })
        const saleOrderDetailServiceInstance = Container.get(
            SaleOrderDetailService
        )
        const saleOrderGlassesServiceInstance = Container.get(
            SaleOrderGlassesService
        )
        const saleOrderAccessoireServiceInstance = Container.get(
            SaleOrderAccessoireService
        )

        const details = await saleOrderDetailServiceInstance.find({
            sod_nbr: saleOrder.so_nbr,
        })
        const detailsgls = await saleOrderGlassesServiceInstance.find({
            sodg_nbr: saleOrder.so_nbr,
        })

        const detailsacs = await saleOrderAccessoireServiceInstance.find({
            soda_nbr: saleOrder.so_nbr,
        })

        return res.status(200).json({
            message: "fetched succesfully",
            data: { saleOrder, details, detailsgls, detailsacs },
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
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        
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
const findByAllAdr = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all requisition endpoint")
    try {
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        
        const sos = await saleOrderServiceInstance.findadd({...req.body })
            // Will escape title and validate DESC against a list of valid direction parameters
 for (let so of sos) {
     so.chr04 = so.address.ad_name
     so.chr05 = so.address.ad_name_control
     }           
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
const findGlsAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all requisition endpoint")
    try {
        const saleOrderGlassesServiceInstance = Container.get(SaleOrderGlassesService)
        const { date,date1,vend } = req.body;
        //const sos = await saleOrderGlassesServiceInstance.findspec(date,date1,vend)
            // Will escape title and validate DESC against a list of valid direction parameters
            
       // console.log(sos)    
        //for(const obj of sos) {
        //   console.log(obj.sodg_part,  obj.sodg_nbr)
        //}
        if (vend == null || vend == "") {
        const sos = await saleOrderGlassesServiceInstance.findSpecial({
            where: {
             // sodg_for: vend,
              sodg_due_date: { [Op.between]: [date, date1] },
            },
            attributes: ['sodg_part', 'sodg_for','sodg_desc', 'sodg_cyl', 'sodg_sph', 'sodg_add', [Sequelize.fn('sum', Sequelize.col('sodg_qty_ord')), 'total_qty']],
            group: ['sodg_part','sodg_for', 'sodg_desc','sodg_cyl', 'sodg_sph', 'sodg_add'],
            raw: true,
          });
          console.log(sos)
          return res.status(202).json({
              message: "sec",
              data:  sos ,
          })
        }else {
            const sos = await saleOrderGlassesServiceInstance.findSpecial({
                where: {
                  sodg_for: vend,
                  sodg_due_date: { [Op.between]: [date, date1] },
                },
                attributes: ['sodg_part', 'sodg_for','sodg_desc', 'sodg_cyl', 'sodg_sph', 'sodg_add', [Sequelize.fn('sum', Sequelize.col('sodg_qty_ord')), 'total_qty']],
                group: ['sodg_part','sodg_for', 'sodg_desc','sodg_cyl', 'sodg_sph', 'sodg_add'],
                raw: true,
              });
              console.log(sos)
              return res.status(202).json({
                  message: "sec",
                  data:  sos ,
              })
        }
        
        
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findrange = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all purchaseOrder endpoint")
    try {
        let result = []
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const { date,date1 } = req.body;
        
        const sos = await saleOrderServiceInstance.findspec({
          
              so_ord_date: { [Op.between]: [date, date1] },
                    //  attributes: ['sodg_part', 'sodg_for','sodg_desc', 'sodg_cyl', 'sodg_sph', 'sodg_add', [Sequelize.fn('sum', Sequelize.col('sodg_qty_ord')), 'total_qty']],
           // group: ['sodg_part','sodg_for', 'sodg_desc','sodg_cyl', 'sodg_sph', 'sodg_add'],
           // raw: true,
          });
         // console.log(sos)
          for ( let so of sos) {
            so.so__chr01 = so.user.usrd_name
          }
           return res
          .status(200)
          .json({ message: "fetched succesfully", data: sos })
    }
    
    
     catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all purchaseOrder endpoint")
    try {
        let result = []
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const saleOrderDetailServiceInstance = Container.get(
            SaleOrderDetailService
        )
        const sos = await saleOrderServiceInstance.find({})
        for(const so of sos){
            const details = await saleOrderDetailServiceInstance.find({
                sod_nbr: so.so_nbr,
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
const findByrange = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all saleOrder endpoint")
    try {
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const saleOrderDetailServiceInstance = Container.get(
            SaleOrderDetailService
        )
        const saleorder = await saleOrderServiceInstance.find({so_cust: {
            [Op.between]: [req.body.cm_addr_1, req.body.cm_addr_2],
          },
          so_ord_date: {
            [Op.between]: [req.body.date_1, req.body.date_2],
          },
        })
        console.log("here",saleorder)  
        const results_head = [];
        const results_body = [];
        
        for (const so of saleorder) {
            const details = await saleOrderDetailServiceInstance.find({
                sod_nbr: so.so_nbr,
                sod_part: {
                    [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
                },
               
            })
            const result_head = {
                
                cm_addr_head : so.so_cust,
                cm_sort_head : so.customer.cm_sort,
              
            }; 
        for (const sod of details) {
            const result_body = {
                so_nbr: so.so_nbr,
                cm_addr_body : so.so_cust,
                cm_sort_body : so.customer.cm_sort,
                sod_part: sod.sod_part,
                pt_desc1: sod.item.pt_desc1,

                sod_line: sod.sod_line,
                sod_um: sod.sod_um,
                sod_qty_ord: sod.sod_qty_ord,
                sod_price: sod.sod_price,
                sod_qty_ship:sod.sod_qty_ship,
              };
              results_body.push( result_body );    
            }
            let bool = false;
            for (var i = 0; i < results_head.length; i++) {
            if (results_head[i].cm_addr_head == so.so_cust) 
            { bool = true}
            }
            if (!bool) { results_head.push(result_head) }
        }console.log(results_body)
        

        return res.status(201).json({ message: 'created succesfully', data: {results_body,results_head} });
        //return res2.status(201).json({ message: 'created succesfully', data: results_body });
    } catch (e) {
      //#
      logger.error('🔥 error: %o', e);
      return next(e);
    }
}
const getActivity = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all customer endpoint")
    try {
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const saleShiperServiceInstance = Container.get(SaleShiperService);
        const invoiceOrderServiceInstance = Container.get(InvoiceOrderService)
        const customerServiceInstance = Container.get(CustomerService)
        const accountreceivableServiceInstance = Container.get(AccountReceivableService)
        const accountshiperServiceInstance = Container.get(accountShiperService)
        const customer = await customerServiceInstance.find({cm_addr: 
            {[Op.between]: [req.body.cm_addr_1, req.body.cm_addr_2]},})
            
        const results_head = [];

        for (const cm of customer){
            const accountreceivable = await accountreceivableServiceInstance.find({ar_cust:
                cm.cm_addr,
                ar_type:{[Op.eq]:'p'},
                ar_effdate:{[Op.between]: [req.body.date, new Date()]},})

            
            let paid_amt = 0;
            for(const ar of accountreceivable){
                paid_amt = paid_amt + Number(ar.ar_amt);

            }
            const accountshiper = await accountshiperServiceInstance.find({as_cust:
                cm.cm_addr,
                as_type:{[Op.eq]:'p'},
                as_effdate:{[Op.between]: [req.body.date, new Date()]},})
            let ship_paid_amt = 0;
            for(const as of accountshiper){
                ship_paid_amt = ship_paid_amt + Number(as.as_amt);
            }
            const saleorder = await saleOrderServiceInstance.find({so_cust: 
                cm.cm_addr,
                so_ord_date: {[Op.between]: [req.body.date_1, req.body.date_2],
              },})
            let ord_amt = 0;
            for(const so of saleorder){
                ord_amt = ord_amt + Number(so.so_amt);
            }  
            const saleshiper = await saleShiperServiceInstance.find({psh_cust: 
                cm.cm_addr,
                psh_ship_date: {[Op.between]: [req.body.date_1, req.body.date_2],
              },})
            let ship_amt = 0;
            for(const psh of saleshiper){
                ship_amt = ship_amt + Number(psh.psh_qty_ship*psh.psh_um_conv*psh.psh_price);
            }  
            const invoice = await invoiceOrderServiceInstance.find({ih_cust: 
                cm.cm_addr,
                ih_inv_date: {[Op.between]: [req.body.date_1, req.body.date_2],
              },})
            let inv_amt = 0;
            for(const ih of invoice){
                inv_amt = inv_amt + Number(ih.ih_amt);
            }  



            const result_head = {
                cm_addr_head    : cm.cm_addr,
                cm_sort_head    : cm.cm_sort,
                cm_ord_amt      : ord_amt,
                cm_ship_amt     : ship_amt,
                cm_inv_amt      : inv_amt,
                cm_paid_amt     : paid_amt,
                cm_ship_paid_amt: ship_paid_amt,

            };
            console.log(result_head)
                
            results_head.push(result_head);    
        };
        

        return res
            .status(200)
            .json({ message: "fetched succesfully", data: results_head })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const getCA = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all customer endpoint")
    try {
        const invoiceOrderServiceInstance = Container.get(InvoiceOrderService)
        const customerServiceInstance = Container.get(CustomerService)
        
        const customer = await customerServiceInstance.find({cm_addr: 
            {[Op.between]: [req.body.cm_addr_1, req.body.cm_addr_2]},})
            
        const results_head = [];

        for (const cm of customer){
            const invoice = await invoiceOrderServiceInstance.find({ih_cust: 
                cm.cm_addr,
                ih_inv_date: {[Op.between]: [req.body.date_1, req.body.date_2],
              },})
            let ht_amt = 0;
            let tva_amt = 0;
            let tf_amt = 0;
            let ttc_amt= 0;
            for(const ih of invoice){
                ht_amt = ht_amt + Number(ih.ih_amt);
                tva_amt= tva_amt + Number(ih.ih_tax_amt);
                tf_amt = tf_amt + Number(ih.ih_trl1_amt);
                ttc_amt = ttc_amt + ht_amt + tva_amt + tf_amt;
            }  
            



            const result_head = {
                cm_addr_head    : cm.cm_addr,
                cm_sort_head    : cm.cm_sort,
                cm_ht_amt       : ht_amt,
                cm_tva_amt      : tva_amt,
                cm_tf_amt       : tf_amt,
                cm_ttc_amt      : ttc_amt,
        
            };
            console.log(result_head)
                
            results_head.push(result_head);    
        };
        

        return res
            .status(200)
            .json({ message: "fetched succesfully", data: results_head })
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
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const saleOrderDetailServiceInstance = Container.get(
            SaleOrderDetailService
        )
        const { id } = req.params
        const {saleOrder, saleOrderDetail} = req.body
        console.log(id)
        const so = await saleOrderServiceInstance.update(
            { ...saleOrder , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},
            { id }
        )
        console.log(saleOrder.so_nbr)
        await saleOrderDetailServiceInstance.delete({sod_nbr: saleOrder.so_nbr})
        for (let entry of saleOrderDetail) {
            entry = { ...entry, sod_nbr: saleOrder.so_nbr, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
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
        const saleOrderServiceInstance = Container.get(SaleOrderService)
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

        const sos =await sequelize.query("SELECT *  FROM   PUBLIC.so_mstr, PUBLIC.pt_mstr, PUBLIC.sod_det  where PUBLIC.sod_det.sod_nbr = PUBLIC.so_mstr.so_nbr and PUBLIC.sod_det.sod_part = PUBLIC.pt_mstr.pt_part ORDER BY PUBLIC.sod_det.id DESC", { type: QueryTypes.SELECT });
       
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: sos })
            
            
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    } 
}
const findcustca = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all customer endpoint")
    try {
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const customerServiceInstance = Container.get(CustomerService)
        const visiteServiceInstance = Container.get(VisiteService)
        
        const customer = await customerServiceInstance.find({})
            
        const results_head = [];
        var i = 1
        for (const cm of customer){
            const invoice = await saleOrderServiceInstance.find({so_cust: 
                cm.cm_addr,
                so_ord_date: {[Op.between]: [req.body.date, req.body.date1],
              },})
            let ht_amt = 0;
            let ttc_amt= 0;
            for(const ih of invoice){
                ht_amt = ht_amt + Number(ih.so_amt);
                ttc_amt = ttc_amt + Number(ih.so__dec01);;
            }  
            
            const visite = await visiteServiceInstance.count({vis_cust: 
                cm.cm_addr,
                vis_ord_date: {[Op.between]: [req.body.date, req.body.date1],
              },})
            
             var today = new Date()

             var calc_age = Number(today.getFullYear()) - Number((new Date(cm.cm_mod_date)).getFullYear())
            
                const result_head = {
                    id         : i,
                    code       : cm.cm_addr,
                    name       : cm.address.ad_name,
                    prenom     : cm.address.ad_name_control,
                    solde      : cm.cm_balance,
                    age        : calc_age,
                    caht       : ht_amt,
                    ca         : ttc_amt,
                    nbr        : visite,
            
                };
             
          //  console.log(result_head)
            if (visite != 0) {  
                results_head.push(result_head);    
                i = i + 1;
            }
        };
       // console.log(results_head)

        return res
            .status(200)
            .json({ message: "fetched succesfully", data: results_head })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findsodDetail = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all saleOrder endpoint")
    try {
        const glassesServiceInstance = Container.get(GlassesService)
        const codeServiceInstance = Container.get(CodeService)
        
        const saleOrderGlassesServiceInstance = Container.get(
            SaleOrderGlassesService
        )
        const saleorder = await saleOrderGlassesServiceInstance.findSpecial({
            where: {
                
                sodg_due_date: { [Op.between]: [req.body.date, req.body.date1] },
              },
        })
       // console.log(saleorder)
       let result =[]
       var i = 1
        for (const so of saleorder) {
            const effdate = new Date(so.sodg_due_date)   
            so.sodg_due_date = effdate.getUTCFullYear() + "-" + (effdate.getUTCMonth() + 1) + "-" + effdate.getUTCDate();
            const glass = await glassesServiceInstance.findOne({gls_part : so.sodg_part})
            const typstk = await codeServiceInstance.findOne({code_fldname: "gls_rev" , code_value: glass.gls_rev})
            const parttype = await codeServiceInstance.findOne({code_fldname: "gls_part_type" , code_value: glass.gls_part_type})
            const famille = await codeServiceInstance.findOne({code_fldname: "gls_draw" , code_value: glass.gls_draw})
            const sfamille = await codeServiceInstance.findOne({code_fldname: "gls_dsgn_grp" , code_value: glass.gls_dsgn_grp})
            const mrk = await codeServiceInstance.findOne({code_fldname: "gls_group" , code_value: glass.gls_group})
            const trt = await codeServiceInstance.findOne({code_fldname: "gls_upc" , code_value: glass.gls_upc})
            const color = await codeServiceInstance.findOne({code_fldname: "gls_promo" , code_value: glass.gls_promo})
            
//console.log(parttype)
            result.push({id:i, nbr: so.sodg_nbr, effdate: so.sodg_due_date,part: so.sodg_part, desc : glass.gls_desc1, qty: so.sodg_qty_ord, amt: so.sodg_sales_price,
                         typestk:typstk.code_cmmt,typepart: parttype.code_cmmt,famille:famille.code_cmmt,sfamille:sfamille.code_cmmt,
                        mark: mrk.code_cmmt, trait : trt.code_cmmt, col: color.code_cmmt,
                        diam: glass.gls_size, indice : glass.gls_net_wt,
                        cyl: so.sodg_cyl, sph: so.sodg_sph, add: so.sodg_add
                        })
        //console.log(so)
        i = i + 1 
        
        }

        return res.status(201).json({ message: 'created succesfully', data: result});
        //return res2.status(201).json({ message: 'created succesfully', data: results_body });
    } catch (e) {
        //#
        logger.error('🔥 error: %o', e);
        return next(e);
    }
}
    

const avoir = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const saleOrderServiceInstance = Container.get(SaleOrderService)
        const locationDetailServiceInstance = Container.get(locationDetailService);
        const locationAccessoireServiceInstance = Container.get(locationAccessoireService);
        const locationGlassesServiceInstance = Container.get(locationGlassesService);
        const costSimulationServiceInstance = Container.get(costSimulationService);
        const inventoryTransactionServiceInstance = Container.get(inventoryTransactionService);
        const itemServiceInstance = Container.get(itemService);
        const glassesServiceInstance = Container.get(GlassesService);
        const accessoireServiceInstance = Container.get(AccessoireService);
        const customerServiceInstance = Container.get(CustomerService);
        const accountShiperServiceInstance = Container.get(AccountShiperService)
       
        const saleOrderDetailServiceInstance = Container.get(
            SaleOrderDetailService
        )
        const saleOrderGlassesServiceInstance = Container.get(
            SaleOrderGlassesService
        )
        const saleOrderAccessoireServiceInstance = Container.get(
            SaleOrderAccessoireService
        )
        const { saleOrder, saleOrderDetail, saleOrderGlasses, saleOrderAccessoire } = req.body
       
        
        let open = true
        if(Number(saleOrder.so__dec01) - Number(saleOrder.so__dec02) <= 0 ) {
            open = false  
        }
        const so = await saleOrderServiceInstance.create({...saleOrder,so__log01: open, so__qadl01:true,so_ord_date: new Date(),created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        
        //  const cm = await customerServiceInstance.findOne({cm_addr: saleOrder.so_cust})
        //if(cm) await customerServiceInstance.update({cm_balance : Number(cm.cm_balance) - Number(saleOrder.so__dec01)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: cm.id})
        // const as = await accountShiperServiceInstance.create({
            
        //     as_ship : saleOrder.so_nbr,
        //     as_cust : saleOrder.so_cust,
        //     as_curr : "DA",
        //     as_effdate : saleOrder.so_ord_date,
        //     as_type : "P",
        //     as_pay_method : saleOrder.so_cr_terms,
        //     as_amt : saleOrder.so__dec02,
        //     as_applied : saleOrder.so__dec02,created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
       // const cm = await customerServiceInstance.findOne({cm_addr: req.body.as_cust})
       // if(cm) await customerServiceInstance.update({cm_balance : Number(cm.cm_balance) + Number(req.body.as_amt)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: cm.id})
        
          //if(!isNull(saleOrder.so_fob)) {
               
          //}     
          const cm = await customerServiceInstance.findOne({cm_addr: saleOrder.so_cust})
        if(cm) await customerServiceInstance.update({cm_balance : Number(cm.cm_balance) + Number(saleOrder.so__dec01)  , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: cm.id})
       
        if (saleOrderDetail.length > 0) {
            for (let entry of saleOrderDetail) {
                entry = { ...entry, sod_nbr: so.so_nbr,sod_due_date: so.so_ord_date, sod_qty_ord: - Number(entry.sod_ord_qty),created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
                await saleOrderDetailServiceInstance.create(entry)
           
            }
            /**********************stk*************************/
            for (const item of saleOrderDetail) {
                const {  ...remain } = item;
                console.log(remain)
                const sctdet = await costSimulationServiceInstance.findOne({ sct_part: remain.sod_part, sct_site: remain.sod_site,  sct_sim: 'STDCG' });
                const pt = await itemServiceInstance.findOne({ pt_part: remain.sod_part });
                console.log(remain.sod_part, remain.sod_site)
                
                console.log(remain.qty_oh)
                console.log(sctdet.sct_cst_tot)
                await inventoryTransactionServiceInstance.create({
                  tr_status: remain.sod_status,
                  tr_expire: remain.sod_expire,
                  tr_line: remain.sod_line,
                  tr_part: remain.sod_part,
                  tr_prod_line: pt.pt_prod_line,
                  tr_qty_loc: - Number(remain.sod_qty_ship),
                  tr_um: remain.sod_um,
                  tr_um_conv: remain.sod_um_conv,
                  tr_ship_type: remain.sod_type,
                  tr_price: remain.sod_price,
                  tr_site: remain.sod_site,
                  tr_loc: remain.sod_loc,
                  tr_serial: remain.sod_serial,
                  tr_nbr: so.so_nbr,
                  tr_lot: null,
                  tr_addr: so.so_cust,
                  tr_effdate: so.so_ord_date,
                  tr_so_job: null,
                  tr_ref: remain.sod_ref,
                  tr_curr: so.so_curr,
                  tr_ex_rate: so.so_ex_rate,
                  tr_ex_rate2: so.so_ex_rate2,
                  tr_rmks: so.so_rmks,
                  tr_type:'ISS-SO',
                  tr_qty_chg:  Number(remain.sod_qty_ord),
                  tr_loc_begin: Number(remain.qty_oh),
                  tr_gl_amt: Number(remain.sod_qty_ord) * (sctdet.sct_cst_tot),
                  tr_date: new Date(),
                  tr_mtl_std: sctdet.sct_mtl_tl,
                  tr_lbr_std: sctdet.sct_lbr_tl, 
                  tr_bdn_std: sctdet.sct_bdn_tl, 
                  tr_ovh_std: sctdet.sct_ovh_tl,
                  tr_sub_std: sctdet.sct_sub_tl,
                  created_by:user_code,created_ip_adr: req.headers.origin,
                  last_modified_by:user_code,last_modified_ip_adr: req.headers.origin
                  });
                  
                  if(remain.sod_type != 'M') {
                  const ld = await locationDetailServiceInstance.findOne({ld_part: remain.sod_part, ld_lot: remain.sod_serial, ld_site: remain.sod_site,ld_loc: remain.sod_loc,ld_ref: remain.sod_ref})
                  if(ld) {await locationDetailServiceInstance.update({ld_qty_oh : Number(ld.ld_qty_oh) - (Number(remain.sod_qty_ord)* Number(remain.sod_um_conv)), ld_expire: remain.sod_expire, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ld.id})
                 console.log("rani hnnnnnnnnnnnnnnnnnnnnnnnald.ld_qty_oh") 
                 }else await locationDetailServiceInstance.create({ld_part: remain.sod_part,ld_date: new Date(), ld_lot:remain.sod_serial, ld_site: remain.sod_site,ld_loc: remain.sod_loc, ld_ref: remain.sod_ref, ld_qty_oh : - (Number(remain.sod_qty_ord)* Number(remain.sod_um_conv)), ld_expire: remain.sod_expire, ld_status: remain.sod_status, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
                  }
              }
            
            /**********************stk*************************/
       }    
       if (saleOrderGlasses.length > 0) {
       
            for (let entry of saleOrderGlasses) {
                const pt = await glassesServiceInstance.findOne({ gls_part: entry.sodg_part });
                            
                entry = { ...entry, sodg_for: pt.gls_vend,sodg_due_date: so.so_ord_date,sodg_nbr: so.so_nbr, sodg_qty_ord: - Number(entry.sodg_ord_qty),created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
                await saleOrderGlassesServiceInstance.create(entry)
            }

                        /**********************stk*************************/
                        for (const item of saleOrderGlasses) {
                            const {  ...remain } = item;
                            console.log(remain)
                            const sctdet = await costSimulationServiceInstance.findOne({ sct_part: remain.sodg_part, sct_site: remain.sodg_site,  sct_sim: 'STDCG' });
                            const pt = await glassesServiceInstance.findOne({ gls_part: remain.sodg_part });
                            console.log(remain.sodg_part, remain.sodg_site)
                            
                            console.log(remain.qty_oh)
                            console.log(sctdet.sct_cst_tot)
                            await inventoryTransactionServiceInstance.create({
                              tr_status: remain.sodg_status,
                              tr_expire: remain.sodg_expire,
                              tr_line: remain.sodg_line,
                              tr_part: remain.sodg_part,
                              tr_prod_line: pt.pt_prod_line,
                              tr_qty_loc: - Number(remain.sodg_qty_ord),
                              tr_um: remain.sodg_um,
                              tr_um_conv: remain.sodg_um_conv,
                              tr_ship_type: remain.sodg_type,
                              tr_price: remain.sodg_price,
                              tr_site: remain.sodg_site,
                              tr_loc: remain.sodg_loc,
                              tr_serial: remain.sodg_serial,
                              tr_dec01: remain.sodg_cyl,
                              tr_dec02: remain.sodg_sph,
                              tr_dec03: remain.sodg_add,
                              tr_nbr: so.so_nbr,
                              tr_lot: null,
                              tr_addr: so.so_cust,
                              tr_effdate: so.so_ord_date,
                              tr_so_job: null,
                              tr_ref: remain.sodg_ref,
                              tr_curr: so.so_curr,
                              tr_ex_rate: so.so_ex_rate,
                              tr_ex_rate2: so.so_ex_rate2,
                              tr_rmks: so.so_rmks,
                              tr_type:'ISS-SO',
                              tr_qty_chg:  Number(remain.sodg_qty_ord),
                              tr_loc_begin: Number(remain.qtyoh),
                              tr_gl_amt: Number(remain.sodg_qty_ord) * (sctdet.sct_cst_tot),
                              tr_date: new Date(),
                              tr_mtl_std: sctdet.sct_mtl_tl,
                              tr_lbr_std: sctdet.sct_lbr_tl, 
                              tr_bdn_std: sctdet.sct_bdn_tl, 
                              tr_ovh_std: sctdet.sct_ovh_tl,
                              tr_sub_std: sctdet.sct_sub_tl,
                              created_by:user_code,created_ip_adr: req.headers.origin,
                              last_modified_by:user_code,last_modified_ip_adr: req.headers.origin
                              });
                              
                              if(remain.sodg_type != 'M') {
                              const ld = await locationGlassesServiceInstance.findOne({ldg_part: remain.sodg_part, ldg_lot: remain.sodg_serial, ldg_site: remain.sodg_site,ldg_loc: remain.sodg_loc,ldg_ref: remain.sodg_ref, ldg_sph: remain.sodg_sph, ldg_cyl: remain.sodg_cyl, ldg_add: remain.sodg_add })
                              if(ld) await locationGlassesServiceInstance.update({ldg_qty_oh : Number(ld.ldg_qty_oh) - (Number(remain.sodg_qty_ord)* Number(remain.sodg_um_conv)), ldg_expire: remain.sodg_expire, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ld.id})
                              else await locationGlassesServiceInstance.create({ldg_part: remain.sodg_part,ldg_date: new Date(), ldg_lot:remain.sodg_serial, ldg_site: remain.sodg_site,ldg_loc: remain.sodg_loc, ldg_ref: remain.sodg_ref, ldg_qty_oh : - (Number(remain.sodg_qty_ord)* Number(remain.sodg_um_conv)), ldg_expire: remain.sodg_expire, ldg_status: remain.sodg_status, ldg_sph: remain.sodg_sph, ldg_cyl: remain.sodg_cyl, ldg_add: remain.sodg_add, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
                              }
                          }
                        
                        /**********************stk*************************/
        }
        if (saleOrderAccessoire.length > 0) {
            for (let entry of saleOrderAccessoire) {
                entry = { ...entry, soda_nbr: so.so_nbr,soda_due_date: so.so_ord_date,sod_qty_ord: - Number(entry.soda_ord_qty),created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
                await saleOrderAccessoireServiceInstance.create(entry)
            }
             /**********************stk*************************/
             for (const item of saleOrderAccessoire) {
                const {  ...remain } = item;
                console.log(remain)
                const sctdet = await costSimulationServiceInstance.findOne({ sct_part: remain.soda_part, sct_site: remain.soda_site,  sct_sim: 'STDCG' });
                const pt = await accessoireServiceInstance.findOne({ acs_part: remain.soda_part });
                console.log(remain.soda_part, remain.soda_site)
                
                console.log(remain.qty_oh)
                console.log(sctdet.sct_cst_tot)
                await inventoryTransactionServiceInstance.create({
                  tr_status: remain.soda_status,
                  tr_expire: remain.soda_expire,
                  tr_line: remain.soda_line,
                  tr_part: remain.soda_part,
                  tr_prod_line: pt.pt_prod_line,
                  tr_qty_loc: - Number(remain.soda_qty_ord),
                  tr_um: remain.soda_um,
                  tr_um_conv: remain.soda_um_conv,
                  tr_ship_type: remain.soda_type,
                  tr_price: remain.soda_price,
                  tr_site: remain.soda_site,
                  tr_loc: remain.soda_loc,
                  tr_serial: remain.soda_serial,
                  tr_nbr: so.so_nbr,
                  tr_lot: null,
                  tr_addr: so.so_cust,
                  tr_effdate: so.so_ord_date,
                  tr_so_job: null,
                  tr_ref: remain.soda_ref,
                  tr_curr: so.so_curr,
                  tr_ex_rate: so.so_ex_rate,
                  tr_ex_rate2: so.so_ex_rate2,
                  tr_rmks: so.so_rmks,
                  tr_type:'ISS-SO',
                  tr_qty_chg:  Number(remain.soda_qty_ord),
                  tr_loc_begin: Number(remain.qty_oh),
                  tr_gl_amt: Number(remain.soda_qty_ord) * (sctdet.sct_cst_tot),
                  tr_date: new Date(),
                  tr_mtl_std: sctdet.sct_mtl_tl,
                  tr_lbr_std: sctdet.sct_lbr_tl, 
                  tr_bdn_std: sctdet.sct_bdn_tl, 
                  tr_ovh_std: sctdet.sct_ovh_tl,
                  tr_sub_std: sctdet.sct_sub_tl,
                  created_by:user_code,created_ip_adr: req.headers.origin,
                  last_modified_by:user_code,last_modified_ip_adr: req.headers.origin
                  });
                  
                  if(remain.soda_type != 'M') {
                  const ld = await locationAccessoireServiceInstance.findOne({lda_part: remain.soda_part, lda_lot: remain.soda_serial, lda_site: remain.soda_site,lda_loc: remain.soda_loc,lda_ref: remain.soda_ref})
                  if(ld) await locationAccessoireServiceInstance.update({lda_qty_oh : Number(ld.lda_qty_oh) - (Number(remain.soda_qty_ord)* Number(remain.soda_um_conv)), lda_expire: remain.soda_expire, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ld.id})
                  else await locationAccessoireServiceInstance.create({lda_part: remain.soda_part,lda_date: new Date(), lda_lot:remain.soda_serial, lda_site: remain.soda_site,lda_loc: remain.soda_loc, lda_ref: remain.soda_ref, lda_qty_oh : - (Number(remain.soda_qty_ord)* Number(remain.soda_um_conv)), lda_expire: remain.soda_expire, lda_status: remain.soda_status, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
                  }
              }
            
            /**********************stk*************************/
        }    
        return res
            .status(201)
            .json({ message: "created succesfully", data: so })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
export default {
    create,
    createdirect,
    findBy,
    findDetail,
    findsodDetail,
    findByAll,
    findByAllAdr,
    findGlsAll,
    findOne,
    findAll,
    findByrange,
    findrange,
    findcustca,
    update,
    updateSo,
    findAllwithDetails,
    getActivity,
    getCA,
    avoir
}
