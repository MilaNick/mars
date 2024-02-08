const myVideo = document.getElementById("video");
myVideo.addEventListener('click', function(e){
    e.preventDefault();
    // this[this.paused ? 'play' : 'pause']();

    if (this.paused) {
        this.play();
    } else {
        this.pause();
    }
});
// autoplay playsinline

