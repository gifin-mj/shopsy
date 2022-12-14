const { response } = require("express");
var express = require("express");
var router = express.Router();
var prodHelp = require("../helpers/product-helpers");
const userHelpers = require("../helpers/user-helpers");
var userHelp = require("../helpers/user-helpers");
/* GET home page. */

const verifyLogin = (req, res, next) => {
  if (req.session.userloggedIn) next();
  else res.redirect("/userlogin");
};
router.get("/", function (req, res, next) {
  let user = req.session.user;
  let cartcount = null;
  if (req.session.user) {
    userHelp.getCartcount(user._id).then((count) => {
      cartcount = count;
    });
  }
  prodHelp.viewProduct().then((prods) => {
    res.render("user/user-viewproducts", {
      prods,
      user,
      cartcount,
      admin: false,
    });
  });
});

router.get("/userlogin", (req, res) => {
  if (req.session.userloggedIn) res.redirect("/");
  else {
    res.render("user/userlogin", { admin: false, logErr: req.session.logErr });
    req.session.logErr = null;
  }
});

router.get("/user-register", (req, res) => {
  res.render("user/user-register", { admin: false });
});

router.post("/user-register", (req, res) => {
  userHelp.signup(req.body).then((response) => {
    res.render("user/userlogin", { admin: false });
  });
});

router.post("/userlogin", (req, res) => {
  userHelp.login(req.body).then((response) => {
    if (response.loginStatus) {
      req.session.user = response.user;
      req.session.userloggedIn = true;
      res.redirect("/");
    } else {
      req.session.logErr = true; //"invalid user or password"
      res.redirect("/userlogin");
    }
  });
});
router.get("/userlogout", (req, res) => {
  req.session.user=null
  req.session.userloggedIn = false;
  res.redirect("/");
});
router.get("/cart", verifyLogin, async (req, res, next) => {
  let user = req.session.user;
  let userid = req.session.user._id;
  let cartcount = 0;
  let total = 0;

  await userHelp.getCartcount(user._id).then((count) => {
    cartcount = count;
  });
  if (cartcount > 0) {
    await userHelp.getTotalAmount(user._id).then((totalprice) => {
      total = totalprice;
    });
  }
  let products = await userHelp.viewCart(userid).then((products) => {
    res.render("user/cart", { user, cartcount, products, total });
  });
});
router.get("/delete-product-cart/:id", verifyLogin, (req, res, next) => {
  let userid = req.session.user._id;
  let prodId = req.params.id;
  userHelp.deletecartProduct(userid, prodId).then((response) => {
    res.redirect("/cart");
  });
});

router.post("/add-to-cart", verifyLogin, (req, res, next) => {
  let userid = req.session.user._id;
  userHelp.addtocart(userid, req.body).then((response) => {
    res.json({ status: true });
  });
});
router.post("/change-product-quantity", verifyLogin, (req, res, next) => {
  userHelp.changeproductQuantity(req.body).then((response) => {
    res.json({ status: true });
  });
});
router.get("/place-order", verifyLogin, async (req, res, next) => {
  let user = req.session.user;
  let userid = req.session.user._id;
  let cartcount = null;
  let total = null;

  await userHelp.getCartcount(user._id).then((count) => {
    cartcount = count;
  });
  await userHelp.getTotalAmount(user._id).then((totalprice) => {
    total = totalprice;
  });
  let products = await userHelp.viewCart(userid).then((products) => {
    res.render("user/place-order", { user, cartcount, products, total });
  });
});
router.post("/place-order", verifyLogin, async (req, res, next) => {
  let products = await userHelpers.getCartproductList(req.body.userId);
  let total = await userHelpers.getTotalAmount(req.body.userId);
  userHelpers.placeOrder(req.body, products, total).then((orderid) => {
    if (req.body["payment-method"] === "COD") {
      res.json({ codsuccess: true });
    } else {
      console.log(orderid);
      userHelpers.razorpayPayment(orderid, total).then((response) => {
        res.json(response);
      });
    }
  });
});
router.post("/verify-payment", verifyLogin, (req, res) => {
  console.log(req.body);
  userHelpers
    .verifypayment(req.body)
    .then((response) => {
      userHelpers
        .updatePaymentStatus(req.body["order[receipt]"])
        .then((response) => {
          res.json({ status: true });
        });
    })
    .catch(() => {
      res.json({ status: "Payment failed" });
    });
});
router.get("/orderplaced", verifyLogin, async (req, res) => {
  let user = req.session.user;
  let userid = req.session.user._id;
  let cartcount = null;
  await userHelp.getCartcount(user._id).then((count) => {
    cartcount = count;
  });
  res.render("user/orderplaced", { user, cartcount });
});
router.get("/vieworders", verifyLogin, async (req, res) => {
  let user = req.session.user;
  let userid = req.session.user._id;
  let cartcount = null;
  await userHelp.getCartcount(user._id).then((count) => {
    cartcount = count;
  });
  await userHelpers.viewOrders(userid).then((orders) => {
    console.log(orders);
    res.render("user/vieworders", { user, cartcount, orders });
  });
})
router.get("/vieworderproducts/:id", verifyLogin, async (req, res) => {
    orderid=req.params.id
    let user = req.session.user;
    let userid = req.session.user._id;
    let cartcount = null;
    await userHelp.getCartcount(user._id).then((count) => {
      cartcount = count;
    });
    await userHelpers.viewOrderProducts(orderid).then((orderproducts) => {
      console.log(orderproducts);
      res.render("user/vieworderproducts", { user, cartcount, orderproducts });
    });
});

module.exports = router;
