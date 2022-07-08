const BaseRepository = require(REPOSITORIES_PATH + '/BaseRepository.js');
const User = require(MODELS_PATH + '/User');

class UserRepository extends BaseRepository{

    constructor() {
        super();
        this.model = User;
    }
}

module.exports = UserRepository;