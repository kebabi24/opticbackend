import { Service, Inject } from "typedi"

@Service()
export default class purchaseOrderGlassesService {
    constructor(
        @Inject("purchaseOrderGlassesModel") private purchaseOrderGlassesModel: Models.PurchaseOrderGlassesService,
        @Inject("glassesModel") private glassesModel: Models.GlassesModel,
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const purchaseOrderGlasses = await this.purchaseOrderGlassesModel.create({ ...data })
            this.logger.silly("create purchaseOrderGlasses mstr")
            return purchaseOrderGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOne(query: any): Promise<any> {
        try {
            const purchaseOrderGlasses = await this.purchaseOrderGlassesModel.findOne({ where: query, include: this.glassesModel })
            this.logger.silly("find one purchaseOrderGlasses mstr")
            return purchaseOrderGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async find(query: any): Promise<any> {
        try {
            const purchaseOrderGlassess = await this.purchaseOrderGlassesModel.findAll({ where: query ,include: this.glassesModel})
            this.logger.silly("find All purchaseOrderGlassess mstr")
            return purchaseOrderGlassess
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const purchaseOrderGlasses = await this.purchaseOrderGlassesModel.update(data, { where: query })
            this.logger.silly("update one purchaseOrderGlasses mstr")
            return purchaseOrderGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async delete(query: any): Promise<any> {
        try {
            const purchaseOrderGlasses = await this.purchaseOrderGlassesModel.destroy({ where: query })
            this.logger.silly("delete one purchaseOrderGlasses mstr")
            return purchaseOrderGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}

