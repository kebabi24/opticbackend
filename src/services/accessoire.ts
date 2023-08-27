import { Service, Inject } from "typedi"

@Service()
export default class AccessoireService {
    constructor(
        @Inject("accessoireModel") private accessoireModel: Models.AccessoireModel,
        @Inject("taxeModel") private taxeModel: Models.TaxeModel,
        @Inject("locationModel") private locationModel: Models.LocationModel,      
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const accessoire = await this.accessoireModel.create({ ...data })
            this.logger.silly("accessoire", accessoire)
            return accessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async find(query: any): Promise<any> {
        try {
            const codes = await this.accessoireModel.findAll({ where: query,include: this.taxeModel,incluse: this.locationModel  })
            this.logger.silly("find accessoire ")
            return codes
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }



    public async findOne(query: any): Promise<any> {
        try {
            const accessoire = await this.accessoireModel.findOne({ where: query,include: this.taxeModel,incluse: this.locationModel  })
            this.logger.silly("find one accessoire mstr")
            return accessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOneS(query: any): Promise<any> {
        try {
            const accessoire = await this.accessoireModel.findOne({ where: query,include: this.taxeModel,incluse: this.locationModel, raw:true  })
            this.logger.silly("find one accessoire mstr")
            return accessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const accessoire = await this.accessoireModel.update(data, { where: query ,include: this.taxeModel })
            this.logger.silly("update one accessoire mstr")
            return accessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}
