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
document.querySelector('video').playbackRate = 1.7;
const throttle = (fn, throttleTime) => {
    let start = -Infinity;
    let cachedResult;
    return function() {
        const end = Date.now();
        if (end - start >= throttleTime) {
            start = end;
            cachedResult = fn.apply(this, arguments);
        }
        return cachedResult;
    };
}

const moveBg = document.querySelector('.move-bg');

moveBg.addEventListener('mousemove', throttle((e) => {
    const centerBody = moveBg.getBoundingClientRect().width / 2;
    const DEFAULT_POSITION = 50;
    const offset = e.clientX - centerBody;
    const newPosition = offset * DEFAULT_POSITION / centerBody + DEFAULT_POSITION;
    moveBg.setAttribute("style",`background-position-x: ${newPosition}%`)
}, 110));

const fullscreenPopup = document.querySelector('.wrapper');
document.body.addEventListener('click', () => {
    // fullscreenPopup.classList.add('wrapper--active');
})

const options = {
    id: 1,
    formatter: (input, date) => {
        input.value = date.toLocaleDateString();
    },
    customDays: ['пн', 'вт', '二', '三', '四', '五', '六'],
    customMonths: ['Январь', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
}

const start = datepicker('.buy-tickets-range[name="date-from"]', options);
const end = datepicker('.buy-tickets-range[name="date-to"]', options);