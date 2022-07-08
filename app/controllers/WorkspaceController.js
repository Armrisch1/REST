const BaseController = require(CONTROLLERS_PATH + "/BaseController");
const WorkspaceRepository = require(REPOSITORIES_PATH + '/WorkspaceRepository');
const ChannelRepository = require(REPOSITORIES_PATH + '/ChannelRepository');
const Workspace = require(MODELS_PATH + '/Workspace');
const Channel = require(MODELS_PATH + '/Channel');
const WorkspaceValidation = require(MIDDLEWARES_PATH + "/WorkspaceValidation");
const checkPermission = require(MIDDLEWARES_PATH + "/CheckPermission");
const checkWorkspacePermission = require(MIDDLEWARES_PATH + '/CheckWorkspacePermission');
const addValidationRules = WorkspaceValidation.add();
const deleteValidationRules = WorkspaceValidation.delete();
const addChannelValidationRules = WorkspaceValidation.addChannel();
const deleteChannelValidationRules = WorkspaceValidation.deleteChannel();
const editChannelValidationRules = WorkspaceValidation.editChannel();
const {Types} = require("mongoose");

class WorkspaceController extends BaseController {

    constructor(app) {
        super(app);
        this.prefix = '/api/workspace/';
        this.WR = new WorkspaceRepository();
        this.CR = new ChannelRepository();
    }

    initRoutes() {
        this.route('post', 'add', this.add, [checkPermission, addValidationRules]);
        this.route('post', 'add-channel', this.addChannel, [checkPermission, checkWorkspacePermission, addChannelValidationRules]);
        this.route('patch', 'edit-channel', this.editChannel, [checkPermission, checkWorkspacePermission, editChannelValidationRules]);
        this.route('get', 'get-workspaces', this.getWorkspaces, [checkPermission]);
        this.route('get', 'get-channels', this.getChannels, [checkPermission, checkWorkspacePermission]);
        this.route('delete', 'delete', this.delete, [checkPermission, checkWorkspacePermission, deleteValidationRules]);
        this.route('delete', 'delete-channel', this.deleteChannel, [checkPermission, checkWorkspacePermission, deleteChannelValidationRules]);
    }

    add = async (req, res) => {

        let userId = res.locals.user.id;
        let name = req.body.name;
        let slug = req.body.slug;
        let workspace = new Workspace({ name, userId, slug, createdAt: new Date() });

        await workspace.save(function (err){
            if (err) return res.status(503).json({'status': 'error', data: {message : 'server error occurred'}});
        });

        return res.status(201).json({status : 'ok', message : `workspace with ${slug} slug created`});
    }

    delete = async (req, res) => {

        let slug = res.locals.slug;
        let workspace = await this.WR.findOne('slug', slug);

        // Delete workspace
        await Workspace.deleteOne({slug});
        // Delete related channels
        await Channel.deleteMany({workspaceId : workspace.id});

        return res.status(200).json({status: 'ok', message : `workspace with ${slug} slug and related channels deleted`});
    }

    getWorkspaces = async (req, res) => {

        let user = res.locals.user;
        let data = await this.WR.findAllByField(user.id);

        return res.status(200).json({status : 'ok', workspaces : data});
    }

    addChannel = async (req, res) => {

        let userId = res.locals.user.id;
        let slug = res.locals.slug;
        let name = req.body.name;
        let workspace = await this.WR.findOne('slug', slug);
        let channel = new Channel({ name, userId, workspaceId : workspace.id});

        await channel.save(function (err){
            if (err) return res.status(503).json({'status': 'error', data: {message : 'server error occurred'}});
        });

        return res.status(201).json({status : 'ok', message : `channel successfully created`});
    }

    editChannel = async (req, res) => {

        let id = req.body.id;
        let name = req.body.name;

        await Channel.findOneAndUpdate({_id : Types.ObjectId(id)}, {name});

        return res.status(200).json({'status' : 'ok', 'message' : 'channel updated'});
    }

    deleteChannel = async (req, res) => {

        let id = req.body.id;
        await Channel.deleteOne({_id : Types.ObjectId(id)});

        return res.status(200).json({status: 'ok', message : `channel deleted from workspace`});
    }

    getChannels = async (req, res) => {

        let slug = res.locals.slug;

        let workspace = await this.WR.findOne('slug', slug);
        let channels = await this.CR.findAllByField(workspace.id);

        return res.status(200).json({status : 'ok', channels});
    }
}

module.exports = WorkspaceController;