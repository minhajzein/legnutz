const { response } = require("express");

function addToCart (id,userId) {
    $.ajax({
        url:`/addToCart?id=${id}&&userId=${userId}`,
        method: 'get',
        success: (response) => {
            if(response.status){
                let cartCount = $('#cartCount').html()
                cartCount = parseInt(cartCount)+1
                $('#cartCount').html(cartCount)
            }
        }
    })
}