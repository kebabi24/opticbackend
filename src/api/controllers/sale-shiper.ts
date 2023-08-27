import SaleShiperService from '../../services/sale-shiper';
import locationDetailService from '../../services/location-details';
import inventoryTransactionService from '../../services/inventory-transaction';
import costSimulationService from '../../services/cost-simulation';
import saleOrderDetailService from '../../services/saleorder-detail';
import itemService from '../../services/item';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { round } from 'lodash';
import {QueryTypes} from 'sequelize'


const create = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const{user_code} = req.headers

  logger.debug('Calling Create code endpoint');
  try {
    const saleShiperServiceInstance = Container.get(SaleShiperService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const inventoryTransactionServiceInstance = Container.get(inventoryTransactionService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const saleOrderDetailServiceInstance = Container.get(saleOrderDetailService);
    const itemServiceInstance = Container.get(itemService);

    //const lastId = await saleShiperServiceInstance.max('psh_nbr');

    for (const item of req.body.detail) {
      const {  ...remain } = item;
      console.log(remain)
      await saleShiperServiceInstance.create({ psh_shiper: req.body.pshnbr, ...remain, ...req.body.ps, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin });
      const sod = await saleOrderDetailServiceInstance.findOne({sod_nbr: req.body.ps.psh_nbr, sod_line:remain.psh_line, sod_part: remain.psh_part})
      if(sod) await saleOrderDetailServiceInstance.update({sod_qty_ship : Number(sod.sod_qty_ship) + Number(remain.psh_qty_ship) ,last_modified_by:user_code,last_modified_ip_adr: req.headers.origin },{id: sod.id})
      const sctdet = await costSimulationServiceInstance.findOne({ sct_part: remain.psh_part, sct_site: remain.psh_site,  sct_sim: 'STDCG' });
      const pt = await itemServiceInstance.findOne({ pt_part: remain.psh_part });
      console.log(remain.psh_part, remain.psh_site)
      
      console.log(remain.qty_oh)
      console.log(sctdet.sct_cst_tot)
      await inventoryTransactionServiceInstance.create({
        tr_status: remain.psh_status,
        tr_expire: remain.psh_expire,
        tr_line: remain.psh_line,
        tr_part: remain.psh_part,
        tr_prod_line: pt.pt_prod_line,
        tr_qty_loc: - Number(remain.psh_qty_ship),
        tr_um: remain.psh_um,
        tr_um_conv: remain.psh_um_conv,
        tr_ship_type: remain.psh_type,
        tr_price: remain.psh_price,
        tr_site: remain.psh_site,
        tr_loc: remain.psh_loc,
        tr_serial: remain.psh_serial,
        tr_nbr: req.body.ps.psh_nbr,
        tr_lot: req.body.pshnbr,
        tr_addr: req.body.ps.psh_cust,
        tr_effdate: req.body.ps.psh_ship_date,
        tr_so_job: req.body.ps.psh_xinvoice,
        tr_curr: req.body.ps.psh_curr,
        tr_ex_rate: req.body.ps.psh_ex_rate,
        tr_ex_rate2: req.body.ps.psh_ex_rate2,
        tr_rmks: req.body.ps.psh_rmks,
        tr_type:'ISS-SO',
        tr_qty_chg:  Number(remain.psh_qty_ship),
        tr_loc_begin: Number(remain.qty_oh),
        tr_gl_amt: Number(remain.psh_qty_ship) * (sctdet.sct_cst_tot),
        tr_date: new Date(),
        tr_mtl_std: sctdet.sct_mtl_tl,
        tr_lbr_std: sctdet.sct_lbr_tl, 
        tr_bdn_std: sctdet.sct_bdn_tl, 
        tr_ovh_std: sctdet.sct_ovh_tl,
        tr_sub_std: sctdet.sct_sub_tl,
        created_by:user_code,created_ip_adr: req.headers.origin,
        last_modified_by:user_code,last_modified_ip_adr: req.headers.origin

        });
        
        if(remain.psh_type != 'M') {
        const ld = await locationDetailServiceInstance.findOne({ld_part: remain.psh_part, ld_lot:remain.psh_serial, ld_site: remain.psh_site,ld_loc: remain.psh_loc})
        if(ld) await locationDetailServiceInstance.update({ld_qty_oh : Number(ld.ld_qty_oh) - (Number(remain.psh_qty_ship)* Number(remain.psh_um_conv)), ld_expire: remain.psh_expire, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id: ld.id})
        else await locationDetailServiceInstance.create({ld_part: remain.psh_part,ld_date: new Date(), ld_lot:remain.psh_serial, ld_site: remain.psh_site,ld_loc: remain.psh_loc, ld_qty_oh : - (Number(remain.psh_qty_ship)* Number(remain.psh_um_conv)), ld_expire: remain.psh_expire, ld_status: remain.psh_status, created_by:user_code,created_ip_adr: req.headers.origin, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin})
        }
    }
    // const shiper = await saleShiperServiceInstance.create(req.body)
    return res.status(201).json({ message: 'created succesfully', data: req.body.pshnbr });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findOne = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find one  code endpoint');
  try {
    const saleShiperServiceInstance = Container.get(SaleShiperService);
    const { id } = req.params;
    const shiper = await saleShiperServiceInstance.findOne({ id });
    return res.status(200).json({ message: 'fetched succesfully', data: shiper });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find all code endpoint');
  try {
    const saleShiperServiceInstance = Container.get(SaleShiperService);
    const shiper = await saleShiperServiceInstance.find({});
    return res.status(200).json({ message: 'fetched succesfully', data: shiper });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};


const findAllDistinct = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get("logger")
  const sequelize = Container.get("sequelize")

  logger.debug("Calling find all purchaseOrder endpoint")
  try {
      let result = []
      const { distinct } = req.params;
      //const purchaseOrderServiceInstance = Container.get(PurchaseOrderService)
console.log(distinct)
      const pshs =await sequelize.query("SELECT DISTINCT PUBLIC.psh_hist.psh_shiper, PUBLIC.psh_hist.psh_cust, PUBLIC.psh_hist.psh_ship_date  FROM   PUBLIC.psh_hist where PUBLIC.psh_hist.psh_invoiced = 'false' and  PUBLIC.psh_hist.psh_cust = ? ", { replacements: [distinct ] , type: QueryTypes.SELECT });
     console.log(pshs)
      return res
          .status(200)
          .json({ message: "fetched succesfully", data: pshs })
          
          
  } catch (e) {
      logger.error("🔥 error: %o", e)
      return next(e)
  } 
}
const findBy = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  try {
    console.log(req.body)
    const saleShiperServiceInstance = Container.get(SaleShiperService);
    const shiper = await saleShiperServiceInstance.find({ ...req.body });
    console.log(shiper)
    return res.status(200).json({ message: 'fetched succesfully', data: shiper });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const{user_code} = req.headers

  logger.debug('Calling update one  code endpoint');
  try {
    const saleShiperServiceInstance = Container.get(SaleShiperService);
    const { id } = req.params;
    const shiper = await saleShiperServiceInstance.update({ ...req.body , last_modified_by:user_code,last_modified_ip_adr: req.headers.origin}, { id });
    return res.status(200).json({ message: 'fetched succesfully', data: shiper });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling update one  code endpoint');
  try {
    const saleShiperServiceInstance = Container.get(SaleShiperService);
    const { id } = req.params;
    const shiper = await saleShiperServiceInstance.delete({ id });
    return res.status(200).json({ message: 'deleted succesfully', data: id });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
export default {
  create,
  findOne,
  findAll,
  findAllDistinct,
  findBy,
  update,
  deleteOne,
};
