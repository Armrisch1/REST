const jwt = require('jsonwebtoken');
const UserRepository = require(REPOSITORIES_PATH + '/UserRepository');
const tokenGenerator = require(HELPERS_PATH + '/tokenGenerator');
const User = require(MODELS_PATH + '/User');

async function checkPermission(req, res, next) {

    const UR = new UserRepository();
    const secret = CONFIG.get("jwt.secret");
    const authHeader = req.headers['authorization'];
    let accessToken = authHeader && authHeader.split(' ')[1];
    let refreshToken = req.cookies.refreshToken;
    let regenerated = false;
    let user = null;

    // Case: access token none exists
    if (accessToken == null) {
        return res.status(403).json({status: 'error', message: 'permission denied'});
    }

    user = await UR.findOne('accessToken', accessToken);


    // Case: Wrong access token
    if (!user){
        return res.status(403).json({status: 'error', message: 'permission denied'});
    }

    let isAccessExpire = await jwt.verify(accessToken, secret, (err, decoded) => err && err.message === 'jwt expired');

    // Case: access expired but valid refresh exists
    if (isAccessExpire && refreshToken){

        let isRefreshExpire = await jwt.verify(refreshToken, secret, (err, decoded) => err && err.message === 'jwt expired');
        user = await UR.findOne('refreshToken', refreshToken);

        if (!user || isRefreshExpire){
            return res.status(403).json({status: 'error', message: 'permission_denied'});
        }

        accessToken = tokenGenerator.generateAccessToken(user.username);
        refreshToken = tokenGenerator.generateRefreshToken(user.username);

        // Regenerate tokens and store db
        let result = await User.findOneAndUpdate({username : user.username}, {accessToken, refreshToken});

        if (result){
            // Set refresh token cookie for day
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                expires: new Date(Date.now() + CONFIG.get('jwt.cookieExpire'))
            });

            // set access token in header for client if regenerated with refresh
            res.set('regeneratedAccessToken', accessToken);
            regenerated = true;
        }
    }
    // Case: access expired and refresh expired or none exists
    else if(isAccessExpire && !refreshToken){
        return res.status(403).json({status: 'error', message: 'permission denied'});
    }

    res.set('regenerated', regenerated);
    res.locals.user = user;
    next();
}

module.exports = checkPermission;