import { Service, Inject, Container } from "typedi"

@Service()
export default class DailySalesService {
    constructor(
        @Inject("dailysalesModel") private dailySalesModel: Models.dailySalesModel,
        @Inject("customerModel") private customerModel: Models.CustomerModel,
        @Inject("addressModel") private addressModel: Models.AddressModel,
        //  @Inject("requisitionModel") private requisitionModel: Models.RequisitionModel,
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const dailysales = await this.dailySalesModel.create({ ...data })
            this.logger.silly("create dailySales mstr")
            return dailysales
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findOne(query: any): Promise<any> {
        try {
            const dailysales = await this.dailySalesModel.findOne({
                where: query,
                include: [this.customerModel],
            })
            this.logger.silly("find one dailySales mstr")
            return dailysales
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async find(query: any): Promise<any> {
        try {
            const dailysales = await this.dailySalesModel.findAll({
                where: query,
                include: [this.customerModel],
            })
            this.logger.silly("find All dailySales mstr")
            return dailysales
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findadd(query: any): Promise<any> {
        try {
            const dailysales = await this.dailySalesModel.findAll({
                where: query,
                include: [this.addressModel],
                order:[['id', 'DESC']]
            })
            this.logger.silly("find All dailySales mstr")
            return dailysales
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const dailysales = await this.dailySalesModel.update(data, {
                where: query,
            })
            this.logger.silly("update one dailySales mstr")
            return dailysales
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async delete(query: any): Promise<any> {
        try {
            const dailysales = await this.dailySalesModel.destroy({
                where: query,
            })
            this.logger.silly("delete one dailySales mstr")
            return dailysales
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}
