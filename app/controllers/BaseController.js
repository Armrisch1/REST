const multer = require('multer');

class BaseController{

    constructor(app) {
        this.app = app;
        this.prefix = '/api/';
        this.middlewares = [];
        this.multerMiddleware = multer().any();
    }

    initRoutes(){}

    route(method, route, callback, middlewares = [], fileRoute = false) {

        if (fileRoute){
            return this.app[method](this.prefix + route, ...middlewares, callback);
        }

        return this.app[method](this.prefix + route, this.multerMiddleware, ...middlewares, callback);
    }

}

module.exports = BaseController;