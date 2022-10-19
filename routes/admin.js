var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var prodHelp = require('../helpers/product-helpers')

const verifyLogin = (req, res, next) => {
  if (req.session.adminloggedIn) next();
  else res.redirect("/admin");
};

/* GET users listing. */
router.get('/products',verifyLogin, function(req, res, next) {
  let user = req.session.admin;
  prodHelp.viewProduct().then((prods)=>{
    res.render('admin/view-products',{user,prods,admin:true});
  })
  
});
router.get('/',(req,res)=>{
  res.render('admin/adminlogin',{admin:true})
})
router.post('/adminlogin',async(req,res)=>{
  await productHelpers.adminlogin(req.body).then((response)=>{
    if (response.loginStatus) {
      req.session.admin = response.user;
      req.session.adminloggedIn = true;
      res.redirect("/admin/products");
    } else {
      req.session.logErr = true; //"invalid user or password"
      res.redirect("/admin");
    }
  })
})
router.get('/adminlogout',(req,res)=>{
  req.session.admin=null
  req.session.adminloggedIn = false;
  res.redirect("/admin");
})

router.get('/product',verifyLogin,(req,res,next)=>{
  let user = req.session.admin;
  res.render('admin/product',{user,admin:true})
})

router.get('/product/:id',(req,res)=>{
  prodId=req.params.id
  let user = req.session.admin;
  prodHelp.viewOne(prodId).then((prods)=>{
    res.render('admin/product',{user,prods,admin:true})
  })
  
})


router.post('/product',(req,res)=>{
  prodHelp.addProduct(req.body).then((id)=>{
    
    let image=req.files.image
    image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
      if(err)
        console.log(err);
      else
        res.redirect('/admin/products')
    })
    
  })
})
router.post('/update-product/:id',(req,res)=>{
  
  let prodId=req.params.id
  let prods=req.body
 
  prodHelp.updateProduct(prodId,prods).then((response)=>{
    
    res.redirect('/admin/products')
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
    res.redirect('/admin/products')
  })
})

router.get('/orders',verifyLogin,async(req,res,next)=>{
  let user = req.session.admin;
  await productHelpers.getPlacedOrders().then((orders)=>{
    res.render('admin/orders',{user,orders,admin:true})
  })
  
})
router.get('/updateorder/:id',async (req,res)=>{
  let orderId=req.params.id
  console.log(orderId);                                               
  await prodHelp.updateOrder(orderId).then((response)=>{
    res.redirect('/admin/products')
  })
})

module.exports = router;
