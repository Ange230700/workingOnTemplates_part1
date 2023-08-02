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
    $.fn.panel = function (userConfig) {
        if (this.length == 0)
            return $this;

        if (this.length > 1) {
            for (var i = 0; i < this.length; i++)
                $(this[i]).panel(userConfig);

            return $this;
        }

        var $this = $(this),
            $body = $('body'),
            $window = $(window),
            id = $this.attr('id'),
            config;

        config = $.extend({
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

    $.fn.placeholder = function () {
        if (typeof (document.createElement('input')).placeholder != 'undefined')
            return $(this);
        if (this.length == 0)
            return $this;
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++)
                $(this[i]).placeholder();

            return $this;
        }

        var $this = $(this);
        $this.find('input[type=text],textarea').each(function () {
            var i = $(this);
            if (i.val() == '' || i.val() == i.attr('placeholder')) i.addClass('polyfill-placeholder').val(i.attr('placeholder'));
        })
            .on('blur', function () {
                var i = $(this);

                if (i.attr('name').match(/-polyfill-field$/))
                    return;

                if (i.val() == '')
                    i.addClass('polyfill-placeholder').val(i.attr('placeholder'));
            })
            .on('focus', function () {
                var i = $(this);

                if (i.attr('name').match(/-polyfill-field$/))
                    return;

                if (i.val() == i.attr('placeholder'))
                    i.removeClass('polyfill-placeholder').val('');
            });

        $this.find('input[type=password]').each(function () {
            var i = $(this);
            var x = $($('<div>').append(i.clone()).remove().html().replace(/type="password"/i, 'type="text"').replace(/type=password/i, 'type=text'));

            if (i.attr('id') != '')
                x.attr('id', i.attr('id') + '-polyfill-field');

            if (i.attr('name') != '')
                x.attr('name', i.attr('name') + '-polyfill-field')

            x.addClass('polyfill-placeholder').val(x.attr('placeholder')).insertAfter(i);

            if (i.val() == '')
                i.hide();
            else
                x.hide();

            i.on('blur', function (event) {
                event.preventDefault();

                var x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

                if (i.val() == '') {
                    i.hide();
                    x.show();
                }
            });
            x.on('focus', function (event) {
                event.preventDefault();

                var i = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');

                x.hide();

                i.show().focus();
            })
                .on('keypress', function (event) {
                    event.preventDefault();
                    x.val('');
                });
        });

        $this.on('submit', function () {
            $this.find('input[type=text],input[type=password],textarea').each(function (event) {
                var i = $(this);

                if (i.attr('name').match(/-polyfill-field$/))
                    i.attr('name', '');

                if (i.val() == i.attr('placeholder')) {
                    i.removeClass('polyfill-placeholder');
                    i.val('');
                }
            });
        })
            .on('reset', function (event) {
                event.preventDefault();

                $this.find('select').val($('option:first').val());

                $this.find('input,textarea').each(function () {
                    var i = $(this),
                        x;

                    i.removeClass('polyfill-placeholder');

                    switch (this.type) {
                        case 'submit':
                        case 'reset':
                            break;

                        case 'password':
                            i.val(i.attr('defaultValue'));

                            x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');

                            if (i.val() == '') {
                                i.hide();
                                x.show();
                            }
                            else {
                                i.show();
                                x.hide();
                            }

                            break;

                        case 'checkbox':
                        case 'radio':
                            i.attr('checked', i.attr('defaultValue'));
                            break;

                        case 'text':
                        case 'textarea':
                            i.val(i.attr('defaultValue'));

                            if (i.val() == '') {
                                i.addClass('polyfill-placeholder');
                                i.val(i.attr('placeholder'));
                            }

                            break;

                        default:
                            i.val(i.attr('defaultValue'));
                            break;
                    }
                });
            });

        return $this;

        /**
         * Moves elements to/from the first positions of their respective parents.
         * @param {jQuery} $elements Elements (or selector) to move.
         * @param {bool} condition If true, moves elements to the top. Otherwise, moves elements back to their original locations.
         */
        $.prioritize = function ($elements, condition) {
            var key = '__prioritize';

            if (typeof ($elements) != 'jQuery')
                $elements = $($elements);

            $elements.each(function () {
                var $e = $(this), $p, $parent = $e.parent();

                if ($parent.length == 0)
                    return;

                if (!$e.data(key)) {
                    if (!condition)
                        return;

                    $p = $e.prev();

                    if ($p.length == 0)
                        return;

                    $e.prependTo($parent);

                    $e.data(key, $p);

                }

                else {
                    if (condition)
                        return;

                    $p = $e.data(key);

                    $e.insertAfter($p);

                    $e.removeData(key);
                }
            });
        }
    };
})(jQuery);