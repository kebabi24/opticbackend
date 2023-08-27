import { Service, Inject } from "typedi"
import { DATE, Op, Sequelize } from 'sequelize';
@Service()
export default class GlassesDetailService {
    constructor(
        @Inject("glassesDetailModel") private glassesDetailModel: Models.GlassesDetailModel,
        @Inject("glassesModel") private glassesModel: Models.GlassesModel,
        @Inject("taxeModel") private taxeModel: Models.TaxeModel,
        @Inject("locationModel") private locationModel: Models.LocationModel,      
        @Inject("locationGlassesModel") private locationGlassesModel: Models.LocationGlassesModel,      
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const glsd = await this.glassesDetailModel.create({ ...data })
            this.logger.silly("create glsd mstr")
            return glsd
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOne(query: any): Promise<any> {
        try {
            const glsd = await this.glassesDetailModel.findOne({ where: query })
            this.logger.silly("find one glsd mstr")
            return glsd
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async find(query: any): Promise<any> {
        try {
            //const glsds = await this.glassesDetailModel.findAll({ where: query })
            const glsds = await this.glassesDetailModel.findAll( { where: query })
            this.logger.silly("find All glsds mstr")
            return glsds
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findSpecial(query: any): Promise<any> {
        try {
            const glasses = this.glassesDetailModel.findAll({ where: query ,include: [this.glassesModel]})
            this.logger.silly("find All glassess mstr")
            return glasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findSpecialOne(query: any): Promise<any> {
        try {
            const glasses = this.glassesDetailModel.findOne( {where: query} )
            this.logger.silly("find All glassess mstr")
            return glasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async findSpecialgls(query: any): Promise<any> {
        try {
            const glasses = this.glassesDetailModel.findAll({where : query,include: [{model:this.glassesModel, where :  {gls_rev : {[Op.ne]: "M"}}, required: true, left: true,right:true }]})
            this.logger.silly("find All glassess mstr")
            return glasses
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async update(data: any, query: any): Promise<any> {
        try {
            const glsd = await this.glassesDetailModel.update(data, { where: query })
            this.logger.silly("update one glsd mstr")
            return glsd
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async delete(query: any): Promise<any> {
        try {
            const glsd = await this.glassesDetailModel.destroy({ where: query })
            this.logger.silly("delete one glsd mstr")
            return glsd
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    
}
