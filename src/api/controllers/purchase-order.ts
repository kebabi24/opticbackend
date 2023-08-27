import PurchaseOrderService from "../../services/purchase-order"
import PurchaseOrderDetailService from "../../services/purchase-order-detail"
import PurchaseReceiveService from '../../services/purchase-receive'
import VoucherOrderService from "../../services/voucher-order"
import AccountPayableService from "../../services/account-payable"
import ProviderService from "../../services/provider"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import {QueryTypes} from 'sequelize'
import { DATE, Op } from 'sequelize';
import ItemService from "../../services/item"
import GlassesService from "../../services/glasses"
import GlassesDetailService from "../../services/glasses-detail"
import PurchaseOrderGlassesService from "../../services/purchase-order-glasses"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
        const purchaseOrderDetailServiceInstance = Container.get(
            PurchaseOrderDetailService
        )
        const { purchaseOrder, purchaseOrderDetail } = req.body
        const po = await purchaseOrderServiceInstance.create({...purchaseOrder, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        for (let entry of purchaseOrderDetail) {
            entry = { ...entry, pod_nbr: po.po_nbr }
            await purchaseOrderDetailServiceInstance.create(entry)
        }
        return res
            .status(201)
            .json({ message: "created succesfully", data: po })
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
        const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
        const purchaseOrderGlassesServiceInstance = Container.get(
            PurchaseOrderGlassesService
        )
        const purchaseOrder = await purchaseOrderServiceInstance.findOne({
            ...req.body,
        })
        if (purchaseOrder) {
            const details = await purchaseOrderGlassesServiceInstance.find({
                podg_nbr: purchaseOrder.po_nbr,
            })
            return res.status(200).json({
                message: "fetched succesfully",
                data: { purchaseOrder, details },
            })
        } else {
            return res.status(404).json({
                message: "not FOund",
                data: { purchaseOrder, details: null },
            })
        }
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const createPos = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
        const purchaseOrderGlassesServiceInstance = Container.get(
            PurchaseOrderGlassesService
        )
        const glassesServiceInstance = Container.get(GlassesService)
        const glassesDetailServiceInstance = Container.get(GlassesDetailService)
        const providerServiceInstance = Container.get(ProviderService)
        const { purchaseOrder, purchaseOrderDetail } = req.body
       // const po = await purchaseOrderServiceInstance.create({...purchaseOrder, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        for (let entry of purchaseOrder) {
           
            //let nbr = `${sequence.seq_prefix}-${Number(sequence.seq_curr_val)+1}`;
            //await sequence.update({ seq_curr_val: Number(sequence.seq_curr_val )+1 }, { where: { seq_seq: "PO" } });
            const provider = await providerServiceInstance.findOne({vd_addr: entry.sodg_for })
            
            let ent = { po_category: "PO", po_cr_terms: provider.vd_cr_terms, po_taxable: provider.address.ad_taxable, po_taxc: provider.address.ad_taxc, po_ord_date: new Date, po_vend:entry.sodg_for, po_curr : "DA", po_ex_rate : 1, po_ex_rate2: 1, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin}
             const po =  await purchaseOrderServiceInstance.create(ent)
console.log(po.po_nbr)

var line = 1
for (let obj of purchaseOrderDetail) {
console.log("hnahnahnahnahna",obj.sodg_for , entry)
    if(obj.sodg_for == entry.sodg_for) {
        var duedate = new Date();

        // add a day
        duedate.setDate(duedate.getDate() + 1);
        const pt =  await glassesServiceInstance.findOne({gls_part: obj.sodg_part})
        console.log(pt.taxe)

        const glsdet = await glassesDetailServiceInstance.findOne({
             
           
        glsd_sph_max:    {[Op.gte]: obj.sodg_sph}, 
        glsd_sph_min: {[Op.lte]: obj.sodg_sph},

        glsd_cyl_max: {[Op.gte]: obj.sodg_cyl},
        glsd_cyl_min: {[Op.lte]: obj.sodg_cyl},

        glsd_add_max: {[Op.gte]: obj.sodg_add},
        glsd_add_min: {[Op.lte]: obj.sodg_add},
              
       //  raw: true,
      });
    console.log(glsdet)
      
        let entr = { podg_nbr: po.po_nbr, podg_line: line, podg_part: obj.sodg_part, podg_sph: obj.sodg_sph, podg_cyl: obj.sodg_cyl,podg_add: obj.sodg_add,podg_taxable: pt.gls_taxable,podg_tax_code: pt.gls_taxc,podg_taxc:pt.taxe.tx2_tax_pct, podg_qty_ord: obj.total_qty,podg_site: pt.gls_site, podg_loc:pt.gls_loc, podg_price: glsdet.glsd_pur_price, podg_um: pt.gls_um, podg_due_date: duedate, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin}
          await purchaseOrderGlassesServiceInstance.create(entr)
        line = line + 1

    }
}

        }
        console.log(purchaseOrder)
        return res
            .status(201)
            .json({ message: "created succesfully", data: purchaseOrder })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}



const findByrange = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all purchaseOrder endpoint")
    try {
        const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
        const purchaseOrderDetailServiceInstance = Container.get(
            PurchaseOrderDetailService
        )
        
        const purchaseOrder = await purchaseOrderServiceInstance.find({po_vend: {
            [Op.between]: [req.body.vd_addr_1, req.body.vd_addr_2],
          },
          po_ord_date: {
            [Op.between]: [req.body.date_1, req.body.date_2],
          },
        })
        console.log("here",purchaseOrder)  
        const results_head = [];
        const results_body = [];
        
        for (const po of purchaseOrder) {
            const details = await purchaseOrderDetailServiceInstance.find({
                pod_nbr: po.po_nbr,
                pod_part: {
                    [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
                },
               
            })
            const result_head = {
                
                vd_addr_head : po.po_vend,
                vd_sort_head : po.provider.vd_sort,
                
                              
            }; 
            for (const pod of details) {
                const result_body = {
                po_nbr: po.po_nbr,
                vd_addr_body : po.po_vend,
                vd_sort_body : po.provider.vd_sort,
                pod_part: pod.pod_part,
                pt_desc1: pod.item.pt_desc1,

                pod_line: pod.pod_line,
                pod_um: pod.pod_um,
                pod_qty_ord: pod.pod_qty_ord,
                pod_price: pod.pod_price,
                pod_qty_rcvd:pod.pod_qty_rcvd,
                };
              results_body.push( result_body );    
            }
            let bool = false;
            for (var i = 0; i < results_head.length; i++) {
            if (results_head[i].vd_addr_head == po.po_vend) 
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
const getProviderActivity = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all purchaseOrder endpoint")
    try {
        const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
        const purchaseOrderDetailServiceInstance = Container.get(PurchaseOrderDetailService)
        const purchaseReceiveServiceInstance = Container.get(PurchaseReceiveService)
        const voucherOrderServiceInstance = Container.get(VoucherOrderService)
        const accountPayableServiceInstance = Container.get(AccountPayableService)
        const providerServiceInstance = Container.get(ProviderService)

        const provider = await providerServiceInstance.find({vd_addr: {
            [Op.between]: [req.body.vd_addr_1, req.body.vd_addr_2],
          },
          
        })
        console.log("here",provider)  
        const results_head = [];
        const results_body = [];
        
        for (const vd of provider) {
            const accountpayable = await accountPayableServiceInstance.find({ap_vend:
                vd.vd_addr,
                ap_type:{[Op.eq]:'p'},
                ap_effdate:{[Op.between]: [req.body.date_1, req.body.date_2]},})

            
            let paid_amt = 0;
            for(const ap of accountpayable){
                paid_amt = paid_amt + Number(ap.ap_amt);

            }
            const voucher = await voucherOrderServiceInstance.find({vh_vend:
                vd.vd_addr,
                
                vh_inv_date:{[Op.between]: [req.body.date_1, req.body.date_2]},})

            
            let inv_amt = 0;
            for(const vh of voucher){
                inv_amt = inv_amt + Number(vh.vh_amt);

            }
            const purchasereceive = await purchaseReceiveServiceInstance.find({prh_vend:
                vd.vd_addr,
                prh_rcp_date:{[Op.between]: [req.body.date_1, req.body.date_2]},})

            
            let ship_amt = 0;
            for(const prh of purchasereceive){
                ship_amt = ship_amt + Number(prh.prh_rcvd*prh.prh_um_conv*prh.prh_pur_cost);

            }
            const purchase = await purchaseOrderServiceInstance.find({
                po_vend    : vd.vd_addr,
                po_ord_date: {[Op.between]: [req.body.date_1, req.body.date_2]
                },
               
            })

            let ord_amt = 0;                        
             
            for (const po of purchase) {
                  ord_amt = ord_amt + Number(po.po_amt)
            }
            const result_head = {
                vd_addr_head    : vd.vd_addr,
                vd_sort_head    : vd.vd_sort,
                vd_ord_amt      : ord_amt,
                vd_ship_amt     : ship_amt,
                vd_inv_amt      : inv_amt,
                vd_paid_amt     : paid_amt,
                

            };
            console.log(result_head)
                
            results_head.push(result_head);
        };

        return res.status(201).json({ message: 'created succesfully', data: {results_body,results_head} });
        //return res2.status(201).json({ message: 'created succesfully', data: results_body });
    } catch (e) {
      //#
      logger.error('🔥 error: %o', e);
      return next(e);
    }
}

const getProviderBalance = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all purchaseOrder endpoint")
    try {
        const voucherOrderServiceInstance = Container.get(VoucherOrderService)
        const accountPayableServiceInstance = Container.get(AccountPayableService)
        const providerServiceInstance = Container.get(ProviderService)

        const provider = await providerServiceInstance.find({vd_addr: {
            [Op.between]: [req.body.vd_addr_1, req.body.vd_addr_2],
          },
          
        })
        console.log("here",provider)  
        const results_head = [];
        const results_body = [];
        
        for (const vd of provider) {
            const accountpayable2 = await accountPayableServiceInstance.find({ap_vend:
                vd.vd_addr,
                ap_type:{[Op.eq]:'P'},
                ap_effdate:{[Op.between]: [req.body.date_2, new Date()]},})

            
            let paid_amt2 = 0;
            for(const ap of accountpayable2){
                paid_amt2 = paid_amt2 + Number(ap.ap_amt);

            }
            const accountpayable1 = await accountPayableServiceInstance.find({ap_vend:
                vd.vd_addr,
                ap_type:{[Op.eq]:'P'},
                ap_effdate:{[Op.between]: [req.body.date_1, new Date()]},})

            
            let paid_amt1 = 0;
            for(const ap of accountpayable1){
                paid_amt1 = paid_amt1 + Number(ap.ap_amt);

            }
            const voucher2 = await accountPayableServiceInstance.find({ap_vend:
                vd.vd_addr,
                ap_type:{[Op.eq]:'I'},
                ap_effdate:{[Op.between]: [req.body.date_1, new Date()]},})

            
            let inv_amt2 = 0;
            for(const vh of voucher2){
                inv_amt2 = inv_amt2 + Number(vh.ap_amt);

            }
            const voucher1 = await accountPayableServiceInstance.find({ap_vend:
                vd.vd_addr,
                ap_type:{[Op.eq]:'I'},
                ap_effdate:{[Op.between]: [req.body.date_1, new Date()]},})
            
            let inv_amt1 = 0;
            for(const vh of voucher1){
                inv_amt1 = inv_amt1 + Number(vh.ap_amt);

            }
            let solde2 = 0;
            solde2 = Number(vd.vd_balance + paid_amt2 - inv_amt2)
            let solde1 = 0;
            solde1 = Number(vd.vd_balance + paid_amt1 - inv_amt1)
            let credit2 = 0;
            let debit2 = 0;
            let credit1 = 0;
            let debit1 = 0;
            if(solde2 < 0){credit2 = solde2, debit2 = 0}else{credit2 = 0,debit2 = solde2};
            if(solde1 < 0){credit1 = solde1, debit1 = 0}else{credit1 = 0, debit1 = solde1};  
            
            const result_head = {
                vd_acct         : vd.vd_acct,
                vd_addr_head    : vd.vd_addr,
                vd_sort_head    : vd.vd_sort,
                vd_credit1      : credit1,
                vd_debit1       : debit1,
                vd_credit2      : credit2,
                vd_debit2       : debit2,
                
                

            };
            console.log(result_head)
                
            results_head.push(result_head);
        };

        return res.status(201).json({ message: 'created succesfully', data: {results_body,results_head} });
        //return res2.status(201).json({ message: 'created succesfully', data: results_body });
    } catch (e) {
      //#
      logger.error('🔥 error: %o', e);
      return next(e);
    }
}
const getProviderCA = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all customer endpoint")
    try {
        const voucherOrderServiceInstance = Container.get(VoucherOrderService)
        const providerServiceInstance = Container.get(ProviderService)
        
        const provider = await providerServiceInstance.find({vd_addr: 
            {[Op.between]: [req.body.vd_addr_1, req.body.vd_addr_2]},})
            
        const results_head = [];

        for (const vd of provider){
            const invoice = await voucherOrderServiceInstance.find({vh_vend: 
                vd.vd_addr,
                vh_inv_date: {[Op.between]: [req.body.date_1, req.body.date_2],
              },})
            let ht_amt = 0;
            let tva_amt = 0;
            let tf_amt = 0;
            let ttc_amt= 0;
            for(const ih of invoice){
                ht_amt = ht_amt + Number(ih.vh_amt);
                tva_amt= tva_amt + Number(ih.vh_tax_amt);
                tf_amt = tf_amt + Number(ih.vh_trl1_amt);
                ttc_amt = ttc_amt + ht_amt + tva_amt + tf_amt;
            }  
            



            const result_head = {
                vd_addr_head    : vd.vd_addr,
                vd_sort_head    : vd.vd_sort,
                vd_ht_amt       : ht_amt,
                vd_tva_amt      : tva_amt,
                vd_tf_amt       : tf_amt,
                vd_ttc_amt      : ttc_amt,
        
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
const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  purchaseOrder endpoint")
    try {
        const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
        const { id } = req.params
        const purchaseOrder = await purchaseOrderServiceInstance.findOne({ id })
        const purchaseOrderDetailServiceInstance = Container.get(
            PurchaseOrderDetailService
        )
        const details = await purchaseOrderDetailServiceInstance.find({
            pod_nbr: purchaseOrder.po_nbr,
        })

        return res.status(200).json({
            message: "fetched succesfully",
            data: { purchaseOrder, details },
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
        const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
        
        const pos = await purchaseOrderServiceInstance.find({})
            
        return res.status(202).json({
            message: "sec",
            data:  pos ,
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
        const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
        const purchaseOrderDetailServiceInstance = Container.get(
            PurchaseOrderDetailService
        )
        const pos = await purchaseOrderServiceInstance.find({})
        for(const po of pos){
            const details = await purchaseOrderDetailServiceInstance.find({
                pod_nbr: po.po_nbr,
            })
            result.push({id:po.id, po, details})
    
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

    logger.debug("Calling update one  purchaseOrder endpoint")
    try {
        const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
        const { id } = req.params
        console.log(req.body)
        const purchaseOrder = await purchaseOrderServiceInstance.update(
            { ...req.body, last_modified_by: user_code },
            { id }
        )
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: purchaseOrder })
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
        //const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)

        const pos =await sequelize.query("SELECT *  FROM   PUBLIC.po_mstr, PUBLIC.gls_mstr, PUBLIC.podg_det  where PUBLIC.podg_det.podg_nbr = PUBLIC.po_mstr.po_nbr and PUBLIC.podg_det.podg_part = PUBLIC.gls_mstr.gls_part ORDER BY PUBLIC.podg_det.id DESC", { type: QueryTypes.SELECT });
       
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: pos })
            
            
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    } 
}

export default {
    create,
    findBy,
    findByAll,
    findOne,
    createPos,
    findAll,
    update,
    findAllwithDetails,
    findByrange,
    getProviderActivity,
    getProviderBalance,
    getProviderCA,
}
