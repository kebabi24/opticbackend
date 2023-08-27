import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"

const sequelize = Container.get("sequelize")

const LocationGlasses = sequelize.define(
    "locationGlasses",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        ldg_loc: Sequelize.STRING,
        ldg_part: {
            type: Sequelize.STRING,
            references:{
                model: "gls_mstr",
                key: "gls_part",
            },

        },
        ldg_cyl: {type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg_sph: {type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg_add: {type: Sequelize.DECIMAL  },
        ldg_date: Sequelize.DATEONLY,
        ldg_qty_oh: {type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg_lot: Sequelize.STRING,
        ldg_ref: Sequelize.STRING,
        ldg_cnt_date:Sequelize.DATEONLY,
        ldg_assay: {type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg_expire: Sequelize.DATEONLY,
        ldg_user1: Sequelize.STRING,
        ldg_user2: Sequelize.STRING,
        ldg_site: Sequelize.STRING,
        ldg_status: Sequelize.STRING,
        ldg_qty_all: {type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg_grade: Sequelize.STRING,
        ldg_qty_frz: Sequelize.DECIMAL,
        ldg_date_frz: Sequelize.DATEONLY,
        ldg_vd_lot: Sequelize.STRING,
        ldg_cmtindx: Sequelize.INTEGER,
        ldg_work: {type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg__chr01:Sequelize.STRING,
        ldg__chr02:Sequelize.STRING,
        ldg__chr03:Sequelize.STRING,
        ldg__chr04:Sequelize.STRING,
        ldg__chr05:Sequelize.STRING,
        ldg__dte01:Sequelize.DATEONLY,
        ldg__dte02:Sequelize.DATEONLY,
        ldg__dec01:{type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg__dec02:{type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg__log01:Sequelize.BOOLEAN,
        ldg_cost:{type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg_rev:Sequelize.STRING,
        ldg_cust_consign_qty:{type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg_supp_consign_qty:{type: Sequelize.DECIMAL, defaultValue : 0  },
        ldg_domain: {
            type: Sequelize.STRING,
            defaultValue: 'zitouni'
        },

        ...base,
    },
    {
        tableName: "ldg_det",
    }
)
export default LocationGlasses
