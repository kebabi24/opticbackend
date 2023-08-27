import { Service, Inject } from "typedi"

@Service()
export default class GlassService {
    constructor(
        @Inject("glassesModel") private glassesModel: Models.GlassesModel,
        @Inject("taxeModel") private taxeModel: Models.TaxeModel,
        @Inject("locationModel") private locationModel: Models.LocationModel,      
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const item = await this.glassesModel.create({ ...data })
            this.logger.silly("item", item)
            return item
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async find(query: any): Promise<any> {
        try {
            const codes = await this.glassesModel.findAll({ where: query,include: this.taxeModel,incluse: this.locationModel  })
            this.logger.silly("find item ")
            return codes
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findSpecial(query: any): Promise<any> {
        try {
            const glasses = await this.glassesModel.findAll( query)
            this.logger.silly("find All glassess mstr")
            return glasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOne(query: any): Promise<any> {
        try {
            const item = await this.glassesModel.findOne({ where: query,include: this.taxeModel,incluse: this.locationModel  })
            this.logger.silly("find one item mstr")
            return item
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOneS(query: any): Promise<any> {
        try {
            const item = await this.glassesModel.findOne({ where: query,include: this.taxeModel,incluse: this.locationModel, raw:true  })
            this.logger.silly("find one item mstr")
            return item
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const item = await this.glassesModel.update(data, { where: query ,include: this.taxeModel })
            this.logger.silly("update one item mstr")
            return item
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}
