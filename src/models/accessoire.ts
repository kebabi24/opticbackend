import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"

const sequelize = Container.get("sequelize")

const Accessoire = sequelize.define(
    "accessoire",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        acs_part: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: true
        },
        acs_desc1: Sequelize.STRING,
        acs_desc2: Sequelize.STRING,
        acs_um: Sequelize.STRING,
        acs_draw: Sequelize.STRING,
        acs_prod_line: {
            type: Sequelize.STRING,
            references:{
                model: "pl_mstr",
                key: "pl_prod_line",
            },

        },
        acs_group: Sequelize.STRING,
        acs_part_type: Sequelize.STRING,
        acs_status: Sequelize.STRING,
        acs_abc: Sequelize.STRING,
        acs_iss_pol: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_phantom: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_loc:{
            type: Sequelize.STRING,
            references:{
                model: "loc_mstr",
                key: "loc_loc",
            },

        },
        acs_abc_amt: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_avg_int: Sequelize.INTEGER,
        acs_cyc_int: Sequelize.INTEGER,
        acs_ms: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_plan_ord: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_mrp: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_ord_pol: Sequelize.STRING,
        acs_ord_qty: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_ord_per: Sequelize.INTEGER,
        acs_sfty_stk: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_sfty_time: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_rop: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_buyer: Sequelize.STRING,
        acs_vend: Sequelize.STRING,
        acs_pm_code: Sequelize.STRING,
        acs_mfg_lead: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_pur_lead: Sequelize.INTEGER,
        acs_insp_rqd: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_insp_lead: Sequelize.INTEGER,
        acs_cum_lead: Sequelize.INTEGER,
        acs_ord_min: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_ord_max: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_ord_mult: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_yield_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_setup: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_setup_ll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_run_ll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_run: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_price: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_sales_price: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_marge: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_pur_price: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xmtl_tl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xlbr_tl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xbdn_tl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xsub_tl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xmtl_ll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xlbr_ll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xbdn_ll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xsub_ll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xtot_cur: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_cur_date: Sequelize.DATEONLY,
        acs_xmtl_stdtl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xlbr_stdtl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xbdn_stdtl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xsub_stdtl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xtot_std: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_std_date: Sequelize.DATEONLY,
        acs_ll_code: Sequelize.INTEGER,
        acs_abc_qty: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_routing: Sequelize.STRING,
        acs_lot_ser: Sequelize.STRING,
        acs_timefence: Sequelize.INTEGER,
        acs_xmtl_stdll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xlbr_stdll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xbdn_stdll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xsub_stdll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_rev: Sequelize.STRING,
        acs_last_eco: Sequelize.DATEONLY,
        acs_qc_lead: Sequelize.INTEGER,
        acs_auto_lot: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_assay: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_batch: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_user3: Sequelize.STRING,
        acs_user2: Sequelize.STRING,
        acs_user1: Sequelize.STRING,
        acs_net_wt: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_net_wt_um: Sequelize.STRING,
        acs_size: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_size_um: Sequelize.STRING,
        acs_taxable: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_taxc: Sequelize.STRING,
        acs_rollup: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_xovh_ll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xovh_tl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xovh_stdll: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_xovh_stdtl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_site: Sequelize.STRING,
        acs_shelflife: Sequelize.INTEGER,
        acs_critical: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_sngl_lot: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_upc: Sequelize.STRING,
        acs_hazard: Sequelize.STRING,
        acs_added: Sequelize.DATEONLY,
        acs_length: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_height: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_width: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_dim_um: Sequelize.STRING,
        acs_pkg_code: Sequelize.STRING,
        acs_network: Sequelize.STRING,
        acs_fr_class: Sequelize.STRING,
        acs_spec_hdlg: Sequelize.STRING,
        acs_bom_code: Sequelize.STRING,
        acs_loc_type: Sequelize.STRING,
        acs_transtype: Sequelize.STRING,
        acs_warr_cd: Sequelize.STRING,
        acs_pvm_days: Sequelize.INTEGER,
        acs_isb: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_mttr: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_mtbf: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_svc_type: Sequelize.STRING,
        acs_svc_group: Sequelize.STRING,
        acs_ven_warr: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_fru: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_mfg_mttr: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_mfg_mtbf: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_sttr: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_origin: Sequelize.STRING,
        acs_tariff: Sequelize.STRING,
        acs_sys_type: Sequelize.STRING,
        acs_inst_call: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_cover: Sequelize.STRING,
        acs_unit_isb: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_article: Sequelize.STRING,
        acs_ll_drp: Sequelize.INTEGER,
        acs_po_site: Sequelize.STRING,
        acs_ship_wt: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_ship_wt_um: Sequelize.STRING,
        acs_userid: Sequelize.STRING,
        acs_mod_date: Sequelize.DATEONLY,
        acs_comm_code: Sequelize.STRING,
        acs_dea: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_formula: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_obs_date: Sequelize.DATEONLY,
        acs_pvm_bom: Sequelize.STRING,
        acs_pvm_route: Sequelize.STRING,
        acs_pvm_um: Sequelize.STRING,
        acs_rp_bom: Sequelize.STRING,
        acs_rp_route: Sequelize.STRING,
        acs_rp_vendor: Sequelize.STRING,
        acs_rctpo_status: Sequelize.STRING,
        acs_rollup_id: Sequelize.STRING,
        acs_spec_grav: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_joint_type: Sequelize.STRING,
        acs_mfg_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_pur_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_drp_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_pou_code: Sequelize.STRING,
        acs_wks_avg: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_wks_max: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_wks_min: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_pick_logic: Sequelize.INTEGER,
        acs_fiscal_class: Sequelize.STRING,
        acs_dsgn_grp: Sequelize.STRING,
        acs_drwg_loc: Sequelize.STRING,
        acs_ecn_rev: Sequelize.STRING,
        acs_drwg_size: Sequelize.STRING,
        acs_model: Sequelize.STRING,
        acs_repairable: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_rctwo_status: Sequelize.STRING,
        acs_rctpo_active: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_lot_grp: Sequelize.STRING,
        acs_rctwo_active: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_break_cat: Sequelize.STRING,
        acs_fsc_code: Sequelize.STRING,
        acs_trace_active: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_trace_detail: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_pm_mrp: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_ins_call_type: Sequelize.STRING,
        acs_ins_bom: Sequelize.STRING,
        acs_ins_route: Sequelize.STRING,
        acs_promo: Sequelize.STRING,
        acs_meter_interval: {type: Sequelize.DECIMAL, defaultValue : 0  },
        acs_meter_um: Sequelize.STRING,
        acs_wh: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_btb_type: Sequelize.STRING,
        acs_cfg_type: Sequelize.STRING,
        acs_app_owner: Sequelize.STRING,
        acs_op_yield: Sequelize.STRING,
        acs_run_seq1: Sequelize.STRING,
        acs_run_seq2: Sequelize.STRING,
        acs_atp_enforcement: Sequelize.STRING,
        acs_atp_family: {type: Sequelize.BOOLEAN, defaultValue : false  },
        acs_domain: {
            type: Sequelize.STRING,
            defaultValue: 'zitouni'
        },
        oid_acs_mstr: Sequelize.STRING,
        ...base,
    },
    {
        tableName: "acs_mstr",
    }
)
export default Accessoire
