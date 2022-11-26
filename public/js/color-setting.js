/*=====================
    color(2) picker
==========================*/
var color_picker1 = document.getElementById("ColorPicker2").value;
document.getElementById("ColorPicker2").onchange = function () {
    color_picker1 = this.value;
    document.body.style.setProperty('--theme-color2', color_picker1);
};