import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"

const sequelize = Container.get("sequelize")

const Doctor = sequelize.define(
    "devise",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        dr_addr: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: true
        },
        dr_desc: Sequelize.STRING,
      
        dr_active: {type: Sequelize.BOOLEAN, defaultValue : false  },
        dr_mod_userid: Sequelize.STRING,
        dr_mod_date: Sequelize.DATEONLY,
        dr_user1: Sequelize.STRING,
        dr_user2: Sequelize.STRING,
        dr_iso_curr: Sequelize.STRING,
        dr_domain: {
            type: Sequelize.STRING,
            defaultValue: 'zitouni'
        },
        oid_dr_mstr: {type: Sequelize.DECIMAL, defaultValue : 0  },
        ...base,
    },
    {
        tableName: "dr_mstr",
    }
)
export default Doctor
