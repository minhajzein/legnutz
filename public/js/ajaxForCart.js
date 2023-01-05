const { response } = require("express");
const { count } = require("../../models/userSchema");
const { post } = require("../../routes/user");

function addToCart(id, userId, checker) {
    let total = parseInt(document.getElementById('totalAmount').innerHTML)
    let price = parseInt(document.getElementById(`price${id}`).innerHTML)
    document.getElementById('totalAmount').innerHTML = total + price
    if (checker == 'wish') {
        deleteItem(id, checker)
    }
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

function deleteItem(id, checker) {
    $.ajax({
        url: `deleteFromWish?id=${id}`,
        method: 'get',
        success: (response) => {
            if (response.status) {
                if (checker == 'wish') {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'item added to cart',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    location.reload()
                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: 'item removed from wishlist',
                        showConfirmButton: false,
                        timer: 1500
                    })
                    location.reload()
                }
            }
        }
    })
}

function addToWishlist(prodId) {
    $.ajax({
        url: '/addToWishlist',
        method: 'post',
        data: {
            prodId
        },
        success: (response) => {
            if (response.status) {

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
                    document.getElementById('total').innerHTML = "$" + response.totalAmount
                    document.getElementById('totalAmount').innerHTML = response.totalAmount
                }

            }
        }
    })
}

function removeItem(cartId, prodId) {
    $.ajax({
        url: `/removeItem`,
        data: {
            cartId: cartId,
            prodId: prodId
        },
        method: 'post',
        success: (response) => {
            if (response.removeItem) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire(
                            'Deleted!',
                            `Order's status has been changed.`,
                            'success'
                        )
                        location.reload()
                    }
                })
            }
        }
    })
}


function shipped(orderId) {
    $.ajax({
        url: '/admin/shipped',
        method: 'post',
        data: {
            orderId
        },
        success: (response) => {
            if (response.status) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, change it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $(`#status${orderId}`).removeClass("order-success")
                        $(`#status${orderId}`).addClass("order-warning")
                        let aaa = `<span>shipped</span>`
                        $(`#status${orderId}`).html(aaa)
                        Swal.fire(
                            'Changed!',
                            `Order's status has been changed.`,
                            'success'
                        )
                    }
                })
            } else {
                Swal.fire(
                    'The status?',
                    'Do you have checked the status?',
                    'question'
                )
            }
        }
    })
}
function delivered(orderId) {
    $.ajax({
        url: '/admin/delivered',
        method: 'post',
        data: {
            orderId
        },
        success: (response) => {
            if (response.status) {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, change it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $(`#status${orderId}`).removeClass("order-warning")
                        $(`#status${orderId}`).addClass("order-success")
                        let bbb = `<span>delivered</span>`
                        $(`#status${orderId}`).html(bbb)
                        Swal.fire(
                            'changed!',
                            'Your file has been deleted.',
                            'success'
                        )
                    }
                })
            } else {
                Swal.fire(
                    'The status?',
                    'Do you have checked the status?',
                    'question'
                )
            }
        }
    })
}
