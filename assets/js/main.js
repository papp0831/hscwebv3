(function($) {
    var $window = $(window),
        $body = $('body');

    // Breakpoints.
    if (typeof breakpoints === 'function') {
        breakpoints({
            xlarge: ['1281px', '1680px'],
            large: ['981px', '1280px'],
            medium: ['737px', '980px'],
            small: ['481px', '736px'],
            xsmall: ['361px', '480px'],
            xxsmall: [null, '360px']
        });
    }

    // Play initial animations on page load.
    $window.on('load', function() {
        window.setTimeout(function() {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Touch?
    if (typeof browser !== 'undefined' && browser.mobile)
        $body.addClass('is-touch');

    // Forms.
    var $form = $('form');

    // Auto-resizing textareas.
    $form.find('textarea').each(function() {
        var $this = $(this),
            $wrapper = $('<div class="textarea-wrapper"></div>');

        $this
            .wrap($wrapper)
            .attr('rows', 1)
            .css({
                'overflow': 'hidden',
                'resize': 'none'
            })
            .on('keydown', function(event) {
                if (event.keyCode === 13 && event.ctrlKey) {
                    event.preventDefault();
                    event.stopPropagation();
                    $(this).blur();
                }
            })
            .on('blur focus', function() {
                $this.val($.trim($this.val()));
            })
            .on('input blur focus --init', function() {
                $wrapper.css('height', $this.height());
                $this.css('height', 'auto').css('height', $this.prop('scrollHeight') + 'px');
            })
            .on('keyup', function(event) {
                if (event.keyCode === 9)
                    $this.select();
            })
            .triggerHandler('--init');

        // Fix for IE and mobile
        if (typeof browser !== 'undefined' && (browser.name === 'ie' || browser.mobile))
            $this.css({
                'max-height': '10em',
                'overflow-y': 'auto'
            });
    });

    // Menu.
    var $menu = $('#menu');

    $menu.wrapInner('<div class="inner"></div>');

    $menu._locked = false;

    $menu._lock = function() {
        if ($menu._locked)
            return false;

        $menu._locked = true;

        window.setTimeout(function() {
            $menu._locked = false;
        }, 350);

        return true;
    };

    $menu._show = function() {
        if ($menu._lock())
            $body.addClass('is-menu-visible');
    };

    $menu._hide = function() {
        if ($menu._lock())
            $body.removeClass('is-menu-visible');
    };

    $menu._toggle = function() {
        if ($menu._lock())
            $body.toggleClass('is-menu-visible');
    };

    $menu
        .appendTo($body)
        .on('click', function(event) {
            event.stopPropagation();
        })
        .on('click', 'a', function(event) {
            var href = $(this).attr('href');

            event.preventDefault();
            event.stopPropagation();

            // Hide.
            $menu._hide();

            // Redirect.
            if (href !== '#menu') {
                window.setTimeout(function() {
                    window.location.href = href;
                }, 350);
            }
        })
        .append('<a class="close" href="#menu">Close</a>');

    $body
        .on('click', 'a[href="#menu"]', function(event) {
            event.stopPropagation();
            event.preventDefault();

            // Toggle.
            $menu._toggle();
        })
        .on('click', function() {
            // Hide.
            $menu._hide();
        })
        .on('keydown', function(event) {
            // Hide on escape.
            if (event.keyCode === 27)
                $menu._hide();
        });

    // Hírfal animáció és Slideshow logika
    $(document).ready(function() {
        // Hírfal animáció
        $('.hirek .hir').each(function(index) {
            $(this).css({
                'opacity': 0,
                'transform': 'translateY(20px)'
            });

            setTimeout(() => {
                $(this).css({
                    'opacity': 1,
                    'transform': 'translateY(0)',
                    'transition': 'opacity 0.6s ease-out, transform 0.6s ease-out'
                });
            }, index * 200); // Egyesével késlelteti a megjelenést
        });

        // Slideshow logika
        var $slides = $('.slide'),
            currentSlide = 0;

        // Első kép megjelenítése
        $slides.eq(currentSlide).addClass('active');

        // Automatikus váltás 3 másodpercenként
        setInterval(function() {
            $slides.eq(currentSlide).removeClass('active');
            currentSlide = (currentSlide + 1) % $slides.length;
            $slides.eq(currentSlide).addClass('active');
        }, 3000);
    });

})(jQuery);
