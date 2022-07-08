const {Schema, model, Types} = require("mongoose");

const workspaceSchema = new Schema({
    name: {
        type : String,
        required: true
    },
    userId: {
        type : Types.ObjectId,
        ref : 'Users',
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('workspaces', workspaceSchema);