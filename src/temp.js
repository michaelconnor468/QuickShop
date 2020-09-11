const mongodb = require('mongodb');
const mongoc = mongodb.MongoClient;

const connectionURL = 'mongodb://localhost:27017';
const databaseName = 'ShoppingLists';

mongoc.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if ( error )
        return console.log('Unable to connect to database.');

    const db = client.db(databaseName);

	
	db.grocery.insertMany([
		{item: 'Apples', quantity: 7, preferences: 'Honey Crisp, Red Delicious', alternatives: 'None', aliases: ['apples', 'apple'] },
		{item: 'Bananas', quantity: 8, preferences: 'Regular', alternatives: 'None', aliases: ['bananas', 'banana'] },
		{item: 'Blackberries', quantity: '1 Box', preferences: 'Regular', alternatives: 'Raspberries', aliases: ['blackberries', 'blackberry'] },
		{item: 'Raspberries', quantity: '1 Box', preferences: 'Regular', alternatives: 'Blackberries, Strawberries', aliases: ['raspberries', 'raspberry']},
		{item: 'Salmon', quantity: '1 Fillet', preferences: 'Fresh', alternatives: 'Cod, Mackarel', aliases: ['salmon', 'salmons']},
		{item: 'Chicken', quantity: 1, preferences: 'Fresh', alternatives: 'Chicken Breasts, Chicken Thighs', aliases: ['chicken', 'chickens']},
		{item: 'Yogurt', quantity: 2, preferences: 'Plain, Greek', alternatives: 'None', aliases: ['yogurt', 'yogurts']},
		{item: 'Eggs', quantity: '2 Cartons', preferences: 'Free Run', alternatives: 'None', aliases: ['eggs', 'egg']},
		{item: 'Milk', quantity: '2 Cartons', preferences: 'Whole Milk', alternatives: 'None', aliases: ['milk']},
		{item: 'Strawberries', quantity: '1 Box', preferences: 'Regular', alternatives: 'Blackberries, Raspberries', aliases: ['strawberries', 'strawberry']},
		{item: 'Mozarella', quantity: 1, preferences: 'Pizza Mozarella', alternatives: 'Fresh Mozarella', aliases: ['mozarella', 'pizza mozarella']},
		{item: 'Pepperoni', quantity: 1, preferences: 'Medium length and thick', alternatives: 'Italian Sausage', aliases: ['pepperoni', 'peperoni']},
		{item: 'Basil', quantity: '1 Box', preferences: 'Fresh', alternatives: 'None', aliases: ['basil']},
		{item: 'Hummus', quantity: '3 Cartons', preferences: 'Jalapeno', alternatives: 'Regular', aliases: ['hummus']}
	]);
	db.household.insertOne({item: 'Kleenex', quantity: '6 Boxes', preferences: 'Ultra Soft', aliases: ['kleenex', 'tissues', 'face tissues']});
});
