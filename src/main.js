const express = require('express');
const path = require('path');
const mongodb = require('mongodb');

const mongoc = mongodb.MongoClient;
const app = express();

// Process command line args
var argv = require('yargs')
    .usage('Usage: $0 -p [server port *required*] -m [mongodb port *required*] -d [debug]')
    .demandOption(['p','m'])
    .argv;

let port = argv.p;
let mongoport = argv.m;

const mongoURL = 'mongodb://127.0.0.1:' + mongoport;
const databaseName = 'ShoppingLists';

app.use(express.static(path.join(__dirname, '../client')));

app.get('/lists', (req, res) => {
    if ( req.query.list === "grocery" ) {
        res.send({items: [{item: 'apple', quantity: 4, preferences: 'honey crisp, red delicious', alternatives: 'berries'}, {item: 'banana', quantity: 1, preferences: 'regular', alternatives: ''}]});
    }
    else if ( req.query.list === "household" ) {
        res.send({items: [{item: 'toilet paper', quantity: 1, preferences: 'ultra soft', alternatives: ''}]});
    }
});

app.listen(port, () => {
    console.log('Server running on port ' + port);
});


