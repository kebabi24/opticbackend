import { Container } from 'typedi';
import Sequelize from 'sequelize';
import base from './base';
import Sequence from './sequence';


const sequelize = Container.get('sequelize');

const dailySales = sequelize.define(
    "dailysales",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,

        },
        ds_nbr: {
            type: Sequelize.STRING,
            unique: true,
        },
        ds_cust: {
            type: Sequelize.STRING,
            references:{
                model: "cm_mstr",
                key: "cm_addr",
            },

        },
	
		ds_category: {
			type: Sequelize.STRING,
			references: {
			  model: 'seq_mstr',
			  key: 'seq_seq',
			},
		  },
		ds_ship: Sequelize.STRING,
		ds_ord_date: Sequelize.DATEONLY,
		ds_req_date: Sequelize.DATEONLY,
		ds_due_date: Sequelize.DATEONLY,
		ds_rmks: Sequelize.STRING,
		ds_cr_terms: Sequelize.STRING,
		ds_fob: Sequelize.STRING,
		ds_po: Sequelize.STRING,
		ds_shipvia: Sequelize.STRING,
		ds_partial: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_conf: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_print_so: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_inv_nbr: Sequelize.STRING,
		ds_pr_list: Sequelize.STRING,
		ds_xslspsn: Sequelize.STRING,
		ds_source: Sequelize.STRING,
		ds_xcomm_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_cr_card: Sequelize.STRING,
		ds_print_pl: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_cr_init: Sequelize.STRING,
		ds_stat: Sequelize.STRING,
		ds__qad01: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds__qad02: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds__qad03: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_disc_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_tax_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_prepaid: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_to_inv: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_invoiced: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_ar_acct: Sequelize.STRING,
		ds_ar_cc: Sequelize.STRING,
		ds_inv_date: Sequelize.DATEONLY,
		ds_ship_date: Sequelize.DATEONLY,
		ds_taxable: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_cmtindx: Sequelize.INTEGER,
		ds__qad04: Sequelize.INTEGER,
		ds_user1: Sequelize.STRING,
		ds_user2: Sequelize.STRING,
		ds_curr: Sequelize.STRING,
		ds_ex_rate: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_lang: Sequelize.STRING,
		ds_type: Sequelize.STRING,
		ds_conf_date: Sequelize.DATEONLY,
		ds_rev: Sequelize.INTEGER,
		ds_bol: Sequelize.STRING,
		ds__qad05: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_pst: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_fst_id: Sequelize.STRING,
		ds_trl1_amt: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_trl1_cd: Sequelize.STRING,
		ds_trl2_amt: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_trl2_cd: Sequelize.STRING,
		ds_trl3_amt: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_trl3_cd: Sequelize.STRING,
		ds_weight: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_weight_um: Sequelize.STRING,
		ds_size: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_size_um: Sequelize.STRING,
		ds_cartons: Sequelize.INTEGER,
		ds_site: Sequelize.STRING,
		ds_pst_id: Sequelize.STRING,
		ds_cncl_date: Sequelize.DATEONLY,
		ds_quote: Sequelize.STRING,
		ds_taxc: Sequelize.STRING,
		ds__chr01: Sequelize.STRING,
		ds__chr02: Sequelize.STRING,
		ds__chr03: Sequelize.STRING,
		ds__chr04: Sequelize.STRING,
		ds__chr05: Sequelize.STRING,
		ds__chr06: Sequelize.STRING,
		ds__chr07: Sequelize.STRING,
		ds__chr08: Sequelize.STRING,
		ds__chr09: Sequelize.STRING,
		ds__chr10: Sequelize.STRING,
		ds__dte01: Sequelize.DATEONLY,
		ds__dte02: Sequelize.DATEONLY,
		ds__dec01: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds__dec02: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds__log01: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_credit: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_inv_cr: Sequelize.STRING,
		ds_project: Sequelize.STRING,
		ds_channel: Sequelize.STRING,
		ds_pst_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_fr_list: Sequelize.STRING,
		ds_fr_terms: Sequelize.STRING,
		ds_slspsn: Sequelize.STRING,
		ds_comm_pct: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_inv_mthd: Sequelize.STRING,
		ds_fix_rate: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_ent_ex: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_bill: Sequelize.STRING,
		ds_print_bl: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_userid: Sequelize.STRING,
		ds_tax_date: Sequelize.DATEONLY,
		ds_fsm_type: Sequelize.STRING,
		ds_conrep: Sequelize.STRING,
		ds_bank: Sequelize.STRING,
		ds_tax_env: Sequelize.STRING,
		ds_sched: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_fr_min_wt: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_pr_list2: Sequelize.STRING,
		ds_tax_usage: Sequelize.STRING,
		ds_sa_nbr: Sequelize.STRING,
		ds_fix_pr: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_sch_mthd: Sequelize.STRING,
		ds_pricing_dt: Sequelize.DATEONLY,
		ds_priced_dt: Sequelize.DATEONLY,
		ds_ca_nbr: Sequelize.STRING,
		ds_eng_code: Sequelize.STRING,
		ds_fcg_code: Sequelize.STRING,
		ds_ship_eng: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_crprlist: Sequelize.STRING,
		ds__qadc01: Sequelize.STRING,
		ds__qadc02: Sequelize.STRING,
		ds__qadc03: Sequelize.STRING,
		ds__qadc04: Sequelize.STRING,
		ds__qadc05: Sequelize.STRING,
		ds__qadl01: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds__qadl02: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_incl_iss: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds__qadi01: Sequelize.INTEGER,
		ds__qadi02: Sequelize.INTEGER,
		ds__qadi03: Sequelize.INTEGER,
		ds__qadd01: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds__qadd02: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds__qadd03: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds__qadt01: Sequelize.DATEONLY,
		ds__qadt02: Sequelize.DATEONLY,
		ds__qadt03: Sequelize.DATEONLY,
		ds_auth_days: Sequelize.INTEGER,
		ds_cum_acct: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_merge_rss: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_ship_cmplt: Sequelize.INTEGER,
		ds_bump_all: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_primary: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_cust_po: Sequelize.STRING,
		ds_secondary: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_ship_po: Sequelize.STRING,
		ds_ex_rate2: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_ex_ratetype: Sequelize.STRING,
		ds_div: Sequelize.STRING,
		ds_exru_seq: Sequelize.INTEGER,
		ds_app_owner: Sequelize.STRING,
		ds_ar_sub: Sequelize.STRING,
		ds_seq_order: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_inc_in_rss: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_firm_seq_days: Sequelize.INTEGER,
		ds_prep_tax: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds__qadl04: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_custref_val: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_consignment: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_max_aging_days: Sequelize.INTEGER,
		ds_consign_loc: Sequelize.STRING,
		ds_intrans_loc: Sequelize.STRING,
		ds_auto_replenish: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_revenue: Sequelize.STRING,
		ds_fsaccr_acct: Sequelize.STRING,
		ds_fsaccr_sub: Sequelize.STRING,
		ds_fsaccr_cc: Sequelize.STRING,
		ds_fsdef_acct: Sequelize.STRING,
		ds_fsdef_sub: Sequelize.STRING,
		ds_fsdef_cc: Sequelize.STRING,
		ds_manual_fr_terms: {type: Sequelize.BOOLEAN, defaultValue : false  },
		ds_req_time: Sequelize.STRING,
		ds_amt: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_tax_amt: {type: Sequelize.DECIMAL, defaultValue : 0  },
		ds_domain: {type: Sequelize.STRING,	defaultValue: 'zitouni'	},
		oid_ds_mstr: {type: Sequelize.DECIMAL, defaultValue : 0  },
		...base,
			},
			{
				tableName: "ds_mstr",
			}
		)
	dailySales.addHook('beforeCreate', async (instance, option) => {
		
	const seq = await Sequence.findOne({ where: { seq_seq: instance.ds_category, seq_type: "DS"  } });
	instance.ds_nbr = `${seq.seq_prefix}-${Number(seq.seq_curr_val)+1}`;
	await Sequence.update({ seq_curr_val: Number(seq.seq_curr_val )+1 }, { where: { seq_type: "DS", seq_seq: instance.ds_category } });
	});
export default dailySales;