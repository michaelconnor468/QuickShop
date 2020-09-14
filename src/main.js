const express = require('express');
const path = require('path');
const mongodb = require('mongodb');
const { dodgerblue } = require('color-name');

const mongoc = mongodb.MongoClient;
const expressApp = express();

// Process command line args
var argv = require('yargs')
    .usage('Usage: $0 -p [server port *required*] -m [mongodb port *required*] -d [debug]')
    .demandOption(['p','m'])
    .argv;

let grocery = {items: []}
let household = {items: []}

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

expressApp.get('/lists', (req, res) => {
    shoppingLists.forEach( (list) => {
        if ( req.query.list === list.name) {
            res.send( list );
        }
    });
});

expressApp.listen(argv.p, () => {
    console.log('Server running on port ' + argv.p);
});


