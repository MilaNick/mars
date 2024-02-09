document.addEventListener("DOMContentLoaded", ready);

function ready() {
    /* mouse movement - changing background-position-x */
    const throttle = (fn, throttleTime) => {
        let start = -Infinity;
        let cachedResult;
        return function () {
            const end = Date.now();
            if (end - start >= throttleTime) {
                start = end;
                cachedResult = fn.apply(this, arguments);
            }
            return cachedResult;
        };
    }

    const moveBg = document.querySelector('.move-bg');
    const handlerMove = (e) => {
        const header = document.querySelector('.header');
        const { y: headerY, height: headerHeight} = header.getBoundingClientRect();
        const headerBottomY = headerY + headerHeight;
        if (e.clientY < headerBottomY) {
            return;
        }
        const centerBody = moveBg.getBoundingClientRect().width / 2;
        const DEFAULT_POSITION = 50;
        const offset = e.clientX - centerBody;
        const newPosition = offset * DEFAULT_POSITION / centerBody + DEFAULT_POSITION;
        moveBg.setAttribute("style", `background-position-x: ${newPosition}%`)
    }
    moveBg.addEventListener('mousemove', throttle(handlerMove,110));
    moveBg.addEventListener('pointermove', throttle(handlerMove,110));

    /* fullscreenPopup */
    const fullscreenPopup = document.querySelector('.full-screen-popup');
    const btnBuyTicket = document.querySelector('.header__btn');
    const btnClosed = document.querySelector('.buy-tickets__closed');

    btnBuyTicket.addEventListener('click', () => {
        fullscreenPopup.classList.add('full-screen-popup--active');
    })

    btnClosed.addEventListener('click', () => {
        fullscreenPopup.classList.remove('full-screen-popup--active');
    })

    /* js-datepicker */
    const options = {
        id: 1,
        formatter: (input, date) => {
            input.value = date.toLocaleDateString();
        },
        customDays: ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'],
        customMonths: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    }

    datepicker('.buy-tickets-range[name="date-from"]', options);
    datepicker('.buy-tickets-range[name="date-to"]', options);

    /* for animation */

    setTimeout(() => {
        document.body.classList.add('site-open-animation');
    }, 700);

}

/* nav mobile */
const burger = document.querySelector('.nav__burger-wrap');
const navMobile = document.querySelector('.full-screen-nav-mobile');
const btnClosedNav = document.querySelector('.nav-mobile__closed');

burger.addEventListener('click', () => {
    navMobile.classList.add('full-screen-nav-mobile--active');
})

btnClosedNav.addEventListener('click', () => {
    navMobile.classList.remove('full-screen-nav-mobile--active');
})

/* play/pause video onclick*/

// const myVideo = document.getElementById("video");
// myVideo.addEventListener('click', function(e){
//     e.preventDefault();
//     // this[this.paused ? 'play' : 'pause']();
//
//     if (this.paused) {
//         this.play();
//     } else {
//         this.pause();
//     }
// });