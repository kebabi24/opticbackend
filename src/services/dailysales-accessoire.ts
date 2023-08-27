import { Service, Inject } from "typedi"

@Service()
export default class DailySalesAccessoireService {
    constructor(
        @Inject("dailysalesAccessoireModel") private dailySalesAccessoireModel: Models.dailysalesAccessoireModel,
        @Inject("accessoireModel") private accessoireModel: Models.AccessoireModel,
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const dailysalesAccessoire = await this.dailySalesAccessoireModel.create({ ...data })
            this.logger.silly("create dailysalesAccessoire mstr")
            return dailysalesAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOne(query: any): Promise<any> {
        try {
            const dailysalesAccessoire = await this.dailySalesAccessoireModel.findOne({ where: query, include:  this.accessoireModel })
            this.logger.silly("find one dailysalesAccessoire mstr")
            return dailysalesAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async find(query: any): Promise<any> {
        try {
            const dailysalesAccessoires = await this.dailySalesAccessoireModel.findAll({ where: query ,include:  this.accessoireModel})
            this.logger.silly("find All dailysalesAccessoires mstr")
            return dailysalesAccessoires
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const dailysalesAccessoire = await this.dailySalesAccessoireModel.update(data, { where: query })
            this.logger.silly("update one dailysalesAccessoire mstr")
            return dailysalesAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
   public async delete(query: any): Promise<any> {
        try {
            const dailysalesAccessoire = await this.dailySalesAccessoireModel.destroy({ where: query })
            this.logger.silly("delete one dailysalesAccessoire mstr")
            return dailysalesAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}

