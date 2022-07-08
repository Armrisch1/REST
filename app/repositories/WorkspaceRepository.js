const BaseRepository = require(REPOSITORIES_PATH + '/BaseRepository.js');
const Workspace = require(MODELS_PATH + '/Workspace');

class UserRepository extends BaseRepository{

    constructor() {
        super();
        this.model = Workspace;
    }

    checkUserPermission = async (slug, userId) => {

        let workspace = await this.model.findOne({slug, userId});
        return !!workspace;
    }

    findAllByField = async (userId) => {
        return await this.model.find({userId}).select(['name', 'slug']);
    }
}

module.exports = UserRepository;