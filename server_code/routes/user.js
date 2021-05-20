const express = require('express')
const router = express.Router()
const data = require('../data')
const userData = data.user

router.get('/', async(req, res) => {
    res.json({Message: "This is the default page for api user"})
})

router.get('/:id', async(req, res) => {
    const userId = req.params.id;
    try{
        if(typeof(userId) !== "string") {
            res.json({ERROR: "ID is not valid"});
            return;
        }
        let user = await userData.getUser(userId);
        if(user.Error === "ID does not exist") {
            user = await userData.createUser(userId, null, null);
        }
        res.json(user);
    } catch(e){
        console.log(e)
        res.status(404).json({"Error with in get /:id": e})
    }
})

router.post('/:id', async(req, res) => {
    const userId = req.params.id;
    const name = req.body.userName;
    const img = req.body.profileImg;
    try{
        if(typeof(userId) !== "string") {
            res.json({ERROR: "ID is not valid"});
            return;
        }
        user = await userData.createUser(userId, name, img);
        res.json(user);
    } catch(e){
        console.log(e)
        res.status(404).json({"Error with in post /:id": e})
    }
})

router.patch('/:id', async(req, res) => {
    const userId = req.params.id;
    try{
        if(typeof(userId) !== "string") {
            res.json({ERROR: "ID is not valid"});
            return;
        }
        if(!req.body || !req.body) {
            res.json({ERROR: "req.body or req.body is missing in patch function"});
            return;
        }
        /*
        let user = await userData.getUser(userId);

        let oldData = user.stockList;
        let newData = req.body.stockList;

        oldData.sort()
        newData.sort()

        let newUser = {
            stockList: (req.body.stockList && (JSON.stringify(a) !== JSON.stringify(b)) ? newData : oldData)
        }

        */
        let validUser = await userData.patchUser(userId, req.body);
        res.json(validUser);
        return validUser;
    } catch(e){
        console.log(e)
        res.status(404).json({"Error with in patch /:id": e})
    }
})

module.exports = router;