import InventoryTransactionService from '../../services/inventory-transaction';
import locationDetailService from '../../services/location-details';
import costSimulationService from '../../services/cost-simulation';
import itemService from '../../services/item';
import workOrderService from '../../services/work-order';
import statusService from '../../services/inventory-status';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { round } from 'lodash';
import { DATE, Op, Sequelize } from 'sequelize';
import ItemService from '../../services/item';
import workOrderDetailService from '../../services/work-order-detail';
import sequelize from '../../loaders/sequelize';
import Item from '../../models/item';
import moment from 'moment';
const create = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling Create code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const devise = await inventoryTransactionServiceInstance.create({
      ...req.body,
      created_by: user_code,
      created_ip_adr: req.headers.origin,
      last_modified_by: user_code,
      last_modified_ip_adr: req.headers.origin,
    });
    return res.status(201).json({ message: 'created succesfully', data: devise });
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
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const { id } = req.params;
    const devise = await inventoryTransactionServiceInstance.findOne({ id });
    return res.status(200).json({ message: 'fetched succesfully', data: devise });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find all code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const trs = await inventoryTransactionServiceInstance.find({});

    for (let tr of trs){
      const effdate = new Date(tr.tr_effdate)   
      //console.log(effdate)
      //console.log(effdate.getUTCFullYear(),effdate.getUTCMonth() + 1,effdate.getUTCDate())
      //data.push(gl, {effet:  new Date(effdate.getFullYear(), effdate.getMonth() , effdate.getDay()) })
      tr.tr_effdate = effdate.getUTCFullYear() + "-" + (effdate.getUTCMonth() + 1) + "-" + effdate.getUTCDate();
      
      //new Date(effdate.getUTCFullYear(),effdate.getUTCMonth() + 1,effdate.getUTCDate())
      //console.log(ap.ap_effdate)
  }
    return res.status(200).json({ message: 'fetched succesfully', data: trs });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const findBy = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling find by  all code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const devise = await inventoryTransactionServiceInstance.findOne({ ...req.body });
    return res.status(200).json({ message: 'fetched succesfully', data: devise });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const { id } = req.params;
    const devise = await inventoryTransactionServiceInstance.update(
      { ...req.body, last_modified_by: user_code, last_modified_ip_adr: req.headers.origin },
      { id },
    );
    return res.status(200).json({ message: 'fetched succesfully', data: devise });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling update one  code endpoint');
  try {
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const { id } = req.params;
    const devise = await inventoryTransactionServiceInstance.delete({ id });
    return res.status(200).json({ message: 'deleted succesfully', data: id });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const rctUnp = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it, nlot } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);

    for (const data of detail) {
      const { desc, ...item } = data;
      const sct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STDCG',
      });
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part });

      const lds = await locationDetailServiceInstance.find({ ld_part: item.tr_part, ld_site: item.tr_site });
      const { sct_mtl_tl } = await costSimulationServiceInstance.findOne({ sct_part: item.tr_part, sct_sim: 'STDCG' });
      const sctdet = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STDCG',
      });

      let qty = 0;
      lds.map(elem => {
        qty += Number(elem.ld_qty_oh);
      });
      console.log(qty, sct_mtl_tl);
      const new_price = round(
        (qty * Number(sct_mtl_tl) + Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price)) /
          (qty + Number(item.tr_qty_loc) * Number(item.tr_um_conv)),
        2,
      );
      await costSimulationServiceInstance.update(
        {
          sct_mtl_tl: new_price,
          sct_cst_tot:
            new_price +
            Number(sctdet.sct_lbr_tl) +
            Number(sctdet.sct_bdn_tl) +
            Number(sctdet.sct_ovh_tl) +
            Number(sctdet.sct_sub_tl),
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        },
        { sct_part: item.tr_part, sct_site: item.tr_site, sct_sim: 'STDCG' },
      );
      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
      });
      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      else {
        console.log(item.tr_status)
     const status =   await statusServiceInstance.findOne({
      is_status: item.tr_status
     })

        await locationDetailServiceInstance.create({
          ld_part: item.tr_part,
          ld_lot: item.tr_serial,
          ld_date: new Date(),
          ld_site: item.tr_site,
          ld_loc: item.tr_loc,
          ld_status: item.tr_status,
          ld_qty_oh: Number(item.tr_qty_loc) * Number(item.tr_um_conv),
          ld_expire: item.tr_expire,
          ld__log01: status.is_nettable,
        }); }
      let qtyoh = 0;
      if (ld) {
        qtyoh = Number(ld.ld_qty_oh);
      } else {
        qtyoh = 0;
      }
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_lot: nlot,
        tr_qty_chg: Number(item.tr_qty_loc),
        tr_loc_begin: Number(qtyoh),
        tr_type: 'RCT-UNP',
        tr_date: new Date(),
        tr_mtl_std: new_price,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        tr_prod_line: pt.pt_prod_line,
        tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      });
    }
    return res.status(200).json({ message: 'Added succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const issUnp = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it, nlot } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);

    for (const item of detail) {
      const sct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STDCG',
      });
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part });
      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
      });

      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) - Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_lot: nlot,
        tr_gl_date: it.tr_effdate,
        tr_qty_loc: -1 * Number(item.tr_qty_loc),
        tr_qty_chg: -1 * Number(item.tr_qty_loc),
        tr_loc_begin: Number(ld.ld_qty_oh),
        tr_type: 'ISS-UNP',
        tr_date: new Date(),
        tr_mtl_std: sct.sct_mtl_tl,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        tr_prod_line: pt.pt_prod_line,
        tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      });
    }
    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const issTr = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  logger.debug('Calling update one  code endpoint');
  const { user_code } = req.headers;

  try {
    const { detail, it, nlot } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService)

    for (const item of detail) {
      const sct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: it.tr_site,
        sct_sim: 'STDCG',
      });
      const sctrct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: it.tr_ref_site,
        sct_sim: 'STDCG',
      });
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part });

      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: it.tr_site,
        ld_loc: it.tr_loc,
      });
      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) - Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_lot: nlot,
        tr_qty_loc: -1 * Number(item.tr_qty_loc),
        tr_type: 'ISS-TR',
        tr_date: new Date(),
        tr_mtl_std: sct.sct_mtl_tl,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        tr_prod_line: pt.pt_prod_line,
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      });

      const ld1 = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: it.tr_ref_site,
        ld_loc: it.tr_ref_loc,
      });
      if (ld1)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld1.id },
        );
      else {
        const status =   await statusServiceInstance.findOne({
          is_status: item.tr_status
         })
        await locationDetailServiceInstance.create({
          ld_part: item.tr_part,
          ld_lot: item.tr_serial,
          ld_date: new Date(),
          ld_site: it.tr_ref_site,
          ld_loc: it.tr_ref_loc,
          ld_status: item.tr_status,
          ld__log01: status.is_nettable, 
          ld_qty_oh: Number(item.tr_qty_loc) * Number(item.tr_um_conv),
          ld_expire: item.tr_expire,
          created_by: user_code,
          created_ip_adr: req.headers.origin,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        })
      };
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_lot: nlot,
        tr_qty_loc: Number(item.tr_qty_loc),
        tr_type: 'RCT-TR',
        tr_date: new Date(),
        tr_loc: it.tr_ref_loc,
        tr_site: it.tr_ref_site,
        tr_ref_site: it.tr_site,
        tr_ref_loc: it.tr_loc,
        tr_mtl_std: sctrct.sct_mtl_tl,
        tr_lbr_std: sctrct.sct_lbr_tl,
        tr_bdn_std: sctrct.sct_bdn_tl,
        tr_ovh_std: sctrct.sct_ovh_tl,
        tr_sub_std: sctrct.sct_sub_tl,
        tr_prod_line: pt.pt_prod_line,
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      });
    }
    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const issChl = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const it = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);

    const sct = await costSimulationServiceInstance.findOne({
      sct_part: it.tr_part,
      sct_site: it.tr_site,
      sct_sim: 'STDCG',
    });
    const pt = await itemServiceInstance.findOne({ pt_part: it.tr_part });

    console.log(it.tr_part, it.tr_serial, it.tr_site, it.tr_loc)
    const ld = await locationDetailServiceInstance.findOne({
      ld_part: it.tr_part,
      ld_lot: it.tr_serial,
      ld_site: it.tr_site,
      ld_loc: it.tr_loc,
    });
    console.log(ld)
    await inventoryTransactionServiceInstance.create({
      ...it,
      tr_status: ld.ld_status,
      tr_expire: ld.ld_expire,
      tr_qty_loc: 0,
      tr_type: 'ISS-CHL',
      tr_line: 1,
      tr_um: ld.ld_um,
      tr_effdate: new Date(),
      tr_date: new Date(),
      tr_price: sct.sct_mtl_tl,
      tr_mtl_std: sct.sct_mtl_tl,
      tr_lbr_std: sct.sct_lbr_tl,
      tr_bdn_std: sct.sct_bdn_tl,
      tr_ovh_std: sct.sct_ovh_tl,
      tr_sub_std: sct.sct_sub_tl,
      tr_prod_line: pt.pt_prod_line,
      created_by: user_code,
      created_ip_adr: req.headers.origin,
      last_modified_by: user_code,
      last_modified_ip_adr: req.headers.origin,
    });
    if (ld) {
      const status =   await statusServiceInstance.findOne({
        is_status: it.tr_status
       })
      await locationDetailServiceInstance.update(
        {
          ld_status: it.tr_status,
          ld_expire: it.tr_expire,
          ld__log01: status.is_nettable,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        },
        { id: ld.id },
      );
    }
    await inventoryTransactionServiceInstance.create({
      ...it,
      tr_qty_loc: 0,
      tr_type: 'RCT-CHL',
      tr_line: 1,
      tr_um: ld.ld_um,
      tr_effdate: new Date(),
      tr_date: new Date(),
      tr_price: sct.sct_mtl_tl,
      tr_mtl_std: sct.sct_mtl_tl,
      tr_lbr_std: sct.sct_lbr_tl,
      tr_bdn_std: sct.sct_bdn_tl,
      tr_ovh_std: sct.sct_ovh_tl,
      tr_sub_std: sct.sct_sub_tl,
      tr_prod_line: pt.pt_prod_line,
      created_by: user_code,
      created_ip_adr: req.headers.origin,
      last_modified_by: user_code,
      last_modified_ip_adr: req.headers.origin,
    });

    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const inventoryToDate = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    console.log(req.body.date);
    const items = await itemService.find({
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const result = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.findSpecial({
        where: {
          ld_part: item.pt_part,
          ld_site: { [Op.between]: [req.body.pt_site_1, req.body.pt_site_2] },
          ld_loc: { [Op.between]: [req.body.pt_loc_1, req.body.pt_loc_2] },
        },
        attributes: ['ld_part', 'ld_site', 'ld_loc', [Sequelize.fn('sum', Sequelize.col('ld_qty_oh')), 'total_qty']],
        group: ['ld_part', 'ld_site', 'ld_loc'],
        raw: true,
      });
      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
        const res = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_site: det.ld_site,
            tr_loc: det.ld_loc,
            tr_ship_type: {[Op.ne]: "M"}, 
            tr_effdate: { [Op.between]: [req.body.date, new Date()] },
          },
          attributes: ['tr_part', 'tr_site', 'tr_loc', [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'total']],
          group: ['tr_part', 'tr_site', 'tr_loc'],
          raw: true,
        });
        const qty = res[0] ? (res[0].total ? res[0].total : 0) : 0;
        det.total_qty = det.total_qty - qty;
        const item = await itemService.findOneS({pt_part:det.ld_part})
        det.item = item
        result.push(det)
      }
    }
    //  console.log('aaa', result);

    return res.status(201).json({ message: 'created succesfully', data: result });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const inventoryActivity = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    console.log(req.body.date);
    const items = await itemService.find({
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const result = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.find({
        where: {
          ld_part: item.pt_part,
          
        },
        attributes: ['ld_part',  [Sequelize.fn('sum', Sequelize.col('ld_qty_oh')), 'total_qty']],
        group: ['ld_part'],
        raw: true,
      });
      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
        const res_2 = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"}, 
            tr_effdate: { [Op.between]: [req.body.date_2, new Date()] },
          },
          attributes: ['tr_part' , [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'total']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_2 = res_2[0] ? (res_2[0].total ? res_2[0].total : 0) : 0;
        det.total_qty_2 = det.total_qty - qty_2;

        const res_rctpo = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "RCT-PO"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctpo']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctpo = res_rctpo[0] ? (res_rctpo[0].totalrctpo ? res_rctpo[0].totalrctpo : 0) : 0;
        det.total_qty_rctpo = det.total_qty_rctpo + qty_rctpo;
        const res_rctwo = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "RCT-WO"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctwo']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctwo = res_rctwo[0] ? (res_rctwo[0].totalrctwo ? res_rctwo[0].totalrctwo : 0) : 0;
        det.total_qty_rctwo = det.total_qty_rctwo + qty_rctwo;
        const res_rctcns = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "RCT-CNS"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctcns']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctcns = res_rctcns[0] ? (res_rctcns[0].totalrctcns ? res_rctcns[0].totalrctcns : 0) : 0;
        det.total_qty_rctcns = det.total_qty_rctcns + qty_rctcns;
        const res_rcttr = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "RCT-TR"},
            tr_status: {[Op.eq]: "PROD"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrcttr']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rcttr = res_rcttr[0] ? (res_rcttr[0].totalrcttr ? res_rcttr[0].totalrcttr : 0) : 0;
        det.total_qty_rcttr = det.total_qty_rcttr + qty_rcttr;
        const res_rctchl = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "RCT-CHL"},
            tr_status:  {[Op.eq]: "NONCONF"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctchl']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctchl = res_rctchl[0] ? (res_rctchl[0].totalrctchl ? res_rctchl[0].totalrctchl : 0) : 0;
        det.total_qty_rctchl = det.total_qty_rctchl + qty_rctchl;
        const res_isswo = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "ISS-WO"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalisswo']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_isswo = res_isswo[0] ? (res_isswo[0].totalisswo ? res_isswo[0].totalisswo : 0) : 0;
        det.total_qty_isswo = det.total_qty_isswo + qty_isswo;
        const res_issso = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "ISS-SO"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalissso']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_issso = res_issso[0] ? (res_issso[0].totalissso ? res_issso[0].totalissso : 0) : 0;
        det.total_qty_issso = det.total_qty_issso + qty_issso;
        const res_issprv = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "ISS-PRV"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalissprv']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_issprv = res_issprv[0] ? (res_issprv[0].totalissprv ? res_issprv[0].totalissprv : 0) : 0;
        det.total_qty_issprv = det.total_qty_issprv + qty_issprv;
        const res_rctunp = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "RCT-UNP"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalrctunp']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_rctunp = res_rctunp[0] ? (res_rctunp[0].totalrctunp ? res_rctunp[0].totalrctunp : 0) : 0;
        det.total_qty_rctunp = det.total_qty_rctunp + qty_rctunp;
        const res_issunp = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "ISS-UNP"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalissunp']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_issunp = res_issunp[0] ? (res_issunp[0].totalissunp ? res_issunp[0].totalissunp : 0) : 0;
        det.total_qty_issunp = det.total_qty_issunp + qty_issunp;
        const res_isscns = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.eq]: "ISS-CNS"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totalisscns']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_isscns = res_isscns[0] ? (res_isscns[0].totalisscns ? res_isscns[0].totalisscns : 0) : 0;
        det.total_qty_isscns = det.total_qty_isscns + qty_isscns;
        const res_tagcnt = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_ship_type: {[Op.ne]: "M"},
            tr_type:  {[Op.contains]: "TAG"},
            tr_effdate: { [Op.between]: [req.body.date_1, req.body.date_2] },
          },
          attributes: ['tr_part', 'tr_type',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'totaltag']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_tagcnt = res_tagcnt[0] ? (res_tagcnt[0].totaltagcnt ? res_tagcnt[0].totaltagcnt : 0) : 0;
        det.total_qty_tagcnt = det.total_qty_tagcnt + qty_tagcnt;



        const res_1 = await inventoryTransactionServiceInstance.findSpecial({
          where: {
            tr_part: det.ld_part,
            tr_type: {[Op.ne]: "M"}, 
            tr_effdate: { [Op.between]: [req.body.date_1, new Date()] },
          },
          attributes: ['tr_part',  [Sequelize.literal('SUM(tr_qty_loc * tr_um_conv)'), 'total']],
          group: ['tr_part'],
          raw: true,
        });
        const qty_1 = res_1[0] ? (res_1[0].total ? res_1[0].total : 0) : 0;
        det.total_qty_1 = det.total_qty - qty_1;







        const item = await itemService.findOneS({pt_part:det.ld_part})
        det.item = item
        result.push(det)
      }
    }
      console.log('aaa', result);

    return res.status(201).json({ message: 'created succesfully', data: result });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const inventoryByLoc = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    console.log(req.body.date);
    const items = await itemService.find({
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const results_head = [];
    const results_body = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.find({
          ld_part: item.pt_part,
          ld_loc: { [Op.between]: [req.body.ld_loc_1, req.body.ld_loc_2] },
                
      });
      console.log("here",locationDetails)  
        
        
      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const result_head = {
                
        ld_loc_head : det.ld_loc,
        }; 
        const result_body = {
          ld_status: det.ld_status,
          ld_loc_body : det.ld_loc,
          ld_part : det.ld_part,
          pt_desc1: item.pt_desc1,        
          pt_um: item.pt_um,
          ld_qty_oh: det.ld_qty_oh,
          ld_lot   : det.ld_lot,

        
        };
        results_body.push( result_body );
        let bool = false;
        for (var i = 0; i < results_head.length; i++) {
            if (results_head[i].ld_loc_head == det.ld_loc ) 
            { bool = true}
            }
            if (!bool) { results_head.push(result_head) } 
      }
    }
    //  console.log('aaa', result);

    return res.status(201).json({ message: 'created succesfully', data: {results_head,results_body} });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const inventoryByStatus = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    console.log(req.body.date);
    const items = await itemService.find({
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const results_head = [];
    const results_body = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.find({
          ld_part: item.pt_part,
          ld_status: { [Op.between]: [req.body.ld_status_1, req.body.ld_status_2] },
          ld_loc: { [Op.between]: [req.body.ld_loc_1, req.body.ld_loc_2] },
                
      });
      console.log("here",locationDetails)  
        
        
      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const result_head = {
                
          ld_status_head : det.ld_status,
          ld_loc_head : det.ld_loc,
        }; 
        const result_body = {
          ld_status_body: det.ld_status,
          ld_loc_body : det.ld_loc,
          ld_part : det.ld_part,
          pt_desc1: item.pt_desc1,        
          pt_um: item.pt_um,
          ld_qty_oh: det.ld_qty_oh,
          ld_lot   : det.ld_lot,
          ld_expire: det.ld_expire
        
        };
        results_body.push( result_body );
        let bool = false;
        for (var i = 0; i < results_head.length; i++) {
            if (results_head[i].ld_status_head == det.ld_status , results_head[i].ld_loc_head == det.ld_loc ) 
            { bool = true}
            }
            if (!bool) { results_head.push(result_head) } 
      }
    }
    //  console.log('aaa', result);

    return res.status(201).json({ message: 'created succesfully', data: {results_head,results_body} });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const inventoryOfSecurity = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling Create sequence endpoint');
  try {
    const itemService = Container.get(ItemService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    console.log(req.body.date);
    const items = await itemService.find({
      pt_part: {
        [Op.between]: [req.body.pt_part_1, req.body.pt_part_2],
      },
    });
    const result = [];
    for (const item of items) {
      const locationDetails = await locationDetailServiceInstance.findSpecial({
        where: {
          ld_part: item.pt_part,
          ld_status: { [Op.between]: [req.body.pt_status_1, req.body.pt_status_2] },
          ld_loc: { [Op.between]: [req.body.pt_loc_1, req.body.pt_loc_2] },
          
        },
        attributes: ['ld_part', 'ld_status', 'ld_loc', [Sequelize.fn('sum', Sequelize.col('ld_qty_oh')), 'total_qty']],
        group: ['ld_part', 'ld_status', 'ld_loc'],
        raw: true,
      });
      const d = moment().format('YYYY-MM-dd');
      for (const det of locationDetails) {
        const qty = res[0] ? (res[0].total_qty ? res[0].total_qty : 0) : 0;
        det.qty = qty ;
        const item = await itemService.findOneS({pt_part:det.ld_part})
        det.item = item
        if(det.qty < items.pt_safety_stk){
        result.push(det)}
      }
    }
    //  console.log('aaa', result);

    return res.status(201).json({ message: 'created succesfully', data: result });
  } catch (e) {
    //#
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

const rctWo = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it} = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const itemServiceInstance = Container.get(itemService);
    const statusServiceInstance = Container.get(statusService);
    const workOrderServiceInstance = Container.get(workOrderService);
console.log(it)
    for (const data of detail) {
      const { desc, ...item } = data;
      const pt = await itemServiceInstance.findOne({ pt_part: it.tr_part });

      const ld = await locationDetailServiceInstance.findOne({
        ld_part: it.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
      });
      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      else {
        console.log(item.tr_status)
     const status =   await statusServiceInstance.findOne({
      is_status: item.tr_status
     })

        await locationDetailServiceInstance.create({
          ld_part: it.tr_part,
          ld_lot: item.tr_serial,
          ld_date: new Date(),
          ld_site: item.tr_site,
          ld_loc: item.tr_loc,
          ld_status: item.tr_status,
          ld_qty_oh: Number(item.tr_qty_loc) * Number(item.tr_um_conv),
          ld_expire: item.tr_expire,
          ld__log01: status.is_nettable,
        }); }
      let qtyoh = 0;
      if (ld) {
        qtyoh = Number(ld.ld_qty_oh);
      } else {
        qtyoh = 0;
      }
      const sct = await costSimulationServiceInstance.findOne({
        sct_part: it.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STDCG',
      });
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_qty_chg: Number(item.tr_qty_loc),
        tr_loc_begin: Number(qtyoh),
        tr_type: 'RCT-WO',
        tr_date: new Date(),
        tr_mtl_std: sct.sct_mtl_tl,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        tr_prod_line: pt.pt_prod_line,
        tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      });
      const wo = await workOrderServiceInstance.findOne({id: it.tr_lot})
     
      if(wo) await workOrderServiceInstance.update({wo_qty_comp : Number(wo.wo_qty_comp) + Number(item.tr_qty_loc) ,last_modified_by:user_code,last_modified_ip_adr: req.headers.origin },{id: wo.id})
      
    }
    return res.status(200).json({ message: 'Added succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};
const issWo = async (req: Request, res: Response, next: NextFunction) => {
  const logger = Container.get('logger');
  const { user_code } = req.headers;

  logger.debug('Calling update one  code endpoint');
  try {
    const { detail, it } = req.body;
    const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
    const locationDetailServiceInstance = Container.get(locationDetailService);
    const costSimulationServiceInstance = Container.get(costSimulationService);
    const itemServiceInstance = Container.get(itemService);
    const workOrderDetailServiceInstance = Container.get(workOrderDetailService);

    for (const item of detail) {
      const sct = await costSimulationServiceInstance.findOne({
        sct_part: item.tr_part,
        sct_site: item.tr_site,
        sct_sim: 'STDCG',
      });


      
      const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part });
      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.tr_part,
        ld_lot: item.tr_serial,
        ld_site: item.tr_site,
        ld_loc: item.tr_loc,
      });

      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) - Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      await inventoryTransactionServiceInstance.create({
        ...item,
        ...it,
        tr_gl_date: it.tr_effdate,
        tr_qty_loc: -1 * Number(item.tr_qty_loc),
        tr_qty_chg: -1 * Number(item.tr_qty_loc),
        tr_loc_begin: Number(ld.ld_qty_oh),
        tr_type: 'ISS-WO',
        tr_date: new Date(),
        tr_price: sct.sct_mtl_tl,
        tr_mtl_std: sct.sct_mtl_tl,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        tr_prod_line: pt.pt_prod_line,
        tr_gl_amt: Number(item.tr_qty_loc) * Number(item.tr_um_conv) * Number(item.tr_price),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      });
  if( !isNaN(item.wodid)) {
        const wod = await workOrderDetailServiceInstance.findOne({ id: item.wodid});
        if(wod)  {
          var bool = false

          if(Number(wod.wod_qty_req) - ( Number(wod.wod_qty_iss) + Number(item.tr_qty_loc) * Number(item.tr_um_conv)) >= 0) { bool = true}
          await workOrderDetailServiceInstance.update(
          {
            wod__qadl01 : true ? (bool) : false,
            wod_qty_iss: Number(wod.wod_qty_iss) + Number(item.tr_qty_loc) * Number(item.tr_um_conv),
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: wod.id },
        );
      } 
  }else {

    await workOrderDetailServiceInstance.create({
      wod_nbr     : it.tr_nbr,
      wod_lot     : it.tr_lot,
      wod_part    : item.tr_part,
      wod_qty_req : 0,
      wod_qty_iss : item.tr_qty_loc,
      wod_site    : item.tr_site,
      wod_loc     : item.tr_loc,
      wod_um      : item.tr_um,
      wod_serial  : item.tr_serial,
      wod_ref     : item.tr_ref,
      wod__qadl01 : true,

    })




  }

    }
    return res.status(200).json({ message: 'deleted succesfully', data: true });
  } catch (e) {
    logger.error('🔥 error: %o', e);
    return next(e);
  }
};

export default {
  create,
  findOne,
  findAll,
  findBy,
  update,
  deleteOne,
  rctUnp,
  issUnp,
  issTr,
  issChl,
  inventoryToDate,
  inventoryActivity,
  inventoryByStatus,
  inventoryByLoc,
  inventoryOfSecurity,
  rctWo,
  issWo,
};
