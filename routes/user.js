const { response } = require('express');
var express = require('express');
var router = express.Router();
var prodHelp=require('../helpers/product-helpers')
var userHelp=require('../helpers/user-helpers')
/* GET home page. */

const verifyLogin=(req,res,next)=>{
  if (req.session.loggedIn)
  next()
  else
  res.redirect('/userlogin')
}
router.get('/', function(req, res, next) {

  let user=req.session.user
  console.log(user);
  prodHelp.viewProduct().then((prods)=>{
    res.render('user/user-viewproducts', { prods,user,admin:false});
  })
  
});

router.get('/userlogin',(req,res)=>{
  if(req.session.loggedIn)
  res.redirect('/')
  else
  {
    res.render('user/userlogin',{admin:false,logErr:req.session.logErr})
    req.session.logErr=null
}
})

router.get('/user-register',(req,res)=>{
  res.render('user/user-register',{admin:false})
})

router.post('/user-register',(req,res)=>{
  userHelp.signup(req.body).then((response)=>{
        res.render('user/userlogin',{admin:false})
  }
  )
})

router.post('/userlogin',(req,res)=>{
  userHelp.login(req.body).then((response)=>{

    
    if(response.loginStatus)
    {
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')
    }
      else
      {
       req.session.logErr=true //"invalid user or password"
        res.redirect('/userlogin')
      }
  })
})
router.get('/userlogout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})
router.get('/cart',verifyLogin,(req,res,next)=>{
  let user=req.session.user
  res.render('user/cart',{user})
})

router.get('/add-to-cart/:id',verifyLogin,(req,res,next)=>{
  let userid=req.session.user._id
  let prodId=req.params.id
  
    userHelp.addtocart(userid,prodId).then((responce)=>{
      console.log(responce);
      res.redirect('/')
    })
  
})



module.exports = router;
