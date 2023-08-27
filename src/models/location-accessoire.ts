import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"

const sequelize = Container.get("sequelize")

const LocationAccessoire = sequelize.define(
    "locationAccessoires",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        lda_loc: Sequelize.STRING,
        lda_part: {
            type: Sequelize.STRING,
            references:{
                model: "acs_mstr",
                key: "acs_part",
            },

        },
        lda_date: Sequelize.DATEONLY,
        lda_qty_oh: {type: Sequelize.DECIMAL, defaultValue : 0  },
        lda_lot: Sequelize.STRING,
        lda_ref: Sequelize.STRING,
        lda_cnt_date:Sequelize.DATEONLY,
        lda_assay: {type: Sequelize.DECIMAL, defaultValue : 0  },
        lda_expire: Sequelize.DATEONLY,
        lda_user1: Sequelize.STRING,
        lda_user2: Sequelize.STRING,
        lda_site: Sequelize.STRING,
        lda_status: Sequelize.STRING,
        lda_qty_all: {type: Sequelize.DECIMAL, defaultValue : 0  },
        lda_grade: Sequelize.STRING,
        lda_qty_frz: Sequelize.DECIMAL,
        lda_date_frz: Sequelize.DATEONLY,
        lda_vd_lot: Sequelize.STRING,
        lda_cmtindx: Sequelize.INTEGER,
        lda_work: {type: Sequelize.DECIMAL, defaultValue : 0  },
        lda__chr01:Sequelize.STRING,
        lda__chr02:Sequelize.STRING,
        lda__chr03:Sequelize.STRING,
        lda__chr04:Sequelize.STRING,
        lda__chr05:Sequelize.STRING,
        lda__dte01:Sequelize.DATEONLY,
        lda__dte02:Sequelize.DATEONLY,
        lda__dec01:{type: Sequelize.DECIMAL, defaultValue : 0  },
        lda__dec02:{type: Sequelize.DECIMAL, defaultValue : 0  },
        lda__log01:Sequelize.BOOLEAN,
        lda_cost:{type: Sequelize.DECIMAL, defaultValue : 0  },
        lda_rev:Sequelize.STRING,
        lda_cust_consign_qty:{type: Sequelize.DECIMAL, defaultValue : 0  },
        lda_supp_consign_qty:{type: Sequelize.DECIMAL, defaultValue : 0  },
        lda_domain: {
            type: Sequelize.STRING,
            defaultValue: 'zitouni'
        },

        ...base,
    },
    {
        tableName: "lda_det",
    }
)
export default LocationAccessoire
