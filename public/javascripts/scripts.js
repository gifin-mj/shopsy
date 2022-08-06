

function addToCart(prodId){
    $.ajax({
      url:'/add-to-cart/'+prodId,
      method:'get',
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

function changeQuantity(cartId,prodId,count){

  $.ajax({
    url:'/change-product-quantity',
    data:{
      cart:cartId,
      product:prodId,
      count:count
    },
    method:'post',
    success:(response)=>{

        if(response.status == true){
          let quan=document.getElementById(prodId+"quantity").value

           quan=parseInt(quan)+parseInt(count)
           
           document.getElementById(prodId+"quantity").value=quan
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