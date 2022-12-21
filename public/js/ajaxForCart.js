const { response } = require("express");
const { count } = require("../../models/userSchema");
const { post } = require("../../routes/user");

function addToCart(id, userId) {
    $.ajax({
        url: `/addToCart?id=${id}&&userId=${userId}`,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let cartCount = $('#cartCount').html()
                cartCount = parseInt(cartCount) + 1
                $('#cartCount').html(cartCount)
            }
        }
    })
}

function IncDecQuant(cartId, prodId, count, price) {
    let quantity = parseInt(document.getElementById(prodId).innerHTML)
    $.ajax({
        url: `/changeQuantity`,
        data: {
            cart: cartId,
            prodId: prodId,
            quantity: quantity,
            count: count,
            price: price
        },
        method: 'post',
        success: (response) => {
            if (response.status) {
                if (quantity == 1 && count == 1 || quantity != 1) {
                    document.getElementById(prodId).innerHTML = quantity + count
                    document.getElementById(`total${prodId}`).innerHTML = "$" + (quantity + count) * price
                }

            }
        }
    })
}

function removeItem(cartId, prodId) {
    $.ajax({
        url: `removeItem`,
        data: {
            cartId: cartId,
            prodId: prodId
        },
        method: 'post',
        success: (response) => {
            if (response.removeItem) {
                location.reload()
            }
        }
    })
}




