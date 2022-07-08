const Base = require(MODELS_PATH + '/Base');

class BaseRepository{

    constructor() {
        this.model = Base
    }

    checkExists = async (field, value) => {
        let item = await this.model.findOne({[field] : value});
        return !!item;
    }

    findOne = async (field, value) => {
        return await this.model.findOne({[field] : value});
    }
}


module.exports = BaseRepository;