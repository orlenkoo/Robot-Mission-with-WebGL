var MongoClient = require('mongodb').MongoClient;

const uri = "mongodb://humaps:humaps123%23%24@humaps-shard-00-00-6dxge.mongodb.net:27017,humaps-shard-00-01-6dxge.mongodb.net:27017,humaps-shard-00-02-6dxge.mongodb.net:27017/test?ssl=true&replicaSet=humaps-shard-0&authSource=admin&retryWrites=true&w=majority";

var connectionClient = function (cb) {
    MongoClient.connect(uri, function(err, client) {
        if (err) console.log(err);
        try { cb(client) } catch (e) {}
    });
};

module.exports = connectionClient;