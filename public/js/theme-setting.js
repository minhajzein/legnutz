    /*=====================
     20. Color Picker
     ==========================*/
    var color_picker1 = document.getElementById("ColorPicker1").value;
    document.getElementById("ColorPicker1").onchange = function () {
        color_picker1 = this.value;
        document.body.style.setProperty('--theme-color', color_picker1);
    };

    /*------------------------------
    21. RTL & Dark Light
    -------------------------------*/
    var events = $("body");
    events.on("click", ".rtl-btn", function () {
        $(this).toggleClass('rtl');
        $('body').removeClass('rtl');
        if ($('.rtl-btn').hasClass('rtl')) {
            $('.rtl-btn').text('LTR');
            $('body').addClass('rtl');
        } else {
            $('.rtl-btn').text('RTL');
        }
        return false;
    });



    $(".setting_buttons li").click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    $(".color-box li").click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });

    function openSetting() {
        document.getElementById("setting_box").classList.add('open-setting');
        document.getElementById("setting-icon").classList.add('open-icon');
    }

    function closeSetting() {
        document.getElementById("setting_box").classList.remove('open-setting');
        document.getElementById("setting-icon").classList.remove('open-icon');
    }