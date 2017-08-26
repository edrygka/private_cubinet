function callParallax() {
    $(document).ready(function() {
    var movementStrength = 25;
    var height = movementStrength / $(window).height();
    var width = movementStrength / $(window).width();
        deviceWidth = document.documentElement.clientWidth;
        if(deviceWidth >= 1024) {
            $(".parallax-wrap").mousemove(function(e){
            var pageX = e.pageX - ($(window).width() / 2);
            var pageY = e.pageY - ($(window).height() / 2);
            var newvalueX = width * pageX * -1 - 25;
            var newvalueY = height * pageY * -1 - 50;
            $('.parallax-wrap').css("background-position", newvalueX+"px     "+newvalueY+"px");
    });
        }
    });
}