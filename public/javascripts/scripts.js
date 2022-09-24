

function addToCart(prodId,price){
    $.ajax({
      url:'/add-to-cart',
      data:{
        prodId:prodId,
        price:price
      },
      method:'post',
      success:(response)=>{
        if (response.status){
          let count=$('#cartcount').html()
          count=parseInt(count)+1
          $('#cartcount').html(count)
        }
        else
        window.location='/userlogin'
      }
    })
  }

function changeQuantity(cartId,prodId,count,price){

  $.ajax({
    url:'/change-product-quantity',
    data:{
      cart:cartId,
      product:prodId,
      count:count,
    },
    method:'post',
    success:(response)=>{

        if(response.status == true){
          let quan=document.getElementById(prodId+"quantity").value
          let totalprice=document.getElementById(prodId+"totalprice").value
          let totalcart=document.getElementById("carttotal").innerHTML
          
           quan=parseInt(quan)+parseInt(count)
           totalprice=parseInt(totalprice)+parseInt(price)
           totalcart=parseInt(totalcart)+parseInt(price)
           document.getElementById(prodId+"quantity").value=quan
           document.getElementById(prodId+"totalprice").value=totalprice
           document.getElementById("carttotal").innerHTML=totalcart
          if(quan == 1){
            document.getElementById(prodId+"minus").disabled = true;
          }
          else{ 
            document.getElementById(prodId+"minus").disabled = false;
          }
          
        }
        else{
          alert(response.status)
        }
    }
  })

  }
  