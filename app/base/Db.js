const mongoose = require('mongoose');

async function connect(){
    await mongoose.connect(CONFIG.get('mongo.connectUri'), {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

module.exports = {
    connect
}


