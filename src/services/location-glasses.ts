import { Service, Inject } from "typedi"

@Service()
export default class locationGlassesService {
    constructor(
        @Inject("locationGlassesModel") private locationGlassesModel: Models.LocationGlassesModel,
        @Inject("glassesModel") private glassesModel: Models.GlassesModel,
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const locationGlasses = await this.locationGlassesModel.create({ ...data })
            this.logger.silly("create locationGlasses mstr")
            return locationGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOne(query: any): Promise<any> {
        try {
            const locationGlasses = await this.locationGlassesModel.findOne({ where: query, include: this.glassesModel })
            this.logger.silly("find one locationGlasses mstr")
            return locationGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    } 
    public async find(query: any): Promise<any> {
        try {
            const locationGlassess = await this.locationGlassesModel.findAll({ where: query ,include: this.glassesModel})
            this.logger.silly("find All locationGlassess mstr")
            return locationGlassess
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findfifo(query: any): Promise<any> {
        try {
            const locationGlassess = await this.locationGlassesModel.findAll({ where: query,include: this.glassesModel
         ,order : [['ldg_expire', 'ASC'],['ldg_qty_oh', 'ASC']] })
            this.logger.silly("find All locationGlassess mstr")
            return locationGlassess
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findSpecial(query: any): Promise<any> {
        try {
            const locationGlassess = await this.locationGlassesModel.findAll({...query,include: [this.glassesModel]})
            this.logger.silly("find All locationGlassess mstr")
            return locationGlassess
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findSpecialgls(query: any): Promise<any> {
        try {
            const locationGlassess = await this.locationGlassesModel.findAll({where: query,include: [{model:this.glassesModel, where : {gls_rev : "M"}, required: false, left: true }]})
            this.logger.silly("find All locationGlassess mstr")
            return locationGlassess
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }


    public async update(data: any, query: any): Promise<any> {
        try {
            const locationGlasses = await this.locationGlassesModel.update(data, { where: query })
            this.logger.silly("update one locationGlasses mstr")
            return locationGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async delete(query: any): Promise<any> {
        try {
            const locationGlasses = await this.locationGlassesModel.destroy({ where: query })
            this.logger.silly("delete one locationGlasses mstr")
            return locationGlasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}

