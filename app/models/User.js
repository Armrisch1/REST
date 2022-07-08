const {Schema, model} = require("mongoose");

const userSchema = new Schema({
    username: {
        type : String,
        unique : true,
        required: true
    },
    password: {
        type : String,
        required: true
    },
    accessToken: {
      type : String,
      required : true
    },
    refreshToken: {
        type : String,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    profileImg: String
});

module.exports = model('users', userSchema);