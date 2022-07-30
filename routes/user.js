const { response } = require('express');
var express = require('express');
var router = express.Router();
var prodHelp=require('../helpers/product-helpers')
var userHelp=require('../helpers/user-helpers')
/* GET home page. */


router.get('/', function(req, res, next) {

  let user=req.session.user
  console.log(user);
  prodHelp.viewProduct().then((prods)=>{
    res.render('user/user-viewproducts', { prods,user,admin:false});
  })
  
});

router.get('/userlogin',(req,res)=>{
  res.render('user/userlogin',{admin:false})
})

router.get('/user-register',(req,res)=>{
  res.render('user/user-register',{admin:false})
})

router.post('/user-register',(req,res)=>{
  userHelp.signup(req.body).then((response)=>{
    console.log(response);
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
      res.redirect('/userlogin')
  })
})
router.get('/userlogout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

module.exports = router;
