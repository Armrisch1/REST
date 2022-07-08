const tokenGenerator = require(HELPERS_PATH + "/tokenGenerator");
const BaseController = require(CONTROLLERS_PATH + "/BaseController");
const UserValidation = require(MIDDLEWARES_PATH + "/UserValidation");
const checkPermission = require(MIDDLEWARES_PATH + "/CheckPermission");
const uploadPhoto = require(MIDDLEWARES_PATH + "/UploadPhoto");
const UserRepository = require(REPOSITORIES_PATH + '/UserRepository');
const User = require(MODELS_PATH + '/User');
const registerValidationRules = UserValidation.register();
const loginValidationRules = UserValidation.login();
const {Types} = require("mongoose");

class UserController extends BaseController {

    constructor(app) {
        super(app);
        this.prefix = '/api/user/';
        this.UR = new UserRepository();
    }

    initRoutes() {
        this.route('post', 'register', this.register, [registerValidationRules]);
        this.route('post', 'login', this.login, [loginValidationRules]);
        this.route('post', 'upload-profile-photo', this.uploadProfilePhoto, [checkPermission, uploadPhoto.single('img')], true);
    }

    register = async (req, res) => {

        let username = req.body.username;
        let password = req.body.password;
        let accessToken = tokenGenerator.generateAccessToken(username);
        let refreshToken = tokenGenerator.generateRefreshToken(username);
        let encryptedPassword = await tokenGenerator.generateEncryptedPass(password);
        let user = new User({username, password: encryptedPassword, accessToken, refreshToken, createdAt: new Date()});

        // Save user
        await user.save(function (err) {
            if (err) return res.status(503).json({'status': 'error', data: {message: 'server error occurred'}});
        });

        // Send refresh token cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            expires: new Date(Date.now() + CONFIG.get('jwt.cookieExpire'))
        });

        return res.status(201).json({'status': 'ok', data: {accessToken: accessToken}});
    }

    login = async (req, res) => {

        let username = req.body.username;
        let password = req.body.password;
        let isPasswordCorrect = false;

        // Get user data by username or email
        let userData = await this.UR.findOne('username', username);

        // Verify Password
        if (userData) {
            isPasswordCorrect = await tokenGenerator.verifyEncryptedPass(password, userData.password);
        }

        if (isPasswordCorrect) {

            let accessToken = tokenGenerator.generateAccessToken(username);
            let refreshToken = tokenGenerator.generateRefreshToken(username);

            // Regenerate tokens and store db
            let result = await User.findOneAndUpdate({username: userData.username}, {accessToken, refreshToken});

            if (result) {

                // Set refresh token cookie for day
                res.cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    expires: new Date(Date.now() + CONFIG.get('jwt.cookieExpire'))
                });

                return res.status(200).json({
                    'status': 'ok',
                    data: {
                        accessToken: accessToken
                    }
                });
            }
        }

        return res.status(200).json({'status': 'error', data: {message: "user doesn't exists"}});
    }

    uploadProfilePhoto = async (req, res) => {

        let user = res.locals.user;
        let filename = req.file.filename;

        if (user.profileImg !== undefined && user.profileImg){
            await FS.unlinkSync(UPLOADS_PATH + '/' + user.profileImg);
        }

        await User.findOneAndUpdate({_id: Types.ObjectId(user.id)}, {profileImg : filename});

        return res.status(200).json('profile image updated');
    }
}

module.exports = UserController;