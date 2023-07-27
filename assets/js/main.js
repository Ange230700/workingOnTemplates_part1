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
    $main._show = function(id, initial){
        var $article = $main_articles.filter('#' + id);

        // No such article? Bail.
        if ($article.length == 0)
            return;

        // Handle lock.

        // Already locked? Speed through "show" steps w/o delays.
        if(locked || (typeof initial != 'undefined' && initial === true)){
            $body.addClass('is-article-visible');
            $body.addClass('is-switching');
            $main_articles.removeClass('active');
            $header.hide();
            $footer.hide();
            $main.show();
            $article.show();
            $article.addClass('active');
            locked = false;
            setTimeout(function(){
                $body.removeClass('is-switching');
            }, (initial ? 1000 : 0));
            return;
        }

        locked = true;

        if($body.hasClass('is-article-visible')){
            var $currentArticle = $main_articles.filter('.active');
            $currentArticle.removeClass('active');
            setTimeout(function(){
                $currentArticle.hide();
                $article.show();
                setTimeout(function(){

                }, 25);
            }, delay);
        }
    }
})(jQuery);