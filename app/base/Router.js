const path = require('path');

class Router{

    constructor(app){
        this.app = app;
    }

    init(){
        FS.readdir(CONTROLLERS_PATH, (err, controllers) => {

            controllers.forEach((controller) => {
                let ct = require(path.resolve(CONTROLLERS_PATH, controller));
                (new ct(this.app)).initRoutes();
            });
        });
    }
}

module.exports = Router;