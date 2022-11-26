
if ($(window).width() > '576') {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            $('#sticky-header').addClass("sticky");
        } else {
            $('#sticky-header').removeClass("sticky");
        }
    });
}
if ($(window).width() < '576') {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 150) {
            $('#sticky-header').addClass("stickycls");
        } else {
            $('#sticky-header').removeClass("stickycls");
        }
    });
}