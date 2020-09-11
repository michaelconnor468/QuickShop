const mongodb = require('mongodb');
const mongoc = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'ShoppingLists';

mongoc.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if ( error )
        return console.log('Unable to connect to database.'); 

    const db = client.db(databaseName);
		
		db.collection('grocery').createIndex({ "item": 1 }, { unique: true });
		db.collection('household').createIndex({ "item": 1 }, { unique: true });
});
