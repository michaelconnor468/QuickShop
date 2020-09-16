const express = require('express');
const path = require('path');
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const { dodgerblue } = require('color-name');

const mongoc = mongodb.MongoClient;
const expressApp = express();

// Process command line args
var argv = require('yargs')
    .usage('Usage: $0 -p [server port *required*] -m [mongodb port *required*] -d [debug]')
    .demandOption(['p','m'])
    .argv;

let shoppingLists = [
    {
        name: 'grocery',
        items: []
    },
    {
        name: 'household',
        items: []
    }
]

mongodb.MongoClient.connect('mongodb://127.0.0.1:' + argv.m, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if ( error )
        return console.log('Unable to connect to database.');

    const db = client.db('ShoppingLists');

    shoppingLists.forEach( (list) => {
        db.collection(list.name).find().toArray( (error, array) => {
            if ( error )
                console.log('Failed to find list ' + list.name + ' in database');
            list.items = array;
        });
    });
});

expressApp.use(express.static(path.join(__dirname, '../client')));
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(bodyParser.json());

expressApp.get('/lists', (req, res) => {
    mongodb.MongoClient.connect('mongodb://127.0.0.1:' + argv.m, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
        if ( error )
            return console.log('Unable to connect to database.');
        const db = client.db('ShoppingLists');
        db.collection(req.query.list).find().toArray((error, array) => {
            if ( error )
                console.log('failed to retrieve list ' + req.query.list + ' from database');
            array.forEach( (x) => {delete x._id;});
            res.send({ name: req.query.list, items: array });
        });
    });
});

expressApp.put('/lists', bodyParser.json(), (req, res) => {
    mongodb.MongoClient.connect('mongodb://127.0.0.1:' + argv.m, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
        if ( error )
            return console.log('Unable to connect to database.');
    
        const db = client.db('ShoppingLists');
        db.collection(req.query.list).replaceOne({item: req.body.item}, req.body, {upsert: true}).catch();
        res.send('Database updated');
    });
});

expressApp.listen(argv.p, () => {
    console.log('Server running on port ' + argv.p);
});


