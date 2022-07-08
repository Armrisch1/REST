const UserRepository = require(REPOSITORIES_PATH + '/UserRepository');
const {body, validationResult} = require('express-validator');
const customFormatResult = validationResult.withDefaults({
    formatter: error => {
        return {
            [error['param']]: error.msg
        };
    },
});


class UserValidation {

    constructor() {
        this.UR = new UserRepository();
    }

    register() {

        return [
            body('username')
                .exists().withMessage('username is required')
                .bail()
                .isLength({min: 6}).withMessage('username min length is 6')
                .isLength({max: 50}).withMessage('username max length is 50')
                .bail()
                .custom(async value => {
                    let result = await this.UR.checkExists('username', value);

                    if (result) {
                        return Promise.reject('username is already exists');
                    }
                }),
            body('password')
                .exists().withMessage('password is required')
                .bail()
                .isLength({min: 6}).withMessage('password min length is 6')
                .isLength({max: 50}).withMessage('password max length is 6'),

            (req, res, next) => {
                const errors = customFormatResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                next();
            }
        ];
    }

    login() {

        return [
            body('username')
                .exists().withMessage('username is required')
                .bail()
                .isLength({min: 6}).withMessage('username min length is 6')
                .isLength({max: 50}).withMessage('username max length is 50'),
            body('password')
                .exists().withMessage('password is required')
                .bail()
                .isLength({min: 6}).withMessage('password min length is 6')
                .isLength({max: 50}).withMessage('password max length is 6'),

            (req, res, next) => {
                const errors = customFormatResult(req);

                if (!errors.isEmpty()) {
                    return res.status(400).json({errors: errors.array()});
                }

                next();
            }
        ];
    }
}

module.exports = new UserValidation();