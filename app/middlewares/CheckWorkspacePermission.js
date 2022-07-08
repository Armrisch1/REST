const vhost  = require("vhost");
const WorkspaceRepository = require(REPOSITORIES_PATH + '/WorkspaceRepository');

module.exports = vhost('*.localhost', async function (req, res, next){

    let slug = req.vhost[0];
    let WR = new WorkspaceRepository();
    let user = res.locals.user;

    let hasUserPermission = await WR.checkUserPermission(slug, user.id);

    if (!hasUserPermission){
        return res.status(403).json({ 'status': 'error', 'message' : "user doesn't have required permissions for this workspace" });
    }

    res.locals.slug = slug;
    req.body.slug = slug;

    next();
});