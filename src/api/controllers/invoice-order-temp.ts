import InvoiceOrderTempService from "../../services/invoice-order-temp"
import InvoiceOrderTempDetailService from "../../services/invoice-order-temp-detail"
import InvoiceOrderService from "../../services/invoice-order"
import InvoiceOrderDetailService from "../../services/invoice-order-detail"
import AccountReceivableService from "../../services/account-receivable"
import SaleOrderDetailService from '../../services/saleorder-detail';
import SaleOrderService from '../../services/saleorder';
import PayMethService from "../../services/pay-meth"
import PayMethDetailService from "../../services/pay-meth-detail"
import SaleShiperService from '../../services/sale-shiper';
import GeneralLedgerService from "../../services/general-ledger"
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import {INTEGER, QueryTypes} from 'sequelize'
import moment from 'moment';


const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        console.log(req.body)
        const invoiceOrderServiceInstance = Container.get(InvoiceOrderTempService)
        const saleOrderServiceInstance = Container.get(SaleOrderService)

        const invoiceOrderDetailServiceInstance = Container.get(
            InvoiceOrderTempDetailService
        )
        const { invoiceOrderTemp, invoiceOrderTempDetail } = req.body

        const ih = await invoiceOrderServiceInstance.create({...invoiceOrderTemp, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        
        for (let entry of invoiceOrderTempDetail) {
            entry = { ...entry, itdh_inv_nbr: ih.ith_inv_nbr, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
            await invoiceOrderDetailServiceInstance.create(entry)

        }
        const so = await saleOrderServiceInstance.findOne({so_nbr: ih.ith_nbr })
            if(so) await saleOrderServiceInstance.update({so_invoiced : true,so_to_inv:false, so_inv_nbr: ih.ith_inv_nbr, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: so.id})
        
        return res
            .status(201)
            .json({ message: "created succesfully", data:  ih.ith_inv_nbr })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const createIV = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    logger.debug("Calling Create sequence endpoint")
    try {
        console.log(req.body)
        const invoiceOrderTempServiceInstance = Container.get(InvoiceOrderTempService)

        const invoiceOrderTempDetailServiceInstance = Container.get(
            InvoiceOrderTempDetailService
        )
        const saleOrderDetailServiceInstance = Container.get(SaleOrderDetailService)

        const saleShiperServiceInstance = Container.get(SaleShiperService)
        const { invoiceOrderTemp, invoiceOrderTempDetail } = req.body

        const ih = await invoiceOrderTempServiceInstance.create({...invoiceOrderTemp, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by: user_code})
        
        for (let entry of invoiceOrderTempDetail) {
            entry = { ...entry, itdh_inv_nbr: ih.ith_inv_nbr }
            await invoiceOrderTempDetailServiceInstance.create({...entry, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})

            const sh = await saleShiperServiceInstance.findOne({psh_shiper: entry.itdh_ship, psh_part:entry.itdh_part, psh_nbr: entry.itdh_nbr,psh_line: entry.itdh_sad_line })
            if(sh) await saleShiperServiceInstance.update({psh_invoiced : true, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: sh.id})
          }
        
        return res
            .status(201)
            .json({ message: "created succesfully", data: ih.ith_inv_nbr })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const imput = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers
    const  date = new Date();
    logger.debug("Calling Create sequence endpoint")
    try {
        console.log(req.body)
        const invoiceOrderServiceInstance = Container.get(InvoiceOrderService)
        const invoiceOrderTempServiceInstance = Container.get(InvoiceOrderTempService)
        const invoiceOrderDetailServiceInstance = Container.get(
            InvoiceOrderDetailService
        )
        const payMethServiceInstance = Container.get(PayMethService)
        const payMethDetailServiceInstance = Container.get(
            PayMethDetailService
        )
        const generalLedgerServiceInstance = Container.get(GeneralLedgerService)
        const accountReceivableServiceInstance = Container.get(AccountReceivableService)
        const { invoiceOrder, invoiceOrderDetail /*, gldetail*/ } = req.body

        const ih = await invoiceOrderServiceInstance.create({...invoiceOrder, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        
        for (let entry of invoiceOrderDetail) {
            entry = { ...entry, idh_inv_nbr: ih.ih_inv_nbr, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin }
            await invoiceOrderDetailServiceInstance.create(entry)

        
        }

        const PayMeth = await payMethServiceInstance.findOne({
            ct_code: invoiceOrder.ih_cr_terms
        })

        if (PayMeth) {

            const details = await payMethDetailServiceInstance.find({
                ctd_code: PayMeth.ct_code,
           })

           for (let det of details) {

            const effdate = new Date(invoiceOrder.ih_inv_date)
            effdate.setDate(effdate.getDate() + Number(det.ctd_due_day) )
         
                await accountReceivableServiceInstance.create({
                    ar_nbr : ih.ih_inv_nbr,
                    ar_effdate: invoiceOrder.ih_inv_date  ,
                    ar_due_date: effdate,
                    ar_date: new Date(),
                    ar_type: "I",
                    ar_cust: invoiceOrder.ih_cust,
                    ar_bill: invoiceOrder.ih_bill,
                    ar_rmks: invoiceOrder.ih_rmks,
                    ar_cr_terms: invoiceOrder.ih_cr_terms,
                    ar_open: true,
                    ar_applied: 0,
                    ar_base_applied:0,
                    ar_curr: invoiceOrder.ih_curr,
                    ar_ex_rate: invoiceOrder.ih_ex_rate,
                    ar_ex_rate2: invoiceOrder.ih_ex_rate2,
                    ar_amt: (Number(invoiceOrder.ih_amt) + Number(invoiceOrder.ih_tax_amt) + Number(invoiceOrder.ih_trl1_amt)) * Number(det.ctd_pct) / 100,
                    ar_base_amt: ((Number(invoiceOrder.ih_amt) + Number(invoiceOrder.ih_tax_amt) + Number(invoiceOrder.ih_trl1_amt)) * Number(invoiceOrder.ar_ex_rate2) /  Number(invoiceOrder.ar_ex_rate) ) * Number(det.ctd_pct) / 100  ,
                    created_by: user_code,
                    last_modified_by: user_code
                })
            }
        }
        else {
            await accountReceivableServiceInstance.create({
            ar_nbr : ih.ih_inv_nbr,
            ar_effdate: invoiceOrder.ih_inv_date,
            ar_due_date: invoiceOrder.ih_due_date  ,
            ar_date: new Date(),
            ar_type: "I",
            ar_cust: invoiceOrder.ih_cust,
            ar_bill: invoiceOrder.ih_bill,
            ar_rmks: invoiceOrder.ih_rmks,
            ar_cr_terms: invoiceOrder.ih_cr_terms,
            ar_open: true,
            ar_applied: 0,
            ar_base_applied:0,
            ar_curr: invoiceOrder.ih_curr,
            ar_ex_rate: invoiceOrder.ih_ex_rate,
            ar_ex_rate2: invoiceOrder.ih_ex_rate2,
            ar_amt: Number(invoiceOrder.ih_amt) + Number(invoiceOrder.ih_tax_amt) + Number(invoiceOrder.ih_trl1_amt),
            ar_base_amt: (Number(invoiceOrder.ih_amt) + Number(invoiceOrder.ih_tax_amt) + Number(invoiceOrder.ih_trl1_amt)) * Number(invoiceOrder.ar_ex_rate2) /  Number(invoiceOrder.ar_ex_rate)   ,
            created_by: user_code,
            last_modified_by: user_code
            })
        }


        /***************GL ************
        const gl = await generalLedgerServiceInstance.findLastId({glt_date: date})
        if(gl) {
        var seq =  gl.glt_ref.substring(10, 18)
        var d = Number(seq) + 1

        var seqchar = ("000000" + d).slice(-6);

        var ref = "SO" + moment().format('YYYYMMDD') + seqchar ;
        } else {

            
            var ref = "SO"  + moment().format('YYYYMMDD') + "000001" ;
        // return year +  month + day;
        

        }
        const effdate = new Date(invoiceOrder.ih_inv_date)       
        for (let entry of gldetail) {
        console.log(entry)
        await generalLedgerServiceInstance.create({...entry,glt_ref: ref,
            glt_addr: invoiceOrder.ih_bill,
            glt_curr: invoiceOrder.ih_curr,
            glt_tr_type: "SO",
            //glt_dy_code: invoiceOrder.ap_dy_code,
            glt_ex_rate: invoiceOrder.ih_ex_rate,
            glt_ex_rate2: invoiceOrder.ih_ex_rate2,
            glt_doc: invoiceOrder.ih_inv_nbr,
            glt_effdate: invoiceOrder.ih_inv_date,
            glt_year: effdate.getFullYear(),
            
            //glt_curr_amt: (Number(entry.glt_amt)) * Number(invoiceOrder.ap_ex_rate2) /  Number(invoiceOrder.ap_ex_rate)   ,
            glt_date: date, created_by: user_code, last_modified_by: user_code})

        }
        **************GL *************/
        const ith = await invoiceOrderTempServiceInstance.findOne({ith_inv_nbr: ih.ih_inv_nbr })
        if(ith) await invoiceOrderTempServiceInstance.update({ith_invoiced : true, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ith.id})
 



        return res
            .status(201)
            .json({ message: "created succesfully", data: ih })
    } catch (e) {
        //#
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.body)
    logger.debug("Calling find by  all invoiceOrderTemp endpoint")
    try {
        const invoiceOrderTempServiceInstance = Container.get(InvoiceOrderTempService)
        const invoiceOrderTempDetailServiceInstance = Container.get(
            InvoiceOrderTempDetailService
        )
        const invoiceOrderTemp = await invoiceOrderTempServiceInstance.findOne({
            ...req.body,
        })
        console.log("hamel",invoiceOrderTemp.ith_invoiced)
        if (invoiceOrderTemp) {
            const details = await invoiceOrderTempDetailServiceInstance.find({
                itdh_inv_nbr: invoiceOrderTemp.ith_inv_nbr,
            })
            return res.status(200).json({
                message: "fetched succesfully",
                data: { invoiceOrderTemp, details },
            })
        } else {
            return res.status(200).json({
                message: "not FOund",
                data: { invoiceOrderTemp, details: null },
            })
        }
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  invoiceOrderTemp endpoint")
    try {
        const invoiceOrderTempServiceInstance = Container.get(InvoiceOrderTempService)
        const { id } = req.params
        const invoiceOrderTemp = await invoiceOrderTempServiceInstance.findOne({ id })
        const invoiceOrderTempDetailServiceInstance = Container.get(
            InvoiceOrderTempDetailService
        )
        const details = await invoiceOrderTempDetailServiceInstance.find({
            itdh_inv_nbr: invoiceOrderTemp.ith_inv_nbr,
        })

        return res.status(200).json({
            message: "fetched succesfully",
            data: { invoiceOrderTemp, details },
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
        const invoiceOrderTempServiceInstance = Container.get(InvoiceOrderTempService)
        
        const ihs = await invoiceOrderTempServiceInstance.find({...req.body})
            
        return res.status(202).json({
            message: "sec",
            data:  ihs ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find all invoiceOrderTemp endpoint")
    try {
        let result = []
        const invoiceOrderTempServiceInstance = Container.get(InvoiceOrderTempService)
        const invoiceOrderTempDetailServiceInstance = Container.get(
            InvoiceOrderTempDetailService
        )
        const ihs = await invoiceOrderTempServiceInstance.find({})
        for(const ih of ihs){
            const details = await invoiceOrderTempDetailServiceInstance.find({
                itdh_inv_nbr: ih.ith_inv_nbr,
            })
            result.push({id:ih.id, ih, details})
    
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

    logger.debug("Calling update one  invoiceOrderTemp endpoint")
    try {
        const invoiceOrderTempServiceInstance = Container.get(InvoiceOrderTempService)
        const { id } = req.params
        console.log(req.body)
        const invoiceOrderTemp = await invoiceOrderTempServiceInstance.update(
            { ...req.body , last_modified_by: user_code},
            { id }
        )
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: invoiceOrderTemp })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAllwithDetails = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const sequelize = Container.get("sequelize")

    logger.debug("Calling find all invoiceOrderTemp endpoint")
    try {
        let result = []
        //const invoiceOrderTempServiceInstance = Container.get(invoiceOrderTempService)

        const ihs =await sequelize.query("SELECT *  FROM   PUBLIC.ith_hist, PUBLIC.pt_mstr, PUBLIC.itdh_det  where PUBLIC.itdh_det.itdh_inv_nbr = PUBLIC.ith_hist.ith_inv_nbr and PUBLIC.itdh_det.itdh_part = PUBLIC.pt_mstr.pt_part OrderTemp BY PUBLIC.itdh_det.id DESC", { type: QueryTypes.SELECT });
       
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: ihs })
            
            
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    } 
}

export default {
    create,
    createIV,
    imput,
    findBy,
    findByAll,
    findOne,
    findAll,
    update,
    findAllwithDetails,
}
