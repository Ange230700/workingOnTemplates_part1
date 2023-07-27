(function ($) {

    var $window = $(window),
        $body = $('body'),
        $header = $('#header'),
        $wrapper = $('#wrapper'),
        $footer = $('#footer'),
        $main = $('#main'),
        $main_articles = $main.children('article');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: ['481px', '736px'],
        xsmall: ['361px', '480px'],
        xxsmall: [null, '360px']
    });

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    })

    // Fix: Flexbox min-height bug on IE.
    if (browser.name == 'ie') {
        var flexboxFixTimeoutId;

        $window.on('resize.flexbox-fix', function () {
            clearTimeout(flexboxFixTimeoutId);
            flexboxFixTimeoutId = setTimeout(function () {
                if ($wrapper.prop('scrollHeight') > $window.height())
                    $wrapper.css('height', 'auto');
                else
                    $wrapper.css('height', '100vh')
            }, 250)
        }).triggerHandler('resize.flexbox-fix');
    }

    // Nav.
    var $nav = $header.children('nav'),
        $nav_li = $nav.find('li');

    // Add "middle" alignment classes if we're dealing with an even number of items.
    if ($nav_li.length % 2 == 0) {
        $nav.addClass('use-middle');
        $nav_li.eq(($nav_li.length / 2)).addClass('is-middle');
    }

    // Main.
    var delay = 325,
        locked = false;

    // Methods.
    $main._show = function (id, initial) {
        var $article = $main_articles.filter('#' + id);

        // No such article? Bail.
        if ($article.length == 0)
            return;

        // Handle lock.

        // Already locked? Speed through "show" steps w/o delays.
        if (locked || (typeof initial != 'undefined' && initial === true)) {
            $body.addClass('is-article-visible');
            $body.addClass('is-switching');
            $main_articles.removeClass('active');
            $header.hide();
            $footer.hide();
            $main.show();
            $article.show();
            $article.addClass('active');
            locked = false;
            setTimeout(function () {
                $body.removeClass('is-switching');
            }, (initial ? 1000 : 0));
            return;
        }

        locked = true;

        if ($body.hasClass('is-article-visible')) {
            var $currentArticle = $main_articles.filter('.active');
            $currentArticle.removeClass('active');
            setTimeout(function () {
                $currentArticle.hide();
                $article.show();
                setTimeout(function () {
                    $article.addClass('active');
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');
                }, 25);
            }, delay);
        }

        else {
            $body
                .addClass('is-article-visible');
            setTimeout(function () {
                $header.hide();
                $footer.hide();
                $main.show();
                $article.show();
                setTimeout(function () {
                    $article.addClass('active');
                    $window
                        .scrollTop(0)
                        .triggerHandler('resize.flexbox-fix');
                    setTimeout(function () {
                        locked = false;
                    }, delay)
                }, 25);
            }, delay)
        }
    };

    $main._hide = function (addState) {
        var $article = $main_articles.filter('.active');
        if (!$body.hasClass('is-article-visible'))
            return;
        if (typeof addState != 'undefined' && addState === true)
            history.pushState(null, null, '#')

        if (locked) {
            $body.addClass('is-switching');
            $article.removeClass('active');
            $article.hide();
            $main.hide();
            $header.show();
            $footer.show();
            $body.removeClass('is-article-visible');
            locked = false;
            $body.removeClass('is-switching');
            $window
                .scrollTop(0)
                .triggerHandler('resize.flexbox-fix');
            return;
        }

        locked = true;
        $article.removeClass('active');
        setTimeout(function () {
            $article.hide();
            $main.hide();
            $header.show();
            $footer.show();
            setTimeout(function () {
                $body.removeClass('is-article-visible');
                $window
                    .scrollTop(0)
                    .triggerHandler('resize.flexbox-fix');
                setTimeout(function () {
                    locked = false;
                }, delay)
            }, 25);
        }, delay);
    };

    $main_articles.each(function () {
        var $this = $(this);
        $('<div class="close">Close</div>')
            .appendTo($this)
            .on('click', function () {
                location.hash = '';
            });

        $this.on('click', function (event) {
            event.stopPropagation();
        });
    });

    $body.on('click', function (event) {
        if ( $body.hasClass('is-article-visible') )
            $main._hide(true);
    });

    
})(jQuery);