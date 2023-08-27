import { Service, Inject } from "typedi"
import { DATE, Op } from 'sequelize';
@Service()
export default class SaleOrderGlassesService {
    constructor(
        @Inject("saleorderGlassesModel") private saleorderGlassesModel: Models.saleOrderGlassesModel,
        @Inject("saleorderModel") private saleorderModel: Models.saleOrderModel,
        @Inject("glassesModel") private glassesModel: Models.GlassesModel,
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const saleorderGlasses = await this.saleorderGlassesModel.create({ ...data })
            this.logger.silly("create saleorderGlasses mstr")
            return saleorderGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOne(query: any): Promise<any> {
        try {
            const saleorderGlasses = await this.saleorderGlassesModel.findOne({ where: query, include: this.glassesModel })
            this.logger.silly("find one saleorderGlasses mstr")
            return saleorderGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async find(query: any): Promise<any> {
        try {
            const saleorderGlassess = await this.saleorderGlassesModel.findAll({ where: query ,include: this.glassesModel})
            this.logger.silly("find All saleorderGlassess mstr")
            return saleorderGlassess
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findSpecial(query: any): Promise<any> {
        try {
            const saleorderGlassess = await this.saleorderGlassesModel.findAll(query)
            this.logger.silly("find All inventoryTransactions mstr")
            return saleorderGlassess
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findspec( date: Date, date1 : Date, vend: String): Promise<any> {
        try {
            console.log(date,date1)
            
            const saleorderGlassess = await this.saleorderGlassesModel.findAll({ include: [{model: this.saleorderModel, where : { so_ord_date: { [Op.between]: [date, date1]}}, required: true, left: true }, { model : this.glassesModel, where : { gls_vend : vend} , required: true, left:true}]})
            this.logger.silly("find All saleorderGlassess mstr")
            return saleorderGlassess
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const saleorderGlasses = await this.saleorderGlassesModel.update(data, { where: query })
            this.logger.silly("update one saleorderGlasses mstr")
            return saleorderGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
   public async delete(query: any): Promise<any> {
        try {
            const saleorderGlasses = await this.saleorderGlassesModel.destroy({ where: query })
            this.logger.silly("delete one saleorderGlasses mstr")
            return saleorderGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}

