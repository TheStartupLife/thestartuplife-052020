document.addEventListener("DOMContentLoaded", function(){
    var lazyLoadImages = document.querySelectorAll("img.lazy");
    var lazyLoadThrottleTimeout;

    lazyLoadThrottleTimeout = setTimeout(scrollLoad, 20);

    document.addEventListener("scroll", lazyload);
    document.addEventListener("resize", lazyload);
    document.addEventListener("orientationChange", lazyload);
});
function lazyload(){
    if(lazyLoadThrottleTimeout){
        clearTimeout(lazyLoadThrottleTimeout);
    }
}
function scrollLoad(){
    var scrollTop = window.pageYOffset;
    lazyloadImages.forEach(function(img){
        if(img.offsetTop < (window.innerHeight + scrollTop)){
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        }
    });
    if(lazyLoadImages.length == 0){
        document.removeEventListener("scroll", lazyload);
        window.removeEventListener("resize", lazyload);
        window.removeEventListener("orientationChange", lazyload);
    }
}