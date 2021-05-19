var express = require('express');
var router = express.Router();

/* GET categories listing. */
router.get('/', function(req, res, next) {
  let sql = "SELECT * FROM category";
  db.query(sql, function(err,data){
    if(err) throw err;
    res.json(data);
  })
});

// GET categories by id
router.get('/:id', function(req, res, next) {
  const id = req.params.id
  let sql = `SELECT * FROM category WHERE id=${id}`;
  db.query(sql, function(err,data){
    if(err) throw err;
    res.json(data);
  })
});

// GET all product of a category (by id)
router.get('/:id/products', function(req, res, next) {
    const id = req.params.id
    let sql = `SELECT product.* FROM product, category_product WHERE category_product.category_id = ${id} AND
    category_product.product_id = product.id`;
    db.query(sql, function(err,data){
      if(err) throw err;
      res.json(data);
    })
  });

module.exports = router;
