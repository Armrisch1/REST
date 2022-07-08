const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const storage = multer.diskStorage({

    destination: function(req, file, callback) {
        callback(null, UPLOADS_PATH);
    },

    filename: function (req, file, callback) {

        let fileInfo = path.parse(file.originalname);
        let fileName = crypto.randomUUID() + fileInfo.ext;

        callback(null, fileName);
    }
});


module.exports = multer({storage,

    fileFilter: function (req, file, callback) {

        let ext = path.extname(file.originalname);

        if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
            return callback(new Error('Only images are allowed'))
        }

        callback(null, true)
    },

    limits:{
        fileSize: 1024 * 1024
    }
});