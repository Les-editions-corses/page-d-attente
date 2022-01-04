
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



function dealSuccess(form, data) {
    form.find('.global_error,.error').empty();
    form.append("<div class='success'>" + data.message + "</div>");
    form.find('input,textarea,select').prop('disabled',true);
    setTimeout(() => $('button[data-fancybox-close]').click(), 1500)
}

$('form[name="contact_form"]').each(function () {
    var form = $(this);

    form.on("submit", function (event) {

        event.preventDefault();

        let action = $(this).attr("action");
        let formData = new FormData(this);
        let nameForm = $(this).attr("name");

        form.find('input,textarea,select,button').prop('disabled',true);

        $.edc.send(action, "POST", formData, function (e) {
            if (e.success) {
                dealSuccess(form, e);
            }
            else if (e.errors.length) {
                form.find('input,textarea,select,button').removeAttr('disabled');
                e.errors.forEach(function (key) {

                    let keyName = Object.keys(key);
                    let keyValue = Object.values(key)[0][0].message;
                    let input = nameForm + "_" + keyName;
                    if(form.find('#'+input).next('.error').length){
                        form.find('#'+input).next('.error').empty().append("<div class='error'>" + keyValue + "</div>");
                    }
                    else{
                        form.find("#" + input).after("<div class='error'>" + keyValue + "</div>");
                    }
                })
            }
            else if (e.globalErrors.length){

                form.find('input,textarea,select,button').removeAttr('disabled');
                e.globalErrors.forEach(function (error) {

                    var globalErrors = form.find('.global_error');
                    let message = error.message;

                    if(globalErrors.length){
                        globalErrors.empty().append(message)
                    }
                    else{
                        form.append($('<div class="global_error"></div>').append(message));
                    }


                })
            }

        });
    })
});