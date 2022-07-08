const WorkspaceRepository = require(REPOSITORIES_PATH + '/WorkspaceRepository');
const ChannelRepository = require(REPOSITORIES_PATH + '/ChannelRepository');
const {body, validationResult} = require('express-validator');
const customFormatResult = validationResult.withDefaults({
    formatter: error => {
        return {
            [error['param']]: error.msg
        };
    },
});

class WorkspaceValidation {

    constructor() {
        this.WR = new WorkspaceRepository();
        this.CR = new ChannelRepository();
    }

    add() {

        return [
            body('name')
                .exists().withMessage('name is required')
                .bail()
                .isLength({min: 6}).withMessage('name min length is 6')
                .isLength({max: 50}).withMessage('name max length is 50'),
            body('slug')
                .exists().withMessage('slug is required')
                .bail()
                .isLength({min: 3}).withMessage('slug min length is 3')
                .isLength({max: 10}).withMessage('slug max length is 10')
                .custom(async value => {
                    let result = await this.WR.checkExists('slug', value);

                    if (result) {
                        return Promise.reject('The slug is already exists');
                    }
                }),
            (req, res, next) => {
                const errors = customFormatResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                next();
            }
        ];
    }

    delete() {

        return [
            body('slug')
                .exists().withMessage('slug is required')
                .bail()
                .isLength({min: 3}).withMessage('slug min length is 3')
                .isLength({max: 10}).withMessage('slug max length is 10'),
            (req, res, next) => {
                const errors = customFormatResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                next();
            },
            this.slug
        ];
    }

    addChannel() {

        return [
            body('name')
                .exists().withMessage('name is required')
                .bail()
                .isLength({min: 6}).withMessage('name min length is 6')
                .isLength({max: 50}).withMessage('name max length is 50')
                .bail()
                .custom(async (value, {req}) => {
                    let workspace = await this.WR.findOne('slug', req.body.slug);
                    let result = await this.CR.checkChannelNameExists({name: value, workspaceId: workspace.id});

                    if (result) {
                        return Promise.reject('name already exists in this workspace');
                    }
                }),
            body('slug')
                .exists().withMessage('slug is required')
                .bail()
                .isLength({min: 3}).withMessage('slug min length is 3')
                .isLength({max: 10}).withMessage('slug max length is 10'),
            (req, res, next) => {
                const errors = customFormatResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                next();
            },
            this.slug
        ];
    }

    editChannel() {

        return [
            body('id')
                .exists().withMessage('id is required')
                .bail()
                .isLength({min: 10}).withMessage('id min length is 10')
                .isLength({max: 50}).withMessage('id max length is 50'),
            body('name')
                .exists().withMessage('name is required')
                .bail()
                .isLength({min: 6}).withMessage('name min length is 6')
                .isLength({max: 50}).withMessage('name max length is 50')
                .bail()
                .custom(async (value, {req}) => {
                    let workspace = await this.WR.findOne('slug', req.body.slug);
                    let result = await this.CR.checkChannelNameExists({name: value, workspaceId: workspace.id});

                    if (result) {
                        return Promise.reject('name already exists in this workspace');
                    }
                }),
            body('slug')
                .exists().withMessage('slug is required')
                .bail()
                .isLength({min: 3}).withMessage('slug min length is 3')
                .isLength({max: 10}).withMessage('slug max length is 10'),
            (req, res, next) => {
                const errors = customFormatResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                next();
            },
            this.slug
        ];
    }

    deleteChannel() {

        return [
            body('id')
                .exists().withMessage('id is required')
                .bail()
                .isLength({min: 10}).withMessage('id min length is 10')
                .isLength({max: 50}).withMessage('id max length is 50'),
            body('slug')
                .exists().withMessage('slug is required')
                .bail()
                .isLength({min: 3}).withMessage('slug min length is 3')
                .isLength({max: 10}).withMessage('slug max length is 10'),
            (req, res, next) => {
                const errors = customFormatResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                next();
            },
            this.slug
        ];
    }

    slug(req, res, next) {

        if (!res.locals.slug) {
            return res.status(403).json({status: 'error', message: 'permission denied'});
        }

        next();
    }
}

module.exports = new WorkspaceValidation();