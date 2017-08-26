function NewTimer(days,hours,minutes,secounds,dateTo) {
    var dateNow = new Date();
        mainTimer = new Date((arguments[4] - dateNow)),
        renderFields = [document.getElementById(arguments[0]),document.getElementById(arguments[1]),document.getElementById(arguments[2]),document.getElementById(arguments[3])];
        this.timerId = 0;
        this.timerStatus = true;
        this.startTimer = function() {
            mainTimer.setSeconds(mainTimer.getSeconds() - 1);
            this.render();
            if(this.timerStatus) {
                this.timerId = setTimeout(function(){this.startTimer();}.bind(this),1000);
            }
            else {
                clearTimeout(this.timerId);
                return;
            }
        };
        this.render = function() {
            var dateVals = [mainTimer.getDate(),mainTimer.getHours(),mainTimer.getMinutes(),mainTimer.getSeconds()];
            for(var i = 0; i < renderFields.length ; i++) {
                renderFields[i].textContent = (dateVals[i] < 10) ? '0' + dateVals[i] : dateVals[i];
            }
        };
        this.events = function(){
            window.addEventListener('blur',function(){
                this.timerStatus = false;
            }.bind(this));
            window.addEventListener('focus',function(){
                // mainTimer = new Date(mainTimer - (mainTimer - Date.now()));
                this.startTimer();
            }.bind(this));
        };

}
document.addEventListener('DOMContentLoaded', function() {
    var newTimer = new NewTimer('days','hours','minutes','seconds',new Date(2017,07,21));
    newTimer.startTimer();
});
