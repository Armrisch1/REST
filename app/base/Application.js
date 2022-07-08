const path = require('path');
const express = require('express');
const multer = require('multer')();
const fs = require('fs');
const cookieParser = require('cookie-parser');
const cors = require('cors')({
    origin: "*",
    credentials: true
});

const Router = require(path.resolve('app', 'base', 'router'));
const DB = require(path.resolve('app', 'base', 'db'));

class APPLICATION {

    constructor() {

        if (APPLICATION.instance) {
            throw new Error('Trying use constructor twice');
        }
    }

    registerGlobals = () => {

        // Register Paths
        global.ROOT = path.resolve();
        global.CONFIG_PATH = path.resolve(ROOT, 'config');
        global.APP_PATH = path.resolve(ROOT, 'app');
        global.BASE_PATH = path.resolve(APP_PATH, 'base');
        global.CONTROLLERS_PATH = path.resolve(APP_PATH, 'controllers');
        global.MODELS_PATH = path.resolve(APP_PATH, 'models');
        global.REPOSITORIES_PATH = path.resolve(APP_PATH, 'repositories');
        global.HELPERS_PATH = path.resolve(APP_PATH, 'helpers');
        global.MIDDLEWARES_PATH = path.resolve(APP_PATH, 'middlewares');
        global.UPLOADS_PATH = path.resolve(APP_PATH, 'uploads');

        // Objects
        global.CONFIG = require("config");
        global.APP = express();
        global.FS = fs;
    };

    registerMiddlewares() {
        APP.use(express.urlencoded({extended: true}));
        APP.use(express.json());
        APP.use(cookieParser());
        APP.use(cors);
    }

    run() {
        this.registerGlobals();
        this.connectDb();
        this.registerMiddlewares();
        this.initRouter();
        this.runServer();
    }

    initRouter() {
        const router = new Router(APP);
        router.init();
    }

    runServer() {
        const PORT = CONFIG.get('app.port');

        global.SERVER = APP.listen(PORT, () => {
            console.log(`Server listen ${PORT}`);
        });
    }

    connectDb() {
        DB.connect().then(() => {
            console.log("Db connected");
        }).catch((err) => {
            console.log(err.message);
            throw new Error('DB connection error');
        });
    }

    static getInstance() {

        if (!APPLICATION.instance) {
            APPLICATION.instance = new APPLICATION();
        }

        return APPLICATION.instance;
    }
}

module.exports = APPLICATION.getInstance();