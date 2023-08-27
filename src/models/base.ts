import Sequelize from 'sequelize'
export default {
    chr01: Sequelize.STRING,
    chr02: Sequelize.STRING,
    chr03: Sequelize.STRING,
    chr04: Sequelize.STRING,
    chr05: Sequelize.STRING,
    int01: Sequelize.INTEGER,
    int02: Sequelize.INTEGER,
    int03: Sequelize.INTEGER,
    int04: Sequelize.INTEGER,
    int05: Sequelize.INTEGER,
    dec01: {type:Sequelize.DECIMAL, defaultValue : 0  }, 
    dec02: {type:Sequelize.DECIMAL, defaultValue : 0  },
    dec03: {type:Sequelize.DECIMAL, defaultValue : 0  },
    dec04: {type:Sequelize.DECIMAL, defaultValue : 0  },
    dec05: {type:Sequelize.DECIMAL, defaultValue : 0  },
    bool01: {type: Sequelize.BOOLEAN, defaultValue : false  },
    bool02: {type: Sequelize.BOOLEAN, defaultValue : false  },
    bool03: {type: Sequelize.BOOLEAN, defaultValue : false  },
    bool04: {type: Sequelize.BOOLEAN, defaultValue : false  },
    bool05: {type: Sequelize.BOOLEAN, defaultValue : false  },
    date01: Sequelize.DATEONLY,
    date02: Sequelize.DATEONLY,
    date03: Sequelize.DATEONLY,
    date04: Sequelize.DATEONLY,
    date05: Sequelize.DATEONLY,
    created_ip_adr: Sequelize.STRING,
    last_modified_ip_adr: Sequelize.STRING,
    created_by: Sequelize.STRING,
    last_modified_by: Sequelize.STRING
}