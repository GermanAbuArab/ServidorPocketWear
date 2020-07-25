const express = require('express');
const bodyParser = require('body-parser');
const bdd = require("./Base/bdd");
const app= express();


var port = process.env.PORT || 3001;

var assert = require('assert');
app.use(bodyParser.urlencoded({limit: '50mb'}));
app.use(bodyParser.json());




// Create new user
app.post('/user/:user', bdd.createUser);
app.get('/user/:user', bdd.findOneUser);

app.get('/userMail/:mail', bdd.findOneUserByMail);

app.post('/item', bdd.createItem);

app.get('/userInventory/:user', bdd.findInventory);

app.get('/colors', bdd.findColorsItems);                 //Done

app.get('/stores', bdd.findStoresItems);

app.get('/ultimos', bdd.findLastItems);

app.post('/itemCostumized', bdd.findTheItem); //todo terminar

// app.post('/userInventory', bdd.createUserInventory);


//update userInventory data using user id
//app.put('/userInventory/:userID', bdd.putUserInventory);

/*
// Delete an user data with id
app.delete('/user/:userID', bdd.deleteUser);




// Retrieve all users
app.get('/user', bdd.findAllUser);

//update user data
app.put('/user/:userID', bdd.putUser);


//todo fijarse

//app.post('/item', bdd.createItem);                      //Done

// Delete an item data with id
app.delete('/item/:itemID', bdd.deleteItem);           //Done

//update item data
app.put('/item/:itemID', bdd.putItem);                     //Done

// Retrieve all items data
app.get('/item/data', bdd.findAllItem);                         //Done

// Retrieve a single item data with id
app.get('/item/data/:itemID', bdd.findOneItem);                 //Done

// Retrieve items data by filter
app.get('/item/dataFilters', bdd.findWithConditionItem);          //Done


//Imagene

// Retrieve all items images
app.get('/itemImage', bdd.findAllImages);                 //Done

// Retrieve a single item image with id
app.get('/itemImage/:itemID', bdd.findOneImage);           //Done

// UTILITY FUNCTIONS

// Retrieve all colors to filter
app.get('/colors', bdd.findColorsItems);                 //Done

// Retrieve all stores to filter
app.get('/stores', bdd.findStoresItems);            //Done

// Retrieve all types to filter
app.get('/types', bdd.findTypesItems);                      //Done

// Retrieve all seasons
app.get('/seasons', bdd.findSeasonsItems);                  //Done

// Retrieve all items ordered by creation date
app.get('/item/date', bdd.findItemsByDateItems);            //Done

// Retrieve all items ordered by lst update date
app.get('/item/date/update', bdd.findItemsByDateUpdated);      //Done


//Inventarios


// Delete an userInventory data with id
app.delete('/userInventory/:userID', bdd.deleteUserInventory);

// Retrieve a single userInventory data with id of user
app.get('/userInventory/:userID', bdd.findInventoryByUserID);


*/
app.listen(port, function () {
    console.log('listening on port:', port);
});