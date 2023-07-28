(function ($) {
    /**
     * Generate an intended list of links form a nav.
     * Meant for use with panel().
     * @return {jQuery} jQuery object.
     */
    $.fn.navList = function () {
        var $this = $(this);
        $a = $this.find('a'),
            b = [];
        $a.each(function () {
            var $this = $(this),
                indent = Math.max(0, $this.parents('li').length - 1),
                href = $this.attr('href'),
                target = $this.attr('target');
            b.push(
                '<a ' +
                'class="link depth-' + indent + '"' +
                ((typeof target !== 'undefined' && target != '') ? ' target="' + target + '"' : '') +
                ((typeof href !== 'undefined' && href != '') ? ' href="' + href + '"' : '') +
                '>' +
                '<span class="indent-' + indent + '"></span>' +
                $this.text() +
                '</a>'
            );
        });

        return b.join('');
    };

    /**
     * Panel-ify an element.
     * @param {object} userConfig User config.
     * @return {jQuery} jQuery object.
     */
    $.fn.panel = function(userConfig){
        if (this.length == 0)
            return $this;

        if(this.length > 1){
            for(var i=0; i < this.length; i++)
                $(this[i]).panel(userConfig);

            return $this;
        }

        var $this = $(this),
            $body = $('body'),
            $window = $(window),
            id = $this.attr('id'),
            config;

        config =$.extend({
            delay: 0,
            hideOnClick: false,
            hideOnEscape: false,
            hideOnSwipe: false,
            resetScroll: false,
            resetForms: false,
            side: null,
            target: $this,
            visibleClass: 'visible'
        }, userConfig)
    };

    /**
     * Apply "placeholder" attribute polyfill to one or more forms.
     * @return {jQuery} jQuery object.
     */

    $.fn.placeholder = function(){
        if (typeof (document.createElement('input')).placeholder != 'undefined')
            return $(this);
    };
})(jQuery);