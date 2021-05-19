var express = require('express');
var router = express.Router();
const argon2 = require('argon2');
const Jwt = require('../helpers/Jwt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next)=>{
  let body = req.body;
  let sql = `SELECT * FROM user WHERE login=?`;
  db.query(sql,[body.login], (error,data) => {
    if(error) throw error;
    if(data.length === 0){
      argon2.hash(body.password, {
        type: argon2.argon2id,
        memoryCost: 1024,
        parallelism: 2,
        timeCost: 2
      }).then(hashedPw=>{
        body.password = hashedPw.replace(Jwt.prefix,'')
        sql = `INSERT INTO user SET ?`
        db.query(sql,body, (err, result) =>{
          if(err) throw err;
          res.json(result.affectedRows === 1);
        })
      })
      
    }
    else{
      res.json(false);
    }
    //res.json(data);
  })
})

router.post('/login', (req, res, next)=>{
  let body = req.body;
  let sql = `SELECT * FROM user WHERE login=?`;
  db.query(sql,[body.login], (error,data) => {
    if(error) throw error;
    if(data.length === 1){
      data = data[0];
      argon2.verify(Jwt.prefix+data.password, body.password).then(
        result =>{
          if(result){
            //Jwt
            const id = data.id
            const email = data.login
            const role = data.role
            const time = Math.round(Date.now() / 1000)
            const customerId = data.customer_id
            let payload = {id,email,role,time,customerId};
            delete data.password
            Jwt.create(payload).then(token=>{
              res.json({user:data,token})
              //return;
            })
            
          }
          else{
            res.json(false);
          }
        }
      )
    }
    else{
      res.json(false);
    }
  })
})

module.exports = router;
