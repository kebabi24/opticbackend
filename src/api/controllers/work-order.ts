import WorkOrderService from "../../services/work-order"
import WorkOrderDetailService from "../../services/work-order-detail"
import WoroutingService from "../../services/worouting"
import WorkroutingService from "../../services/workrouting"
import InventoryTransactionService from '../../services/inventory-transaction';
import LocationDetailService from '../../services/location-details';
import CostSimulationService from '../../services/cost-simulation';
import { Router, Request, Response, NextFunction } from "express"
import { Container } from "typedi"
import { result } from "lodash"
import { IntegerDataType } from "sequelize/types"

const create = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get('logger');
    const { user_code } = req.headers;
  
    logger.debug('Calling update one  code endpoint');
    try {
      const { detail, it, nof } = req.body;
      const workOrderServiceInstance = Container.get(WorkOrderService)
      const woroutingServiceInstance = Container.get(WoroutingService)
      const workroutingServiceInstance = Container.get(WorkroutingService)
    
      for (const item of detail) {
   
        let wolot = 0;

        await workOrderServiceInstance.create({
          ...item,
          ...it,
          wo_nbr: nof,
          created_by: user_code,
          created_ip_adr: req.headers.origin,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        }).then(result => { wolot = result.id } );;
        const ros = await workroutingServiceInstance.find({ro_routing:it.wo_routing})
        for (const ro of ros) {
   
            await woroutingServiceInstance.create({
                wr_nbr: nof,
                wr_lot: wolot,
                wr_start: item.wo_rel_date,
                wr_routing: ro.ro_routing,
                wr_wkctr: ro.ro_wkctr,
                wr_mch: ro.ro_mch,
                wr_status : "F",
                wr_part: item.wo_part,
                wr_site: item.wo_site,
                wr_op: ro.ro_op,
                created_by: user_code,
                created_ip_adr: req.headers.origin,
                last_modified_by: user_code,
                last_modified_ip_adr: req.headers.origin,
              });
        }

      }
      return res.status(200).json({ message: 'deleted succesfully', data: true });
    } catch (e) {
      logger.error('🔥 error: %o', e);
      return next(e);
    }
  };
  const createDirect = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get('logger');
    const { user_code } = req.headers;
  
    logger.debug('Calling update one  code endpoint');
    try {
      const { detail, wo, nof } = req.body;
      const workOrderServiceInstance = Container.get(WorkOrderService)
      const workOrderDetailServiceInstance = Container.get(WorkOrderDetailService)
      const inventoryTransactionServiceInstance = Container.get(InventoryTransactionService);
      const costSimulationServiceInstance = Container.get(CostSimulationService);
      const locationDetailServiceInstance = Container.get(LocationDetailService);
    
      let wolot = 0;
      await workOrderServiceInstance.create({
        ...wo,
        wo_rel_date: wo.wo_ord_date,
        wo_due_date: wo.wo_ord_date,
        wo_status: "C",
        wo_nbr: nof,
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      }).then(result => { wolot = result.id } );;
      const sct = await costSimulationServiceInstance.findOne({
        sct_part: wo.wo_part,
        sct_site: wo.wo_site,
        sct_sim: 'STDCG',
      });

      const ld = await locationDetailServiceInstance.findOne({
        ld_part: wo.wo_part,
        ld_lot: wo.wo_serial,
        ld_site: wo.wo_site,
        ld_loc: wo.wo_loc,
      });
      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) + Number(wo.wo_qty_ord) ,
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      else {
     
        await locationDetailServiceInstance.create({
          ld_part: wo.wo_part,
          ld_lot: wo.wo_serial,
          ld_um: wo.wo_um,
          ld_date: new Date(),
          ld_site: wo.wo_site,
          ld_loc: wo.wo_loc,
          ld_status: wo.wo_rctstat,
          ld_qty_oh: Number(wo.wo_qty_ord) ,
         // ld_expire: item.tr_expire,
          //ld__log01: status.is_nettable,
        }); }
      let qtyoh = 0;
      if (ld) {
        qtyoh = Number(ld.ld_qty_oh);
       
      } else {
        qtyoh = 0;
      }


      await inventoryTransactionServiceInstance.create({
        tr_nbr: nof,
        tr_lot:wolot,
        tr_part: wo.wo_part,
        tr_site: wo.wo_site,
        tr_loc : wo.wo_loc,
        tr_um: wo.wo__chr01,
        tr_serial: wo.wo_serial,
        tr_um_conv: 1,
        tr_qty_loc: Number(wo.wo_qty_ord),
        tr_effdate: wo.wo_ord_date,
        tr_qty_chg: Number(wo.wo_qty_ord),
        tr_loc_begin: Number(qtyoh),
        tr_type: 'RCT-WO',
        tr_status: wo.wo_rctstat,
        tr_date: new Date(),
        tr_mtl_std: sct.sct_mtl_tl,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
        //tr_prod_line: pt.pt_prod_line,
        tr_gl_amt: Number(wo.wo_qty_ord) * Number(sct.sct_mtl_tl),
        created_by: user_code,
        created_ip_adr: req.headers.origin,
        last_modified_by: user_code,
        last_modified_ip_adr: req.headers.origin,
      });

      for (const item of detail) {
   
       

        await workOrderDetailServiceInstance.create({
          ...item,
          wod_lot: wolot,
          wod_nbr: nof,
          wod_iss_date: wo.wo_ord_date,
          created_by: user_code,
          created_ip_adr: req.headers.origin,
          last_modified_by: user_code,
          last_modified_ip_adr: req.headers.origin,
        })
  
    const sct = await costSimulationServiceInstance.findOne({
        sct_part: item.wod_part,
        sct_site: item.wod_site,
        sct_sim: 'STDCG',
      });


      
     // const pt = await itemServiceInstance.findOne({ pt_part: item.tr_part });
      const ld = await locationDetailServiceInstance.findOne({
        ld_part: item.wod_part,
        ld_lot: item.wod_serial,
        ld_site: item.wod_site,
        ld_loc: item.wod_loc,
      });

      if (ld)
        await locationDetailServiceInstance.update(
          {
            ld_qty_oh: Number(ld.ld_qty_oh) - Number(item.wod_qty_req) ,
            last_modified_by: user_code,
            last_modified_ip_adr: req.headers.origin,
          },
          { id: ld.id },
        );
      await inventoryTransactionServiceInstance.create({
        //...item,
        tr_part: item.wod_part,
        tr_site: item.wod_site,
        tr_loc: item.wod_loc,
        tr_serial: item.wod_serial,
        tr_ref: item.wod_ref,
        tr_nbr: nof,
        tr_um: item.wod_um,
        tr_um_conv: 1,
        tr_lot:wolot,
        tr_status: item.wod_status,
        tr_effdate: wo.wo_ord_date,
        tr_gl_date: wo.wo_ord_date,
        tr_qty_loc: -1 * Number(item.wod_qty_req),
        tr_qty_chg: -1 * Number(item.wod_qty_req),
        tr_loc_begin: Number(ld.ld_qty_oh),
        tr_type: 'ISS-WO',
        tr_date: new Date(),
        tr_price: sct.sct_mtl_tl,
        tr_mtl_std: sct.sct_mtl_tl,
        tr_lbr_std: sct.sct_lbr_tl,
        tr_bdn_std: sct.sct_bdn_tl,
        tr_ovh_std: sct.sct_ovh_tl,
        tr_sub_std: sct.sct_sub_tl,
       // tr_prod_line: pt.pt_prod_line,
        tr_gl_amt: Number(item.tr_qty_loc) *  Number(sct.sct_mtl_tl),
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
const findOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find one  wo endpoint")
    try {
        const workOrderServiceInstance = Container.get(WorkOrderService)
        const {id} = req.params
        const wo = await workOrderServiceInstance.findOne({id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: wo  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findAll = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    console.log(req.headers.origin)

    logger.debug("Calling find all wo endpoint")
    try {
        const workOrderServiceInstance = Container.get(WorkOrderService)
        const wos = await workOrderServiceInstance.find({})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: wos })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findBy = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all wo endpoint")
    try {
        const workOrderServiceInstance = Container.get(WorkOrderService)
        const wos = await workOrderServiceInstance.find({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: wos })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const findByOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling find by  all wo endpoint")
    try {
        const workOrderServiceInstance = Container.get(WorkOrderService)
        const wos = await workOrderServiceInstance.findOne({...req.body})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: wos })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    const{user_code} = req.headers

    console.log(req.body)
    logger.debug("Calling update one  wo endpoint")
    try {
        const workOrderServiceInstance = Container.get(WorkOrderService)
        const {id} = req.params
        const wo = await workOrderServiceInstance.update({...req.body, last_modified_by:user_code,last_modified_ip_adr: req.headers.origin},{id})
        return res
            .status(200)
            .json({ message: "fetched succesfully", data: wo  })
    } catch (e) {
        logger.error("🔥 error: %o", e)
        return next(e)
    }
}

const deleteOne = async (req: Request, res: Response, next: NextFunction) => {
    const logger = Container.get("logger")
    logger.debug("Calling update one  wo endpoint")
    try {
        const workOrderServiceInstance = Container.get(WorkOrderService)
        const {id} = req.params
        const wo = await workOrderServiceInstance.delete({id})
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
    createDirect,
    findOne,
    findAll,
    findBy,
    findByOne,
    update,
    deleteOne
}
