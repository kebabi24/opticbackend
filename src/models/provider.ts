import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"
import Address from "./address"
const sequelize = Container.get("sequelize")

const Provider = sequelize.define(
    "provider",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        vd_addr: {
            type: Sequelize.STRING,
            unique: true,
            references: {
                model: "ad_mstr",
                key: "ad_addr",
            },
        },
        vd_curr: {
            type: Sequelize.STRING,
            references: {
                model: "cu_mstr",
                key: "cu_curr",
            },
        },
        vd_cr_terms: Sequelize.STRING,
        vd_buyer: Sequelize.STRING,
        vd_disc_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
        vd_shipvia: Sequelize.STRING,
        vd_partial: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_rmks: Sequelize.STRING,
        vd_ap_acct: Sequelize.STRING,
        vd_ap_cc: Sequelize.STRING,
        vd_act_acct: Sequelize.STRING,
        vd_act_cc: Sequelize.STRING,
        vd_pur_cntct: Sequelize.STRING,
        vd_ap_cntct: Sequelize.STRING,
        vd_1099: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_sort: Sequelize.STRING,
        vd_last_ck: Sequelize.DATEONLY,
        vd_balance: {type: Sequelize.DECIMAL, defaultValue : 0  },
        vd_hold: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_tax_id: Sequelize.STRING,
        vd_taxable: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_user1: Sequelize.STRING,
        vd_user2: Sequelize.STRING,
        vd_lang: Sequelize.STRING,
        vd_vt_id: Sequelize.STRING,
        vd_fob: Sequelize.STRING,
        vd_debtor: Sequelize.STRING,
        vd_bank: Sequelize.STRING,
        vd_ckfrm: Sequelize.STRING,
        vd_pay_spec: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_remit: Sequelize.STRING,
        vd_type: Sequelize.STRING,
        vd_userid: Sequelize.STRING,
        vd_mod_date: Sequelize.DATEONLY,
        vd_prepay: {type: Sequelize.DECIMAL, defaultValue : 0  },
        vd_conrep_logic: Sequelize.STRING,
        vd_pr_list: Sequelize.STRING,
        vd_drft_bal: {type: Sequelize.DECIMAL, defaultValue : 0  },
        vd_lc_bal: {type: Sequelize.DECIMAL, defaultValue : 0  },
        vd_pr_list2: Sequelize.STRING,
        vd_fix_pr: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_fr_list: Sequelize.STRING,
        vd_fr_min_wt: {type: Sequelize.DECIMAL, defaultValue : 0  },
        vd_fr_terms: Sequelize.STRING,
        vd_tid_notice: Sequelize.STRING,
        vd_promo: Sequelize.STRING,
        vd_misc_cr: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_rcv_so_price: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_rcv_held_so: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_tp_use_pct: {type: Sequelize.BOOLEAN, defaultValue : false  },
        vd_tp_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
        vd_ex_ratetype: Sequelize.STRING,
        vd_db: Sequelize.STRING,
        vd_ap_sub: Sequelize.STRING,
        vd_act_sub: Sequelize.STRING,
        vd_tot_terms_code: Sequelize.STRING,
        vd_carrier_id: Sequelize.STRING,
        vd_kanban_supplier: Sequelize.STRING,
        vd_domain: {
            type: Sequelize.STRING,
            defaultValue: "acsiome",
        },
        oid_vd_mstr: Sequelize.STRING,
        ...base,
    },
    {
        tableName: "vd_mstr",
    }
)

export default Provider
