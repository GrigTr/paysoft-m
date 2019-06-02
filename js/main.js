"use strict";
window.addEventListener('DOMContentLoaded', function(event){
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const addLoader = (function(){
        const laziesElContainers = $$(".item");
        const loader = `<svg class="loader">
        <g>
          <path d="M 50,100 A 1,1 0 0 1 50,0"/>
        </g>
        <g>
          <path d="M 50,75 A 1,1 0 0 0 50,-25"/>
        </g>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#01adff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FFCF55;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>`;
        laziesElContainers.forEach((container)=>{
            container.insertAdjacentHTML("afterBegin",loader);
        });
    }());

    const transformXCards = (function(){
        const cardsContainer = $(".other");
        const cards = $$(".other__item");

        const getMousePosition = function(xRef){
            let panelRect = cardsContainer.getBoundingClientRect();
            return {
                x: Math.floor(xRef - panelRect.left) /(panelRect.right-panelRect.left)*cardsContainer.offsetWidth
            }
        }

        const moveCards = function(event){
            if (window.screen.width >= 860 || window.innerWidth >= 860){
                const maxMove = cardsContainer.offsetWidth / 30;
                let addVal = 4;
                cards.forEach((card, index)=>{ 
                    card.style.transition = "0s";
                    const cardCenterX = card.offsetLeft + (card.offsetWidth / 2);
                    let mousePos = getMousePosition(event.clientX || event.changedTouches[0].clientX);
                    let distX = mousePos.x -cardCenterX;
                    if (distX < 0 ){
                        index++;
                        card.style.zIndex = index;
                    } else if (distX > 0) {
                        addVal--;
                        card.style.zIndex = addVal;
                    }
                    card.style.transform = `skewY(${distX/maxMove/4.5}deg)`;
                });
            }
    }

    const returnBack = function(event) {
        event.stopPropagation();
        cards.forEach((card)=>{
            card.style.transition = "0.3s";
            card.style.transform = "skewY(0deg)";
        });
    }

    cardsContainer.addEventListener('mousemove', moveCards);
    cardsContainer.addEventListener('touchmove', moveCards);
    cardsContainer.addEventListener('mouseleave', returnBack);
    cardsContainer.addEventListener('touchend', returnBack);
    }());

    const lazyLoad = (function(){
        
        const isInViewport = function(element){
            let position = element.getBoundingClientRect();
            return (
                position.bottom >= 0 && position.top <= (window.innerHeight || document.documentElement.clientHeight)
            );
        };

        const laziesEl = $$(".lazy");

        const lazyLoadFunc = function(event) {
           event.stopPropagation();
           
            for(let i=0; i<laziesEl.length; i++){
                if(isInViewport(laziesEl[i])) {
                    const img = laziesEl[i].querySelector("img");
                    if (img.getAttribute('data-src')) {
                        img.src = img.getAttribute('data-src');
                        img.removeAttribute('data-src');
                        img.addEventListener("load",function(){
                            if(laziesEl[i].querySelector(".loader")){
                                let loader = laziesEl[i].querySelector(".loader");
                                loader.style.display = "none";
                            }
                      });
                    }
                    laziesEl[i].classList.remove("lazy");
                }
            }
          }
          
        if (window.addEventListener) {
            window.addEventListener("load", lazyLoadFunc);
            window.addEventListener("scroll", lazyLoadFunc);
        } else {
            window.attachEvent('on' + load, lazyLoadFunc);
            window.attachEvent('on' + scroll, lazyLoadFunc);
        }
    }());

    const popUp = (function(){
        const items = $$(".item");
        const popUpCloseBtn = $('.pop-up__button-close');
        const popUp = document.querySelector(".pop-up");

        const overLay = {
            it: document.querySelector(".grey-overlay"),
            toggleClass: function(){
                this.it.classList.toggle("open");
            }
        };

        function preventDefault(e){
            e.preventDefault();
        }
        function disableScroll(){
            document.body.addEventListener('touchmove', preventDefault, { passive: false });
        }
        function enableScroll(){
            document.body.removeEventListener('touchmove', preventDefault);
        }
        const openPopup = function(event){
            event.stopPropagation();
            popUp.classList.add("pop-up-open");
            disableScroll();
            document.body.style.overflow = "hidden";
            document.body.classList.add("no-scroll");
            let container = $('.pop-up__main-content');
            container.addEventListener("touchmove", enableScroll);
            container.addEventListener("touchend", disableScroll);
            overLay.toggleClass();
        }
        const closePopUp = function(event){
            event.stopPropagation();
            popUp.classList.remove("pop-up-open");
            enableScroll();
            document.body.classList.remove("no-scroll");
            document.body.style.overflow = "auto";
            overLay.toggleClass();
        };
        items.forEach((item)=>{
            item.addEventListener("click", openPopup);
        });
        popUpCloseBtn.addEventListener("click", closePopUp);
    }());

    const postAjax = (function(){
        const form = $('.page-form');
        const submit = $('.page-form__button');

        const createRequest = function(action){
            let request;
            if (window.XMLHttpRequest) { // Mozilla, Safari, ...
                request = new XMLHttpRequest();
                if (request.overrideMimeType) {
                    request.overrideMimeType('text/xml');
                }
            } else if (window.ActiveXObject) { // IE
                request = new ActiveXObject("Microsoft.XMLHTTP");
            }

            request.open('POST', action, true);
            request.setRequestHeader('accept', 'application/json');
            let formData = new FormData(form);
            request.send(formData);
        };


        const isInputsValidate = function(){
            let result = true;
            const inputs = $$('.input');
            inputs.forEach((input)=>{
                if(input.value === ""){
                    result = false;
                    input.style.color = "red";
                    input.previousElementSibling.style.color = "red";
                } else {
                    input.style.color = "#38454f";
                    input.previousElementSibling.style.color = "#38454f";
                }
                if (input.name == "email"){
                    const regMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if (!regMail.test(input.value)){
                        result = false;
                        input.style.color = "red";
                        input.previousElementSibling.style.color = "red";
                    } else {
                        input.style.color = "#38454f";
                        input.previousElementSibling.style.color = "#38454f";
                    }
                } 
            });
            
            return result;
        };

        const makeRequest = function(event){
            event.preventDefault();
            if (isInputsValidate()){
                console.log("send");
                createRequest('send.php');
            } else {
                console.log("error");
            }
        }
        submit.addEventListener("click", makeRequest);
    }());


     const smoothScrollingToElement = (function(){
        const links = $$('.link');
        //const buttons = $$('.button-to-form');
        
        // const getPadding = function(selector){
        //     return document.querySelector(selector).offsetHeight;
        // }
        const elmYPosition = function(eID) {
          let elm = document.getElementById(eID);
          let y = elm.offsetTop;
          let node = elm;
          while (node.offsetParent && node.offsetParent != document.body) {
            node = node.offsetParent;
            y += node.offsetTop;
          }
          return y;
        };
    
        const smoothScroll = function(eID) {
          let startY = self.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
          let padding = 30;
          //if (windowInfo.width >= windowInfo.desktopMinWidth) padding = getPadding(selector);
          let stopY = elmYPosition(eID) - padding;
          let distance = stopY > startY ? stopY - startY : startY - stopY;
          if (distance < 100) {
            scrollTo(0, stopY); return;
          }
          let speed = Math.round(distance / 100);
          if (speed >= 20) speed = 20;
          let step = Math.round(distance / 25);
          let leapY = stopY > startY ? startY + step : startY - step;
          let timer = 0;
          if (stopY > startY) {
            for ( let i=startY; i<stopY; i+=step ) {
              setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
              leapY += step;
              if (leapY > stopY) leapY = stopY;
              timer++;
            } return;
          }
          for ( let i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step;
            if (leapY < stopY) leapY = stopY;
            timer++;
          }
        };
    
        for (let i =0; i < links.length; i++) {
          links[i].addEventListener('click', function(event){
              event.preventDefault();
              event.stopPropagation();
              let id = "" + event.target.dataset.target;
              smoothScroll(id);
              if ($(".checkbox-toggle").checked){
                $(".checkbox-toggle").checked = false;
              }
           });
        }
        // buttons.forEach((button)=>{
        //     button.addEventListener('click', function(event){
        //         event.preventDefault();
        //         event.stopPropagation();
        //         const id = "page-form";
        //         smoothScroll(id,".navigation__list");
        //     });
        // })
    }());

});


