const { AsyncLocalStorage } = require('async_hooks');
const bluebird = require('bluebird');
const redis = require('redis');

const client = redis.createClient();

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

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