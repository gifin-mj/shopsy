var express = require('express');
var router = express.Router();
var prodHelp = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  prodHelp.viewProduct().then((prods)=>{
    res.render('admin/view-products',{prods,admin:true});
  })
  
});

router.get('/add-product',(req,res)=>{
  res.render('admin/add-product',{admin:true})
})


router.post('/add-product',(req,res)=>{

  prodHelp.addProduct(req.body).then((id)=>{
    console.log(id);
    let image=req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(err)
        console.log(err);
      else
        res.render('admin/add-product',{admin:true})
    })
    
  })
})

module.exports = router;
