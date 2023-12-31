import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"

const sequelize = Container.get("sequelize")

const saleOrderAccessoire = sequelize.define(
    "saleorderAccessoire",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        soda_nbr: {
            type: Sequelize.STRING,
            references: {
                model: "so_mstr",
                key: "so_nbr",
            },
        },
        soda_line: Sequelize.INTEGER,
        soda_part: {
            type: Sequelize.STRING,
            references:{
                model: "acs_mstr",
                key: "acs_part",
            },

        },

        soda_tax_code: {
            type: Sequelize.STRING,
            references: {
                model: "tx2_mstr",
                key: "tx2_tax_code",
            },
        },
    soda_due_date: Sequelize.DATEONLY,
    soda_per_date: Sequelize.DATEONLY,
    soda_req_date: Sequelize.DATEONLY,
    soda_qty_ord:{type: Sequelize.DECIMAL, defaultValue : 0  }, 
    soda_qty_all: {type: Sequelize.DECIMAL, defaultValue : 0  }, 
    soda_qty_pick: {type: Sequelize.DECIMAL, defaultValue : 0  }, 
    soda_qty_ship:   {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_qty_inv:  {type: Sequelize.DECIMAL, defaultValue : 0  }, 
    soda_loc: Sequelize.STRING,
    soda_type: Sequelize.STRING,
    soda_price: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_sales_price: {type: Sequelize.DECIMAL, defaultValue : 0  }, 
    soda_std_cost: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_qty_chg:  {type: Sequelize.DECIMAL, defaultValue : 0  }, 
    soda_bo_chg: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_acct: Sequelize.STRING,
    soda_abnormal: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_taxable: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_serial: Sequelize.STRING,
    soda_desc: Sequelize.STRING,
    soda_um: Sequelize.STRING,
    soda_cc: Sequelize.STRING,
    soda_comment: Sequelize.STRING,
    soda_lot: Sequelize.STRING,
    soda_um_conv: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_fa_nbr: Sequelize.STRING,
    soda_disc_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_project: Sequelize.STRING,
    soda_cmtindx: Sequelize.INTEGER,
    soda_custpart: Sequelize.STRING,
    soda__qad01: Sequelize.INTEGER,
    soda_status: Sequelize.STRING,
    soda_xslspsn: Sequelize.STRING,
    soda_xcomm_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_dsc_acct: Sequelize.STRING,
    soda_dsc_cc: Sequelize.STRING,
    soda_list_pr: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_user1: Sequelize.STRING,
    soda_user2: Sequelize.STRING,
    soda_sob_rev: Sequelize.DATEONLY,
    soda_sob_std: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_qty_qote: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_consume: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_expire: Sequelize.DATEONLY,
    soda__qad02: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_taxc: Sequelize.STRING,
    soda_inv_nbr: Sequelize.STRING,
    soda_partial: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_site: Sequelize.STRING,
    soda_prodline: Sequelize.STRING,
    soda_tax_in: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_fst_list: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_pst: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda__chr01: Sequelize.STRING,
    soda__chr02: Sequelize.STRING,
    soda__chr03: Sequelize.STRING,
    soda__chr04: Sequelize.STRING,
    soda__chr05: Sequelize.STRING,
    soda__chr06: Sequelize.STRING,
    soda__chr07: Sequelize.STRING,
    soda__chr08: Sequelize.STRING,
    soda__chr09: Sequelize.STRING,
    soda__chr10: Sequelize.STRING,
    soda__dte01: Sequelize.DATEONLY,
    soda__dte02: Sequelize.DATEONLY,
    soda__dec01: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda__dec02: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda__log01: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_tax_max: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_curr_rlse_id: Sequelize.STRING,
    soda_sched: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_contr_id: Sequelize.STRING,
    soda_pickdate: Sequelize.DATEONLY,
    soda_confirm: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_cum_qty: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_cum_date: Sequelize.DATEONLY,
    soda_for: Sequelize.STRING,
    soda_ref: Sequelize.STRING,
    soda_qty_per: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_qty_item: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_rma_type: Sequelize.STRING,
    soda_owner: Sequelize.STRING,
    soda_calc_isb: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_fr_rate: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_slspsn: Sequelize.STRING,
    soda_comm_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_ord_mult: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_pkg_code: Sequelize.STRING,
    soda_translt_days: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_fsm_type: Sequelize.STRING,
    soda_conrep: Sequelize.STRING,
    soda_sch_data: Sequelize.STRING,
    soda_sch_mrp: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_rlse_nbr: Sequelize.INTEGER,
    soda_start_eff: Sequelize.DATEONLY,
    soda_end_eff: Sequelize.DATEONLY,
    soda_dock: Sequelize.STRING,
    soda_pr_list: Sequelize.STRING,
    soda_translt_hrs: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_out_po: Sequelize.STRING,
    soda_raw_days: Sequelize.INTEGER,
    soda_fab_days: Sequelize.INTEGER,
    soda_tax_usage: Sequelize.STRING,
    soda_rbkt_days: Sequelize.INTEGER,
    soda_rbkt_weeks: Sequelize.INTEGER,
    soda_rbkt_mths: Sequelize.INTEGER,
    soda_sched_chgd: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_pastdue: Sequelize.STRING,
    soda_fix_pr: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_fr_wt: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_fr_wt_um: Sequelize.STRING,
    soda_fr_class: Sequelize.STRING,
    soda_fr_chg: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_ship: Sequelize.STRING,
    soda_sa_nbr: Sequelize.STRING,
    soda_enduser: Sequelize.STRING,
    soda_isb_loc: Sequelize.STRING,
    soda_upd_isb: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_isb_ref: Sequelize.INTEGER,
    soda_auto_ins: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_drp_ref: Sequelize.STRING,
    soda_tax_env: Sequelize.STRING,
    soda_crt_int: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_fr_list: Sequelize.STRING,
    soda_pricing_dt: Sequelize.DATEONLY,
    soda_act_price: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_covered_amt: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_fixed_price: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_inv_cost: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_car_load: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_ca_line: Sequelize.INTEGER,
    soda_qty_cons: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_qty_ret: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_ca_nbr: Sequelize.STRING,
    soda_qty_pend: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_to_loc: Sequelize.STRING,
    soda_to_site: Sequelize.STRING,
    soda_to_ref: Sequelize.STRING,
    soda_ln_ref: Sequelize.STRING,
    soda_qty_exch: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_sad_line: Sequelize.INTEGER,
    soda_warr_start: Sequelize.DATEONLY,
    soda_mod_userid: Sequelize.STRING,
    soda_mod_date: Sequelize.DATEONLY,
    soda_sv_code: Sequelize.STRING,
    soda_alt_pkg: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_for_serial: Sequelize.STRING,
    soda_override_lmt: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda__qadc01: Sequelize.STRING,
    soda__qadc02: Sequelize.STRING,
    soda__qadc03: Sequelize.STRING,
    soda__qadc04: Sequelize.STRING,
    soda__qadt01: Sequelize.DATEONLY,
    soda__qadt02: Sequelize.DATEONLY,
    soda__qadt03: Sequelize.DATEONLY,
    soda__qadt04: Sequelize.DATEONLY,
    soda__qadd01: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda__qadd02: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda__qadd03: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda__qadl01: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda__qadl02: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda__qadl03: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda__qadi01: Sequelize.INTEGER,
    soda__qadi02: Sequelize.INTEGER,
    soda_bonus: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_btb_type: Sequelize.STRING,
    soda_btb_po: Sequelize.STRING,
    soda_btb_pod_line: Sequelize.INTEGER,
    soda_btb_vend: Sequelize.STRING,
    soda_exp_del: Sequelize.DATEONLY,
    soda_dir_all: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_cfg_type: Sequelize.STRING,
    soda_div: Sequelize.STRING,
    soda_pl_priority: Sequelize.INTEGER,
    soda_prig1: Sequelize.STRING,
    soda_prig2: Sequelize.STRING,
    soda__qadd04: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_sub: Sequelize.STRING,
    soda_dsc_sub: Sequelize.STRING,
    soda_dsc_project: Sequelize.STRING,
    soda_qty_ivcd: {type: Sequelize.DECIMAL, defaultValue : 0  },
    soda_cum_time: Sequelize.INTEGER,
    soda_ship_part: Sequelize.STRING,
    soda_promise_date: Sequelize.DATEONLY,
    soda_charge_type: Sequelize.STRING,
    soda_order_category: Sequelize.STRING,
    soda_modelyr: Sequelize.STRING,
    soda_custref: Sequelize.STRING,
    soda_consignment: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_max_aging_days: Sequelize.INTEGER,
    soda_consign_loc: Sequelize.STRING,
    soda_intrans_loc: Sequelize.STRING,
    soda_auto_replenish: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_manual_fr_list: {type: Sequelize.BOOLEAN, defaultValue : false  },
    soda_req_time: Sequelize.STRING,


    soda_domain: {
        type: Sequelize.STRING,
        defaultValue: 'zitouni'
    },
    oid_soda_det: {type: Sequelize.DECIMAL, defaultValue : 0  },
    ...base,
        },
        {
            tableName: "soda_det",
        }
)
export default saleOrderAccessoire
