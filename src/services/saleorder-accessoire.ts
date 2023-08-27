import { Service, Inject } from "typedi"

@Service()
export default class SaleOrderAccessoireService {
    constructor(
        @Inject("saleorderAccessoireModel") private saleorderAccessoireModel: Models.SaleOrderAccessoireModel,
        @Inject("accessoireModel") private accessoireModel: Models.AccessoireModel,
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const saleorderAccessoire = await this.saleorderAccessoireModel.create({ ...data })
            this.logger.silly("create saleorderAccessoire mstr")
            return saleorderAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOne(query: any): Promise<any> {
        try {
            const saleorderAccessoire = await this.saleorderAccessoireModel.findOne({ where: query, include:  this.accessoireModel })
            this.logger.silly("find one saleorderAccessoire mstr")
            return saleorderAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async find(query: any): Promise<any> {
        try {
            const saleorderAccessoires = await this.saleorderAccessoireModel.findAll({ where: query ,include:  this.accessoireModel})
            this.logger.silly("find All saleorderAccessoires mstr")
            return saleorderAccessoires
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const saleorderAccessoire = await this.saleorderAccessoireModel.update(data, { where: query })
            this.logger.silly("update one saleorderAccessoire mstr")
            return saleorderAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
   public async delete(query: any): Promise<any> {
        try {
            const saleorderAccessoire = await this.saleorderAccessoireModel.destroy({ where: query })
            this.logger.silly("delete one saleorderAccessoire mstr")
            return saleorderAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}

