import { Service, Inject, Container } from "typedi"

@Service()
export default class VisiteService {
    constructor(
        @Inject("visiteModel") private visiteModel: Models.VisiteModel,
        @Inject("customerModel") private customerModel: Models.CustomerModel,
      //  @Inject("requisitionModel") private requisitionModel: Models.RequisitionModel,
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const visite = await this.visiteModel.create({ ...data })
            this.logger.silly("create visite mstr")
            return visite
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findOne(query: any): Promise<any> {
        try {
            const visite = await this.visiteModel.findOne({
                where: query,
                include: [this.customerModel],
            })
            this.logger.silly("find one visite mstr")
            return visite
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async find(query: any): Promise<any> {
        try {
            const visite = await this.visiteModel.findAll({
                where: query,
                include: [this.customerModel],
            })
            this.logger.silly("find All visite mstr")
            return visite
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const visite = await this.visiteModel.update(data, {
                where: query,
            })
            this.logger.silly("update one visite mstr")
            return visite
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async delete(query: any): Promise<any> {
        try {
            const visite = await this.visiteModel.destroy({
                where: query,
            })
            this.logger.silly("delete one visite mstr")
            return visite
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}
