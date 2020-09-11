const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../web')));

app.get('/lists', (req, res) => {
    if ( req.query.list === "grocery" ) {
        res.send({items: [{item: 'apple', quantity: 4, preferences: 'honey crisp, red delicious', alternatives: 'berries'}, {item: 'banana', quantity: 1, preferences: 'regular', alternatives: ''}]});
    }
    else if ( req.query.list === "household" ) {
        res.send({items: [{item: 'toilet paper', quantity: 1, preferences: 'ultra soft', alternatives: ''}]});
    }
});

app.listen(3000, () => {
    console.log('Server is running.');
});


