import { Service, Inject } from "typedi"

@Service()
export default class PenicheService {
    constructor(
        @Inject("penicheModel") private penicheModel: Models.PenicheModel,
        @Inject("logger") private logger
    ) {}

    public async create(data: any): Promise<any> {
        try {
            const peniche = await this.penicheModel.create({ ...data })
            this.logger.silly("create peniche mstr")
            return peniche
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async findOne(query: any): Promise<any> {
        try {
            const peniche = await this.penicheModel.findOne({ where: query })
            this.logger.silly("find one peniche mstr")
            return peniche
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async find(query: any): Promise<any> {
        try {
            const peniches = await this.penicheModel.findAll({ where: query })
            this.logger.silly("find All peniches mstr")
            return peniches
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }

    public async update(data: any, query: any): Promise<any> {
        try {
            const peniche = await this.penicheModel.update(data, { where: query })
            this.logger.silly("update one peniche mstr")
            return peniche
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
    public async delete(query: any): Promise<any> {
        try {
            const peniche = await this.penicheModel.destroy({ where: query })
            this.logger.silly("delete one peniche mstr")
            return peniche
        } catch (e) {
            this.logger.error(e)
            throw e
        }
    }
}
