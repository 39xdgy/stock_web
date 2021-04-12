const { json } = require('express')
const express = require('express')
const router = express.Router()
const data = require('../data')
const userData = data.user

router.get('/:id', async(req, res) => {
    const userId = req.params.id;
    try{
        if(typeof(userId) !== "string" || userId.length !== 20) {
            res.json({ERROR: "ID is not valid"});
            return;
        }
        user = await userData.getUser(userId);
        res.json(user);
    } catch(e){
        res.status(404).json({"Error with in get /:id": e})
    }
})

router.post('/:id', async(req, res) => {
    const userId = req.params.id;
    try{
        if(typeof(userId) !== "string" || userId.length !== 20) {
            res.json({ERROR: "ID is not valid"});
            return;
        }
        user = await userData.createUser(userId);
        res.json(user);
    } catch(e){
        res.status(404).json({"Error with in post /:id": e})
    }
})

router.patch('/:id', async(req, res) => {
    const userId = req.params.id;
    try{
        if(typeof(userId) !== "string" || userId.length !== 20) {
            res.json({ERROR: "ID is not valid"});
            return;
        }
        if(!req.body || !req.body.stockList) {
            res.json({ERROR: "req.body or req.body.stockList is missing in patch function"});
            return;
        }
        user = await userData.getUser(userId);

        let oldData = user.stockList;
        let newData = req.body.stockList;

        oldData.sort()
        newData.sort()

        let newUser = {
            stockList: (req.body.stockList && (JSON.stringify(a) !== JSON.stringify(b)) ? newData : oldData)
        }
        let validUser = await userData.updateUser(userId, newUser);
        return validUser;


        res.json(user);
    } catch(e){
        res.status(404).json({"Error with in patch /:id": e})
    }
})

module.exports = router;