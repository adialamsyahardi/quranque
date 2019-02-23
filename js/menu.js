// (function () {
  'use strict';

  var menuIconElement = document.querySelector('.header__icon');
  var menuElement = document.querySelector('.menu');
  var menuOverlayElement = document.querySelector('.menu__overlay');

  //Menu click event
  menuIconElement.addEventListener('click', showMenu, false);
  menuOverlayElement.addEventListener('click', hideMenu, false);

   //To show menu
  function showMenu() {
  	menuElement.style.transform = "translateX(0)";
    menuElement.classList.add('menu--show');
    menuOverlayElement.classList.add('menu__overlay--show');
  }

  //To hide menu
  function hideMenu() {
  	menuElement.style.transform = "translateX(-110%)";
    menuElement.classList.remove('menu--show');
    menuOverlayElement.classList.remove('menu__overlay--show');
  }

  var start = null;
  window.addEventListener("touchstart",function(event){
    if(event.touches.length === 1){
       //just one finger touched
       start = event.touches.item(0).clientX;
     }else{
       //a second finger hit the screen, abort the touch
       start = null;
     }
   });

   window.addEventListener("touchend",function(event){
    var offset = 50;
    if(start){
      var end = event.changedTouches.item(0).clientX;

      if(end > start + offset){
       //a left -> right swipe
       showMenu();
      }
      if(end < start - offset ){
       //a right -> left swipe
       hideMenu();
      }
    }
  });

// })();
