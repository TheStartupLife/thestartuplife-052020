$(document).ready(function(){
    var lazyloadImages;
    
    if("IntersectionObserver" in window){
        lazyloadImages = document.querySelectorAll(".lazy");
        var imageObserver = new IntersectionObserver(function(entries, observer){
            console.log(observer);
            entries.forEach(function(entry){
                if(entry.isIntersecting){
                    var image = entry.target;
                    image.classList.remove(".lazy");
                    imageObserver.unobserve(image);
                }
            });
        }, {
            root: document.querySelector("#container"),
            rootMargin: "0px 0px 500px 0px"
        });
        
        lazyloadImages.forEach(function(image){
            imageObserver.observe(image);
        });
    }
    else {
        var lazyloadThrottleTimeout;
        lazyloadImages = $(".lazy");
        
        function lazyload(){
            if(lazyloadThrottleTimeout){
                clearTimeout(lazyloadThrottleTimeout);
            }
            
            lazyloadThrottleTimeout = setTimeout(function(){
                var scrollTop = $(window).scrollTop();
                lazyloadImages.each(function(){
                    var el = $(this);
                    if(el.offset().top < window.innerHeight + scrollTop + 500){
                    var url = el.attr("data-src");
                    el.attr("src", url);
                    img.removeClass('lazy');
                    lazyloadImages = $(".lazy");
                }
            });
            if(lazyloadImages.length == 0){
                $(document).off("scroll");
                $(window).off("resize");
            }
            }, 20);
        }
        
        $(document).on("scroll", lazyload);
        $(window).on("resize", lazyload);
}
});    
    



    

    

    