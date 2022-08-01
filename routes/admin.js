var express = require('express');
var router = express.Router();
var prodHelp = require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  prodHelp.viewProduct().then((prods)=>{
    res.render('admin/view-products',{prods,admin:true});
  })
  
});


router.get('/product',(req,res)=>{
  res.render('admin/product',{admin:true})
})

router.get('/product/:id',(req,res)=>{
  prodId=req.params.id
  prodHelp.viewOne(prodId).then((response)=>{
    prods=response
    res.render('admin/product',{prods,admin:true})
  })
  
})


router.post('/product',(req,res)=>{

  prodHelp.addProduct(req.body).then((id)=>{
    
    let image=req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(err)
        console.log(err);
      else
        res.render('admin/product',{admin:true})
    })
    
  })
})
router.post('/update-product/:id',(req,res)=>{
  
  let prodId=req.params.id
  let prods=req.body
 
  prodHelp.updateProduct(prodId,prods).then((response)=>{
    
    res.redirect('/admin')
    if (req.files.image)
    {
      let image=req.files.image
      image.mv('./public/product-images/'+prodId+'.jpg')
    }
    

  })

})


router.get('/delete-product/:id',(req,res)=>{
  let prodId=req.params.id
  prodHelp.deleteProduct(prodId).then((response)=>{
    res.redirect('/admin')
  })
})

module.exports = router;
