import { Container } from "typedi"
import Sequelize from "sequelize"
import base from "./base"

const sequelize = Container.get("sequelize")

const GlassesDetail = sequelize.define(
    "GlassesDetail",
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true

        },
        glsd_part: {
            type: Sequelize.STRING,
            references: {
                model: "gls_mstr",
                key: "gls_part",
            },
        },
        glsd_sph_min: {type: Sequelize.DECIMAL, defaultValue : 0  },
        glsd_sph_max: {type: Sequelize.DECIMAL, defaultValue : 0  },
        glsd_cyl_min: {type: Sequelize.DECIMAL, defaultValue : 0  },
        glsd_cyl_max: {type: Sequelize.DECIMAL, defaultValue : 0  },
        glsd_add_min: {type: Sequelize.DECIMAL,   },
        glsd_add_max: {type: Sequelize.DECIMAL,   },
        glsd_pur_price: {type: Sequelize.DECIMAL, defaultValue : 0  },
        glsd_price: {type: Sequelize.DECIMAL, defaultValue : 0  },
        glsd_sales_price: {type: Sequelize.DECIMAL, defaultValue : 0  },
        glsd_marge: {type: Sequelize.DECIMAL, defaultValue : 0  },
        glsd_domain: {
            type: Sequelize.STRING,
            defaultValue: 'zitouni'
        },
       
        ...base,
    },
    {
        tableName: "glsd_det",
    }
)
export default GlassesDetail
