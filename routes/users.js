var express = require('express');
var router = express.Router();
var argon2 = require('argon2');
var Jwt = require('../helpers/Jwt')

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(res.locals.auth.role == 2){
    let sql = "SELECT * FROM user";
    db.query(sql, function(err,data){
      if(err) throw err;
      res.json(data);
    })
  }
  else{
    res.json(false);
  }
  
});

// GET user by id
router.get('/:id', function(req, res, next) {
  const id = req.params.id
  let sql = `SELECT * FROM user WHERE id=${id}`;
  db.query(sql, function(err,data){
    if(err) throw err;
    res.json(data);
  })
});

//GET customer info for a user (by id)
router.get('/:id/info', function(req, res, next) {
  const id = req.params.id
  let sql = `SELECT customer.* FROM user, customer WHERE user.id=${id} AND customer.id = user.customer_id`;
  db.query(sql, function(err,data){
    if(err) throw err;
    res.json(data);
  })
});

//GET customer info for a user (by id)
router.get('/:id/commands', function(req, res, next) {
  const id = req.params.id
  let sql = `SELECT command.* FROM user, command WHERE user.id=${id} AND command.customer_id = user.customer_id`;
  db.query(sql, function(err,data){
    if(err) throw err;
    res.json(data);
  })
});

//POST create or update a user
router.post('/:action/:id?', (req,resp) => {
  const action = req.params.action;
  const id = parseInt(req.params.id);
  if(action === 'create'){
    let body = req.body;
    Object.keys(body).map((key)=>{
      body[key] = db.escape(body[key])
    })
    // body.password
    argon2.hash(body.password,{
      type: argon2.argon2id,
      memoryCost: 1024,
      parallelism: 2,
      timeCost : 2
    }).then(hash=>{
      body.password = hash.replace(Jwt.prefix,'');
      let sql = `INSERT INTO user SET ?`;
      db.query(sql,body,(err,result)=>{
        if(err) console.log(err);
        resp.json(result.insertId)
      })
    });
  }

  if(action === 'update'){
    let body = req.body;
    Object.keys(body).map((key)=>{
      body[key] = db.escape(body[key])
    })
    // body.password
    argon2.hash(body.password,{
      type: argon2.argon2id,
      memoryCost: 1024,
      parallelism: 2,
      timeCost : 2
    }).then(hash=>{
      body.password = hash.replace(Jwt.prefix,'');
      let sql = `UPDATE user SET ? WHERE id=${id}`;
      db.query(sql,body,(err,result)=>{
        if(err) console.log(err);
        resp.json(result.affectedRows)
      })
    });
  }

  if(action === 'delete'){
    let sql = `DELETE FROM user WHERE id=?`;
    db.query(sql,[id],(err,result)=>{
      if(err) console.log(err);
      resp.json(result.affectedRows)
    })
  }
  
});

module.exports = router;
