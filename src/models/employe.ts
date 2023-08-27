import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"

const sequelize = Container.get("sequelize")

const Employe = sequelize.define(
    "employe",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        emp_addr: {
            type: Sequelize.STRING,
            primaryKey: true,
            unique: true
        },
        emp_fname: Sequelize.STRING,
        emp_lname: Sequelize.STRING,
        emp_birth_date: Sequelize.DATEONLY,
        emp_sex:  Sequelize.STRING,
        emp_familysit:  Sequelize.STRING,
        emp_line1: Sequelize.STRING, 
        emp_line2: Sequelize.STRING,
        emp_line3: Sequelize.STRING,
        emp_ss_id:  Sequelize.STRING, 
        emp_country: Sequelize.STRING,
        emp_city: Sequelize.STRING,
        emp_county: Sequelize.STRING,
        emp_state: Sequelize.STRING,
        emp_zip:  Sequelize.INTEGER,
        emp_phone: Sequelize.STRING,
        emp_fax: Sequelize.STRING,
        emp_mail: Sequelize.STRING,
        emp_job: Sequelize.STRING,
        emp_level:  Sequelize.STRING,
        emp_shift: Sequelize.STRING,
        emp_site: Sequelize.STRING,
        emp_first_date: Sequelize.DATEONLY,
        emp_last_date: Sequelize.DATEONLY,
        emp_rate: Sequelize.DECIMAL,
        emp_mrate: Sequelize.DECIMAL,
        emp_arate: Sequelize.DECIMAL,
        emp_domain:  {
            type: Sequelize.STRING,
            defaultValue: 'zitouni'
        },
        
        ...base,
    },
    {
        tableName: "emp_mstr",
    }
)
export default Employe
