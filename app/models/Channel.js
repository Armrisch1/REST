const {Schema, model, Types} = require("mongoose");

const channelSchema = new Schema({
    name: {
        type : String,
        required: true
    },
    userId: {
        type : Types.ObjectId,
        ref : 'Users',
        required: true
    },
    workspaceId: {
        type: Types.ObjectId,
        ref: 'Workspaces',
        required : true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('channels', channelSchema);