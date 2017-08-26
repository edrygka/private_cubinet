$(document).ready(function($){ //main request for forms
    $('.main-form').submit(function(e){
        var self = this;
        e.preventDefault();
        console.log($(this).serialize());
        $.ajax({
            url: $(this).attr('action'),
            method: $(this).attr('method'),
            data : $(this).serialize(),
            success: function(data) {
                console.log(data);
                if(self.id.indexOf('login') > -1) {//If login form
                    if(!data) {
                        createNotification('Invalid login or password.');
                        self.getElementsByTagName('input')[1].value = ''; //If error,clear password field.
                    }
                    else {
                        createNotification('Authentificated.');
                        setTimeout(function() {
                            location.href = data;
                        },1000);
                    }
                }
                else {
                    if(data.success) {
                        createNotification(data.success);
                        setTimeout(function(){
                            console.log(data.redirect);
                            location.href = data.redirect;
                        },1000);
                    }
                    else {
                        createNotification(data);
                    }
                }
            }
        });
    });
});


window.addEventListener('load',function(){
    var startTime = 1,
        timerId,
        balance = document.getElementsByClassName('balance')[0];
        function makeReq() {
            console.log('1234');
            timerId = setTimeout(function() {
                    $.ajax({
                    url : location.href,
                    method: 'POST',
                    data: 'key',
                    success : function(data) {
                        for(var key in data) {
                            balance.innerHTML = balance.innerHTML.replace(key,data[key]);
                        }
                    }
                });
                startTime = 10000;
                makeReq();
            },startTime)
        }
        
        window.addEventListener('blur' , function() {
            clearTimeout(timerId);
        });
        window.addEventListener('focus' , function() {
            clearTimeout(timerId);
            makeReq();
        });
        makeReq();
});