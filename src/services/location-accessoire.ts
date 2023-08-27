import { Service, Inject } from "typedi"

@Service()
export default class locationAccessoireService {
    constructor(
        @Inject("locationAccessoireModel") private locationAccessoireModel: Models.LocationAccessoireModel,
        @Inject("accessoireModel") private accessoireModel: Models.AccessoireModel,
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const locationAccessoire = await this.locationAccessoireModel.create({ ...data })
            this.logger.silly("create locationAccessoire mstr")
            return locationAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOne(query: any): Promise<any> {
        try {
            const locationAccessoire = await this.locationAccessoireModel.findOne({ where: query, include: this.accessoireModel })
            this.logger.silly("find one locationAccessoire mstr")
            return locationAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    } 
    public async find(query: any): Promise<any> {
        try {
            const locationAccessoires = await this.locationAccessoireModel.findAll({ where: query ,include: this.accessoireModel})
            this.logger.silly("find All locationAccessoires mstr")
            return locationAccessoires
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findfifo(query: any): Promise<any> {
        try {
            const locationAccessoires = await this.locationAccessoireModel.findAll({ where: query,include: this.accessoireModel
         ,order : [['ld_expire', 'ASC'],['ld_qty_oh', 'ASC']] })
            this.logger.silly("find All locationAccessoires mstr")
            return locationAccessoires
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findSpecial(query: any): Promise<any> {
        try {
            const locationAccessoires = await this.locationAccessoireModel.findAll({...query})
            this.logger.silly("find All locationAccessoires mstr")
            return locationAccessoires
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const locationAccessoire = await this.locationAccessoireModel.update(data, { where: query })
            this.logger.silly("update one locationAccessoire mstr")
            return locationAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async delete(query: any): Promise<any> {
        try {
            const locationAccessoire = await this.locationAccessoireModel.destroy({ where: query })
            this.logger.silly("delete one locationAccessoire mstr")
            return locationAccessoire
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}

