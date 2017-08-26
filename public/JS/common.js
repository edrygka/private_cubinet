var deviceWidth = document.documentElement.clientWidth;

function rng(min,max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}
document.addEventListener('DOMContentLoaded', function() {
	var BgArr = ['bg_1','bg_2','bg_3','bg_4'],
        rnG = rng(0,BgArr.length - 1),
		pxWrap = document.getElementsByClassName('parallax-wrap')[0];
		if(pxWrap.classList) {
			if(deviceWidth <= 1023) {
			document.getElementsByClassName('parallax-wrap')[0].classList.add(BgArr[rng(1,BgArr.length - 1)]);
		}
			else {
				document.getElementsByClassName('parallax-wrap')[0].classList.add(BgArr[rnG]);
			}
		}
		else {
			pxWrap.className += ' ' + BgArr[rnG];
		}
});

//Login/Reg buttons
document.addEventListener('DOMContentLoaded',function(){
	var buttons = document.querySelectorAll('.sign-in-btns > .wrap');
	function attachEvent() {
		var bg = document.getElementsByClassName('bg')[0];
			$(bg).fadeIn('slow');
			bg.addEventListener('click', function(){
				var pop = document.getElementsByClassName('opened')[0];
				if(pop) {
					$('.opened').fadeOut('slow').removeClass('opened');
					$(bg).fadeOut('slow');
				}
			});
	}
	for(var i = 0 ; i < buttons.length ; i++) {
		buttons[i].addEventListener('click',function(){
			var self = this;
			if(self.getAttribute('data-attr') == 'login') {
				attachEvent();
				$('#login-form').fadeIn('slow').addClass('opened');
			}
			else {
				attachEvent();
				$('#register-form').fadeIn('slow').addClass('opened');
			}
		});
	}
});

//Payment cabined slide down
document.addEventListener('DOMContentLoaded' , function(){
	var expandBtn = document.getElementsByClassName('expand'),
		i = 0;
	for(i ; i < expandBtn.length ; i++) {
		expandBtn[i].addEventListener('click' , function(e){
			var parent = this.parentElement,
				child = parent.childNodes[3],
				cur_data = parent.getAttribute('data-currency-type');
				console.log(parent);
				console.log(child.className);
				function hideElems() { //Hiding all forms before opening new one.
					var hideAll = document.getElementsByClassName('wallets-data');
					for(i = 0 ; i < hideAll.length; i++) {
						$(hideAll[i]).stop().slideUp('100').removeClass('opened');
					}
				}
				function getWallet(wallet_type) {
					console.log('data' + child.className.indexOf('opened'));
					var walletval = child.getElementsByTagName('input')[0].value;
					var requestData = {
						wallettype: wallet_type,
						wallet : walletval,
						getqr: (child.className.indexOf('opened') > -1) ? false : true
					}
					$.ajax({
						url: location.href + '/getwallet',
						method: 'POST',
						data: JSON.stringify(requestData),
						contentType: 'application/json',
						success: function(data) {
							document.getElementById('qr-value').setAttribute('src' , data);
							document.getElementById('user-wallet').value = walletval;
						}
					})
				}
				if($(child).hasClass('opened')) {
					hideElems();
					getWallet(cur_data);
				}
				else {
					hideElems();
					console.log(cur_data);
					$(child).stop().slideDown('100' , function() {
						getWallet(cur_data);
					}).addClass('opened');
					
				}
		});
	}
});



//Payment cabined slide down

function createNotification(string) { // Popup notification
					var notificationWrap = document.body.appendChild(document.createElement('div')),
						computedStyle;
						notificationWrap.textContent = string;
						computedStyle = getComputedStyle(notificationWrap);
						console.log(computedStyle.height);
						notificationWrap.style.cssText = 'width: 280px;height: auto ;display: none; background-color: rgba(0,0,0,.6); position: fixed; margin-top: -24px; margin-left: -140px; bottom: 10%; left: 50%; z-index: 100; line-height: 1.2; text-align: center; border: 1px solid #FFFFFF; border-radius : 8px; padding: 8px;';
						$(notificationWrap).stop().fadeIn('slow');
						setTimeout(function(){
							$(notificationWrap).stop().fadeOut('slow');
							notificationWrap.parentElement.removeChild(notificationWrap);
						},1200);
				}
//Payment cabinet copy wallet on click
window.addEventListener('load' , function(){
	var targetBtn = document.getElementsByClassName('copy-wallet'),
		i = 0;
	for(i; i < targetBtn.length ; i++) {
		targetBtn[i].addEventListener('click' , function() {
			var wrap = this.parentElement.getElementsByClassName('user-wallet');
				$(wrap).select();
				document.execCommand('copy');
				createNotification('Copied succesfully');
		});
	}
});


//Payment cabinet copy wallet on click

//Login/Reg buttons

// //Jquery slide button
// 	var 
// 		socialWrap = document.getElementsByClassName('soc-links')[0],
// 		triggerBtn = document.getElementById('sldbtn'),
// 		trigger = document.getElementsByClassName('slide-down')[0];
// 		function slideD() {
// 			if(!socialWrap.classList.contains('opened')) {
// 				$(socialWrap).slideDown('slow',function arrUp() {
// 					triggerBtn.classList.remove('icon-down-big');
// 					triggerBtn.classList.add('icon-up-big');
// 					socialWrap.classList.add('opened');
					
// 				});
// 			}
// 			else {
// 				socialWrap.classList.remove('opened');
// 				$(socialWrap).css('height' , '').slideUp('slow',function(){
// 					triggerBtn.classList.remove('icon-up-big');
// 					triggerBtn.classList.add('icon-down-big');
					
// 				});
				
// 			}
// 		}
// 		if(deviceWidth >= 768) {
// 			slideD();
// 		}
// 		trigger.addEventListener('click',function() {
// 			slideD();
// 		});
// 		//Jquery slide button
// });
$(document).ready(function($) { /// Ajax form
	var 
		self,
		inoputs,
		loadImg;
	$("#mc-embedded-subscribe-form").submit(function(e) {
		e.preventDefault();
		self = this;
		inputs = self.getElementsByTagName('input'),
		loadImg,
		action = $(this).attr('action');
		$(this).css('border' , '1px solid transparent');
		$(inputs).fadeOut('slow');
		loadImg = self.appendChild(document.createElement('img')).className = 'load';
			loadImg = document.getElementsByClassName('load')[0];
			loadImg.setAttribute('src' , 'images/load.svg');
		$.ajax({
			type: 'POST',
			url: action,
			data: $(this).serialize()
		}).done(function() {
			$(loadImg).fadeOut('slow',function() {
				self.innerHTML = '<p class="th-msg">Thanks for registering,don \'t forget to confirm registration via email.</p>';
			});
		});
		return false;
	});
	
});

$('#mce-EMAIL').click(function(){
	$('span.fakeplaceholder').css('display','none');
});
$('#mce-EMAIL').mouseout(function(){
	if(!$('#mce-EMAIL').val()) {
		$('span.fakeplaceholder').css('display', 'block');
	}
	else {
		return;
	}
});
$('#mce-EMAIL').on('input',function(){
	$('span.fakeplaceholder').css('display','none');
});	


