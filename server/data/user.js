const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;

async function createUser(id, name, img){
    if (!id) throw "Server Error: id is missing when create";
    //let obj_id = myDBfunction(id)
    let new_user = {
        _id: id,
        userName: name, 
        profileImg: img,
        stockList: []
    }

    const userCollections = await user();
    const insertedInfo = await userCollections.insertOne(new_user);
    if(insertedInfo.insertedCount === 0) throw 'New User Cannot be added';
    return await this.getUser(id)
}



async function getUser(id){
    if(!id) throw "Error: server getUser has no input"
    if(typeof(id) !== "string") "Error: server getUser input is not a string"

    //let obj_id = myDBfunction(id);
    const userCollections = await user();
    const user_data = await userCollections.findOne({_id: id});

    if(user_data === "null") throw "Error: this user does not exist."
    return user_data
}


async function patchUser(id, patch_obj){
    if(!id || !patch_obj) throw "Error: server patchUser id or object is missing"
    
    //let obj_id = myDBfunction(id)

    let patch_info = {}

    if(patch_obj.userName) patch_info.userName = patch_obj.userName
    if(patch_obj.profileImg) patch_info.profileImg = patch_obj.profileImg
    if(patch_obj.stockList) patch_info.stockList = patch_obj.stockList
    
    const userCollections = await user();
    await userCollections.updateOne({_id:id}, {$set: patch_info})

    return await this.getUser(id)
}

function myDBfunction(id) {
    let { ObjectId } = require('mongodb');

    //check to make sure we have input at all
    if (!id) throw 'Id parameter must be supplied';
  
  
    //check to make sure it's a string
    if (typeof id !== 'string') throw "Id must be a string";
  
    
    //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
    //if it fails, it will throw an error (you do not have to throw the error, it does it automatically and the catch where you call the function will catch the error just as it catches your other errors).

    let parsedId = ObjectId(id);

    //this console.log will not get executed if Object(id) fails, as it will throw an error
    return parsedId;
  }


module.exports = {
    createUser, getUser, patchUser
}



/*
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

*/