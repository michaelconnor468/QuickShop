const mongodb = require('mongodb');

function connect( databaseName, connectionURL = 'mongodb://127.0.0.1:27017' ) {
    mongodb.MongoClient.connect(connectionURL)
        .then(
            ( client ) => { db = client.db(databaseName);}
        ).catch(
            () => {console.log('Unable to connect to database ' + databaseName + ' at ' + connectionURL);}
        );
}

db.collection('grocery').createIndex({ "item": 1 }, { unique: true });
db.collection('household').createIndex({ "item": 1 }, { unique: true });
module.exports.connect = connect;
