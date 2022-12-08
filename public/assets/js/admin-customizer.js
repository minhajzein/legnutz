// RTl & Ltr
$('<ul class="custom-theme"><li class="btn-dark-setting">Dark</li></ul>').appendTo($('body'));
(function () {
})();
//live customizer js
$(document).ready(function () {

  var body_event = $("body");
  body_event.on("click", ".btn-dark-setting", function () {
    $(this).toggleClass('dark');
    $('body').removeClass('dark');
    if ($('.btn-dark-setting').hasClass('dark')) {
      $('.btn-dark-setting').text('Light');
      $('body').addClass('dark');
    } else {
      $('#theme-dark').remove();
      $('.btn-dark-setting').text('Dark');
    }

    return false;
  });
});
