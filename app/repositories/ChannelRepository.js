const BaseRepository = require(REPOSITORIES_PATH + '/BaseRepository.js');
const Channel = require(MODELS_PATH + '/Channel');

class ChannelRepository extends BaseRepository{

    constructor() {
        super();
        this.model = Channel;
    }

    checkChannelNameExists = async (conditions) => {
        let item = await this.model.findOne(conditions);
        return !!item;
    }

    findAllByField = async (workspaceId) => {
        return await this.model.find({workspaceId}).select(['name']);
    }
}

module.exports = ChannelRepository;