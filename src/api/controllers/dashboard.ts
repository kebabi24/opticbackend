import InvoiceOrderService from "../../services/invoice-order"
import InvoiceOrderDetailService from "../../services/invoice-order-detail"
import AccountReceivableService from "../../services/account-receivable"
import SaleShiperService from '../../services/sale-shiper';
import SaleOrderService from '../../services/saleorder';

import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import {QueryTypes} from 'sequelize'


const daySales = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const sequelize = Container.get("sequelize")

    console.log(req.body)
    logger.debug("Calling find by  all requisition endpoint")
    try {
        const invoiceOrderServiceInstance = Container.get(InvoiceOrderService)
        
        //const ihs = await invoiceOrderServiceInstance.sum({})
        const  totalAmount = await invoiceOrderServiceInstance.findAll({
            attributes: [[sequelize.fn('sum', sequelize.col('ih_amt')), 'totalAmount']],
    raw: true,
    
          });
        //  totalAmount = 
          console.log(totalAmount)  
        return res.status(202).json({
            message: "sec",
            data:  totalAmount ,
        })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}
export default {
   
    daySales,
   }
