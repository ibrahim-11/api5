var express = require('express');
var router = express.Router();
const Jwt = require('../helpers/Jwt');

router.get('/', (req, res, next)=>{
    console.log(req.baseUrl)
    //Verifier le token
    res.locals.auth = {role:1, id:25}
    next()
})

router.post('/', (req, res, next)=>{
    console.log(req.baseUrl)
})

module.exports = router