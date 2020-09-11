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

app.use(express.static(path.join(__dirname, '../client')));

let grocery = {items: []}
let household = {items: []}

mongoc.connect('mongodb://127.0.0.1:' + mongoport, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if ( error )
        return console.log('Unable to connect to database.');

    const db = client.db('ShoppingLists');
    db.collection('grocery').find().toArray(( error, array ) => {grocery.items = array});
    db.collection('household').find().toArray(( error, array ) => {household.items = array});
});

app.get('/lists', (req, res) => {
    if ( req.query.list === "grocery" ) {
        res.send( grocery );
    }
    else if ( req.query.list === "household" ) {
        res.send( household );
    }
});

app.listen(port, () => {
    console.log('Server running on port ' + port);
});


