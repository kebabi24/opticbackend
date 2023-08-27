import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"

const sequelize = Container.get("sequelize")

const Peniche = sequelize.define(
    "peniche",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        pen_pen: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: true
        },
        pen_used: {type: Sequelize.BOOLEAN, defaultValue : false  }, 
        pen_nbr: Sequelize.STRING,
        pen__qad01: {type: Sequelize.BOOLEAN, defaultValue : false  },
        pen_date: Sequelize.DATEONLY,
        pen_perm: {type: Sequelize.BOOLEAN, defaultValue : false  },
        pen__qadc01: Sequelize.STRING,
        pen__qadc02: Sequelize.STRING,
        pen_project: Sequelize.STRING,
        pen_site: Sequelize.STRING,
        pen_status: Sequelize.STRING,
        pen_user1: Sequelize.STRING,
        pen_user2: Sequelize.STRING,
        pen_single: {type: Sequelize.BOOLEAN, defaultValue : false  },
        pen_type: Sequelize.STRING,
        pen_desc: Sequelize.STRING,
        pen_cap: {type: Sequelize.DECIMAL, defaultValue : 0  },
        pen_cap_um: Sequelize.STRING,
        pen_phys_addr: Sequelize.STRING,
        pen_xfer_ownership: {type: Sequelize.BOOLEAN, defaultValue : false  },
        pen_domain: {
            type: Sequelize.STRING,
            defaultValue: 'zitouni'
        },
        oid_pen_mstr: {type: Sequelize.DECIMAL, defaultValue : 0  },

        ...base,
    },
    {
        tableName: "pen_mstr",
    }
)
export default Peniche
