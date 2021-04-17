const bluebird = require('bluebird');
const redis = require('redis');

const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const firebase = require('firebase');


var config = {
    apiKey: "AIzaSyADpCYy5NTH_XfmPZ3aLBoy3kEVsdMqk-8",
    authDomain: "829141757660.firebaseapp.com",
    // For databases not in the us-central1 location, databaseURL will be of the
    // form https://[databaseName].[region].firebasedatabase.app.
    // For example, https://your-database-123.europe-west1.firebasedatabase.app
    databaseURL: "https://databaseName.firebaseio.com",
    storageBucket: "stock-web-19682-default-rtdb.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  var database = firebase.database();







async function getUser(userId){
    let user = await client.getAsync(userId);//id come from firebase
    if(user){
        user = JSON.parse(user);
        return user;
    }else throw JSON.parse({404: "Personal Error: Function getUser in server/data, User does not exest with this ID"});
}

async function createUser(userId){
    let user = await client.getAsync(userId);
    if(user){
        return JSON.parse(user);
    }else{
        user = {
            stockList: []
        }
        let redisUser = JSON.stringify(user);
        await client.setAsync(userId, redisUser);
        return user;
    }
}

async function patchUser(userId, patchInfo){
    let user = await client.getAsync(userId);
    if(user){
        updatedUser = JSON.stringify(userObject);
        await client.setAsync(userId, updatedUser);
        return userObject;
    }else throw JSON.parse({404: "Personal Error: function updateUser in data/server, User does not exest with this ID"})
}

module.exports = {
    getUser,
    createUser,
    patchUser
}