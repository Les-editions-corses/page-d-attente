
(function(){
    //initialize swiper when document ready

    var swippers = new Array();
    document.body.querySelectorAll('.zone.diapo_top').forEach(function(zone){

        zone.querySelector(".swiper-controls").style.display = "none";

        var length = zone.querySelectorAll(".photo").length;
        if(length > 1)
        {
            var loop = true;
            var autoplay = { delay : 5000 };
            var navigation = {
                nextEl: zone.querySelectorAll('.swiper-button-next'),
                prevEl: zone.querySelectorAll('.swiper-button-prev')
            };
        }
        else{
            var loop = false;
            var autoplay = false;
            var navigation = false;
        }

        swippers.push(new Swiper (zone.querySelectorAll('.swiper-container'), {
            // Optional parameters
            direction: 'horizontal',
            loop: loop,
            autoplay: autoplay,
            slidesPerView: 1,
            speed:1000,
            effect : 'fade',
            fadeEffect: {
                crossFade: true
            },
            navigation: navigation,
            on: {
                init:function(){
                    const photos = this.$el[0].querySelectorAll('.photo:not(.loaded),.lazy');
                    if(LazyLoad !== undefined){
                        if(LazyLoad.ImageObserver != null){
                            photos.forEach(function(photo){
                                LazyLoad.ImageObserver.observe(photo);
                            });
                        }
                        else{
                            photos.forEach(function(photo){
                                LazyLoad.lazyObjects[lazyImages.length] = photo;
                            })
                        }
                    }
                },
            },
        }));
    });

})();