
window.onload = function () {
    let sky = document.querySelector('#img-bg'),
        elemOne = document.querySelector('#img-1'),
        elemTwo = document.querySelector('#img-2');


    sky.addEventListener('mousemove', function (e) {
        var pageX = e.clientX - window.innerWidth / 2,
            pageY = e.clientY - window.innerHeight / 2;
        elemOne.style.transform = 'translateX(' + (7 + pageX / 150) + '%) translateY(' + (1 + pageY / 150) + '%)';
        elemTwo.style.transform = 'translateX(' + (7 + pageX / 150) + '%) translateY(' + (1 + pageY / 150) + '%)';
    });
};
