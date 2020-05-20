"use strict";
"use strict";

var liquidIsMobile = function liquidIsMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

var liquidMobileNavBreakpoint = function liquidMobileNavBreakpoint() {
  if (window.liquidParams && window.liquidParams.mobileNavBreakpoint) {
    return window.liquidParams.mobileNavBreakpoint;
  } else {
    return jQuery('body').data('mobile-nav-breakpoint') || 1199;
  }
};

var liquidWindowWidth = function liquidWindowWidth() {
  return window.innerWidth;
};

var liquidWindowHeight = function liquidWindowHeight() {
  return window.innerHeight;
};
/**
 Some functions from Underscore js https://underscorejs.org/
*/
// Some functions take a variable number of arguments, or a few expected
// arguments at the beginning and then a variable number of values to operate
// on. This helper accumulates all remaining arguments past the function’s
// argument length (or an explicit `startIndex`), into an array that becomes
// the last argument. Similar to ES6’s "rest parameter".


var restArguments = function restArguments(func, startIndex) {
  startIndex = startIndex == null ? func.length - 1 : +startIndex;
  return function () {
    var length = Math.max(arguments.length - startIndex, 0),
        rest = Array(length),
        index = 0;

    for (; index < length; index++) {
      rest[index] = arguments[index + startIndex];
    }

    switch (startIndex) {
      case 0:
        return func.call(this, rest);

      case 1:
        return func.call(this, arguments[0], rest);

      case 2:
        return func.call(this, arguments[0], arguments[1], rest);
    }

    var args = Array(startIndex + 1);

    for (index = 0; index < startIndex; index++) {
      args[index] = arguments[index];
    }

    args[startIndex] = rest;
    return func.apply(this, args);
  };
}; // Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.


var liquidDelay = restArguments(function (func, wait, args) {
  return setTimeout(function () {
    return func.apply(null, args);
  }, wait);
}); // A (possibly faster) way to get the current timestamp as an integer.

var liquidNow = Date.now || function () {
  return new Date().getTime();
}; // Returns a function, that, when invoked, will only be triggered at most once
// during a given window of time. Normally, the throttled function will run
// as much as it can, without ever going more than once per `wait` duration;
// but if you'd like to disable the execution on the leading edge, pass
// `{leading: false}`. To disable execution on the trailing edge, ditto.


var liquidThrottle = function liquidThrottle(func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function later() {
    previous = options.leading === false ? 0 : liquidNow();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function throttled() {
    var now = liquidNow();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function () {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
}; // Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.


var liquidDebounce = function liquidDebounce(func, wait, immediate) {
  var timeout, result;

  var later = function later(context, args) {
    timeout = null;
    if (args) result = func.apply(context, args);
  };

  var debounced = restArguments(function (args) {
    if (timeout) clearTimeout(timeout);

    if (immediate) {
      var callNow = !timeout;
      timeout = setTimeout(later, wait);
      if (callNow) result = func.apply(this, args);
    } else {
      timeout = liquidDelay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
}; // If it's IE


(function () {
  var ua = window.navigator.userAgent;
  var msie = /MSIE|Trident/.test(ua);
  msie && document.querySelector('html').classList.add('is-ie');
})(); // Custom event Polyfill for IE


(function () {
  if (typeof window.CustomEvent === "function") return false;

  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: null
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidPreloader';
  var defaults = {
    animationType: 'fade',
    animationTargets: 'self',
    stagger: 0
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.$body = $('body');
      this.init();
      this.events();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {}
    }, {
      key: "getAnimationTargets",
      value: function getAnimationTargets() {
        var animationTargets = this.options.animationTargets;

        if (animationTargets === 'self') {
          return this.element;
        } else {
          return document.querySelectorAll(animationTargets);
        }
      }
    }, {
      key: "getAnimationProperties",
      value: function getAnimationProperties() {
        var animationType = this.options.animationType;
        return this["".concat(animationType, "Properties")]();
      }
    }, {
      key: "fadeProperties",
      value: function fadeProperties() {
        var animateIn = {
          opacity: [0, 1]
        };
        var animateOut = {
          opacity: [1, 0]
        };
        return {
          animateIn: animateIn,
          animateOut: animateOut
        };
      }
    }, {
      key: "slideProperties",
      value: function slideProperties() {
        var animateIn = {
          translateX: ['100%', '0%']
        };
        var animateOut = {
          translateX: ['0%', '-100%']
        };
        return {
          animateIn: animateIn,
          animateOut: animateOut
        };
      }
    }, {
      key: "events",
      value: function events() {
        // new IntersectionObserver( (enteries, observer) => {
        // 	enteries.forEach(entry => {
        // 		if ( entry.isIntersecting ) {
        // 			imagesLoaded( entry.target, this.onPageLoad.bind(this) );
        // 			observer.disconnect(enteries.target)
        // 		}
        // 	})
        // } ).observe($('#content > section').get(0));
        // $(window).on('unload', this.onPageUnload.bind(this) );
        if ('onpagehide' in window) {
          window.addEventListener('pageshow', this.onPageLoad.bind(this), false);
          window.addEventListener('pagehide', this.onPageUnload.bind(this), false);
        } else {
          window.addEventListener('unload', this.onPageUnload.bind(this), false);
        }
      }
    }, {
      key: "onPageLoad",
      value: function onPageLoad(event) {
        if ((_typeof(event) !== _typeof(undefined) || event !== null) && event.persisted) {
          this.$body.addClass('lqd-page-loaded lqd-preloader-animations-started');
          this.$body.removeClass('lqd-page-leaving lqd-page-not-loaded');
          this.hidePreloader();
          return;
        }

        this.$body.addClass('lqd-page-loaded lqd-preloader-animations-started');
        this.$body.removeClass('lqd-page-leaving lqd-page-not-loaded');
        this.hidePreloader();
      }
    }, {
      key: "onPageUnload",
      value: function onPageUnload() {
        this.$body.addClass('lqd-page-leaving');
        this.$body.removeClass('lqd-preloader-animations-done');
        this.$body.addClass('lqd-preloader-animations-started');
        this.showPreloader();
      }
    }, {
      key: "hidePreloader",
      value: function hidePreloader() {
        var _this = this;

        var animationTargets = this.getAnimationTargets();
        var animeTimeline = anime.timeline({
          targets: animationTargets,
          duration: 1400,
          easing: 'easeOutExpo',
          delay: anime.stagger(this.options.stagger),
          complete: function complete(anime) {
            _this.$element.hide();

            _this.$body.removeClass('lqd-preloader-animations-started');

            _this.$body.addClass('lqd-preloader-animations-done');

            anime.animatables.forEach(function (animatable) {
              $(animatable.target).css('transform', '');
            });
          }
        });
        $(animationTargets).each(function (i, targetElement) {
          var $targetElement = $(targetElement);

          if (targetElement.hasAttribute('data-animations')) {
            var animations = $targetElement.data('animations');
            var properties = $.extend({}, animations, {
              targets: targetElement
            });
            animeTimeline.add(properties, _this.options.stagger * i);
          } else {
            var animationProperties = _this.getAnimationProperties().animateOut;

            var _properties = $.extend({}, animationProperties, {
              targets: targetElement
            });

            animeTimeline.add(_properties, _this.options.stagger * i);
          }
        });
      }
    }, {
      key: "showPreloader",
      value: function showPreloader() {
        // const animationTargets = this.getAnimationTargets();
        // const animeTimeline = anime.timeline({
        // 	targets: animationTargets,
        // 	duration: 1000,
        // 	easing: 'easeOutExpo',
        // 	delay: anime.stagger(this.options.stagger),
        // });
        this.$element.fadeIn('fast'); // anime.remove(animationTargets);
        // this.$element.show();
        // $(animationTargets).each( (i, targetElement) => {
        // 	const $targetElement = $(targetElement);
        // 	if ( targetElement.hasAttribute('data-animations') ) {
        // 		const animations = $targetElement.data('animations');
        // 		const animationsFirstValue = Object.values(animations)[0][0];
        // 		const animationsSecondValue = Object.values(animations)[0][1];
        // 		Object.values(animations)[0][0] = animationsSecondValue;
        // 		Object.values(animations)[0][1] = animationsFirstValue;
        // 		const properties = $.extend( {}, animations, { targets: targetElement } );
        // 		animeTimeline.add(properties, this.options.stagger * i)
        // 	} else {
        // 		const animationProperties = this.getAnimationProperties().animateIn;
        // 		const properties = $.extend( {}, animationProperties, { targets: targetElement } );
        // 		animeTimeline.add(properties, this.options.stagger * i)
        // 	}
        // } );

        return null;
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('preloader-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.lqd-preloader-wrap').liquidPreloader();
});
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidMegamenu';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      var _this$breakpoints;

      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(this.element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.mobileNavBreakPoint = liquidMobileNavBreakpoint();
      this.tabletBreakpoint = this.mobileNavBreakPoint <= 992 ? 992 : this.mobileNavBreakPoint; // containerWidth: [windowMinWidth, windowMaxWidth]

      this.breakpoints = (_this$breakpoints = {}, _defineProperty(_this$breakpoints, this.mobileNavBreakPoint - 60, [this.mobileNavBreakPoint + 1, Infinity]), _defineProperty(_this$breakpoints, 940, [992, this.tabletBreakpoint]), _this$breakpoints);
      this.$megamenuContainer = $('.megamenu-container', this.element);
      this.$innerRow = $('.megamenu-inner-row', this.element);
      this.isContentStretched = this.$innerRow.next('.vc_row-full-width').length ? true : false;
      this.$columns = $('.megamenu-column', this.element);
      this.$submenu = $('.nav-item-children', this.element);
      this.defaultSidePadding = 15;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.setColumnsNumbers();

        if (!this.isContentStretched) {
          this.setContainerWidth();
          this.getElementBoundingRect();
          this.resizeWindow();
        } else {
          this.$element.addClass('megamenu-content-stretch');
          this.$megamenuContainer.removeClass('container').addClass('container-fluid');
          this.$element.addClass('position-applied');
        }
      }
    }, {
      key: "setColumnsNumbers",
      value: function setColumnsNumbers() {
        this.$element.addClass("columns-".concat(this.$columns.length));
      }
    }, {
      key: "getColumnsWidth",
      value: function getColumnsWidth() {
        var columnsWidth = 0;
        $.each(this.$columns, function (i, col) {
          columnsWidth += Math.round($(col).outerWidth(true));
        });
        return columnsWidth;
      }
    }, {
      key: "setContainerWidth",
      value: function setContainerWidth() {
        this.$megamenuContainer.css({
          width: ''
        });
        var columnsWidth = this.getColumnsWidth();
        this.$megamenuContainer.width(columnsWidth - this.defaultSidePadding * 2);
      }
    }, {
      key: "getGlobalContainerDimensions",
      value: function getGlobalContainerDimensions() {
        var windowWidth = liquidWindowWidth();
        var dimensions = {};
        $.each(this.breakpoints, function (containerWidth, windowWidths) {
          if (windowWidth >= windowWidths[0] && windowWidth <= windowWidths[1]) {
            dimensions.width = parseInt(containerWidth, 10);
            dimensions.offsetLeft = (windowWidth - containerWidth) / 2;
          }
        });
        return dimensions;
      }
    }, {
      key: "getElementBoundingRect",
      value: function getElementBoundingRect() {
        var _this = this;

        new IntersectionObserver(function (enteries) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this.elementBoundingRect = entery.boundingClientRect;

              _this.getMegamenuBoundingRect();
            }
          });
        }).observe(this.element);
      }
    }, {
      key: "getMegamenuBoundingRect",
      value: function getMegamenuBoundingRect() {
        var _this2 = this;

        new IntersectionObserver(function (enteries) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this2.megamenuBoundingRect = entery.boundingClientRect;

              _this2.positioning();
            }
          });
        }).observe(this.$megamenuContainer.get(0));
      }
    }, {
      key: "positioning",
      value: function positioning() {
        var elementWidth = this.elementBoundingRect.width;
        var elementOffsetLeft = this.elementBoundingRect.left;
        var megamenuContainerWidth = this.megamenuBoundingRect.width;
        var globalContainerDimensions = this.getGlobalContainerDimensions();
        var globalContainerWidth = globalContainerDimensions.width;
        var globalContainerOffsetLeft = globalContainerDimensions.offsetLeft;
        var menuItemisInGlobalContainerRange = elementOffsetLeft <= globalContainerWidth + globalContainerOffsetLeft ? true : false;
        var megamenuOffsetLeft = 0;
        this.$submenu.css({
          left: '',
          marginLeft: ''
        }); // just make it center if it fits inside global container

        if (megamenuContainerWidth === globalContainerWidth && menuItemisInGlobalContainerRange) {
          this.$submenu.css({
            left: globalContainerOffsetLeft - this.defaultSidePadding
          });
        } // if the menu item is inside the global container range


        if (menuItemisInGlobalContainerRange) {
          this.$submenu.css({
            left: globalContainerOffsetLeft - this.defaultSidePadding + (globalContainerWidth / 2 - megamenuContainerWidth / 2)
          });
          megamenuOffsetLeft = parseInt(this.$submenu.css('left'), 10);
        } // if the megammenu is pushed too much to the right and it's far from it's parent menu item


        if (megamenuOffsetLeft > elementOffsetLeft) {
          this.$submenu.css({
            left: elementOffsetLeft
          }); // if the megamenu needs to push a bit more to the right
        } else if (megamenuOffsetLeft + megamenuContainerWidth < elementOffsetLeft + elementWidth) {
          this.$submenu.css({
            left: elementOffsetLeft + elementWidth - (megamenuOffsetLeft + megamenuContainerWidth) + megamenuOffsetLeft
          });
        }

        this.$element.addClass('position-applied');
      }
    }, {
      key: "resizeWindow",
      value: function resizeWindow() {
        var onResize = liquidDebounce(this.onResizeWindow, 250);
        $(window).on('resize', onResize.bind(this));
      }
    }, {
      key: "onResizeWindow",
      value: function onResizeWindow() {
        this.$element.removeClass('position-applied');
        this.setContainerWidth();
        this.getElementBoundingRect();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.megamenu').filter(function (i, element) {
    return !$(element).closest('.main-nav').hasClass('main-nav-side, main-nav-fullscreen-style-1');
  }).liquidMegamenu();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidSubmenu';
  var defaults = {
    toggleType: "fade",
    // fade, slide
    handler: "mouse-in-out",
    // click, mouse-in-out
    animationSpeed: 200
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.$mainHeader = this.$element.closest('.main-header');
      this.modernMobileNav = $('body').attr('data-mobile-nav-style') == 'modern';
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        var _this = this;

        var submenuParent = this.$element.find('.menu-item-has-children, .page_item_has_children');
        var $submenus = this.$element.find('.nav-item-children, .children');
        var $navbarCollapse = this.$element.closest('.navbar-collapse');

        if ($navbarCollapse.length && !$navbarCollapse.is('.navbar-fullscreen')) {
          this.positioning($submenus);
        }

        submenuParent.each(function (i, subParent) {
          _this.getMegamenuBackgroundLuminance(subParent);

          _this.eventHandlers(subParent);

          _this.offHandlers(submenuParent);

          _this.handleWindowResize(submenuParent);
        });
        return this;
      }
    }, {
      key: "eventHandlers",
      value: function eventHandlers(submenuParent) {
        var _this2 = this;

        var self = this;
        var $toggleLink = $(submenuParent).children('a');
        var _this$options = this.options,
            handler = _this$options.handler,
            toggleType = _this$options.toggleType,
            animationSpeed = _this$options.animationSpeed;
        var $mobileNavExpander = $('.submenu-expander', $toggleLink);
        $toggleLink.off();
        $(submenuParent).off();
        $mobileNavExpander.off();

        if (handler == 'click') {
          $toggleLink.on('click', function (event) {
            self.handleToggle.call(self, event, 'toggle');
          });
          $(document).on('click', self.closeActiveSubmenu.bind(submenuParent, toggleType, animationSpeed));
          $(document).keyup(function (event) {
            if (event.keyCode == 27) {
              self.closeActiveSubmenu(toggleType, animationSpeed);
            }
          });
        } else {
          $(submenuParent).on('mouseenter', function (event) {
            self.handleToggle.call(self, event, 'show');
          });
          $(submenuParent).on('mouseleave', function (event) {
            self.handleToggle.call(self, event, 'hide');
          });
        } // Mobile nav


        $mobileNavExpander.on('click', function (event) {
          event.preventDefault();
          event.stopPropagation();

          _this2.mobileNav.call(_this2, $(event.currentTarget).closest('li'));
        });
        return this;
      }
    }, {
      key: "handleToggle",
      value: function handleToggle(event, state) {
        var self = this;
        var toggleType = self.options.toggleType;
        var $link = $(event.currentTarget);
        var submenu = $link.is('a') ? $link.siblings('.nav-item-children, .children') : $link.children('.nav-item-children, .children');
        var $mainBarWrap = $link.closest('.mainbar-wrap');
        var isMegamenu = $link.is('.megamenu') ? true : false;
        var megamenuBg = isMegamenu && $link.attr('data-bg-color');
        var megamenuScheme = isMegamenu && $link.attr('data-megamenu-bg-scheme');

        if (submenu.length) {
          event.preventDefault();
          submenu.closest('li').toggleClass('active').siblings().removeClass('active');

          if (toggleType == 'fade' && state === 'show') {
            self.fadeIn(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap);
          } else if (toggleType == 'fade' && state === 'hide') {
            self.fadeOut(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap);
          }

          if (toggleType == 'slide' && state === 'show') {
            self.slideDown(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap);
          } else if (toggleType == 'slide' && state === 'hide') {
            self.slideUp(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap);
          }

          if (toggleType == 'fade' && state === 'toggle') {
            self.fadeToggle(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap);
          }

          if (toggleType == 'slide' && state === 'toggle') {
            self.slideToggle(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap);
          }
        }
      }
    }, {
      key: "fadeToggle",
      value: function fadeToggle(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap) {
        submenu.closest('li').siblings().find('.nav-item-children, .children').stop().fadeOut(this.options.animationSpeed);
        submenu.stop().fadeToggle(this.options.animationSpeed);

        if (isMegamenu) {
          $mainBarWrap.children('.megamenu-hover-bg').css('background-color', megamenuBg);
          this.$mainHeader.removeClass('megamenu-scheme-dark megamenu-scheme-light');
          this.$mainHeader.toggleClass("megamenu-item-active megamenu-scheme-".concat(megamenuScheme));
        }
      }
    }, {
      key: "fadeIn",
      value: function fadeIn(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap) {
        submenu.closest('li').siblings().find('.nav-item-children, .children').stop().fadeOut(this.options.animationSpeed);
        submenu.stop().fadeIn(this.options.animationSpeed);

        if (isMegamenu) {
          $mainBarWrap.children('.megamenu-hover-bg').css('background-color', megamenuBg);
          ;
          this.$mainHeader.removeClass('megamenu-scheme-dark megamenu-scheme-light');
          this.$mainHeader.addClass("megamenu-item-active megamenu-scheme-".concat(megamenuScheme));
        }

        if (submenu.find('[data-lqd-flickity]').length) {
          submenu.find('[data-lqd-flickity]').flickity('resize');
        }
      }
    }, {
      key: "fadeOut",
      value: function fadeOut(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap) {
        submenu.stop().fadeOut(this.options.animationSpeed);

        if (isMegamenu) {
          this.$mainHeader.removeClass('megamenu-scheme-dark megamenu-scheme-light');
          this.$mainHeader.removeClass('megamenu-item-active');
        }
      }
    }, {
      key: "slideToggle",
      value: function slideToggle(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap) {
        submenu.closest('li').siblings().find('.nav-item-children, .children').stop().slideUp(this.options.animationSpeed);
        submenu.stop().slideToggle(this.options.animationSpeed);

        if (isMegamenu) {
          $mainBarWrap.children('.megamenu-hover-bg').css('background-color', megamenuBg);
          this.$mainHeader.removeClass('megamenu-scheme-dark megamenu-scheme-light');
          this.$mainHeader.toggleClass("megamenu-item-active megamenu-scheme-".concat(megamenuScheme));
        }
      }
    }, {
      key: "slideDown",
      value: function slideDown(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap) {
        submenu.closest('li').siblings().find('.nav-item-children, .children').stop().slideUp(this.options.animationSpeed);
        submenu.stop().slideDown(this.options.animationSpeed);

        if (isMegamenu) {
          $mainBarWrap.children('.megamenu-hover-bg').css('background-color', megamenuBg);
          this.$mainHeader.removeClass('megamenu-scheme-dark megamenu-scheme-light');
          this.$mainHeader.addClass("megamenu-item-active megamenu-scheme-".concat(megamenuScheme));
        }
      }
    }, {
      key: "slideUp",
      value: function slideUp(event, submenu, isMegamenu, megamenuScheme, megamenuBg, $mainBarWrap) {
        submenu.stop().slideUp(this.options.animationSpeed);

        if (isMegamenu) {
          this.$mainHeader.removeClass('megamenu-scheme-dark megamenu-scheme-light');
          this.$mainHeader.removeClass('megamenu-item-active');
        }
      }
    }, {
      key: "getMegamenuBackgroundLuminance",
      value: function getMegamenuBackgroundLuminance(subParent) {
        var $subParent = $(subParent);

        if ($subParent.is('.megamenu')) {
          var $megamenuRow = $subParent.find('.megamenu-inner-row').first();
          var backgroundColor = tinycolor($megamenuRow.css('background-color'));
          $subParent.closest('.megamenu').attr('data-bg-color', backgroundColor);

          if (backgroundColor.isLight()) {
            $subParent.attr('data-megamenu-bg-scheme', 'light');
          } else if (backgroundColor.isDark()) {
            $subParent.attr('data-megamenu-bg-scheme', 'dark');
          }
        }
      }
    }, {
      key: "closeActiveSubmenu",
      value: function closeActiveSubmenu(toggleType, animationSpeed) {
        // if Esc key pressed
        if (event.keyCode) {
          var mainNav = $(this.element);

          if (toggleType == 'fade') {
            mainNav.find('.active').removeClass('active').find('.nav-item-children, .children').stop().fadeOut(animationSpeed);
          } else {
            mainNav.find('.active').removeClass('active').find('.nav-item-children, .children').stop().slideUp(animationSpeed);
          }
        } else {
          // else if it was clicked in the document
          var $submenuParent = $(this);

          if (!$submenuParent.is(event.target) && !$submenuParent.has(event.target).length && $submenuParent.hasClass('active')) {
            $submenuParent.removeClass('active');

            if (toggleType == 'fade') {
              $submenuParent.find('.nav-item-children, .children').stop().fadeOut(animationSpeed);
            } else {
              $submenuParent.find('.nav-item-children, .children').stop().slideUp(animationSpeed);
            }
          }
        }
      }
    }, {
      key: "mobileNav",
      value: function mobileNav($submenuParent) {
        var _this3 = this;

        var $submenu = $submenuParent.children('.nav-item-children, .children');
        var $navbarCollapse = $submenuParent.closest('.navbar-collapse');
        var $navbarInner = $navbarCollapse.find('.navbar-collapse-inner');
        var submenuParentWasActive = $submenuParent.hasClass('active');
        $submenuParent.toggleClass('active');
        $submenuParent.siblings().removeClass('active').find('.nav-item-children, .children').slideUp(200);
        $submenu.slideToggle(300, function () {
          if (_this3.modernMobileNav && !submenuParentWasActive) {
            $navbarInner.animate({
              scrollTop: $navbarInner.scrollTop() + ($submenuParent.offset().top - $navbarInner.offset().top)
            });
          } else if (!submenuParentWasActive) {
            $navbarCollapse.animate({
              scrollTop: $navbarCollapse.scrollTop() + ($submenuParent.offset().top - $navbarCollapse.offset().top)
            });
          }
        });
      }
    }, {
      key: "offHandlers",
      value: function offHandlers(submenuParent) {
        if (liquidWindowWidth() <= liquidMobileNavBreakpoint()) {
          $(submenuParent).off();
          $(submenuParent).children('a').off();
        } else {
          this.eventHandlers(submenuParent);
        }
      }
    }, {
      key: "positioning",
      value: function positioning($submenus) {
        var _this4 = this;

        $.each($submenus.get().reverse(), function (i, submenu) {
          var $submenu = $(submenu);
          var $submenuParent = $submenu.parent('li');
          if ($submenuParent.is('.megamenu')) return;
          $submenu.removeClass('to-left');
          $submenuParent.removeClass('position-applied');

          _this4.initIO(submenu, $submenuParent);
        });
      }
    }, {
      key: "initIO",
      value: function initIO(submenu, $submenuParent) {
        var callback = function callback(enteries, observer) {
          enteries.forEach(function (entery) {
            var $submenu = $(submenu);
            var boundingClientRect = entery.boundingClientRect;
            var submenuOffsetLeft = boundingClientRect.left;
            var submenuWidth = boundingClientRect.width;
            var windowWidth = entery.rootBounds.width;

            if (submenuOffsetLeft + submenuWidth >= windowWidth) {
              $submenu.addClass('to-left');
            }

            $submenuParent.addClass('position-applied');
            observer.unobserve(entery.target);
          });
        };

        var observer = new IntersectionObserver(callback);
        observer.observe(submenu);
      }
    }, {
      key: "handleWindowResize",
      value: function handleWindowResize(submenuParent) {
        $(window).on('resize', this.onWindowResize.bind(this, submenuParent));
      }
    }, {
      key: "onWindowResize",
      value: function onWindowResize(submenuParent) {
        this.offHandlers(submenuParent);
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('submenu-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.main-nav').liquidSubmenu();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidStickyHeader';
  var defaults = {
    stickyElement: '.mainbar-wrap',
    stickyTrigger: 'this' // 'this', 'first-section'

  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.$stickyElement = $(this.options.stickyElement, this.element).last();
      this.$firstRow = $('#content > .vc_row:first-of-type');
      this.sentinel = this.addSentinel();
      this.placeholder = this.addPlaceholder();
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.observeSentinel();
        this.observeStickyElement();
        this.handleWindowResize();
        this.eventListeners();
      }
    }, {
      key: "eventListeners",
      value: function eventListeners() {
        document.addEventListener('lqd-header-sticky-change', function (e) {
          var $stickyElement = $(e.detail.target);
          var sticking = e.detail.stuck;
          $stickyElement.toggleClass('is-stuck', sticking);
          $stickyElement.prev('.lqd-sticky-placeholder').toggleClass('hide', !sticking);
        });
      }
    }, {
      key: "addPlaceholder",
      value: function addPlaceholder() {
        var $placeholder = $('<div class="lqd-sticky-placeholder hide" />');
        return $placeholder.insertBefore(this.$stickyElement).get(0);
      }
    }, {
      key: "addSentinel",
      value: function addSentinel() {
        var stickyTrigger = this.options.stickyTrigger;
        var $sentinel = $('<div class="lqd-sticky-sentinel invisible pos-abs" />');
        var trigger = 'body';

        if (stickyTrigger === 'first-section' && !this.$firstRow.is(':only-child')) {
          var $titlebar = $('.titlebar');

          if ($titlebar.length) {
            trigger = $titlebar;
          } else if (this.$firstRow.length) {
            trigger = this.$firstRow;
          } else {
            trigger = trigger;
          }

          $sentinel.css({
            'top': 'auto',
            'bottom': this.$stickyElement.outerHeight()
          });
        }

        return $sentinel.appendTo(trigger).get(0);
      }
    }, {
      key: "observeSentinel",
      value: function observeSentinel() {
        var _this = this;

        var observer = new IntersectionObserver(function (enteries) {
          enteries.forEach(function (entery) {
            var targetInfo = entery.boundingClientRect;
            var rootBoundsInfo = entery.rootBounds;

            var stickyTarget = _this.$stickyElement.get(0);

            if (rootBoundsInfo && targetInfo.bottom < rootBoundsInfo.top) {
              _this.fireEvent(true, stickyTarget);
            }

            if (rootBoundsInfo && targetInfo.bottom >= rootBoundsInfo.top && targetInfo.bottom < rootBoundsInfo.bottom) {
              _this.fireEvent(false, stickyTarget);
            }
          });
        });
        observer.observe(this.sentinel);
      }
    }, {
      key: "observeStickyElement",
      value: function observeStickyElement() {
        var _this2 = this;

        if (!this.$stickyElement.length) return false;
        var observer = new IntersectionObserver(function (enteries, observer) {
          enteries.forEach(function (entery) {
            var stickyTrigger = _this2.options.stickyTrigger;
            var $sentinel = $(_this2.sentinel);
            var $placeholder = $(_this2.placeholder);
            var targetInfo = entery.boundingClientRect;
            if ($(entery.target).hasClass('is-stuck')) return false;

            if (stickyTrigger === 'this' || stickyTrigger === 'first-section' && _this2.$firstRow.is(':only-child')) {
              $sentinel.css({
                width: targetInfo.width,
                height: targetInfo.height,
                top: targetInfo.top + window.scrollY,
                left: targetInfo.left + window.scrollX
              });
            }

            $placeholder.css({
              height: targetInfo.height
            });
            observer.unobserve(entery.target);
          });
        });
        observer.observe(this.$stickyElement.get(0));
      }
    }, {
      key: "fireEvent",
      value: function fireEvent(stuck, target) {
        var e = new CustomEvent('lqd-header-sticky-change', {
          detail: {
            stuck: stuck,
            target: target
          }
        });
        document.dispatchEvent(e);
      }
    }, {
      key: "handleWindowResize",
      value: function handleWindowResize() {
        var onResize = liquidDebounce(this.onWindowResize, 250);
        $(window).on('resize', onResize.bind(this));
      }
    }, {
      key: "onWindowResize",
      value: function onWindowResize() {
        this.observeStickyElement();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('sticky-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-sticky-header]').liquidStickyHeader();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidMobileNav';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.$mainNavElements = $('.main-nav', this.element);
      this.$navbarHeader = $('.navbar-header', this.$element.find('.mainbar')).first();
      this.$firstMainNav = this.$mainNavElements.length && this.$mainNavElements.first();
      this.$navItems = [];
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.mergeMenuItems();
        this.mobileModules();
      }
    }, {
      key: "mergeMenuItems",
      value: function mergeMenuItems() {
        var _this = this;

        if (this.$mainNavElements.length && this.$mainNavElements.length >= 2) {
          this.$mainNavElements.not(this.$firstMainNav).map(function (i, navElement) {
            var $navElement = $(navElement);
            $navElement.children().clone(true).addClass('nav-item-cloned').appendTo(_this.$firstMainNav);
          });
        }
      }
    }, {
      key: "mobileModules",
      value: function mobileModules() {
        var $mobileModules = $('.lqd-show-on-mobile', this.element);

        if ($mobileModules.length) {
          var $mobileModulesContainer = $('<div class="lqd-mobile-modules-container" />');
          $mobileModules.each(function (i, module) {
            var $module = $(module);
            if (!$module.children().length) return false;
            var $clonedModule = $module.clone(true);
            var triggerElement = $('[data-target]', module);
            var target = triggerElement.attr('data-target');
            var $targetEelement = $(target, module);
            triggerElement.length && $targetEelement.attr({
              'id': "".concat(target.replace('#', ''), "-cloned")
            });
            triggerElement.length && triggerElement.attr({
              'data-target': "".concat(target, "-cloned"),
              'aria-controls': "".concat(target.replace('#', ''), "-cloned")
            });
            $clonedModule.appendTo($mobileModulesContainer);
          });

          if (!$('.lqd-mobile-modules-container', this.$navbarHeader).length) {
            $mobileModulesContainer.prependTo(this.$navbarHeader);
          }
        }
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('mobilenav-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.main-header').liquidMobileNav();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidToggle';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.element = element;
      this.$element = $(element);
      this.$body = $('body');
      this.elements = this.options;
      this.targetElement = document.querySelector(this.$element.data('target'));
      this.$targetElement = $(this.targetElement);
      this.$mainHeader = $('.main-header');
      this.$parentElement = this.$element.parent();
      this.isSearchModule = this.$parentElement.is('.ld-module-search');
      this.isCartModule = this.$parentElement.is('.ld-module-cart');
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.$targetElement.not('.navbar-collapse').css({
          'visibility': 'hidden',
          display: 'block'
        });
        this.initIO();
        this.addBodyClassnames();
        this.eventHandlers();
        this.cloneTriggerInTarget();
        this.cloneTargetInBody();
        return this;
      }
    }, {
      key: "initIO",
      value: function initIO() {
        var _this = this;

        var inViewCallback = function inViewCallback(enteries, observer) {
          enteries.forEach(function (entery) {
            var boundingRect = entery.boundingClientRect;

            if (boundingRect.width + boundingRect.left >= liquidWindowWidth()) {
              _this.$targetElement.not('.navbar-collapse').removeClass('left').addClass('right');
            }

            if (boundingRect.left < 0) {
              _this.$targetElement.not('.navbar-collapse').removeClass('right').addClass('left');
            }

            _this.$targetElement.not('.navbar-collapse').css({
              'visibility': '',
              display: ''
            });

            observer.unobserve(entery.target);
          });
        };

        var observer = new IntersectionObserver(inViewCallback);
        this.$targetElement.length && observer.observe(this.targetElement);
      }
    }, {
      key: "addBodyClassnames",
      value: function addBodyClassnames() {
        if (this.$parentElement.get(0).hasAttribute('data-module-style')) {
          this.$body.addClass(this.$parentElement.attr('data-module-style'));
        }
      }
    }, {
      key: "eventHandlers",
      value: function eventHandlers() {
        var self = this;
        this.$targetElement.on('show.bs.collapse', this.onShow.bind(this));
        this.$targetElement.on('shown.bs.collapse', this.onShown.bind(this));
        this.$targetElement.on('hide.bs.collapse', this.onHide.bind(this));
        this.$targetElement.on('hidden.bs.collapse', this.onHidden.bind(this));
        $(document).on('click', function (event) {
          self.closeAll.call(self, event);
        });
        $(document).keyup(function (event) {
          if (event.keyCode == 27) {
            self.closeAll.call(self, event);
          }
        });
        return this;
      }
    }, {
      key: "onShow",
      value: function onShow(e) {
        $('html').addClass('module-expanding');

        if (this.isSearchModule) {
          $('html').addClass('lqd-module-search-expanded');
        } else if (this.isCartModule) {
          $('html').addClass('lqd-module-cart-expanded');
        }

        if (this.$element.attr('data-target').replace('#', '') === $(e.target).attr('id')) {
          this.toggleClassnames(e);
          this.focusOnSearch();
        }

        return this;
      }
    }, {
      key: "onShown",
      value: function onShown() {
        $('html').removeClass('module-expanding');

        if (window.liquidLazyload) {
          window.liquidLazyload.update();
        }

        return this;
      }
    }, {
      key: "onHide",
      value: function onHide(e) {
        $('html').addClass('module-collapsing');

        if (this.$element.attr('data-target').replace('#', '') === $(e.target).attr('id')) {
          this.toggleClassnames(e);
        }

        return this;
      }
    }, {
      key: "onHidden",
      value: function onHidden() {
        $('html').removeClass('module-collapsing lqd-module-search-expanded lqd-module-cart-expanded');
      }
    }, {
      key: "toggleClassnames",
      value: function toggleClassnames(e) {
        // { "element": "classname, classname" }
        $.each(this.elements, function (element, classname) {
          $(element).toggleClass(classname);
        });
        return this;
      }
    }, {
      key: "focusOnSearch",
      value: function focusOnSearch() {
        var self = this;

        if (self.$targetElement.find('input[type=search]').length) {
          setTimeout(function () {
            self.$targetElement.find('input[type=search]').focus().select();
          }, 150);
        }
      }
    }, {
      key: "closeAll",
      value: function closeAll(event) {
        var element = $(this.element);
        var $target = $(element.attr('data-target')); // if Esc key pressed

        if (event.keyCode) {
          $target.collapse('hide');
        } else {
          // else if it was clicked in the document
          if (!$target.is(event.target) && !$target.has(event.target).length && (!$(event.target).is('.add_to_cart_button') && !$target.is('#lqd-cart') || !$target.is('#lqd-cart-cloned'))) {
            $target.collapse('hide');
          }
        }
      }
    }, {
      key: "cloneTriggerInTarget",
      value: function cloneTriggerInTarget() {
        // only for mobile nav.
        // and when mobile nav style is set to modern
        if ($(this.element).is('.nav-trigger:not(.main-nav-trigger)') && this.$body.attr('data-mobile-nav-style') == 'modern') {
          var $clonedTrigger = $(this.element).clone(true).prependTo(this.$targetElement);
          $clonedTrigger.siblings('.nav-trigger').remove();
        }
      }
    }, {
      key: "cloneTargetInBody",
      value: function cloneTargetInBody() {
        // only for mobile nav.
        // and when mobile nav style is set to modern
        if ($(this.element).is('.nav-trigger:not(.main-nav-trigger)') && this.$body.attr('data-mobile-nav-style') == 'modern' && !$('.navbar-collapse-clone').length) {
          var targetClone = $(this.$targetElement).clone(true).addClass('navbar-collapse-clone').attr('id', 'main-header-collapse-clone').insertAfter('#wrap');
          targetClone.children('.main-nav, .header-module').wrapAll('<div class="navbar-collapse-inner"></div>');
          $(this.element).attr('data-target', '#main-header-collapse-clone').addClass('mobile-nav-trigger-cloned');
          targetClone.find('.nav-trigger').attr('data-target', '#main-header-collapse-clone');
        }
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('changeclassnames') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.mainbar-wrap .nav-trigger').liquidToggle();
  $('[data-ld-toggle]').liquidToggle();
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidResponsiveBG';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.targetImage = null;
      this.targetImage = this.element.querySelector('img');
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        if (_typeof(undefined) === _typeof(this.targetImage) || null === this.targetImage) {
          console.error('There should be an image to get the source from it.');
          return false;
        }

        var imgLoad = imagesLoaded(this.targetImage);
        this.setBgImage();
        imgLoad.on('done', this.onLoad.bind(this));
      }
    }, {
      key: "getCurrentSrc",
      value: function getCurrentSrc() {
        var imageSrc = this.targetImage.currentSrc ? this.targetImage.currentSrc : this.targetImage.src;

        if (/data:image\/svg\+xml/.test(imageSrc)) {
          imageSrc = this.targetImage.dataset.src;
        }

        return imageSrc;
      }
    }, {
      key: "setBgImage",
      value: function setBgImage() {
        this.$element.css({
          backgroundImage: "url( ".concat(this.getCurrentSrc(), " )")
        });
      }
    }, {
      key: "reInitparallaxBG",
      value: function reInitparallaxBG() {
        var parallaxFigure = this.$element.children('.liquid-parallax-container').find('.liquid-parallax-figure');

        if (parallaxFigure.length) {
          parallaxFigure.css({
            backgroundImage: "url( ".concat(this.getCurrentSrc(), " )")
          });
        }
      }
    }, {
      key: "onLoad",
      value: function onLoad() {
        this.reInitparallaxBG();
        this.$element.is('[data-liquid-blur]') && this.$element.liquidBlurImage();
        this.$element.addClass('loaded');
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('responsive-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if (!$('body').hasClass('lazyload-enabled')) {
    $('[data-responsive-bg=true]').filter(function (i, element) {
      var $element = $(element);
      var $revealElement = $element.parent('[data-reveal]');
      return !$revealElement.length;
    }).liquidResponsiveBG();
  }
});
"use strict";

jQuery(document).ready(function ($) {
  if ($('body').hasClass('lazyload-enabled')) {
    window.liquidLazyload = new LazyLoad({
      elements_selector: '.ld-lazyload',
      threshold: 700,
      callback_loaded: function callback_loaded(el) {
        var $element = $(el);
        var $masonryParent = $element.closest('[data-liquid-masonry=true]');
        var $flickityParent = $element.closest('[data-lqd-flickity]');
        var $flexParent = $element.closest('.flex-viewport');
        $element.parent().not('#wrap, #content').addClass('loaded');
        $element.closest('[data-responsive-bg=true]').liquidResponsiveBG();

        if ($masonryParent.length && $masonryParent.data('isotope')) {
          $masonryParent.isotope('layout');
        }

        if ($flickityParent.length && $flickityParent.data('flickity')) {
          $flickityParent.on('settle.flickity', function () {
            $flickityParent.flickity('resize');
          });
        }

        if ($flexParent.length && $flexParent.parent().data('flexslider')) {
          $flexParent.height($element.height());
        }
      }
    });
  }
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidMoveElement';
  var defaults = {
    target: '#selector',
    targetRelation: 'closest',
    type: 'prependTo',
    includeParent: false,
    clone: false
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.getHiddenClasses();
        this.moveElement();
      }
    }, {
      key: "getHiddenClasses",
      value: function getHiddenClasses() {
        var $parentColumn = this.$element.closest('.wpb_column');

        if ($parentColumn.length) {
          var parentColumnClass = $parentColumn.attr('class');
          var classList = parentColumnClass.split(' ').filter(function (cls) {
            return cls.search('vc_hidden') >= 0;
          });
          classList.length && this.$element.addClass(classList.join(' '));
        }
      }
    }, {
      key: "moveElement",
      value: function moveElement() {
        var _this$options = this.options,
            target = _this$options.target,
            type = _this$options.type,
            targetRelation = _this$options.targetRelation;
        this.$element[type](this.$element[targetRelation](target));
        this.$element.addClass('element-was-moved');
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('move-element') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-move-element]').liquidMoveElement();
});
"use strict";

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidInView';
  var defaults = {
    delayTime: 0,
    onImagesLoaded: false
  };

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.onInview();
    },
    onInview: function onInview() {
      var _this = this;

      var threshold = this._getThreshold();

      var delayTime = this.options.delayTime;

      var inViewCallback = function inViewCallback(enteries, observer) {
        enteries.forEach(function (entery) {
          if (entery.isIntersecting) {
            if (!_this.options.onImagesLoaded) {
              delayTime <= 0 ? _this._doInViewStuff() : setTimeout(_this._doInViewStuff(), delayTime);
            } else {
              _this.$element.imagesLoaded(delayTime <= 0 ? _this._doInViewStuff.bind(_this) : setTimeout(_this._doInViewStuff.bind(_this), delayTime));
            }

            observer.unobserve(entery.target);
          }
        });
      };

      var observer = new IntersectionObserver(inViewCallback, {
        threshold: threshold
      });
      observer.observe(this.element);
    },
    _getThreshold: function _getThreshold() {
      var windowHeight = liquidWindowWidth();
      var elementOuterHeight = this.$element.outerHeight();
      return Math.min(Math.max(windowHeight / elementOuterHeight / 5, 0), 1);
    },
    _doInViewStuff: function _doInViewStuff() {
      $(this.element).addClass('is-in-view');
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('inview-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-inview]').liquidInView();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidButton';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.gradientBorderRoundness();
      }
    }, {
      key: "gradientBorderRoundness",
      value: function gradientBorderRoundness() {
        var self = this;
        var element = $(self.element);

        if (element.find('.btn-gradient-border').length && element.hasClass('circle') && element.is(':visible')) {
          var svgBorder = element.find('.btn-gradient-border').children('rect');
          var buttonHeight = element.height();
          svgBorder.attr({
            rx: buttonHeight / 2,
            ry: buttonHeight / 2
          });
        }
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.btn').not('.button') // prevent applying to woocommerce buttons. it's messing up ajax calls
  .liquidButton();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidSplitText';
  var defaults = {
    type: "words",
    // "words", "chars", "lines". or mixed e.g. "words, chars"
    forceApply: false
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.splittedTextArray = [];
      this.splitTextInstance = null;
      this.isRTL = $('html').attr('dir') == 'rtl';
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this._initIO();
      }
    }, {
      key: "_initIO",
      value: function _initIO() {
        var _this = this;

        if (this.options.forceApply) {
          this._initSplit();

          this._windowResize();

          return false;
        }

        new IntersectionObserver(function (enteries, observer) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this._initSplit();

              _this._windowResize();

              observer.unobserve(entery.target);
            }
          });
        }, {
          rootMargin: '10%'
        }).observe(this.element);
      }
    }, {
      key: "_initSplit",
      value: function _initSplit() {
        if (this.options.forceApply) {
          this.splitTextInstance = this._doSplit();

          this._onSplittingDone();

          return false;
        } else {
          this._onFontsLoad();
        }
      }
    }, {
      key: "_onFontsLoad",
      value: function _onFontsLoad() {
        var _this2 = this;

        var elementFontFamily = this.$element.css('font-family').replace(/\"/g, '').replace(/\'/g, '').split(',')[0];
        var elementFontWeight = this.$element.css('font-weight');
        var elementFontStyle = this.$element.css('font-style');
        var font = new FontFaceObserver(elementFontFamily, {
          weight: elementFontWeight,
          style: elementFontStyle
        });
        font.load().then(function () {
          _this2.splitTextInstance = _this2._doSplit();

          _this2._onSplittingDone();
        }, function () {
          _this2.splitTextInstance = _this2._doSplit();

          _this2._onSplittingDone();
        });
      }
    }, {
      key: "getSplitTypeArray",
      value: function getSplitTypeArray() {
        var type = this.options.type;
        var splitTypeArray = type.split(',').map(function (item) {
          return item.replace(' ', '');
        });

        if (!this.isRTL) {
          return splitTypeArray;
        } else {
          return splitTypeArray.filter(function (type) {
            return type !== 'chars';
          });
        }
      }
    }, {
      key: "_doSplit",
      value: function _doSplit() {
        var _this3 = this;

        if (this.$element.hasClass('split-text-applied') || this.$element.closest('.tabs-pane').length && this.$element.closest('.tabs-pane').is(':hidden')) {
          return false;
        }

        var splitType = this.getSplitTypeArray();
        var splittedText = new SplitText(this.element, {
          type: splitType,
          charsClass: 'lqd-chars',
          linesClass: 'lqd-lines',
          wordsClass: 'lqd-words'
        });
        $.each(splitType, function (i, type) {
          $.each(splittedText[type], function (i, element) {
            _this3.splittedTextArray.push(element);
          });
        });

        this._unitsOp(this.splittedTextArray);

        this.$element.addClass('split-text-applied');
        return splittedText;
      }
    }, {
      key: "_unitsOp",
      value: function _unitsOp(splittedElements) {
        $.each(splittedElements, function (i, element) {
          var $element = $(element).addClass('split-unit');
          var innerText = $element.text();
          $element.wrapInner("<span data-text=\"".concat(innerText, "\" class=\"split-inner\"><span class=\"split-txt\"></span></span>"));
        });
      }
    }, {
      key: "_onSplittingDone",
      value: function _onSplittingDone() {
        var parentColumn = this.$element.closest('.wpb_wrapper, .lqd-column');
        /*
        	if it's only a split text, then call textRotator
        	Otherwise if it has custom animations, then wait for animations to be done
        	and then textRotator will be called from customAnimations
        */

        if (this.$element.is('[data-text-rotator]') && !this.element.hasAttribute('data-custom-animations') && parentColumn.length && !parentColumn.get(0).hasAttribute('data-custom-animations')) {
          this.$element.liquidTextRotator();
        }
      }
    }, {
      key: "_onCollapse",
      value: function _onCollapse() {
        var self = this;
        $('[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var href = e.target.getAttribute('href');
          var targetPane = $(e.target).closest('.tabs').find(href);
          var element = targetPane.find(self.element);
          if (!element.length) return;
          self.splitText.revert();

          self._doSplit();
        });
      }
    }, {
      key: "_windowResize",
      value: function _windowResize() {
        var onResize = liquidDebounce(this._onWindowResize, 500);
        $(window).on('resize', onResize.bind(this));
      }
    }, {
      key: "_onWindowResize",
      value: function _onWindowResize() {
        $('html').addClass('window-resizing');

        if (this.splitTextInstance) {
          this.splitTextInstance.revert();
          this.$element.removeClass('split-text-applied');
        }

        if (this.$element.data('plugin_liquidTextRotator')) {
          this.$element.find('.txt-rotate-keywords').addClass('ws-nowrap').css('width', '');
          this.$element.data('plugin_liquidTextRotator', '');
          anime.remove(this.$element.get(0));
          anime.remove(this.$element.find('.keyword').get());
          this.$element.find('.keyword').removeClass('active is-next will-change').css({
            opacity: '',
            transform: ''
          });
          this.$element.find('.keyword:first-child').addClass('active');
        }

        this._onAfterWindowResize();
      }
    }, {
      key: "_onAfterWindowResize",
      value: function _onAfterWindowResize() {
        $('html').removeClass('window-resizing');
        this.splitTextInstance = this._doSplit();

        this._onSplittingDone();

        this.$element.find('.split-unit').addClass('lqd-unit-animation-done');
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = this.options = $.extend({}, $(this).data('split-options'), options);

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-split-text]').filter(function (i, element) {
    return !$(element).parents('[data-custom-animations]').length && !element.hasAttribute('data-custom-animations');
  }).liquidSplitText();
});
"use strict";

/*global jQuery */

/*!
* FitText.js 1.2
*
* Copyright 2011, Dave Rupert http://daverupert.com
* Released under the WTFPL license
* http://sam.zoy.org/wtfpl/
*
* Date: Thu May 05 14:23:00 2011 -0600
*/
;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidFitText';
  var defaults = {
    compressor: 1,
    minFontSize: Number.NEGATIVE_INFINITY,
    maxFontSize: Number.POSITIVE_INFINITY
  };

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.setMinFontSize();
      this.setMaxFontSize();
      this.resizer();
      this.onWindowResize();
    },
    setMinFontSize: function setMinFontSize() {
      var minFontSize = this.options.minFontSize;
      var elementFontSize = $(this.element).css('fontSize');

      if (minFontSize == 'currentFontSize') {
        this.options.minFontSize = elementFontSize;
      }
    },
    setMaxFontSize: function setMaxFontSize() {
      var maxFontSize = this.options.maxFontSize;
      var elementFontSize = $(this.element).css('fontSize');

      if (maxFontSize == 'currentFontSize') {
        this.options.maxFontSize = elementFontSize;
      }
    },
    resizer: function resizer() {
      var options = this.options;
      var compressor = options.compressor;
      var maxFontSize = options.maxFontSize;
      var minFontSize = options.minFontSize;
      var $element = $(this.element); // if it's a fancy heading, get .ld-fancy-heading's parent width. because .ld-fancy-heading is set to display: inline-block

      var elementWidth = $element.parent('.ld-fancy-heading').length ? $element.parent().width() : $element.width();
      $element.css('font-size', Math.max(Math.min(elementWidth / (compressor * 10), parseFloat(maxFontSize)), parseFloat(minFontSize)));
    },
    onWindowResize: function onWindowResize() {
      $(window).on('resize.fittext orientationchange.fittext', this.resizer.bind(this));
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('fittext-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-fittext]').liquidFitText();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidStretchElement';
  var defaults = {
    to: 'right'
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.isStretched = false;
      this.boundingClientRect = null;
      this.rootBounds = null;
      this.initIO();
    }

    _createClass(Plugin, [{
      key: "initIO",
      value: function initIO() {
        var _this = this;

        new IntersectionObserver(function (enteries) {
          enteries.forEach(function (entry) {
            if (entry.isIntersecting && !_this.isStretched) {
              _this.boundingClientRect = entry.boundingClientRect;
              _this.rootBounds = entry.rootBounds;

              _this.init();

              _this.isStretched = true;
            }
          });
        }).observe(this.element, {
          rootMargin: '3%'
        });
      }
    }, {
      key: "init",
      value: function init() {
        this.stretch();
        this.$element.addClass('element-is-stretched');
      }
    }, {
      key: "stretch",
      value: function stretch() {
        if (this.options.to === 'right') {
          this.stretchToRight();
        } else {
          this.stretchToLeft();
        }
      }
    }, {
      key: "stretchToRight",
      value: function stretchToRight() {
        var offset = this.rootBounds.width - (this.boundingClientRect.width + this.boundingClientRect.left);
        this.$element.css('marginRight', offset * -1);
      } // TODO: probably not correct. need to be revisited

    }, {
      key: "stretchToLeft",
      value: function stretchToLeft() {
        var offset = this.rootBounds.width - this.boundingClientRect.left;
        this.$element.css('marginLeft', offset * -1);
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('stretch-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-stretch-element=true]').liquidStretchElement();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidCustomAnimations';
  var defaults = {
    delay: 0,
    startDelay: 0,
    offDelay: 0,
    direction: 'forward',
    duration: 300,
    offDuration: 300,
    easing: 'easeOutQuint',
    animationTarget: 'this',
    // it can be also a selector e.g. '.selector'
    initValues: {
      translateX: 0,
      translateY: 0,
      translateZ: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1
    },
    animations: {},
    animateTargetsWhenVisible: false // triggerHandler: "focus", // "inview"
    // triggerTarget: "input",
    // triggerRelation: "siblings",
    // offTriggerHandler: "blur",

  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      if (this.options.triggerHandler == 'mouseenter') this.options.triggerHandler = 'mouseenter touchstart';
      if (this.options.triggerHandler == 'mouseleave') this.options.triggerHandler = 'mouseleave touchend';
      this._defaults = defaults;
      this._name = pluginName;
      this.splitText = null;
      this.isTouchMoving = false;
      this.isRTL = $('html').attr('dir') == 'rtl';

      this._initIO();
    }

    _createClass(Plugin, [{
      key: "_initIO",
      value: function _initIO() {
        var _this = this;

        var callback = function callback(enteries, observer) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this._build();

              observer.unobserve(entery.target);
            }
          });
        };

        var observer = new IntersectionObserver(callback, {
          rootMargin: '10%'
        });
        observer.observe(this.element);
      }
    }, {
      key: "_build",
      value: function _build() {
        var self = this;
        var element = self.element;
        var $element = $(element);
        var $splitTextElements = $element.find('[data-split-text]');

        if ($splitTextElements.length) {
          this.splitText = $splitTextElements.liquidSplitText({
            forceApply: true
          });
          var fonts = {};
          $.each($splitTextElements, function (i, element) {
            var elementFontFamily = $(element).css('font-family').replace(/\"/g, '').replace(/\'/g, '').split(',')[0];
            var elementFontWeight = $(element).css('font-weight');
            var elementFontStyle = $(element).css('font-style');
            fonts[elementFontFamily] = {
              weight: elementFontWeight,
              style: elementFontStyle
            };
          });
          var observers = [];
          Object.keys(fonts).forEach(function (family) {
            var data = fonts[family];
            var obs = new FontFaceObserver(family, data);
            observers.push(obs.load());
          });
          Promise.all(observers).then(function () {
            self._init();
          }).catch(function (err) {
            console.warn('Some critical fonts are not available:', err);

            self._init();
          });
          return;
        } else if ($element.is('[data-split-text]')) {
          this.splitText = $element.liquidSplitText({
            forceApply: true
          });
          var elementFontFamily = $element.css('font-family').replace(/\"/g, '').replace(/\'/g, '').split(',')[0];
          var elementFontWeight = $element.css('font-weight');
          var elementFontStyle = $element.css('font-style');
          var font = new FontFaceObserver(elementFontFamily, {
            weight: elementFontWeight,
            style: elementFontStyle
          });
          font.load().then(function () {
            self._init();
          }, function () {
            self._init();
          });
        } else {
          self._init();
        }
      }
    }, {
      key: "_init",
      value: function _init() {
        this.animationTarget = this._getAnimationTargets();

        this._initValues();

        this._eventHandlers();

        this._handleResize();
      }
    }, {
      key: "_getAnimationTargets",
      value: function _getAnimationTargets() {
        var animationTarget = this.options.animationTarget;

        if (animationTarget == 'this') {
          return this.element;
        } else if (animationTarget == 'all-childs') {
          return this._getChildElments();
        } else {
          return this.element.querySelectorAll(animationTarget);
        }
      }
    }, {
      key: "_getChildElments",
      value: function _getChildElments() {
        var $childs = $(this.element).children();

        if ($childs.is('.wpb_wrapper-inner')) {
          $childs = $childs.children();
        }

        return this._getInnerChildElements($childs);
      }
    }, {
      key: "_getInnerChildElements",
      value: function _getInnerChildElements(elements) {
        var elementsArray = [];
        var $elements = $(elements).map(function (i, element) {
          var $element = $(element);

          if ($element.is('.vc_inner')) {
            return $element.find('.wpb_wrapper-inner').children().get();
          } else if ($element.is('.row')) {
            return $element.find('.lqd-column').children().get();
          } else {
            return $element.not('style').get();
          }
        });
        $.each($elements, function (i, element) {
          var $element = $(element);

          if ($element.is('ul')) {
            $.each($element.children('li'), function (i, li) {
              elementsArray.push(li);
            });
          } else if ($element.find('.split-inner').length || $element.find('[data-split-text]').length) {
            $.each($element.find('.split-inner'), function (i, splitInner) {
              var $innerSplitInner = $(splitInner).find('.split-inner');

              if ($innerSplitInner.length) {
                elementsArray.push($innerSplitInner.get(0));
              } else {
                elementsArray.push(splitInner);
              }
            });
          } else if ($element.is('.accordion')) {
            $.each($element.children(), function (i, accordionItem) {
              elementsArray.push(accordionItem);
            });
          } else if ($element.is('.liquid-ig-feed')) {
            $.each($element.find('li'), function (i, feedItem) {
              elementsArray.push(feedItem);
            });
          } else if ($element.is('.vc_inner')) {
            $.each($element.find('.wpb_wrapper').children('.wpb_wrapper-inner'), function (i, innerColumn) {
              elementsArray.push(innerColumn);
            });
          } else if ($element.is('.row')) {
            $.each($element.find('.lqd-column'), function (i, innerColumn) {
              elementsArray.push(innerColumn);
            });
          } else if ($element.is('.fancy-title')) {
            $.each($element.children(), function (i, fanctTitleElment) {
              elementsArray.push(fanctTitleElment);
            });
          } else if (!$element.is('.vc_empty_space') && !$element.is('style') && !$element.is('.ld-empty-space') && !$element.is('[data-split-text]')) {
            elementsArray.push($element.get(0));
          }
        });
        return elementsArray;
      }
    }, {
      key: "_eventHandlers",
      value: function _eventHandlers() {
        var _this2 = this;

        var element = $(this.element);
        var options = this.options;
        var triggerTarget = !options.triggerRelation ? element : element[options.triggerRelation](options.triggerTarget);

        if (options.triggerHandler == 'inview' && !options.animateTargetsWhenVisible) {
          this._initInviewAnimations(triggerTarget);
        } else if (options.triggerHandler == 'inview' && options.animateTargetsWhenVisible) {
          this._targetsIO();
        }

        $(document).on('touchmove', function (_) {
          return _this2.isTouchMoving = true;
        });
        triggerTarget.on(options.triggerHandler, function (event) {
          _this2._runAnimations.call(_this2, false, event);
        });
        triggerTarget.on(options.offTriggerHandler, function (event) {
          if (event.type === 'touchend') _this2.isTouchMoving = false;

          _this2._offAnimations.call(_this2, event);
        });
      }
    }, {
      key: "_initInviewAnimations",
      value: function _initInviewAnimations($triggerTarget) {
        var _this3 = this;

        var threshold = window.liquidParams && window.liquidParams.tat == '0' ? 0 : this._inviewAnimationsThreshold($triggerTarget);

        var inviewCallback = function inviewCallback(enteries, observer) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this3._runAnimations();

              observer.unobserve(entery.target);
            }
          });
        };

        var observer = new IntersectionObserver(inviewCallback, {
          threshold: threshold
        });
        observer.observe($triggerTarget.get(0));
      }
    }, {
      key: "_inviewAnimationsThreshold",
      value: function _inviewAnimationsThreshold($element) {
        var windowWidth = liquidWindowWidth();
        var windowHeight = liquidWindowHeight();
        var elementOuterWidth = $element.outerWidth();
        var elementOuterHeight = $element.outerHeight();
        var elementOffset = $element.offset();
        var w = windowWidth / elementOuterWidth;
        var h = windowHeight / elementOuterHeight;

        if (elementOuterWidth + elementOffset.left >= windowWidth) {
          w = windowWidth / (elementOuterWidth - (elementOuterWidth + elementOffset.left - windowWidth));
        }

        if (liquidIsMobile()) {
          return 0.1;
        } else {
          return Math.min(Math.max(h / w / 2, 0), 0.8);
        }
      }
    }, {
      key: "_needPerspective",
      value: function _needPerspective() {
        var initValues = this.options.initValues;
        var valuesNeedPerspective = ["translateZ", "rotateX", "rotateY", "scaleZ"];
        var needPerspective = false;

        for (var prop in initValues) {
          for (var i = 0; i <= valuesNeedPerspective.length - 1; i++) {
            var val = valuesNeedPerspective[i];

            if (prop == val) {
              needPerspective = true;
              break;
            }
          }
        }

        return needPerspective;
      }
    }, {
      key: "_initValues",
      value: function _initValues() {
        var options = this.options;
        var $animationTarget = $(this.animationTarget);
        $animationTarget.css({
          transition: 'none',
          transitionDelay: 0
        });
        options.triggerHandler == 'inview' && $animationTarget.addClass('will-change');
        var initValues = {
          targets: this.animationTarget,
          duration: 0,
          easing: 'linear'
        };
        var animations = $.extend({}, options.initValues, initValues);
        anime(animations);
        $(this.element).addClass('ca-initvalues-applied');

        if (this._needPerspective() && options.triggerHandler == 'inview') {
          $(this.element).addClass('perspective');
        }
      }
    }, {
      key: "_targetsIO",
      value: function _targetsIO() {
        var _this4 = this;

        var inviewCallback = function inviewCallback(enteries, observer) {
          var inviewTargetsArray = [];
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              inviewTargetsArray.push(entery.target);

              _this4._runAnimations(inviewTargetsArray);

              observer.unobserve(entery.target);
            }
          });
        };

        var observer = new IntersectionObserver(inviewCallback, {
          threshold: 0.35
        });
        $.each(this.animationTarget, function (i, target) {
          observer.observe(target);
        });
      }
    }, {
      key: "_runAnimations",
      value: function _runAnimations(inviewTargetsArray, event) {
        var _this5 = this;

        if (event && event.type === 'touchstart' && this.isTouchMoving) return false;
        var options = this.options;

        var _delay = parseInt(options.delay, 10);

        var startDelay = parseInt(options.startDelay, 10);
        var duration = parseInt(options.duration, 10);
        var easing = options.easing;
        var targets = [];

        if (inviewTargetsArray) {
          targets = inviewTargetsArray;
        } else {
          targets = $.isArray(this.animationTarget) ? this.animationTarget : $.makeArray(this.animationTarget);
        }

        targets = options.direction == 'backward' ? targets.reverse() : targets;
        var defaultAnimations = {
          targets: targets,
          duration: duration,
          easing: easing,
          delay: function delay(el, i) {
            return i * _delay + startDelay;
          },
          complete: function complete(anime) {
            _this5._onAnimationsComplete(anime);
          }
        };
        var animations = $.extend({}, options.animations, defaultAnimations);
        anime.remove(targets);
        anime(animations);
      }
    }, {
      key: "_onAnimationsComplete",
      value: function _onAnimationsComplete(anime) {
        var _this6 = this;

        if (anime) {
          $.each(anime.animatables, function (i, animatable) {
            var $element = $(animatable.target);
            $element.css({
              transition: '',
              transitionDelay: ''
            }).removeClass('will-change');

            if (_this6.options.triggerHandler == 'inview') {
              if ($element.is('.split-inner')) {
                $element.parent().addClass('lqd-unit-animation-done');
              } else {
                $element.addClass('lqd-unit-animation-done');
              }

              if ($element.is('.btn')) {
                $element.css({
                  transform: ''
                });
              }
            }
          });

          if (this.options.triggerHandler == 'inview') {
            this.$element.addClass('lqd-animations-done');
          }
        }
        /* calling textRotator if there's any text-rotator inside the element,
        	or if the element itself is text-rotator
        */


        this.$element.find('[data-text-rotator]').liquidTextRotator();
        this.$element.is('[data-text-rotator]') && this.$element.liquidTextRotator();
      }
    }, {
      key: "_offAnimations",
      value: function _offAnimations() {
        var _this7 = this;

        var options = this.options;
        var _delay2 = options.delay;
        var offDuration = options.offDuration;
        var offDelay = options.offDelay;
        var easing = options.easing;
        var animationTarget = Array.prototype.slice.call(this.animationTarget).reverse();
        if (options.animationTarget == 'this') animationTarget = this.element;
        var offAnimationVal = {
          targets: animationTarget,
          easing: easing,
          duration: offDuration,
          delay: function delay(el, i, l) {
            return i * (_delay2 / 2) + offDelay;
          },
          complete: function complete() {
            _this7._initValues();
          }
        };

        var _offAnimations = $.extend({}, options.initValues, offAnimationVal);

        anime.remove(this.animationTarget);
        anime(_offAnimations);
      }
    }, {
      key: "_handleResize",
      value: function _handleResize() {
        var onResize = liquidDebounce(this._onWindowResize, 500);
        $(window).on('resize', onResize.bind(this));
      }
    }, {
      key: "_onWindowResize",
      value: function _onWindowResize() {
        if (this.options.triggerHandler !== 'inview') {
          this.animationTarget = this._getAnimationTargets();

          this._initValues();

          this._eventHandlers();
        }

        if (this.$element.find('[data-text-rotator]').length && this.$element.find('[data-text-rotator]').data('plugin_liquidTextRotator')) {
          this.$element.find('[data-text-rotator]').data('plugin_liquidTextRotator', '');
          this.$element.find('.txt-rotate-keywords').addClass('ws-nowrap').css('width', '');
          anime.remove(this.$element.get(0));
          anime.remove(this.$element.find('.keyword').get());
          this.$element.find('.keyword').removeClass('active is-next will-change').css({
            opacity: '',
            transform: ''
          });
          this.$element.find('.keyword:first-child').addClass('active');
        }

        if (this.$element.is('[data-text-rotator]') && this.$element.data('plugin_liquidTextRotator')) {
          this.$element.data('plugin_liquidTextRotator', '');
        }

        this._onAnimationsComplete();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('ca-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if ($('body').hasClass('compose-mode')) return false;
  $('[data-custom-animations]').map(function (i, element) {
    var $element = $(element);
    var $customAnimationParent = $element.parents('.wpb_wrapper[data-custom-animations], .lqd-column[data-custom-animations]');

    if ($customAnimationParent.length) {
      $element.removeAttr('data-custom-animations');
      $element.removeAttr('data-ca-options');
    }
  });
  $('[data-custom-animations]').filter(function (i, element) {
    var $element = $(element);
    var $rowBgparent = $element.closest('.vc_row[data-row-bg]');
    var $slideshowBgParent = $element.closest('.vc_row[data-slideshow-bg]');
    var $fullpageSection = $element.closest('.vc_row.pp-section');
    return !$rowBgparent.length && !$slideshowBgParent.length && !$fullpageSection.length;
  }).liquidCustomAnimations();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidSlideshowBG';
  var defaults = {
    effect: 'fade',
    // 'fade', 'slide', 'scale'
    delay: 3000,
    imageArray: []
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        var markup = this._addMarkup();

        this.imageArray = this.options.imageArray;
        this.slideshowWrap = markup.slideshowWrap;
        this.slideshowInner = markup.slideshowInner;

        this._addImages();

        this._initSlideShow();

        this._onImagesLoaded();
      }
    }, {
      key: "_addMarkup",
      value: function _addMarkup() {
        var slideshowWrap = $('<div class="ld-slideshow-bg-wrap" />');
        var slideshowInner = $('<div class="ld-slideshow-bg-inner" />');
        var loader = $('<span class="row-bg-loader" />');
        slideshowWrap.append(slideshowInner);
        slideshowWrap.append(loader);
        $(this.element).prepend(slideshowWrap);
        return {
          slideshowWrap: slideshowWrap,
          slideshowInner: slideshowInner
        };
      }
    }, {
      key: "_addImages",
      value: function _addImages() {
        var _this = this;

        $.each(this.imageArray, function (i, imgPath) {
          var $img = $("<img class=\"invisible\" src=\"".concat(imgPath, "\" alt=\"Slideshow Image\"/>"));
          var $figure = $("<figure class=\"ld-slideshow-figure\" style=\"background-image: url(".concat(imgPath, ")\" />"));
          var $slideshowItem = $('<div class="ld-slideshow-item" />');
          var $slideshowItemInner = $('<div class="ld-slideshow-item-inner" />');
          $figure.append($img);
          $slideshowItemInner.append($figure);
          $slideshowItem.append($slideshowItemInner);

          _this.slideshowInner.append($slideshowItem);
        });
      }
    }, {
      key: "_initSlideShow",
      value: function _initSlideShow() {
        this.slideshowInner.children(':first-child').addClass('active');
        this.slideshowInner.children().not(':first-child').css({
          opacity: 0
        });
      }
    }, {
      key: "_onImagesLoaded",
      value: function _onImagesLoaded() {
        var _this2 = this;

        this.slideshowInner.children().first().imagesLoaded(function () {
          $(_this2.element).addClass('slideshow-applied');

          _this2._initSlideshowAnimations();

          !$('body').hasClass('compose-mode') && _this2._initLiquidCustomAnimations();
        });
      }
    }, {
      key: "_getCurrentSlide",
      value: function _getCurrentSlide() {
        return this.slideshowInner.children('.active');
      }
    }, {
      key: "_getAllSlides",
      value: function _getAllSlides() {
        return this.slideshowInner.children();
      }
    }, {
      key: "_setActiveClassnames",
      value: function _setActiveClassnames(element) {
        $(element).addClass('active').siblings().removeClass('active');
      }
    }, {
      key: "_getNextSlide",
      value: function _getNextSlide() {
        return !this._getCurrentSlide().is(':last-child') ? this._getCurrentSlide().next() : this.slideshowInner.children(':first-child');
      }
      /*
      	getting animation style from this.options
      	and having the same function names. fade(); slide(); scale();
      */

    }, {
      key: "_initSlideshowAnimations",
      value: function _initSlideshowAnimations() {
        this[this.options.effect]();
      }
    }, {
      key: "_setWillChange",
      value: function _setWillChange(changingProperties) {
        var slides = this._getAllSlides();

        slides.css({
          willChange: changingProperties.join(', ')
        });
      } // START FADE ANIMATIONS

    }, {
      key: "fade",
      value: function fade() {
        var _this3 = this;

        // this._setWillChange(['opacity']);
        this._getCurrentSlide().imagesLoaded(function () {
          _this3._fadeOutCurrentSlide();
        });
      }
    }, {
      key: "_fadeOutCurrentSlide",
      value: function _fadeOutCurrentSlide() {
        var _this4 = this;

        var initiated = false;
        anime.remove(this._getCurrentSlide().get(0));
        anime({
          targets: this._getCurrentSlide().get(0),
          opacity: [1, 0],
          duration: 1000,
          delay: this.options.delay,
          easing: 'easeInQuad',
          change: function change() {
            if (!initiated) {
              _this4._getNextSlide().imagesLoaded(function () {
                initiated = true;

                _this4._fadeInNextSlide();
              });
            }
          }
        });
      }
    }, {
      key: "_fadeInNextSlide",
      value: function _fadeInNextSlide() {
        var _this5 = this;

        anime.remove(this._getNextSlide().get(0));
        anime({
          targets: this._getNextSlide().get(0),
          opacity: [0, 1],
          duration: 1000,
          easing: 'easeInOutQuad',
          complete: function complete(e) {
            _this5._setActiveClassnames(e.animatables[0].target);

            _this5._fadeOutCurrentSlide();
          }
        });
      } // END FADE ANIMATIONS
      // START SLIDING EFFECT

    }, {
      key: "slide",
      value: function slide() {
        var _this6 = this;

        imagesLoaded([this._getCurrentSlide(), this._getNextSlide()], function () {
          _this6._slideOutCurrentSlide();
        });
      }
    }, {
      key: "_slideOutCurrentSlide",
      value: function _slideOutCurrentSlide() {
        var _this7 = this;

        var currentSlide = this._getCurrentSlide().get(0);

        var inner = $(currentSlide).children().get(0);
        var figure = $(inner).children().get(0);
        anime.remove([currentSlide, inner, figure]);
        anime.timeline({
          duration: 1200,
          delay: this.options.delay,
          changeBegin: function changeBegin() {
            _this7._slideInNextSlide();
          }
        }).add({
          targets: currentSlide,
          translateX: ['0%', '-100%'],
          easing: 'easeOutQuint'
        }, 250).add({
          targets: inner,
          translateX: ['0%', '100%'],
          easing: 'easeOutQuint'
        }, 250).add({
          targets: figure,
          scale: [1, 1.2],
          duration: 1000,
          easing: 'easeInOutQuart'
        }, 0);
      }
    }, {
      key: "_slideInNextSlide",
      value: function _slideInNextSlide() {
        var _this8 = this;

        var $nextSlide = this._getNextSlide();

        var nextSlide = $nextSlide.get(0);
        var inner = $nextSlide.children().get(0);
        var figure = $(inner).children().get(0);
        anime.remove([nextSlide, inner, figure]);
        anime.timeline({
          duration: 1200,
          complete: function complete() {
            _this8._setActiveClassnames(nextSlide);

            _this8._slideOutCurrentSlide();
          }
        }).add({
          targets: nextSlide,
          translateX: ['100%', '0%'],
          opacity: [1, 1],
          easing: 'easeOutQuint'
        }, 0).add({
          targets: inner,
          translateX: ['-100%', '0%'],
          opacity: [1, 1],
          easing: 'easeOutQuint'
        }, 0).add({
          targets: figure,
          scale: [1.2, 1],
          easing: 'easeInOutQuart'
        }, -250);
      } // END SLIDING ANIMATIONS
      // START SCALE EFFECT

    }, {
      key: "scale",
      value: function scale() {
        var _this9 = this;

        // this._setWillChange(['opacity', 'transform']);
        this._getCurrentSlide().imagesLoaded(function () {
          _this9._scaleUpCurrentSlide();
        });
      }
    }, {
      key: "_scaleUpCurrentSlide",
      value: function _scaleUpCurrentSlide() {
        var self = this;
        var initiated = false;
        anime.remove(self._getCurrentSlide().get(0));
        anime({
          targets: self._getCurrentSlide().get(0),
          scale: [1, 1.2],
          opacity: [1, 1, 0],
          zIndex: [0, 0],
          duration: 900,
          easing: 'easeInOutQuint',
          delay: self.options.delay,
          change: function change() {
            if (!initiated) {
              initiated = true;

              self._getNextSlide().imagesLoaded(function () {
                self._scaleDownNextSlide();
              });
            }
          }
        });
      }
    }, {
      key: "_scaleDownNextSlide",
      value: function _scaleDownNextSlide() {
        var self = this;
        anime.remove(self._getNextSlide().get(0));
        anime({
          targets: self._getNextSlide().get(0),
          scale: [1.2, 1],
          opacity: [0, 1],
          zIndex: [1, 1],
          duration: 900,
          easing: 'easeInOutQuint',
          complete: function complete(e) {
            self._setActiveClassnames(e.animatables[0].target);

            self._scaleUpCurrentSlide();
          }
        });
      } // END SCALE ANIMATIONS

    }, {
      key: "_initLiquidCustomAnimations",
      value: function _initLiquidCustomAnimations() {
        var $customAnimationElements = $(this.element).find('[data-custom-animations]');
        $customAnimationElements.length && $customAnimationElements.liquidCustomAnimations();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('slideshow-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-slideshow-bg]').liquidSlideshowBG();
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidRowBG';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options, callback) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.callback = callback;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this._createElements();

        this._addBg();

        this._addBgElement();

        this._onImagesLoaded();
      }
    }, {
      key: "_createElements",
      value: function _createElements() {
        this.bgWrap = $('<div class="row-bg-wrap bg-not-loaded" />');
        this.bgInner = $('<div class="row-bg-inner" />');
        this.rowBg = $('<div class="row-bg" />');
        this.bgInner.append(this.rowBg);
        this.bgWrap.append(this.bgInner);
      }
    }, {
      key: "_addBg",
      value: function _addBg() {
        var bgUrl = $(this.element).attr('data-row-bg');
        this.rowBg.css({
          backgroundImage: "url(".concat(bgUrl, ")")
        });
      }
    }, {
      key: "_addBgElement",
      value: function _addBgElement() {
        this.bgWrap.insertAfter($(this.element).children('.row-bg-loader'));
      }
    }, {
      key: "_onImagesLoaded",
      value: function _onImagesLoaded() {
        var _this = this;

        this.rowBg.imagesLoaded({
          background: true
        }, function () {
          _this.bgWrap.removeClass('bg-not-loaded').addClass('bg-loaded');

          $(_this.element).addClass('row-bg-appended');

          _this._handleCallback();
        });
      }
    }, {
      key: "_handleCallback",
      value: function _handleCallback() {
        var _this2 = this;

        anime({
          targets: this.bgInner.get(0),
          opacity: [0, 1],
          scale: [1.05, 1],
          delay: 450,
          easing: 'easeOutQuint',
          begin: function begin() {
            _this2._customAnimations.call(_this2);
          }
        });
      }
    }, {
      key: "_customAnimations",
      value: function _customAnimations() {
        var $customAnimationElements = $(this.element).find('[data-custom-animations]');

        if ($customAnimationElements.length && !$('body').hasClass('compose-mode')) {
          $customAnimationElements.liquidCustomAnimations();
        }
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    var args = arguments;

    if (options === undefined || _typeof(options) === 'object') {
      return this.each(function () {
        var pluginOptions = $(this).data('row-bg-options') || options;

        if (!$.data(this, 'plugin_' + pluginName)) {
          $.data(this, 'plugin_' + pluginName, new Plugin(this, pluginOptions));
        }
      });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
      var returns;
      this.each(function () {
        var instance = $.data(this, 'plugin_' + pluginName);

        if (instance instanceof Plugin && typeof instance[options] === 'function') {
          returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
        }

        if (options === 'destroy') {
          $.data(this, 'plugin_' + pluginName, null);
        }
      });
      return returns !== undefined ? returns : this;
    }
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-row-bg]:not([data-slideshow-bg])').liquidRowBG();
});
"use strict";

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidAccordion';
  var defaults = {};

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.setHashOnLoad();
      this.eventHandlers();
    },
    setHashOnLoad: function setHashOnLoad() {
      var element = $(this.element);

      if (location.hash !== '' && element.find(location.hash).length) {
        var activeItemParent = element.find(location.hash).closest('.accordion-item'); // can't use BS .collapse(). it's accordion loosing functionality

        activeItemParent.find(location.hash).addClass('in');
        activeItemParent.find('.accordion-heading').find('a').attr('aria-expanded', 'true').removeClass('collapsed');
        activeItemParent.siblings().find('.in').removeClass('in');
        activeItemParent.siblings().find('.accordion-heading').find('a').attr('aria-expanded', 'false').addClass('collapsed');
      }
    },
    eventHandlers: function eventHandlers() {
      var _this = this;

      var element = $(this.element);
      var collapse = element.find('.accordion-collapse');
      collapse.on('show.bs.collapse', function (event) {
        _this.onShow.call(_this, event);
      });
      collapse.on('shown.bs.collapse', function (event) {
        _this.onShown.call(_this, event);
      });
      collapse.on('hide.bs.collapse', function (event) {
        _this.onHide.call(_this, event);
      });
    },
    onShow: function onShow(event) {
      this.toggleActiveClass(event, 'show');
      this.setHashOnLoad(event);
    },
    onHide: function onHide(event) {
      this.toggleActiveClass(event, 'hide');
    },
    toggleActiveClass: function toggleActiveClass(event, state) {
      var parent = $(event.target).closest('.accordion-item');

      if (state === 'show') {
        parent.addClass('active').siblings().removeClass('active');
      }

      if (state === 'hide') {
        parent.removeClass('active');
      }
    },
    setHashOnShow: function setHashOnShow(event) {
      if (history.pushState) {
        history.pushState(null, null, '#' + $(event.target).attr('id'));
      } else {
        location.hash = '#' + $(event.target).attr('id');
      }
    },
    onShown: function onShown(event) {
      var collapse = $(event.target);
      var parent = collapse.closest('.accordion-item');
      var $window = $(window);
      var parentOffsetTop = parent.offset().top;

      if (parentOffsetTop <= $window.scrollTop() - 15) {
        $('html, body').animate({
          scrollTop: parentOffsetTop - 45
        }, 800);
      }
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options'),
          opts;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.accordion').liquidAccordion();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidTab';
  var defaults = {
    deepLink: false
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        if (this.options.deepLink) {
          this.setHash();
        }

        ;
        this.eventHandlers();
      }
    }, {
      key: "setHash",
      value: function setHash() {
        var _this = this;

        if (location.hash !== '' && this.$element.find(location.hash).length) {
          $("a[href=\"".concat(location.hash, "\"]")).tab('show');
          $("a[href=\"".concat(location.hash, "\"]")).closest('.tabs-nav').on('shown.bs.tab', function () {
            var $stickyHeader = $('[data-sticky-header]');
            var $mainbarWrap = $('.mainbar-wrap', $stickyHeader);

            var parentOffsetTop = _this.$element.offset().top;

            if ($mainbarWrap.length) {
              var mainBarHeight = $mainbarWrap.outerHeight();
              parentOffsetTop = parentOffsetTop + mainBarHeight;
            }

            $('html, body').animate({
              scrollTop: parentOffsetTop - 50
            }, 800);
          });
        }
      }
    }, {
      key: "eventHandlers",
      value: function eventHandlers() {
        var collapse = this.$element.find('.tabs-nav');
        collapse.on('show.bs.tab', this.onShow.bind(this));
        collapse.on('shown.bs.tab', this.onShown.bind(this));
      }
    }, {
      key: "onShow",
      value: function onShow(event) {
        if (this.options.deepLink) {
          if (history.pushState) {
            history.pushState(null, null, $(event.target).attr('href'));
          } else {
            location.hash = $(event.target).attr('herf');
          }
        }
      }
    }, {
      key: "onShown",
      value: function onShown(event) {
        var collapse = $(event.target);
        var $target = $($(collapse.attr('href')), this.element);
        var $window = $(window);

        if (this.$element.offset().top <= $window.scrollTop() - 15) {
          $('html, body').animate({
            scrollTop: this.$element.offset().top - 45
          }, 800);
        }

        this.initPlugins($target);
      }
    }, {
      key: "initPlugins",
      value: function initPlugins($target) {
        var $pie_charts = $('.vc_pie_chart:not(.vc_ready)', $target);
        var $round_charts = $('.vc_round-chart', $target);
        var $line_charts = $('.vc_line-chart', $target);
        if ($pie_charts.length && $.fn.vcChat) $pie_charts.vcChat();
        if ($round_charts.length && $.fn.vcRoundChart) $round_charts.vcRoundChart({
          reload: !1
        });
        if ($line_charts.length && $.fn.vcLineChart) $line_charts.vcLineChart({
          reload: !1
        });
        $('[data-lqd-flickity]', $target).liquidCarousel();
        $('[data-hover3d=true]', $target).liquidHover3d();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options'),
          opts;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.tabs').liquidTab();
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidAnimatedIcon';
  var defaults = {
    color: '#f42958',
    hoverColor: null,
    type: 'delayed',
    delay: 0,
    animated: true,
    duration: 100,
    resetOnHover: false,
    customColorApplied: false
  };

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);

    if (_typeof(options) !== _typeof(undefined) && options !== null && _typeof(options.color) !== _typeof(undefined) && options.color !== null) {
      options.customColorApplied = true;
    }

    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.$iconContainer = this.$element.find('.iconbox-icon-container');
      this.$obj = this.$iconContainer.children('svg'); // used .children() because there's also .iconbox-icon-wave-bg svg element

      if (!this.$obj.length) return false;

      if (this.$element.get(0).hasAttribute('data-animate-icon')) {
        this.animateIcon();
      } else {
        this.addColors(this.$element);
      }

      return this;
    },
    animateIcon: function animateIcon() {
      var self = this;
      var options = this.options;
      var vivusObj = new Vivus(this.$obj.get(0), {
        type: options.type,
        duration: options.duration,
        start: 'manual',
        onReady: function onReady(vivus) {
          self.addColors.call(self, vivus);
        }
      }).setFrameProgress(1);
      this.animate(vivusObj);
    },
    addColors: function addColors(svg) {
      var obj = _typeof(svg.el) !== _typeof(undefined) ? $(svg.el) : svg.find('.iconbox-icon-container svg');
      var options = this.options;
      var gid = Math.round(Math.random() * 1000000);
      var hoverGradientValues = options.hoverColor;
      var strokeHoverGradients = document.createElementNS('http://www.w3.org/2000/svg', 'style');
      var gradientValues = _typeof(options.color) !== _typeof(undefined) && options.color !== null ? options.color.split(':') : '#000';
      var strokegradients = null;

      if (undefined === gradientValues[1]) {
        gradientValues[1] = gradientValues[0];
      }

      strokegradients = '<defs xmlns="http://www.w3.org/2000/svg">' + '<linearGradient gradientUnits="userSpaceOnUse" id="grad' + gid + '" x1="0%" y1="0%" x2="0%" y2="100%">' + '<stop offset="0%" stop-color="' + gradientValues[0] + '" />' + '<stop offset="100%" stop-color="' + gradientValues[1] + '" />' + '</linearGradient>' + '</defs>';
      var xmlStrokegradients = new DOMParser().parseFromString(strokegradients, "text/xml");
      obj.prepend(xmlStrokegradients.documentElement);

      if (_typeof(undefined) !== _typeof(hoverGradientValues) && null !== hoverGradientValues) {
        hoverGradientValues = hoverGradientValues.split(':');

        if (undefined === hoverGradientValues[1]) {
          hoverGradientValues[1] = hoverGradientValues[0];
        }

        strokeHoverGradients.innerHTML = '#' + this.$element.attr('id') + ':hover .iconbox-icon-container defs stop:first-child{stop-color:' + hoverGradientValues[0] + ';}' + '#' + this.$element.attr('id') + ':hover .iconbox-icon-container defs stop:last-child{stop-color:' + hoverGradientValues[1] + ';}';
        obj.prepend(strokeHoverGradients);
      }

      if (options.customColorApplied) {
        obj.find('path, rect, ellipse, circle, polygon, polyline, line').attr({
          'stroke': 'url(#grad' + gid + ')',
          'fill': 'none'
        });
      }

      this.$element.addClass('iconbox-icon-animating');
      return this;
    },
    animate: function animate(vivusObj) {
      var self = this;
      var options = self.options;
      var delayTime = parseInt(options.delay, 10);
      var canAnimate = options.animated;
      var duration = options.duration;

      if (!liquidIsMobile() && canAnimate) {
        vivusObj.reset().stop();

        var inViewCallback = function inViewCallback(enteries, observer) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting && vivusObj.getStatus() == 'start' && vivusObj.getStatus() != 'progress') {
              self.resetAnimate(vivusObj, delayTime, duration);
              self.eventHandlers(vivusObj, delayTime, duration);
              observer.unobserve(entery.target);
            }
          });
        };

        var observer = new IntersectionObserver(inViewCallback, options);
        observer.observe(this.element);
      }

      return this;
    },
    eventHandlers: function eventHandlers(vivusObj, delayTime, duration) {
      var self = this;
      var options = self.options;
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (event) {
        var $target = $($(event.currentTarget).attr('href'));

        if ($target.find(self.element).length) {
          self.resetAnimate.call(self, vivusObj, delayTime, duration);
        }
      });

      if (options.resetOnHover) {
        this.$element.on('mouseenter', function () {
          if (vivusObj.getStatus() == 'end') {
            self.resetAnimate(vivusObj, 0, duration);
          }
        });
      }
    },
    resetAnimate: function resetAnimate(vivusObj, delay, duration) {
      vivusObj.stop().reset();
      setTimeout(function () {
        vivusObj.play(duration / 100);
      }, delay);
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if (!$('body').hasClass('compose-mode')) {
    $('.iconbox').liquidAnimatedIcon();
  }
});
"use strict";

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidSubscribeForm';
  var defaults = {
    icon: false,
    align: 'right'
  };

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      var element = $(this.element);
      this.buttonPlacement();
      element.addClass('ld-sf-is-initialized');
      return this;
    },
    getSubmitButton: function getSubmitButton() {
      var element = $(this.element);
      var submit = element.find('.ld_sf_submit');
      var submitText = submit.val() == '' ? '' : '<span class="submit-text">' + submit.val() + '</span>';
      return {
        submit: submit,
        submitText: submitText
      };
    },
    createIcon: function createIcon() {
      var options = this.options;
      var icon = options.icon ? $('<span class="submit-icon"><i class="' + options.icon + '"></i></span>') : '';
      return icon;
    },
    createButton: function createButton() {
      var options = this.options;
      var submit = this.getSubmitButton().submit;
      var submitText = this.getSubmitButton().submitText;
      var icon = this.createIcon();
      var button = $('<button class="ld_sf_submit" type="submit">' + submitText + '</button>');

      if ('right' === options.align) {
        icon.appendTo(button);
      } else {
        icon.prependTo(button);
      }

      return button;
    },
    buttonPlacement: function buttonPlacement() {
      var element = $(this.element);
      var lastInput = element.find('.ld_sf_text').last();
      var button = this.createButton.call(this);
      var submit = this.getSubmitButton().submit;
      var isRTL = $('html').attr('dir') == 'rtl';

      if (element.hasClass('ld-sf-button-inside')) {
        lastInput.after(button); // button.css('line-height', parseInt(lastInput.outerHeight(), 10) + 'px'); // Done with css

        if (!isRTL) {
          lastInput.css('padding-right', button.outerWidth() + parseInt(button.css('right'), 10) + 15);
        } else {
          lastInput.css('padding-left', button.outerWidth() + parseInt(button.css('right'), 10) + 15);
        }
      } else {
        submit.after(button);
      }

      submit.hide();
      return button;
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options');
      var opts = null;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-plugin-subscribe-form=true]').liquidSubscribeForm();
});
"use strict";

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidFormInputs';
  var defaults = {};

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.initDatePicker();
      this.initSelect();
      this.initSpinner();
      this.inputsEventHandlers();
    },
    initDatePicker: function initDatePicker() {
      var form = $(this.element);
      var dateInputs = form.find('.date-picker, input.wpcf7-form-control[type=date]');
      dateInputs.each(function (i, element) {
        var $element = $(element);

        if ($element.attr('type') === 'date') {
          var $clonedElement = $element.clone(true);
          $clonedElement.attr('type', 'text');
          $clonedElement.insertAfter($element);
          $element.css('display', 'none');
          $clonedElement.datepicker({
            dateFormat: 'yy-mm-dd',
            onSelect: function onSelect(date) {
              $element.val(date);
            }
          });
        } else {
          $(element).datepicker();
        }
      });
    },
    initSelect: function initSelect() {
      var form = $(this.element);
      var selectElement = form.find('select').not('.select2-hidden-accessible, .select, .woo-rating, #bbp_stick_topic_select, #bbp_topic_status_select, #bbp_forum_id');

      if (!selectElement.closest('.variations').length) {
        selectElement.each(function (i, element) {
          var $element = $(element);
          $element.selectmenu({
            change: function change() {
              $element.trigger('change');
            }
          });
          $element.on('change', function () {
            $element.selectmenu('refresh');
          });
        });
      } else {
        var $selectElExtra = $('<span class="lqd-select-ext" />');
        selectElement.wrap('<span class="lqd-select-wrap" />');
        $selectElExtra.insertAfter(selectElement);
      }

      ;
    },
    initSpinner: function initSpinner() {
      var _this = this;

      var form = $(this.element);
      var splinners = form.find('input.spinner');
      splinners.each(function (i, element) {
        var $element = $(element);
        $element.spinner({
          create: function create(event, ui) {
            _this.addToCartButton($element, event.target.value);
          },
          change: function change(event, ui) {
            _this.addToCartButton($element, event.target.value);
          },
          spin: function spin(event, ui) {
            $element.val(ui.value);
            $element.trigger('change');

            _this.addToCartButton($element, ui.value);
          }
        });
      });
    },
    getInputParent: function getInputParent(focusedInput) {
      if (focusedInput.closest('p').length) {
        return focusedInput.closest('p');
      } else {
        return focusedInput.closest('div');
      }
    },
    inputsEventHandlers: function inputsEventHandlers() {
      var self = this;
      var form = $(self.element);
      $('input, textarea', form).on('focus', self.inputOnFocus.bind(this));
      $('input, textarea', form).on('blur', self.inputOnBlur.bind(this));
    },
    inputOnFocus: function inputOnFocus(event) {
      var inputParent = this.getInputParent($(event.target));
      inputParent.addClass('input-focused');
    },
    inputOnBlur: function inputOnBlur(event) {
      var input = $(event.target);
      var inputParent = this.getInputParent(input);

      if (input.val() !== '') {
        inputParent.addClass('input-filled');
      } else {
        inputParent.removeClass('input-filled');
      }

      ;
      inputParent.removeClass('input-focused');
    },
    addToCartButton: function addToCartButton($element, value) {
      if (!$element.is('.qty')) return;
      var $parentForm = $element.closest('form');
      var $addToCartBtn = $parentForm.find('.add_to_cart_button');
      $addToCartBtn.attr('data-quantity', value);
      $addToCartBtn.data('quantity', value);
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options');
      var opts = null;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.lqd-contact-form, form.cart, form.checkout, form.woocommerce-cart-form').liquidFormInputs();
});
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidCarousel';
  var defaults = {
    contain: false,
    imagesLoaded: true,
    percentPosition: true,
    prevNextButtons: false,
    pageDots: false,
    adaptiveHeight: false,
    cellAlign: "left",
    groupCells: true,
    dragThreshold: 20,
    wrapAround: false,
    autoplay: false,
    fullwidthSide: false,
    navArrow: 1,
    filters: false,
    equalHeightCells: false,
    randomVerOffset: false,
    parallax: false,
    buttonsAppendTo: null // ["parent_row", elementor-selector]
    // controllingCarousels: [],
    // navOffsets: { // we don't want to overwrite defaults
    // 	nav: {
    // 		top: 0,
    //		bottom: 0,
    // 		left: 0,
    // 		right: 0
    // 	},
    // 	prev: 0,
    // 	next: 0,
    // }

  };

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this.flickityData = null;
    this.isRTL = $('html').attr('dir') == 'rtl';
    this._defaults = defaults;
    this._name = pluginName;
    this.initIO();
  }

  Plugin.prototype = {
    initIO: function initIO() {
      var _this = this;

      var iniViewCallback = function iniViewCallback(enteries, observer) {
        enteries.forEach(function (entery) {
          if (entery.isIntersecting) {
            _this.initFlicky();

            observer.unobserve(entery.target);
          }
        });
      };

      var observer = new IntersectionObserver(iniViewCallback, {
        rootMargin: '50%'
      });
      observer.observe(this.element);
    },
    initFlicky: function initFlicky() {
      var self = this;
      var options = $.extend({}, this.options, {
        rightToLeft: this.isRTL || this.options.rightToLeft
      });
      this.$element.imagesLoaded(function () {
        self.$element.flickity(options);
        self.flickityData = $(self.element).data('flickity');
        options.adaptiveHeight && $('.flickity-viewport', self.element).css('transition', 'height 0.3s');
        self.onImagesLoaded();
      });
    },
    onImagesLoaded: function onImagesLoaded() {
      if (this.flickityData) {
        this.addCarouselItemInner();
        this.setElementNavArrow();
        this.navCarousel();
        this.setEqualHeightCells();
        this.randomVerOffset();
        this.navOffsets();
        this.fullwidthSide();
        this.controllingCarousels();
        this.filtersInit();
        this.windowResize();
        this.events();
        this.addEventListeners();
        this.initialPlugins();
      }
    },
    addEventListeners: function addEventListeners() {
      var e = new CustomEvent('lqd-carousel-initialized', {
        detail: {
          flickityData: this.flickityData
        }
      });
      document.dispatchEvent(e);
    },
    windowResize: function windowResize() {
      var self = this;
      $(window).on('resize', function () {
        self.doOnWindowResize();
      });
    },
    doOnWindowResize: function doOnWindowResize() {
      this.fullwidthSide();
    },
    events: function events() {
      var _this2 = this;

      this.$element.on('settle.flickity', function () {
        _this2.lastCell.call(_this2);

        _this2.selectedIndex.call(_this2);

        $(_this2.flickityData.viewport).removeClass('is-moving');
      });
      this.$element.on('change.flickity', function () {
        _this2.lastCell.call(_this2);

        _this2.selectedIndex.call(_this2);

        $(_this2.flickityData.viewport).removeClass('is-moving');
      });
      this.$element.on('select.flickity', function () {
        _this2.lastCell.call(_this2);

        _this2.selectedIndex.call(_this2);
      });
      this.$element.on('scroll.flickity', function () {
        _this2.parallax.call(_this2);

        $(_this2.flickityData.viewport).addClass('is-moving');
      });
    },
    lastCell: function lastCell() {
      var selectedElements = this.flickityData.selectedElements;
      var selectedElement = this.flickityData.selectedElement;
      var navSelectedElement = this.flickityData.navSelectedElements ? this.flickityData.navSelectedElements[0] : null;
      var lastSelectedElement = $(selectedElements).last();

      if (navSelectedElement && $(navSelectedElement).is(lastSelectedElement)) {
        $(navSelectedElement).addClass('is-last');
      } else if ($(selectedElement).is(':last-child')) {
        $(selectedElement).addClass('is-last');
      }
    },
    selectedIndex: function selectedIndex() {
      var cells = this.flickityData.cells;
      var selectedElements = this.flickityData.selectedElements;

      for (var i = 0; i < cells.length; i++) {
        var $element = $(cells[i].element);
        $element.removeClass(function (i, className) {
          return (className.match(/\bis-selected-i\S+/g) || []).join(' ');
        });
      }

      for (var _i = 0; _i < selectedElements.length; _i++) {
        var $cellElements = $(selectedElements[_i]);
        var cellIndex = _i + 1;
        $cellElements.addClass("is-selected-i-".concat(cellIndex));
      }
    },
    addCarouselItemInner: function addCarouselItemInner() {
      var cellsArray = this.flickityData.cells;

      for (var i = 0; i < cellsArray.length; i++) {
        var $cellElement = $(cellsArray[i].element);
        $cellElement.wrapInner('<div class="carousel-item-inner" />');
      }
    },
    navCarousel: function navCarousel() {
      var self = this;
      var carouselContainer = $(self.element).closest('.carousel-container');
      var appendingSelector = self.options.buttonsAppendTo;

      if (appendingSelector == 'parent_row') {
        appendingSelector = $(self.element).closest('.vc_row');
      }

      if (_typeof(undefined) !== _typeof(this.flickityData.prevButton) && null !== this.flickityData.prevButton && self.options.prevNextButtons) {
        var prevButton = $(this.flickityData.prevButton.element);
        var nextButton = $(this.flickityData.nextButton.element);
        var carouselNav = $('<div class="carousel-nav"></div>');
        carouselNav.append(prevButton.add(nextButton));

        if (_typeof(undefined) !== _typeof(appendingSelector) && null !== appendingSelector && $(appendingSelector).length) {
          var carouselNavClassnames = [carouselContainer.attr('id')];
          $.each($(carouselContainer.get(0).classList), function (i, className) {
            if (className.indexOf('carousel-nav-') >= 0) carouselNavClassnames.push(className);
          });
          carouselNav.addClass(carouselNavClassnames.join(' '));

          if ($(appendingSelector).is('.wpb_column')) {
            var wpb_wrapper = $(appendingSelector).children('.vc_column-inner ').children('.wpb_wrapper');
            carouselNav.appendTo(wpb_wrapper);
          } else {
            carouselNav.appendTo(appendingSelector);
          }

          $(appendingSelector).addClass('carousel-nav-appended');
        } else {
          carouselNav.appendTo(self.element);
        }

        self.options.carouselNav = carouselNav.get(0);
      }
    },
    fullwidthSide: function fullwidthSide() {
      var _viewportElWrap$css, _viewportElWrap$css2;

      if (!this.options.fullwidthSide) return;
      var self = this;
      var element = $(self.element);
      var viewportEl = $(this.flickityData.viewport);
      var elementWidth = this.flickityData.size.width;
      var viewportElOffset = viewportEl.offset();
      var viewportElOffsetRight = liquidWindowWidth() - (elementWidth + viewportElOffset.left);
      var margin = !this.isRTL ? 'marginRight' : 'marginLeft';
      var padding = !this.isRTL ? 'paddingRight' : 'paddingLeft';
      var viewportElWrap = $('<div class="flickity-viewport-wrap" />');

      if (!viewportEl.parent('.flickity-viewport-wrap').length) {
        viewportEl.wrap(viewportElWrap);
      }

      viewportElWrap = viewportEl.parent();
      viewportElWrap.css((_viewportElWrap$css = {}, _defineProperty(_viewportElWrap$css, margin, ''), _defineProperty(_viewportElWrap$css, padding, ''), _viewportElWrap$css));
      viewportElWrap.css((_viewportElWrap$css2 = {}, _defineProperty(_viewportElWrap$css2, margin, viewportElOffsetRight >= 0 ? (viewportElOffsetRight - 1) * -1 : viewportElOffsetRight - 1), _defineProperty(_viewportElWrap$css2, padding, Math.abs(viewportElOffsetRight - 1)), _defineProperty(_viewportElWrap$css2, "overflow", 'hidden'), _viewportElWrap$css2));
      viewportEl.css('overflow', 'visible');
      element.flickity('resize');
    },
    randomVerOffset: function randomVerOffset() {
      if (this.options.randomVerOffset) {
        var cellsArray = this.flickityData.cells;
        var maxHeight = 0;

        for (var i = 0; i < cellsArray.length; i++) {
          var cell = $(cellsArray[i].element);
          var itemHeight = cell.height();

          if (itemHeight > maxHeight) {
            maxHeight = itemHeight;
          }

          var maxOffset = maxHeight - itemHeight;
          var offset = (Math.random() * maxOffset).toFixed();
          cell.css("top", offset + "px");
        }
      }
    },
    navOffsets: function navOffsets() {
      var self = this;
      var options = self.options;
      var navOffsets = options.navOffsets;
      var carouselNav = $(options.carouselNav);

      if (navOffsets && _typeof(undefined) !== _typeof(carouselNav) && null !== carouselNav && this.flickityData.options.prevNextButtons) {
        var prevButton = $(this.flickityData.prevButton.element);
        var nextButton = $(this.flickityData.nextButton.element);
        carouselNav.css({
          left: navOffsets.nav ? navOffsets.nav.left : '',
          right: navOffsets.nav ? navOffsets.nav.right : '',
          top: navOffsets.nav ? navOffsets.nav.top : '',
          bottom: navOffsets.nav ? navOffsets.nav.bottom : ''
        });
        prevButton.css({
          left: navOffsets.prev
        });
        nextButton.css({
          right: navOffsets.next
        });
      }
    },
    setElementNavArrow: function setElementNavArrow() {
      if (!this.options.prevNextButtons) {
        return false;
      }

      var navArrowsArray = this.navArrows;
      var prevButton = this.flickityData.prevButton ? this.flickityData.prevButton.element : null;
      var nextButton = this.flickityData.nextButton ? this.flickityData.nextButton.element : null;
      var elementNavArrow = this.options.navArrow;
      var prevIcon;
      var nextIcon;

      if (_typeof(elementNavArrow) !== 'object') {
        elementNavArrow = elementNavArrow - 1; // if it's RTL, just reverse prev/next icons

        if (!this.isRTL) {
          prevIcon = $(navArrowsArray[elementNavArrow].prev);
          nextIcon = $(navArrowsArray[elementNavArrow].next);
        } else {
          prevIcon = $(navArrowsArray[elementNavArrow].next);
          nextIcon = $(navArrowsArray[elementNavArrow].prev);
        }
      } else {
        prevIcon = $(this.options.navArrow.prev);
        nextIcon = $(this.options.navArrow.next);
      }

      if (prevButton || nextButton) {
        $(prevButton).find('svg').remove().end().append(prevIcon);
        $(nextButton).find('svg').remove().end().append(nextIcon);
      }
    },
    navArrows: [{
      prev: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve" width="32" height="32" style="transform: rotate(180deg);"><g class="nc-icon-wrapper" transform="translate(0.5, 0.5)"><line data-cap="butt" data-color="color-2" fill="none" stroke-width="1" stroke-miterlimit="10" x1="2" y1="16" x2="30" y2="16" stroke-linejoin="miter" stroke-linecap="butt"></line> <polyline fill="none" stroke-width="1" stroke-linecap="square" stroke-miterlimit="10" points="21,7 30,16 21,25 " stroke-linejoin="miter"></polyline></g></svg>',
      next: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" xml:space="preserve" width="32" height="32"><g class="nc-icon-wrapper" transform="translate(0.5, 0.5)"><line data-cap="butt" data-color="color-2" fill="none" stroke-width="1" stroke-miterlimit="10" x1="2" y1="16" x2="30" y2="16" stroke-linejoin="miter" stroke-linecap="butt"></line> <polyline fill="none" stroke-width="1" stroke-linecap="square" stroke-miterlimit="10" points="21,7 30,16 21,25 " stroke-linejoin="miter"></polyline></g></svg>'
    }, {
      prev: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="14px" style="transform: rotate(180deg);"> <path fill-rule="evenodd"  fill="rgb(24, 27, 49)" d="M30.354,7.353 L30.000,7.707 L30.000,8.000 L29.707,8.000 L24.354,13.354 L23.646,12.646 L28.293,8.000 L0.000,8.000 L0.000,7.000 L29.293,7.000 L29.293,7.000 L23.646,1.353 L24.354,0.646 L30.354,6.647 L30.000,7.000 L30.354,7.353 Z"/> </svg>',
      next: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="14px"> <path fill-rule="evenodd"  fill="rgb(24, 27, 49)" d="M30.354,7.353 L30.000,7.707 L30.000,8.000 L29.707,8.000 L24.354,13.354 L23.646,12.646 L28.293,8.000 L0.000,8.000 L0.000,7.000 L29.293,7.000 L29.293,7.000 L23.646,1.353 L24.354,0.646 L30.354,6.647 L30.000,7.000 L30.354,7.353 Z"/> </svg>'
    }, {
      prev: '<svg width="15" height="9" xmlns="http://www.w3.org/2000/svg"> <path d="m14.80336,4.99173l0,-1.036l-14.63743,0l0,1.036l14.63743,0z" fill-rule="evenodd"/> <path d="m4.74612,8.277l-0.691,0.733l-3.911,-4.144l0,-0.732l3.911,-4.144l0.691,0.732l-1.7825,1.889l-1.7825,1.889l1.7825,1.8885l1.7825,1.8885z" fill-rule="evenodd"/> </svg>',
      next: '<svg width="15" height="9" xmlns="http://www.w3.org/2000/svg"> <path fill-rule="evenodd" d="m14.80336,4.99173l0,-1.036l-14.63743,0l0,1.036l14.63743,0z"/> <path transform="rotate(-180 12.582813262939453,4.5) " fill-rule="evenodd" d="m14.88382,8.277l-0.691,0.733l-3.911,-4.144l0,-0.732l3.911,-4.144l0.691,0.732l-1.7825,1.889l-1.7825,1.889l1.7825,1.8885l1.7825,1.8885z"/> </svg>'
    }, {
      prev: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18.5px" height="20.5px"> <path fill-rule="evenodd" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" fill="none" d="M0.755,10.241 L16.955,19.159 L16.955,1.321 L0.755,10.241 Z"/> </svg>',
      next: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="17.5px" height="19.5px"> <path fill-rule="evenodd" stroke-width="1px" stroke-linecap="butt" stroke-linejoin="miter" fill="none" d="M16.496,9.506 L0.514,18.503 L0.514,0.509 L16.496,9.506 Z"/> </svg>'
    }, {
      prev: '<svg width="16" height="16" xmlns="http://www.w3.org/2000/svg"> <polygon transform="rotate(180 7.999999999999999,8) " points="9.3,1.3 7.9,2.7 12.2,7 0,7 0,9 12.2,9 7.9,13.3 9.3,14.7 16,8 "/> </svg>',
      next: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 16 16" xml:space="preserve" width="16" height="16"><polygon points="9.3,1.3 7.9,2.7 12.2,7 0,7 0,9 12.2,9 7.9,13.3 9.3,14.7 16,8 "></polygon></svg>'
    }, {
      prev: '<svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <line  fill="none" stroke-width="2" stroke-miterlimit="10" x1="2" y1="12" x2="22" y2="12"/> <polyline transform="rotate(180 5.634945869445801,12) "  fill="none" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" points="2.1349482387304306,5 9.134950384497643,12 2.1349482387304306,19 "/> </svg>',
      next: '<svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <line  fill="none" stroke-width="2" stroke-miterlimit="10" x1="2" y1="12" x2="22" y2="12"/> <polyline  fill="none" stroke-width="2" stroke-linecap="square" stroke-miterlimit="10" points="15,5 22,12 15,19 "/> </svg>'
    }],
    setEqualHeightCells: function setEqualHeightCells() {
      if (!this.options.equalHeightCells) return; // it's not adding the classname after carousel init in some cases

      this.element.classList.add('flickity-equal-cells');

      Flickity.prototype._createResizeClass = function () {
        this.element.classList.add('flickity-equal-cells');
      };

      Flickity.createMethods.push('_createResizeClass');
      var resize = Flickity.prototype.resize;

      Flickity.prototype.resize = function () {
        this.element.classList.remove('flickity-equal-cells');
        resize.call(this);
        this.element.classList.add('flickity-equal-cells');
      };
    },
    parallax: function parallax() {
      if (!this.options.parallax || liquidIsMobile()) return false;
      var flkty = this.flickityData;
      var cellElements = flkty.cells;
      $.each(cellElements, function (i, cell) {
        var x = (cell.target + flkty.x) * -1 / 3;
        var $cellElement = $(cell.element);
        var $cellImage = $cellElement.find('img');

        if (!$cellImage.parent('.ld-carousel-parallax-wrap').length) {
          $cellImage.wrap('<div class="ld-carousel-parallax-wrap overflow-hidden"></div>');
        }

        if ($cellImage.is(':only-child')) {
          $cellImage.css({
            '-webkit-transform': "translateX(".concat(x, "px)"),
            'transform': "translateX(".concat(x, "px)")
          });
        }
      });
    },
    controllingCarousels: function controllingCarousels() {
      var _this3 = this;

      var controllingCarousels = this.options.controllingCarousels;

      if (_typeof(controllingCarousels) !== _typeof(undefined) && controllingCarousels !== null && controllingCarousels.length) {
        var $controlledCarousels = $(controllingCarousels.map(function (carousel) {
          return $(carousel).children('[data-lqd-flickity]');
        }));
        $.each($controlledCarousels, function (i, controlledCarousel) {
          var $controlledCarousel = $(controlledCarousel);
          $controlledCarousel.imagesLoaded(function () {
            _this3.$element.on('change.flickity', function (evt, i) {
              return $controlledCarousel.flickity('select', i);
            });

            $controlledCarousel.on('change.flickity', function (evt, i) {
              return _this3.$element.flickity('select', i);
            });
          });
        });
      }
    },
    getCellsArray: function getCellsArray() {
      return this.flickityData.cells.map(function (cell) {
        return cell.element;
      });
    },
    filtersInit: function filtersInit() {
      var _this4 = this;

      var options = this.options;
      var filters = options.filters;

      if (filters) {
        var filterList = $(filters);
        var filterItems = $('[data-filter]', filterList);
        filterItems.on('click', function (event) {
          var filter = $(event.currentTarget);
          var filterValue = filter.attr('data-filter');
          if (filter.hasClass('active')) return;
          filter.addClass('active').siblings().removeClass('active');

          _this4.filterAnimateStart(filterValue);
        });
      }
    },
    filterAnimateStart: function filterAnimateStart(filterValue) {
      var _this5 = this;

      var visibleCells = this.getCellsArray().filter(function (element) {
        return !element.classList.contains('hidden');
      });
      anime.remove(visibleCells);
      anime({
        targets: visibleCells,
        translateX: -30,
        opacity: 0,
        easing: 'easeInOutQuint',
        duration: 500,
        delay: function delay(el, i, l) {
          return i * 60;
        },
        begin: function begin(anime) {
          if (_this5.options.equalHeightCells) {
            var cells = _this5.flickityData.cells;
            var currentHeight = _this5.flickityData.size.height;
            cells.map(function (cell) {
              var $element = $(cell.element);
              $element.css('minHeight', currentHeight);
            });
          }

          $(anime.animatables).each(function (i, el) {
            var $element = $(el.target);
            $element.css({
              transition: 'none'
            });
          });
        },
        complete: function complete(anim) {
          _this5.filterItems(filterValue);
        }
      });
    },
    filterItems: function filterItems(filterValue) {
      var cells = this.getCellsArray();
      this.$element.find('.hidden').removeClass('hidden');

      if (filterValue != '*') {
        $(cells).not(filterValue).addClass('hidden');
      }

      this.$element.flickity('resize');
      this.filterAnimateComplete();
    },
    filterAnimateComplete: function filterAnimateComplete() {
      var visibleCells = this.getCellsArray().filter(function (element) {
        return !element.classList.contains('hidden');
      });
      anime.remove(visibleCells);
      anime({
        targets: visibleCells,
        translateX: 0,
        opacity: 1,
        easing: 'easeOutQuint',
        delay: function delay(el, i, l) {
          return i * 60;
        },
        complete: function complete(anime) {
          $(anime.animatables).each(function (i, el) {
            var element = $(el.target);
            element.css({
              transition: '',
              transform: '',
              opacity: ''
            });
          });
        }
      });
    },
    initialPlugins: function initialPlugins() {
      var $pie_charts = $('.vc_pie_chart:not(.vc_ready)');
      var $round_charts = $('.vc_round-chart');
      var $line_charts = $('.vc_line-chart');
      if ($pie_charts.length && $.fn.vcChat) $pie_charts.vcChat();
      if ($round_charts.length && $.fn.vcRoundChart) $round_charts.vcRoundChart({
        reload: !1
      });
      if ($line_charts.length && $.fn.vcLineChart) $line_charts.vcLineChart({
        reload: !1
      });
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = this.options = $.extend({}, $(this).data('lqd-flickity'), options);

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if ($('body').hasClass('compose-mode')) return false;
  $('[data-lqd-flickity]').liquidCarousel();
});
"use strict";

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidCarouselV3d';
  var defaults = {
    itemsSelector: '.carousel-item'
  };

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.build();
  }

  Plugin.prototype = {
    build: function build() {
      this.init();
    },
    init: function init() {
      var self = this;
      var element = $(self.element);
      var items = self.options.itemsSelector;
      self.prepareitems();
      var activeItem = $(items, element).first();
      var bottomItem = activeItem.next();
      var topItem = bottomItem.next();
      self.dragY = 0;
      self.startY = 0;
      self.currentY = 0;
      self.setActive(activeItem, element);
      self.initAnim(element, activeItem, topItem, bottomItem);
      self.initDrag();
      self.initClicks();
      element.addClass('carousel-initialized');
      return self;
    },
    prepareitems: function prepareitems() {
      var self = this;
      var items = $(self.options.itemsSelector, self.element);

      if (items.length <= 2 && items.length >= 1) {
        var firstItem = items[0];

        for (var i = items.length; i <= 2; i++) {
          $(firstItem).clone(true).appendTo($(self.element).find('.carousel-items'));
        }
      }
    },
    setActive: function setActive(activeItem, element) {
      var self = this;
      var currentTopItem = $('.is-top', element);
      var currentActiveItem = $('.is-active', element);
      var currentBottomItem = $('.is-bottom', element);

      if (currentTopItem.length) {
        currentTopItem.addClass('was-top');
      }

      if (currentActiveItem.length) {
        currentActiveItem.addClass('was-active');
      }

      if (currentBottomItem.length) {
        currentBottomItem.addClass('was-bottom');
      }

      activeItem.addClass('is-active').removeClass('is-top is-bottom').siblings().removeClass('is-active');
      self.setBottom(activeItem);
      self.setTop(activeItem);
    },
    // Bottom Item will be based on the active item
    setBottom: function setBottom(activeItem) {
      var self = this;
      var element = $(self.element);
      var items = self.options.itemsSelector;
      var firstItem = $(items, element).first();
      var bottomItem = activeItem.next();

      if (!bottomItem.length && activeItem.is(':last-child')) {
        bottomItem = firstItem;
      }

      bottomItem.addClass('is-bottom').removeClass('is-active is-top was-active').siblings().removeClass('is-bottom');
    },
    // Top Item will be based on the active item		
    setTop: function setTop(activeItem) {
      var self = this;
      var element = $(self.element);
      var items = self.options.itemsSelector;
      var lastItem = $(items, element).last();
      var topItem = activeItem.prev();

      if (!topItem.length && activeItem.is(':first-child')) {
        topItem = lastItem;
      }

      topItem.addClass('is-top').removeClass('is-active is-bottom was-active').siblings().removeClass('is-top');
    },
    initAnim: function initAnim(element, activeItem, topItem, bottomItem) {
      var self = this;
      self.animInited = false;

      if (!self.animInited) {
        var animeTimeline = anime.timeline({
          duration: 0,
          easing: 'linear'
        });
        animeTimeline.add({
          targets: element.get(0).querySelectorAll('.carousel-item:not(.is-active):not(.is-bottom)'),
          translateY: '-50%',
          translateZ: 0,
          scale: 0.8,
          offse: 0
        }).add({
          targets: activeItem.get(0),
          translateZ: 50,
          scale: 1,
          offse: 0
        }).add({
          targets: bottomItem.get(0),
          translateY: '50%',
          translateZ: 0,
          scale: 0.8,
          offse: 0
        });
        self.animInited = true;
      }
    },
    initClicks: function initClicks() {
      $(this.element).on('click', '.is-top', this.moveItems.bind(this, 'prev'));
      $(this.element).on('click', '.is-bottom', this.moveItems.bind(this, 'next'));
    },
    initDrag: function initDrag() {
      var self = this;
      var element = $(self.element);
      element.on('mousedown', self.pointerStart.bind(self));
      element.on('mousemove', self.pointerMove.bind(self));
      element.on('mouseup', self.pointerEnd.bind(self));
    },
    pointerStart: function pointerStart(event) {
      var self = this;
      var element = $(self.element);
      self.startY = event.pageY || event.touches[0].pageY;
      self.currentY = self.startY;
      element.addClass('pointer-down');
    },
    pointerMove: function pointerMove(event) {
      var self = this;
      self.currentY = event.pageY || event.touches[0].pageY;
      self.dragY = parseInt(self.startY - self.currentY, 10);
    },
    pointerEnd: function pointerEnd(event) {
      var self = this;
      var element = $(self.element);
      self.dragY = parseInt(self.startY - self.currentY, 10);

      if (self.dragY >= 20) {
        self.moveItems('next');
      } else if (self.dragY <= -20) {
        self.moveItems('prev');
      }

      element.removeClass('pointer-down');
    },
    moveItems: function moveItems(dir) {
      var _this = this;

      if ($(this.element).hasClass('items-moving')) return;
      var self = this;
      var element = $(self.element);
      var items = $(self.options.itemsSelector);
      var bottomItem = $('.is-bottom', element);
      var topItem = $('.is-top', element);
      var animationTimeline = anime.timeline({
        duration: 650,
        easing: 'easeInOutQuad',
        run: function run() {
          $(items, element).addClass('is-moving');
        },
        complete: function complete() {
          $(items, element).removeClass('is-moving was-top was-active was-bottom');
          $(_this.element).removeClass('items-moving');
        }
      });
      if (dir == 'next') self.setActive(bottomItem, element);else if (dir == 'prev') self.setActive(topItem, element);
      var newActiveItem = $('.is-active', element);
      var newBottomItem = $('.is-bottom', element);
      var newTopItem = $('.is-top', element);

      if (dir == 'next') {
        self.moveNext(animationTimeline, newActiveItem, newBottomItem, newTopItem);
      } else if (dir == 'prev') {
        self.movePrev(animationTimeline, newActiveItem, newBottomItem, newTopItem);
      }
    },
    moveNext: function moveNext(animationTimeline, newActiveItem, newBottomItem, newTopItem) {
      $(this.element).addClass('items-moving');
      animationTimeline.add({
        targets: newTopItem.get(0),
        translateY: [{
          value: '-55%'
        }, {
          value: '-50%',
          easing: 'linear'
        }],
        translateZ: 0,
        rotateX: [{
          value: 12
        }, {
          value: 0
        }],
        scale: 0.8
      }, 0).add({
        targets: newActiveItem.get(0),
        translateY: '0%',
        translateZ: [{
          value: 100
        }, {
          value: 50
        }],
        rotateX: [{
          value: 12
        }, {
          value: 0
        }],
        scale: 1
      }, 0).add({
        targets: newBottomItem.get(0),
        translateY: [{
          value: '55%'
        }, {
          value: '50%',
          easing: 'linear'
        }],
        translateZ: 0,
        rotateX: [{
          value: 12
        }, {
          value: 0
        }],
        scale: 0.8
      }, 0);
    },
    movePrev: function movePrev(animationTimeline, newActiveItem, newBottomItem, newTopItem) {
      $(this.element).addClass('items-moving');
      animationTimeline.add({
        targets: newTopItem.get(0),
        translateY: [{
          value: '-55%'
        }, {
          value: '-50%',
          easing: 'linear'
        }],
        translateZ: 0,
        rotateX: [{
          value: 12
        }, {
          value: 0
        }],
        scale: 0.8
      }, 0).add({
        targets: newActiveItem.get(0),
        translateY: '0%',
        translateZ: [{
          value: 100
        }, {
          value: 50
        }],
        rotateX: [{
          value: 12
        }, {
          value: 0
        }],
        scale: 1
      }, 0).add({
        targets: newBottomItem.get(0),
        translateY: [{
          value: '55%'
        }, {
          value: '50%',
          easing: 'linear'
        }],
        translateZ: 0,
        rotateX: [{
          value: 12
        }, {
          value: 0
        }],
        scale: 0.8
      }, 0);
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options');
      var opts = null;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.carousel-vertical-3d').liquidCarouselV3d();
});
"use strict";

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidSlideElement';
  var defaults = {
    alignMid: false
  };

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.build();
  }

  Plugin.prototype = {
    build: function build() {
      this.element = $(this.element);
      this.hiddenElement = $(this.options.hiddenElement, this.element).wrap('<div class="ld-slideelement-hidden" />');
      this.visibleElement = $(this.options.visibleElement, this.element).wrap('<div class="ld-slideelement-visible" />');
      this.init();
    },
    init: function init() {
      var self = this;
      self.element.imagesLoaded(function () {
        self.hiddenElementHeight = self.getHiddenElementHeight.call(self);
        self.element.addClass('hide-target');
        self.moveElements.call(self);
        self.eventListeners.call(self);
      });
    },
    getHiddenElementHeight: function getHiddenElementHeight() {
      return this.hiddenElement.outerHeight();
    },
    getHiddenElementChilds: function getHiddenElementChilds() {
      var childArray = [];
      $.each(this.hiddenElement, function (i, el) {
        var childEl = $(el).children();

        if (childEl.length) {
          $.each(childEl, function (i, child) {
            childArray.push(child);
          });
        } else {
          childArray.push($(el).parent('.ld-slideelement-hidden').get(0));
        }
      });
      return childArray;
    },
    getVisibleElementChilds: function getVisibleElementChilds() {
      var childArray = [];
      $.each(this.visibleElement, function (i, el) {
        var childEl = $(el).children();

        if (childEl.length) {
          $.each(childEl, function (i, child) {
            childArray.push(child);
          });
        } else {
          childArray.push($(el).parent('.ld-slideelement-visible').get(0));
        }
      });
      return childArray;
    },
    moveElements: function moveElements() {
      var self = this;
      var options = self.options;
      var translateVal = options.alignMid ? self.hiddenElementHeight / 2 : self.hiddenElementHeight;
      this.visibleElement.css({
        transform: "translateY(".concat(translateVal, "px)")
      });
      this.hiddenElement.css({
        transform: "translateY(".concat(translateVal, "px)")
      });
    },
    eventListeners: function eventListeners() {
      var self = this;
      var element = $(self.element);
      element.on('mouseenter', self.onMouseEnter.bind(self));
      element.on('mouseleave', self.onMouseLeave.bind(self));
    },
    onMouseEnter: function onMouseEnter() {
      var options = this.options;
      var hiddenElementHeight = this.hiddenElementHeight;
      var childELements = $.merge(this.getVisibleElementChilds(), this.getHiddenElementChilds());
      var translateVal = options.alignMid ? hiddenElementHeight / 2 : hiddenElementHeight;
      $(childELements).css({
        transition: 'none'
      });
      anime.remove(childELements);
      anime({
        targets: childELements,
        translateY: translateVal * -1,
        opacity: 1,
        easing: 'easeInOutQuint',
        duration: 650,
        delay: function delay(el, i, l) {
          return i * 60;
        },
        complete: function complete() {
          $(childELements).css({
            transition: ''
          });
        }
      });
    },
    onMouseLeave: function onMouseLeave() {
      var $hiddenElementChilds = $(this.getHiddenElementChilds());
      var $visibleElementChilds = $(this.getVisibleElementChilds());
      var hiddenChilds = this.getHiddenElementChilds();
      var visibleChilds = this.getVisibleElementChilds();
      var reversedHiddenChilds = hiddenChilds.reverse();
      var reversedVisbleChilds = visibleChilds.reverse();
      anime.remove(hiddenChilds);
      anime.remove(visibleChilds);
      $hiddenElementChilds.css({
        transition: 'none'
      });
      $visibleElementChilds.css({
        transition: 'none'
      });
      anime({
        targets: reversedHiddenChilds,
        translateY: 0,
        opacity: 0,
        easing: 'easeOutQuint',
        duration: 650,
        delay: function delay(el, i, l) {
          return i * 80;
        },
        complete: function complete() {
          $hiddenElementChilds.css({
            transition: ''
          });
        }
      });
      anime({
        targets: reversedVisbleChilds,
        translateY: 0,
        easing: 'easeOutQuint',
        duration: 650,
        delay: function delay(el, i, l) {
          return i * 80 + 160;
        },
        complete: function complete() {
          $visibleElementChilds.css({
            transition: ''
          });
        }
      });
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('slideelement-options');
      var opts = null;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-slideelement-onhover]').liquidSlideElement();
});
"use strict";

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidCounter';
  var defaults = {
    targetNumber: 0,
    startDelay: 0,
    blurEffect: false
  };

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.createMarkup();
      this.setupIntersectionObserver();
    },
    formatNumberWithCommas: function formatNumberWithCommas(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    formatNumberWithSpaces: function formatNumberWithSpaces(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    formatCounterAnimator: function formatCounterAnimator(number) {
      return number.toString().replace(/(\d)/g, '<span class="liquid-counter-animator"><span class="liquid-animator-value">$1</span></span>');
    },
    createMarkup: function createMarkup() {
      var self = this;
      var counter = $(self.element).children('span').not('.liquid-counter-element-hover');
      var options = self.options;
      var counterVal = options.targetNumber;
      var formatWithCommas = /,+/.test(counterVal);
      var formatWithSpaces = /\s+/.test(counterVal);
      if (formatWithCommas) counter.html(self.formatCounterAnimator(self.formatNumberWithCommas(counterVal)));else if (formatWithSpaces) counter.html(self.formatCounterAnimator(self.formatNumberWithSpaces(counterVal)));else counter.html(self.formatCounterAnimator(counterVal));
      counter.find('.liquid-counter-animator').each(function () {
        var animator = $(this);
        var animatorValue = animator.find('.liquid-animator-value').text();
        animator.append('<div class="liquid-animator-numbers" data-value="' + animatorValue + '">' + '<ul>' + '<li>0</li>' + '<li>1</li>' + '<li>2</li>' + '<li>3</li>' + '<li>4</li>' + '<li>5</li>' + '<li>6</li>' + '<li>7</li>' + '<li>8</li>' + '<li>9</li>' + '</ul>' + '</div>');
      });
    },
    addBlurEffect: function addBlurEffect(blurID) {
      if (this.options.blurEffect) {
        var ulElement = $('.liquid-animator-numbers ul', this.element);
        ulElement.each(function (i, element) {
          var ul = $(element);

          if (ul.parent().data('value') != 0) {
            ul.css({
              'filter': "url('#counter-blur-" + blurID + "')"
            });
          }
        });
      }
    },
    animateCounter: function animateCounter() {
      var self = this;
      var startDelay = self.options.startDelay;
      var counter = $(self.element);
      var blurID = anime.random(0, 100);
      var blurSVG = $('<svg class="counter-blur-svg" xmlns="http://www.w3.org/2000/svg" version="1.1" width="0" height="0">' + '<defs>' + '<filter id="counter-blur-' + blurID + '">' + "<feGaussianBlur id=\"counter-blur-filter-".concat(blurID, "\" in=\"SourceGraphic\" stdDeviation=\"0,0\" />") + '</filter>' + '</defs>' + '</svg>');
      self.addBlurEffect(blurID);
      counter.find('.liquid-animator-numbers').each(function () {
        var animator = $(this);
        var counterValue = parseInt(animator.data('value'), 10);
        var stdDeviation = {
          x: 0,
          y: 0
        };
        var blurFilter;
        anime({
          targets: animator.find('ul').get(0),
          translateY: counterValue * -10 + '%',
          easing: 'easeOutQuint',
          delay: startDelay,
          duration: 1200,
          complete: function complete() {
            counter.addClass('counter-animated');
          }
        });

        if (self.options.blurEffect) {
          anime({
            targets: stdDeviation,
            easing: 'easeOutQuint',
            duration: 1200,
            delay: startDelay,
            y: [50 + counterValue * 10, 0],
            round: 1,
            begin: function begin() {
              if (!$('.counter-blur-svg', self.element).length) blurSVG.appendTo(self.element);
              blurFilter = blurSVG.find("#counter-blur-filter-".concat(blurID)).get(0);
            },
            update: function update() {
              blurFilter.setAttribute('stdDeviation', '0,' + stdDeviation.y);

              if (stdDeviation.y <= 0) {
                blurSVG.remove();
                counter.find('ul').css('filter', '');
              }
            }
          });
        }
      });
    },
    setupIntersectionObserver: function setupIntersectionObserver() {
      var self = this;
      var element = self.element;

      var inViewCallback = function inViewCallback(enteries, observer) {
        enteries.forEach(function (entery) {
          if (entery.isIntersecting) {
            self.animateCounter();
            observer.unobserve(entery.target);
          }
        });
      };

      var observer = new IntersectionObserver(inViewCallback, {
        threshold: 0.8
      });
      var observerTarget = element;
      observer.observe(observerTarget);
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('counter-options');
      var opts = null;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-enable-counter]').liquidCounter();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidProgressbar';
  var defaults = {
    value: 0,
    suffix: null,
    prefix: null,
    orientation: "horizontal"
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.percentageElement = $('.liquid-progressbar-percentage', element);
      this.barElement = $('.liquid-progressbar-bar', element);
      this.titleElement = $('.liquid-progressbar-title', element);
      this.isRTL = $('html').attr('dir') == 'rtl';
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.addValue();
        this.addPrefixSuffix();
        this.setupIntersectionObserver();
      }
    }, {
      key: "addValue",
      value: function addValue() {
        this.valueEl = $('<span class="liquid-progressbar-value">0</span>');
        this.percentageElement.html('');
        this.valueEl.appendTo(this.percentageElement);
      }
    }, {
      key: "addPrefixSuffix",
      value: function addPrefixSuffix() {
        var self = this;
        var prefixOpt = self.options.prefix;
        var suffixOpt = self.options.suffix;
        var prefixEl = $('<span class="liquid-progressbar-prefix"></span>');
        var suffixEl = $('<span class="liquid-progressbar-suffix"></span>');
        if (prefixOpt) prefixEl.text(prefixOpt);
        if (suffixOpt) suffixEl.text(suffixOpt);
        prefixEl.prependTo(self.percentageElement);
        suffixEl.appendTo(self.percentageElement);
      }
    }, {
      key: "checkValuesEncountering",
      value: function checkValuesEncountering() {
        if (this.options.orientation == "horizontal" && this.titleElement.length) {
          var titleWidth = this.titleElement.width();
          var percentageOffsetLeft = this.percentageElement.offset().left || 0;
          var percentageWidth = this.percentageElement.width();
          var titleOffsetLeft = this.titleElement.offset().left || 0;

          if (!this.isRTL) {
            if (percentageOffsetLeft >= titleOffsetLeft + titleWidth) {
              this.$element.addClass('values-not-encountering');
            } else {
              this.$element.removeClass('values-not-encountering');
            }
          } else {
            if (percentageOffsetLeft + percentageWidth <= titleOffsetLeft) {
              this.$element.addClass('values-not-encountering');
            } else {
              this.$element.removeClass('values-not-encountering');
            }
          }
        } else {
          this.$element.addClass('values-not-encountering');
        }
      }
    }, {
      key: "setupIntersectionObserver",
      value: function setupIntersectionObserver() {
        var self = this;
        var element = self.element;

        var inViewCallback = function inViewCallback(enteries, observer) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              self.animatePercentage();
              self.animateProgressbar();
              observer.unobserve(entery.target);
            }
          });
        };

        var observer = new IntersectionObserver(inViewCallback, {
          threshold: 1
        });
        var observerTarget = element;
        observer.observe(observerTarget);
      }
    }, {
      key: "animatePercentage",
      value: function animatePercentage() {
        var self = this;
        var percentage = {
          value: 0
        };
        anime({
          targets: percentage,
          value: self.options.value,
          round: 1,
          duration: 1200,
          easing: 'easeInOutQuint',
          update: function update() {
            self.valueEl.text(percentage.value);
          }
        });
      }
    }, {
      key: "animateProgressbar",
      value: function animateProgressbar() {
        var self = this;
        var barElement = self.barElement.get(0);
        var value = self.options.value + '%';
        var orientation = self.options.orientation;

        if (orientation == "horizontal") {
          self.animateHorizontal(barElement, value);
        } else {
          self.initCircleProgressbar(value);
        }
      }
    }, {
      key: "animateHorizontal",
      value: function animateHorizontal(barElement, value) {
        var self = this;
        anime({
          targets: barElement,
          width: value,
          duration: 1200,
          easing: 'easeInOutQuint',
          update: function update() {
            self.checkValuesEncountering();
          }
        });
      }
    }, {
      key: "initCircleProgressbar",
      value: function initCircleProgressbar(value) {
        var circleContainer = $(this.element).find('.ld-prgbr-circle-container');
        var containerWidth = circleContainer.width();
        var numericVal = parseInt(value, 10);
        circleContainer.circleProgress({
          value: numericVal / 100,
          size: containerWidth,
          lineCap: 'round',
          startAngle: -Math.PI / 2
        });
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('progressbar-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-progressbar]').liquidProgressbar();
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
* Credits:
* http://www.codrops.com
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 
* Copyright 2016, Codrops
* http://www.codrops.com
*/
;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidReveal';
  var defaults = {
    // If true, then the content will be hidden until it´s "revealed".
    isContentHidden: true,
    // If true, animtion will be triggred only when element is in view
    animteWhenInView: true,
    delay: 0,
    // The animation/reveal settings. This can be set initially or passed when calling the reveal method.
    revealSettings: {
      // Animation direction: left right (lr) || right left (rl) || top bottom (tb) || bottom top (bt).
      direction: 'lr',
      // Revealer´s background color.
      bgcolor: '#f0f0f0',
      // Animation speed. This is the speed to "cover" and also "uncover" the element (seperately, not the total time).
      duration: 500,
      // Animation easing. This is the easing to "cover" and also "uncover" the element.
      easing: 'easeInOutQuint',
      // percentage-based value representing how much of the area should be left covered.
      coverArea: 0,
      // Callback for when the revealer is covering the element (halfway through of the whole animation).
      onCover: function onCover(contentEl, revealerEl) {
        return false;
      },
      // Callback for when the animation starts (animation start).
      onStart: function onStart(contentEl, revealerEl) {
        return false;
      },
      // Callback for when the revealer has completed uncovering (animation end).
      onComplete: function onComplete(contentEl, revealerEl) {
        return false;
      },
      onCoverAnimations: null
    }
  };

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this._layout();

      if (this.options.animteWhenInView) this.setIntersectionObserver();else this.doTheReveal();
    },
    _createDOMEl: function _createDOMEl(type, className, content) {
      var el = document.createElement(type);
      el.className = className || '';
      el.innerHTML = content || '';
      return el;
    },

    /**
    * Build the necessary structure.
    */
    _layout: function _layout() {
      var position = getComputedStyle(this.element).position;

      if (position !== 'fixed' && position !== 'absolute' && position !== 'relative') {
        this.element.style.position = 'relative';
      } // Content element.


      this.content = this._createDOMEl('div', 'block-revealer__content', this.element.innerHTML);

      if (this.options.isContentHidden && this.content.querySelector('figure')) {
        this.content.querySelector('figure').style.opacity = 0;
      } // Revealer element (the one that animates)


      this.revealer = this._createDOMEl('div', 'block-revealer__element');
      this.element.classList.add('block-revealer');
      this.element.innerHTML = '';
      this.element.appendChild(this.content);
      var parallaxElement = this.element.querySelector('[data-parallax=true]');

      if (_typeof(parallaxElement) !== _typeof(undefined) && parallaxElement !== null) {
        parallaxElement.appendChild(this.revealer);
      } else {
        this.element.appendChild(this.revealer);
      }
    },

    /**
    * Gets the revealer element´s transform and transform origin.
    */
    _getTransformSettings: function _getTransformSettings(direction) {
      var val, origin, origin_2;

      switch (direction) {
        case 'lr':
          val = 'scaleX(0)';
          origin = '0 50%';
          origin_2 = '100% 50%';
          break;

        case 'rl':
          val = 'scaleX(0)';
          origin = '100% 50%';
          origin_2 = '0 50%';
          break;

        case 'tb':
          val = 'scaleY(0)';
          origin = '50% 0';
          origin_2 = '50% 100%';
          break;

        case 'bt':
          val = 'scaleY(0)';
          origin = '50% 100%';
          origin_2 = '50% 0';
          break;

        default:
          val = 'scaleX(0)';
          origin = '0 50%';
          origin_2 = '100% 50%';
          break;
      }

      return {
        // transform value.
        val: val,
        // initial and halfway/final transform origin.
        origin: {
          initial: origin,
          halfway: origin_2
        }
      };
    },

    /**
    * Reveal animation. If revealSettings is passed, then it will overwrite the options.revealSettings.
    */
    reveal: function reveal(revealSettings) {
      // Do nothing if currently animating.
      if (this.isAnimating) {
        return false;
      }

      this.isAnimating = true; // Set the revealer element´s transform and transform origin.

      var defaults = {
        // In case revealSettings is incomplete, its properties deafault to:
        duration: 500,
        easing: 'easeInOutQuint',
        delay: parseInt(this.options.delay, 10) || 0,
        bgcolor: '#f0f0f0',
        direction: 'lr',
        coverArea: 0
      },
          revealSettings = revealSettings || this.options.revealSettings,
          direction = revealSettings.direction || defaults.direction,
          transformSettings = this._getTransformSettings(direction);

      this.revealer.style.WebkitTransform = this.revealer.style.transform = transformSettings.val;
      this.revealer.style.WebkitTransformOrigin = this.revealer.style.transformOrigin = transformSettings.origin.initial; // Set the Revealer´s background color.

      this.revealer.style.background = revealSettings.bgcolor || defaults.bgcolor; // Show it. By default the revealer element has opacity = 0 (CSS).

      this.revealer.style.opacity = 1; // Animate it.

      var self = this,
          // Second animation step.
      animationSettings_2 = {
        complete: function complete() {
          self.isAnimating = false;

          if (typeof revealSettings.onComplete === 'function') {
            revealSettings.onComplete(self.content, self.revealer);
          }

          $(self.element).addClass('revealing-ended').removeClass('revealing-started');
        }
      },
          // First animation step.
      animationSettings = {
        delay: revealSettings.delay || defaults.delay,
        complete: function complete() {
          self.revealer.style.WebkitTransformOrigin = self.revealer.style.transformOrigin = transformSettings.origin.halfway;

          if (typeof revealSettings.onCover === 'function') {
            revealSettings.onCover(self.content, self.revealer);
          }

          $(self.element).addClass('element-uncovered');
          anime(animationSettings_2);
        }
      };
      animationSettings.targets = animationSettings_2.targets = this.revealer;
      animationSettings.duration = animationSettings_2.duration = revealSettings.duration || defaults.duration;
      animationSettings.easing = animationSettings_2.easing = revealSettings.easing || defaults.easing;
      var coverArea = revealSettings.coverArea || defaults.coverArea;

      if (direction === 'lr' || direction === 'rl') {
        animationSettings.scaleX = [0, 1];
        animationSettings_2.scaleX = [1, coverArea / 100];
      } else {
        animationSettings.scaleY = [0, 1];
        animationSettings_2.scaleY = [1, coverArea / 100];
      }

      if (typeof revealSettings.onStart === 'function') {
        revealSettings.onStart(self.content, self.revealer);
      }

      $(self.element).addClass('revealing-started');
      anime(animationSettings);
    },
    animationPresets: function animationPresets() {},
    setIntersectionObserver: function setIntersectionObserver() {
      var self = this;
      var element = self.element;
      self.isIntersected = false;

      var inViewCallback = function inViewCallback(enteries, observer) {
        enteries.forEach(function (entery) {
          if (entery.isIntersecting && !self.isIntersected) {
            self.isIntersected = true;
            self.doTheReveal();
          }
        });
      };

      var observer = new IntersectionObserver(inViewCallback, {
        threshold: 0.5
      });
      observer.observe(element);
    },
    doTheReveal: function doTheReveal() {
      var onCoverAnimations = this.options.revealSettings.onCoverAnimations;
      var onCover = {
        onCover: function onCover(contentEl) {
          $('figure', contentEl).css('opacity', 1);

          if ($(contentEl).find('.ld-lazyload').length && window.liquidLazyload) {
            window.liquidLazyload.update();
          }

          if (onCoverAnimations) {
            var animations = $.extend({}, {
              targets: $('figure', contentEl).get(0)
            }, {
              duration: 800,
              easing: 'easeOutQuint'
            }, onCoverAnimations);
            anime(animations);
          }
        }
      };
      var options = $.extend(this.options, onCover);
      this.reveal(options);
      this.onReveal();
    },
    onReveal: function onReveal() {
      if ($(this.element).find('[data-responsive-bg]').length) {
        $(this.element).find('[data-responsive-bg]').liquidResponsiveBG();
      }
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('reveal-options');
      var opts = null;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-reveal]').filter(function (i, element) {
    var $element = $(element);
    var $fullpageSection = $element.closest('.vc_row.pp-section');
    return !$fullpageSection.length;
  }).liquidReveal();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidStickyRow';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.markupInitiated = false;
      this.$stickyWrap = null;
      this.$stickyWrapInner = null;
      this.boundingClientRect = null;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.initMarkup();
        this.handleSizes();
        this.addEvents();
        this.handleWindowResize();
      }
    }, {
      key: "initMarkup",
      value: function initMarkup() {
        if (this.markupInitiated) return false;
        var $stickyWrap = $('<div class="lqd-css-sticky-wrap pos-rel" />');
        var $stickyWrapInner = $('<div class="lqd-css-sticky-wrap-inner pos-abs" />');
        this.$element.wrap($stickyWrap).wrap($stickyWrapInner);
        this.$stickyWrapInner = this.$element.parent();
        this.$stickyWrap = this.$element.parent().parent();
        this.markupInitiated = true;
      }
    }, {
      key: "handleSizes",
      value: function handleSizes() {
        var $nextElements = this.$stickyWrap.nextAll();
        var elementHeight = this.$element.outerHeight();
        this.$stickyWrap.css({
          height: elementHeight
        });

        if ($nextElements.length) {
          var nextElementsHeight = 0;
          $.each($nextElements, function (i, nextElement) {
            nextElementsHeight += $(nextElement).outerHeight();
          });

          if (elementHeight > nextElementsHeight) {
            console.log(elementHeight - nextElementsHeight);
            this.$stickyWrapInner.css({
              height: "calc(200% - ".concat(nextElementsHeight, "px)")
            });
          }
        }
      }
    }, {
      key: "addEvents",
      value: function addEvents() {
        var e = new CustomEvent('lqd-sticky-row-initiated', {
          detail: {
            $element: this.$element
          }
        });
        this.element.dispatchEvent(e);
      }
    }, {
      key: "handleWindowResize",
      value: function handleWindowResize() {
        var resize = liquidDebounce(this.onWindowResize, 500);
        $(window).on('resize', resize.bind(this));
      }
    }, {
      key: "onWindowResize",
      value: function onWindowResize() {
        this.handleSizes();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('sticky-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if (liquidWindowWidth() <= liquidMobileNavBreakpoint() || liquidIsMobile()) return;
  $('.vc_row.lqd-css-sticky').liquidStickyRow();
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidParallax';
  var defaults = {
    duration: 1800,
    offset: 0,
    triggerHook: "onEnter",
    easing: 'linear',
    parallaxBG: false,
    scaleBG: true,
    overflowHidden: true
  };
  var defaultParallaxFrom = {};
  var defaultParallaxTo = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options, parallaxFrom, parallaxTo) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this.parallaxFromOptions = $.extend({}, defaultParallaxFrom, parallaxFrom);
      this.parallaxToOptions = $.extend({}, defaultParallaxTo, parallaxTo);
      this.isInitialized = false;
      this.parallaxElement = this.element;
      this.triggerElement = this.parallaxElement;
      this._defaults = defaults;
      this._name = pluginName;
      this.build();
    }

    _createClass(Plugin, [{
      key: "build",
      value: function build() {
        // if it's titlebar and it's on mobile, just add the classname to fade in the bg but don't initiate parallax bg
        if (liquidIsMobile() && this.options.parallaxBG && this.$element.is('.titlebar')) {
          this.$element.addClass('liquid-parallax-bg');
          return false;
        }

        if (this.$element.is('.vc_row') && this.$element.is('.vc_row:first-of-type') || this.$element.is('.titlebar') && this.options.parallaxBG) {
          if (this.$element.closest('.lqd-css-sticky').length || this.$element.is('.vc_row[data-pin]') || this.$element.is('.lqd-css-sticky')) {
            this.handleSentinel();
          }

          this.init();
          return false;
        }

        this.initIO();
      }
    }, {
      key: "setParallaxFromParams",
      value: function setParallaxFromParams() {
        var animeOpts = {
          targets: this.parallaxElement,
          duration: 0,
          easing: 'linear'
        };
        var prlxFromOpts = $.extend({}, this.parallaxFromOptions, animeOpts);
        anime(prlxFromOpts);
      }
    }, {
      key: "createSentinel",
      value: function createSentinel() {
        this.$sentinel = $('<div class="lqd-parallax-sentinel" />').appendTo('body');
      }
    }, {
      key: "handleSentinel",
      value: function handleSentinel() {
        this.createSentinel();
        this.positionSentinel();
        this.handleResize();
        this.triggerElement = this.$sentinel.get(0);
      }
    }, {
      key: "positionSentinel",
      value: function positionSentinel() {
        this.$sentinel.attr('style', '');
        this.$sentinel.css({
          width: this.$element.width(),
          height: this.$element.height(),
          top: this.$element.offset().top,
          left: this.$element.offset().left
        });
      }
    }, {
      key: "initParallax",
      value: function initParallax() {
        if (!this.$element.is('.wpb_column')) {
          var overflow = this.options.overflowHidden ? 'overflow-hidden' : '';
          this.$element.wrap("<div class=\"ld-parallax-wrap ".concat(overflow, "\" />"));
        }
      }
    }, {
      key: "initParallaxBG",
      value: function initParallaxBG() {
        var $videoBg = this.$element.children('.lqd-vbg-wrap');

        if (!this.element.hasAttribute('data-slideshow-bg') && !this.element.hasAttribute('data-row-bg') && !$videoBg.length) {
          this.createParallaxBgMarkup(); // this.triggerElement = this.parallaxElement = $('.liquid-parallax-figure', this.element).get(0);

          this.parallaxElement = $('.liquid-parallax-figure', this.element).get(0);
          return false;
        }

        if (this.element.hasAttribute('data-slideshow-bg')) {
          var slideshowWrap = $('.ld-slideshow-bg-wrap', this.element);
          var slideshowInner = $('.ld-slideshow-bg-inner', slideshowWrap);
          this.updateParallaxBgOptions(slideshowInner);
          this.parallaxElement = slideshowInner.get(0);
          this.$element.addClass('liquid-parallax-bg');
          return false;
        }

        if (this.element.hasAttribute('data-row-bg')) {
          var rowBGWrap = $('.row-bg-wrap', this.element);
          var rowBG = $('.row-bg', rowBGWrap);
          this.updateParallaxBgOptions(rowBG);
          this.parallaxElement = rowBG.get(0);
          this.$element.addClass('liquid-parallax-bg');
        }

        if ($videoBg.length) {
          this.updateParallaxBgOptions($videoBg.children());
          this.parallaxElement = $videoBg.children().get(0);
        }
      }
    }, {
      key: "createParallaxBgMarkup",
      value: function createParallaxBgMarkup() {
        var parallaxContainer = $('<div class="liquid-parallax-container"></div>');
        var parallaxFigure = $('<figure class="liquid-parallax-figure"></figure>');
        var elementBGImage = this.$element.css('background-image');
        var elementBGPos = this.$element.css('background-position');
        this.updateParallaxBgOptions(parallaxFigure);

        if (elementBGImage && elementBGImage != 'none') {
          parallaxFigure.css('background-image', elementBGImage);
          parallaxFigure.css('background-position', elementBGPos);
          this.$element.addClass('bg-none');
        }

        this.$element.addClass('liquid-parallax-bg');
        parallaxFigure.appendTo(parallaxContainer);
        parallaxContainer.prependTo(this.element);
      }
    }, {
      key: "updateParallaxBgOptions",
      value: function updateParallaxBgOptions($bgElement) {
        var translateY = this.$element.is('.vc_row') && !liquidIsMobile() ? '-30%' : '-20%';
        var height = this.$element.is('.vc_row') && !liquidIsMobile() ? '140%' : '120%';

        if (_typeof(this.parallaxFromOptions.translateY) === _typeof(undefined)) {
          this.parallaxFromOptions.translateY = translateY;
        }

        if (_typeof(this.parallaxToOptions.translateY) === _typeof(undefined)) {
          this.parallaxToOptions.translateY = '0%';
        }

        this.options.scaleBG && $bgElement.css('height', height);
      }
    }, {
      key: "createTimeline",
      value: function createTimeline() {
        var aniamteParams = $.extend({}, this.parallaxToOptions, {
          targets: this.parallaxElement,
          duration: this.options.duration,
          easing: this.options.easing,
          autoplay: false
        });
        var timeline = anime(aniamteParams);
        return timeline;
      }
    }, {
      key: "initIO",
      value: function initIO() {
        var _this = this;

        var parallaxBG = this.options.parallaxBG;
        var $pinnedParent = this.$element.closest('[data-pin]');
        var $cssStickyParent = this.$element.closest('.lqd-css-sticky');

        var inviewCallback = function inviewCallback(enteries) {
          enteries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (!_this.isInitialized) {
                _this.isInitialized = true;

                if (parallaxBG) {
                  _this.options.duration = entry.rootBounds.height + entry.boundingClientRect.height;
                }

                if ($pinnedParent.length || $cssStickyParent.length || _this.$element.is('.vc_row[data-pin]') || _this.$element.is('.lqd-css-sticky')) {
                  _this.handleSentinel();
                }

                _this.init();
              }

              $(_this.parallaxElement).addClass('will-change');
            } else {
              $(_this.parallaxElement).removeClass('will-change');
            }
          });
        };

        var observer = new IntersectionObserver(inviewCallback, {
          rootMargin: "7%"
        });
        observer.observe(this.element);
      }
    }, {
      key: "init",
      value: function init() {
        !this.options.parallaxBG && this.initParallax();
        this.options.parallaxBG && this.initParallaxBG();
        this.setParallaxFromParams();
        var controller = new ScrollMagic.Controller();
        var timeline = this.createTimeline();
        var newScene = new ScrollMagic.Scene({
          duration: timeline.duration,
          offset: this.options.offset,
          triggerHook: this.options.triggerHook
        });
        newScene.triggerElement(this.triggerElement);
        newScene.addTo(controller); // newScene.addIndicators();

        if (!this.$element.is('.vc_row') && !this.$element.is('.titlebar')) {
          this.$element.parent().addClass('parallax-applied');
        }

        newScene.on('progress', function (e) {
          timeline.seek(e.progress * timeline.duration);
        });
      }
    }, {
      key: "handleResize",
      value: function handleResize() {
        $(window).on('resize', this.onWindowResize.bind(this));
      }
    }, {
      key: "onWindowResize",
      value: function onWindowResize() {
        this.positionSentinel();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('parallax-options');
      var parallaxFrom = $(this).data('parallax-from');
      var parallaxTo = $(this).data('parallax-to');
      var opts = null;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions, parallaxFrom, parallaxTo);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts, parallaxFrom, parallaxTo));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if ($('body').hasClass('compose-mode')) return false;
  $('[data-parallax]').not('[data-pin]:not(.vc_row)').liquidParallax();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidAnimateOnScroll';
  var defaults = {
    offset: 0,
    triggerHook: "onLeave",
    easing: 'linear',
    staticSentinel: null,
    staticSentinelRel: 'closest'
  };
  var defaultAnimateFrom = {};
  var defaultAnimateTo = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options, animateFrom, animateTo) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this.animateFromOptions = $.extend({}, defaultAnimateFrom, animateFrom);
      this.animateToOptions = $.extend({}, defaultAnimateTo, animateTo);
      this.isInitialized = false;
      this.animateElement = this.element;
      this.triggerElement = this.getTriggerElement();
      this.elementOuterHeight = this.getElementOuterHeight();
      this._defaults = defaults;
      this._name = pluginName;
      this.build();
    }

    _createClass(Plugin, [{
      key: "build",
      value: function build() {
        this.initIO();
      }
    }, {
      key: "getTriggerElement",
      value: function getTriggerElement() {
        var options = this.options;

        if (!options.staticSentinel) {
          return this.animateElement;
        } else {
          return this.$element[options.staticSentinelRel](options.staticSentinel).get(0);
        }
      }
    }, {
      key: "getElementOuterHeight",
      value: function getElementOuterHeight() {
        return this.$element.outerHeight();
      }
    }, {
      key: "getElementOffset",
      value: function getElementOffset() {
        return this.$element.offset();
      }
    }, {
      key: "setAnimateFromParams",
      value: function setAnimateFromParams() {
        var animeOpts = {
          targets: this.animateElement,
          duration: 0,
          easing: 'linear'
        };
        var animateFromOpts = $.extend({}, this.animateFromOptions, animeOpts);
        anime(animateFromOpts);
      }
    }, {
      key: "createSentinel",
      value: function createSentinel() {
        this.$sentinel = $('<div class="lqd-animate-sentinel invisible pos-abs" />').appendTo('body');
      }
    }, {
      key: "handleSentinel",
      value: function handleSentinel() {
        this.createSentinel();
        this.positionSentinel();
        this.handleEvents();
        this.triggerElement = this.$sentinel.get(0);
      }
    }, {
      key: "positionSentinel",
      value: function positionSentinel() {
        if (!this.$sentinel) return false;
        this.$sentinel.attr('style', '');
        this.$sentinel.css({
          width: this.$element.width(),
          height: this.elementOuterHeight,
          top: this.getElementOffset().top,
          left: this.getElementOffset().left
        });
      }
    }, {
      key: "createTimeline",
      value: function createTimeline() {
        var aniamteParams = $.extend({}, this.animateToOptions, {
          targets: this.animateElement,
          duration: this.elementOuterHeight,
          easing: this.options.easing,
          autoplay: false
        });
        var timeline = anime(aniamteParams);
        return timeline;
      }
    }, {
      key: "initIO",
      value: function initIO() {
        var _this = this;

        var $pinnedParent = this.$element.closest('[data-pin]');
        var $cssStickyParent = this.$element.closest('.lqd-css-sticky');

        var inviewCallback = function inviewCallback(enteries) {
          enteries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (!_this.isInitialized) {
                _this.isInitialized = true;

                if (!_this.options.staticSentinel && ($pinnedParent.length || $cssStickyParent.length || _this.$element.is('.vc_row[data-pin]') || _this.$element.is('.vc_row.lqd-css-sticky'))) {
                  _this.handleSentinel();
                }

                _this.init();
              }

              $(_this.animateElement).addClass('will-change');
            } else {
              $(_this.animateElement).removeClass('will-change');
            }
          });
        };

        var observer = new IntersectionObserver(inviewCallback, {
          rootMargin: "3%"
        });
        observer.observe(this.element);
      }
    }, {
      key: "init",
      value: function init() {
        this.setAnimateFromParams();
        var controller = new ScrollMagic.Controller();
        var timeline = this.createTimeline();
        var newScene = new ScrollMagic.Scene({
          duration: timeline.duration,
          offset: this.options.offset,
          triggerHook: this.options.triggerHook
        });
        newScene.triggerElement(this.triggerElement);
        newScene.addTo(controller); // newScene.addIndicators();

        newScene.on('progress', function (e) {
          timeline.seek(e.progress * timeline.duration);
        });
      }
    }, {
      key: "handleEvents",
      value: function handleEvents() {
        $(window).on('load resize', this.positionSentinel.bind(this));
        this.element.addEventListener('lqd-sticky-row-initiated', this.positionSentinel.bind(this));
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var $this = $(this);
      var pluginOptions = $this.data('animate-options');
      var animateFrom = $this.data('animate-from');
      var animateTo = $this.data('animate-to');
      var opts = null;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions, animateFrom, animateTo);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts, animateFrom, animateTo));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if ($('body').hasClass('compose-mode')) return false;
  $('[data-animate-onscroll]').liquidAnimateOnScroll();
});
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidTransitionDelay';
  var defaults = {
    elements: null,
    startDelay: 0,
    delayBetween: 250,
    delayType: 'transition' // ['transition', 'animation']

  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.initIO();
    }

    _createClass(Plugin, [{
      key: "initIO",
      value: function initIO() {
        var _this = this;

        new IntersectionObserver(function (enteries, observer) {
          enteries.forEach(function (entry) {
            if (entry.isIntersecting) {
              _this.addDelays();

              observer.unobserve(entry.target);
            }
          });
        }).observe(this.element, {
          "rootMargin": '5%'
        });
      }
    }, {
      key: "addDelays",
      value: function addDelays() {
        var options = this.options;

        if (options.elements) {
          $.each($(options.elements, this.element), function (i, element) {
            var _$$css;

            var delay = i * options.delayBetween + options.startDelay;
            $(element).css((_$$css = {}, _defineProperty(_$$css, "-webkit-".concat(options.delayType, "-delay"), "".concat(delay, "ms")), _defineProperty(_$$css, "".concat(options.delayType, "-delay"), "".concat(delay, "ms")), _$$css));
          });
        }
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('delay-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-transition-delay=true]').liquidTransitionDelay();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidMasonry';
  var defaults = {
    layoutMode: 'packery',
    itemSelector: '.masonry-item',
    alignMid: false
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.onFilterChange = null;
      this.onLayoutComplete = null;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.onImagesLoad();
      }
    }, {
      key: "onImagesLoad",
      value: function onImagesLoad() {
        imagesLoaded(this.element, this.handleOnImagesLoaded.bind(this));
      }
    }, {
      key: "handleOnImagesLoaded",
      value: function handleOnImagesLoaded() {
        this.setStamps();
        this.initIsotope();
        this.onFilterChange = new CustomEvent('lqd-masonry-filter-change', {
          detail: {
            isotopeData: this.$element.data('isotope')
          }
        });
        this.onLayoutComplete = new CustomEvent('lqd-masonry-layout-complete', {
          detail: {
            isotopeData: this.$element.data('isotope')
          }
        });
        this.initFilters();
        this.eventHandlers();
      }
    }, {
      key: "initIsotope",
      value: function initIsotope() {
        var _this$options = this.options,
            layoutMode = _this$options.layoutMode,
            itemSelector = _this$options.itemSelector,
            stamp = _this$options.stamp;
        this.$element.isotope({
          layoutMode: layoutMode,
          itemSelector: itemSelector,
          stamp: stamp
        });
      }
    }, {
      key: "setStamps",
      value: function setStamps() {
        this.setAlignMidStamps();
      }
    }, {
      key: "setAlignMidStamps",
      value: function setAlignMidStamps() {
        var options = this.options;

        if (options.alignMid) {
          var items = $(options.itemSelector, this.element);
          var columnsCount = this.$element.attr('data-columns');
          var itemsHeights = [];
          var gridSizer = $('.grid-stamp', this.$element);
          $.each(items, function (i, item) {
            var $item = $(item);
            var height = $item.outerHeight();
            itemsHeights.push(height);
          });
          this.highestHeight = Math.max.apply(Math, itemsHeights);
          this.lowestHeight = Math.min.apply(Math, itemsHeights);

          if (columnsCount >= 3) {
            gridSizer.clone().insertBefore(items.eq(columnsCount - 1)).addClass('is-right');
            gridSizer = gridSizer.add('.grid-stamp', this.$element);
          }

          gridSizer.height(this.lowestHeight / 2);
          options.stamp = '.grid-stamp';
        }
      }
    }, {
      key: "initFilters",
      value: function initFilters() {
        var self = this;
        var options = self.options;
        var filtersID = options.filtersID;
        if (!filtersID) return;
        self.$element.isotope({
          filter: $('.active', $(filtersID)).attr('data-filter')
        });
        $(filtersID).on('click', 'li', function () {
          var filterElement = $(this);
          var filterValue = filterElement.attr('data-filter');
          filterElement.addClass('active').siblings().removeClass('active');
          self.$element.isotope({
            filter: filterValue
          });
        });
      }
    }, {
      key: "eventHandlers",
      value: function eventHandlers() {
        this.$element.on('arrangeComplete', this.handleArrangeComplete.bind(this));
        this.$element.on('layoutComplete', this.handleLayoutComplete.bind(this));
      }
    }, {
      key: "handleArrangeComplete",
      value: function handleArrangeComplete() {
        document.dispatchEvent(this.onFilterChange);
      }
    }, {
      key: "handleLayoutComplete",
      value: function handleLayoutComplete() {
        document.dispatchEvent(this.onLayoutComplete);
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('masonry-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-liquid-masonry]').liquidMasonry();
});
"use strict";

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidHover3d';
  var defaults = {};

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.build();
  }

  Plugin.prototype = {
    build: function build() {
      this.$icon = $(this.element);

      if (!this.$icon.length) {
        return;
      }

      this.width = this.$icon.outerWidth();
      this.height = this.$icon.outerHeight();
      this.maxRotation = 8;
      this.maxTranslation = 4;
      this.init();
      $(window).on('load resize', this.onWindowLoad.bind(this));
      this.$icon.addClass('hover-3d-applied');
    },
    init: function init() {
      this.eventHandlers();
    },
    onWindowLoad: function onWindowLoad() {
      this.width = this.$icon.outerWidth();
      this.height = this.$icon.outerHeight();
    },
    eventHandlers: function eventHandlers() {
      var self = this;
      self.$icon.on('mousemove', function (e) {
        self.hover.call(self, e);
      }).on('mouseleave', function (e) {
        self.leave.call(self, e);
      });
    },
    appleTvAnimate: function appleTvAnimate(element, config) {
      var rotate = "rotateX(" + config.xRotationPercentage * -1 * config.maxRotationX + "deg)" + " rotateY(" + config.yRotationPercentage * -1 * config.maxRotationY + "deg)";
      var translate = " translate3d(" + config.xTranslationPercentage * -1 * config.maxTranslationX + "px," + config.yTranslationPercentage * -1 * config.maxTranslationY + "px, 0px)";
      anime.remove(element.get(0)); // causing move issues 

      element.css({
        transition: 'all 0.25s ease-out',
        transform: rotate + translate
      }); // anime({
      // 	targets: element.get(0),
      // 	rotateX: -config.xRotationPercentage * config.maxRotationX,
      // 	rotateY: -config.yRotationPercentage * config.maxRotationY,
      // 	translateX: -config.xTranslationPercentage * config.maxTranslationX,
      // 	translateY: -config.yTranslationPercentage * config.maxTranslationY,
      // 	easing: 'easeOutQuint',
      // 	duration: 300
      // });
    },
    calculateRotationPercentage: function calculateRotationPercentage(offset, dimension) {
      return -2 / dimension * offset + 1;
    },
    calculateTranslationPercentage: function calculateTranslationPercentage(offset, dimension) {
      return -2 / dimension * offset + 1;
    },
    hover: function hover(e) {
      var that = this;
      var mouseOffsetInside = {
        x: e.pageX - this.$icon.offset().left,
        y: e.pageY - this.$icon.offset().top
      };
      that.$icon.addClass('mouse-in');
      var xRotationPercentage = this.calculateRotationPercentage(mouseOffsetInside.y, this.height);
      var yRotationPercentage = this.calculateRotationPercentage(mouseOffsetInside.x, this.width) * -1;
      var xTranslationPercentage = this.calculateTranslationPercentage(mouseOffsetInside.x, this.width);
      var yTranslationPercentage = this.calculateTranslationPercentage(mouseOffsetInside.y, this.height);
      this.$icon.find('[data-stacking-factor]').each(function (index, element) {
        var stackingFactor = $(element).attr('data-stacking-factor');
        that.appleTvAnimate($(element), {
          maxTranslationX: that.maxTranslation * stackingFactor,
          maxTranslationY: that.maxTranslation * stackingFactor,
          maxRotationX: that.maxRotation * stackingFactor,
          maxRotationY: that.maxRotation * stackingFactor,
          xRotationPercentage: xRotationPercentage,
          yRotationPercentage: yRotationPercentage,
          xTranslationPercentage: xTranslationPercentage,
          yTranslationPercentage: yTranslationPercentage
        });
      });
    },
    leave: function leave(e) {
      var that = this;
      that.$icon.removeClass('mouse-in');
      this.$icon.find('[data-stacking-factor]').each(function (index, element) {
        anime.remove(element);
        that.appleTvAnimate($(element), {
          maxTranslationX: 0,
          maxTranslationY: 0,
          maxRotationX: 0,
          maxRotationY: 0,
          xRotationPercentage: 0,
          yRotationPercentage: 0,
          xTranslationPercentage: 0,
          yTranslationPercentage: 0
        });
      });
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('hover3d-options');
      var opts = null;

      if (pluginOptions) {
        opts = $.extend(true, {}, options, pluginOptions);
      }

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, opts));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-hover3d=true]').filter(function (i, element) {
    return !$(element).closest('.tabs-pane').not('.active').length;
  }).liquidHover3d();
});
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidMap';
  var defaults = {
    address: '7420 Shore Rd, Brooklyn, NY 11209, USA',
    marker: 'assets/img/map-marker/marker-1.svg',
    style: 'wy',
    markers: null,
    className: 'map_marker',
    marker_option: 'image' // options: "image","html"

  };

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init(element, this.options);
  }

  function CustomMarker(latlng, map, className) {
    this.latlng_ = latlng;
    this.className = className; // Once the LatLng and text are set, add the overlay to the map.  This will
    // trigger a call to panes_changed which should in turn call draw.

    this.setMap(map);
  }

  if ((typeof google === "undefined" ? "undefined" : _typeof(google)) !== _typeof(undefined) && _typeof(google.maps) !== _typeof(undefined)) {
    CustomMarker.prototype = new google.maps.OverlayView();

    CustomMarker.prototype.draw = function () {
      var me = this; // Check if the div has been created.

      var div = this.div_,
          divChild,
          divChild2;

      if (!div) {
        // Create a overlay text DIV
        div = this.div_ = document.createElement('DIV');
        div.className = this.className;
        divChild = document.createElement("div");
        div.appendChild(divChild);
        divChild2 = document.createElement("div");
        div.appendChild(divChild2);
        google.maps.event.addDomListener(div, "click", function (event) {
          google.maps.event.trigger(me, "click");
        }); // Then add the overlay to the DOM

        var panes = this.getPanes();
        panes.overlayImage.appendChild(div);
      } // Position the overlay


      var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);

      if (point) {
        div.style.left = point.x + 'px';
        div.style.top = point.y + 'px';
      }
    };

    CustomMarker.prototype.remove = function () {
      // Check if the overlay was on the map and needs to be removed.
      if (this.div_) {
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
      }
    };

    CustomMarker.prototype.getPosition = function () {
      return this.latlng_;
    };
  }

  Plugin.prototype = {
    init: function init(element, options) {
      this.options = $.extend(true, {}, {
        map: {
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          scrollwheel: false
        }
      }, options);
      this.build();
      this.adjustHeight();
      return this;
    },
    styles: {
      "wy": [{
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [{
          "weight": "2.00"
        }]
      }, {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#9c9c9c"
        }]
      }, {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
          "color": "#f2f2f2"
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ffffff"
        }]
      }, {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ffffff"
        }]
      }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "road",
        "elementType": "all",
        "stylers": [{
          "saturation": -100
        }, {
          "lightness": 45
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#eeeeee"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#7b7b7b"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#ffffff"
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [{
          "visibility": "simplified"
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
          "color": "#46bcec"
        }, {
          "visibility": "on"
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#c8d7d4"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "color": "#070707"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "color": "#ffffff"
        }]
      }],
      "blueEssence": [{
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#e0efef"
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{
          "visibility": "on"
        }, {
          "hue": "#1900ff"
        }, {
          "color": "#c0e8e8"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "lightness": 100
        }, {
          "visibility": "simplified"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
          "visibility": "on"
        }, {
          "lightness": 700
        }]
      }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
          "color": "#7dcdcd"
        }]
      }],
      "lightMonochrome": [{
        "featureType": "administrative.locality",
        "elementType": "all",
        "stylers": [{
          "hue": "#2c2e33"
        }, {
          "saturation": 7
        }, {
          "lightness": 19
        }, {
          "visibility": "on"
        }]
      }, {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [{
          "hue": "#ffffff"
        }, {
          "saturation": -100
        }, {
          "lightness": 100
        }, {
          "visibility": "simplified"
        }]
      }, {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [{
          "hue": "#ffffff"
        }, {
          "saturation": -100
        }, {
          "lightness": 100
        }, {
          "visibility": "off"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "hue": "#bbc0c4"
        }, {
          "saturation": -93
        }, {
          "lightness": 31
        }, {
          "visibility": "simplified"
        }]
      }, {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [{
          "hue": "#bbc0c4"
        }, {
          "saturation": -93
        }, {
          "lightness": 31
        }, {
          "visibility": "on"
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "labels",
        "stylers": [{
          "hue": "#bbc0c4"
        }, {
          "saturation": -93
        }, {
          "lightness": -2
        }, {
          "visibility": "simplified"
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
          "hue": "#e9ebed"
        }, {
          "saturation": -90
        }, {
          "lightness": -8
        }, {
          "visibility": "simplified"
        }]
      }, {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [{
          "hue": "#e9ebed"
        }, {
          "saturation": 10
        }, {
          "lightness": 69
        }, {
          "visibility": "on"
        }]
      }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
          "hue": "#e9ebed"
        }, {
          "saturation": -78
        }, {
          "lightness": 67
        }, {
          "visibility": "simplified"
        }]
      }],
      "assassinsCreedIV": [{
        "featureType": "all",
        "elementType": "all",
        "stylers": [{
          "visibility": "on"
        }]
      }, {
        "featureType": "all",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }, {
          "saturation": "-100"
        }]
      }, {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{
          "saturation": 36
        }, {
          "color": "#000000"
        }, {
          "lightness": 40
        }, {
          "visibility": "off"
        }]
      }, {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "off"
        }, {
          "color": "#000000"
        }, {
          "lightness": 16
        }]
      }, {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 20
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 17
        }, {
          "weight": 1.2
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 20
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#4d6059"
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#4d6059"
        }]
      }, {
        "featureType": "landscape.natural",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#4d6059"
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
          "lightness": 21
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#4d6059"
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#4d6059"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#7f8d89"
        }, {
          "lightness": 17
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#7f8d89"
        }, {
          "lightness": 29
        }, {
          "weight": 0.2
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 18
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 16
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#7f8d89"
        }]
      }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
          "color": "#000000"
        }, {
          "lightness": 19
        }]
      }, {
        "featureType": "water",
        "elementType": "all",
        "stylers": [{
          "color": "#2b3638"
        }, {
          "visibility": "on"
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#2b3638"
        }, {
          "lightness": 17
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#24282b"
        }]
      }, {
        "featureType": "water",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#24282b"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      }],
      "unsaturatedBrowns": [{
        "elementType": "geometry",
        "stylers": [{
          "hue": "#ff4400"
        }, {
          "saturation": -68
        }, {
          "lightness": -4
        }, {
          "gamma": 0.72
        }]
      }, {
        "featureType": "road",
        "elementType": "labels.icon"
      }, {
        "featureType": "landscape.man_made",
        "elementType": "geometry",
        "stylers": [{
          "hue": "#0077ff"
        }, {
          "gamma": 3.1
        }]
      }, {
        "featureType": "water",
        "stylers": [{
          "hue": "#00ccff"
        }, {
          "gamma": 0.44
        }, {
          "saturation": -33
        }]
      }, {
        "featureType": "poi.park",
        "stylers": [{
          "hue": "#44ff00"
        }, {
          "saturation": -23
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [{
          "hue": "#007fff"
        }, {
          "gamma": 0.77
        }, {
          "saturation": 65
        }, {
          "lightness": 99
        }]
      }, {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "gamma": 0.11
        }, {
          "weight": 5.6
        }, {
          "saturation": 99
        }, {
          "hue": "#0091ff"
        }, {
          "lightness": -86
        }]
      }, {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [{
          "lightness": -48
        }, {
          "hue": "#ff5e00"
        }, {
          "gamma": 1.2
        }, {
          "saturation": -23
        }]
      }, {
        "featureType": "transit",
        "elementType": "labels.text.stroke",
        "stylers": [{
          "saturation": -64
        }, {
          "hue": "#ff9100"
        }, {
          "lightness": 16
        }, {
          "gamma": 0.47
        }, {
          "weight": 2.7
        }]
      }],
      "classic": [{
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [{
          "visibility": "simplified"
        }, {
          "hue": "#ff0000"
        }]
      }]
    },
    build: function build() {
      var opts = this.options,
          self = this,
          container = $(this.element),
          mapOpts = opts.map; // inizialize the map

      mapOpts.styles = this.styles[opts.style];
      var map = new google.maps.Map(container.get(0), mapOpts);
      map.zoom = this.options.map.zoom || 16;
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        "address": opts.address
      }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var result = results[0].geometry.location,
              latitude = results[0].geometry.location.lat(),
              longitude = results[0].geometry.location.lng(),
              marker;

          if (self.options.marker_option == 'html') {
            $(container).addClass('marker-html');
          }

          if (self.options.markers == null) {
            if (self.options.marker_option == 'image') {
              marker = new google.maps.Marker({
                position: result,
                map: map,
                visible: true,
                icon: opts.marker,
                zIndex: 9999999
              });
            } else {
              marker = new CustomMarker(result, map, self.options.className);
            }
          } else {
            for (var i = 0; i < self.options.markers.length; i++) {
              if (self.options.marker_option == 'image') {
                marker = new google.maps.Marker({
                  position: new google.maps.LatLng(self.options.markers[i][0], self.options.markers[i][1]),
                  map: map,
                  visible: true,
                  icon: opts.marker,
                  zIndex: 9999999
                });
              } else {
                marker = new CustomMarker(new google.maps.LatLng(self.options.markers[i][0], self.options.markers[i][1]), map, self.options.className);
              }
            }
          } //center map on location


          map.setCenter(new google.maps.LatLng(latitude, longitude));
          $('.lightbox-link[data-type=inline]').on('mfpOpen', function (e) {
            setTimeout(function () {
              map.setCenter(new google.maps.LatLng(latitude, longitude));
            }, 500);
          });
          $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
            setTimeout(function () {
              map.setCenter(new google.maps.LatLng(latitude, longitude));
            }, 500);
          });
        }
      });
      $(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
        setTimeout(function () {
          google.maps.event.trigger(map, 'resize');
        }, 500);
      });
      return this;
    },
    adjustHeight: function adjustHeight() {
      var $element = $(this.element);
      var $parent = $element.parent('.ld-gmap-container');
      var $vcRowParent = $parent.parents('.vc_row').last();

      if (!$parent.siblings().length && $vcRowParent.hasClass('vc_row-o-equal-height')) {
        $parent.height($parent.parent().outerHeight());
      }
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if ((typeof google === "undefined" ? "undefined" : _typeof(google)) !== (typeof undefined === "undefined" ? "undefined" : _typeof(undefined)) && google !== null) {
    $('[data-plugin-map]').liquidMap();
  }
});
"use strict";

/**
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2017, Codrops
 * http://www.codrops.com
 */
;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidDynamicShape';
  var defaults = {};

  function Plugin(element, options) {
    this.element = element;
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function init() {
      this.DOM = {};
      this.DOM.el = this.element;
      this.DOM.pathEl = this.DOM.el.querySelector('path');
      this.paths = this.DOM.pathEl.getAttribute('pathdata:id').split(';');
      this.paths.splice(this.paths.length, 0, this.DOM.pathEl.getAttribute('d'));
      this.win = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      this.animate();
      this.initEvents();
    },
    lineEq: function lineEq(y2, y1, x2, x1, currentVal) {
      // y = mx + b
      var m = (y2 - y1) / (x2 - x1);
      var b = y1 - m * x1;
      return m * currentVal + b;
    },
    getMousePos: function getMousePos(e) {
      var posx = 0;
      var posy = 0;

      if (!e) {
        var _e = window.event;
      }

      ;

      if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
      } else if (e.clientX || e.clientY) {
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      return {
        x: posx,
        y: posy
      };
    },
    animate: function animate() {
      anime.remove(this.DOM.pathEl);
      anime({
        targets: this.DOM.pathEl,
        duration: 10000,
        easing: 'cubicBezier(0.5, 0, 0.5, 1)',
        d: this.paths,
        loop: true
      });
    },
    initEvents: function initEvents() {
      var _this = this;

      // Mousemove event / Tilt functionality.
      var tilt = {
        tx: this.win.width / 8,
        ty: this.win.height / 4,
        rz: 45,
        sx: [0.8, 2],
        sy: [0.8, 2]
      }; // Window resize.

      var onResizeFn = liquidDebounce(function () {
        return _this.win = {
          width: window.innerWidth,
          height: window.innerHeight
        };
      }, 20);
      window.addEventListener('resize', function (ev) {
        return onResizeFn.bind(_this);
      });
    }
  };

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('mi-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-dynamic-shape]').filter(function (i, element) {
    var $element = $(element);
    var $fullpageSection = $element.closest('.vc_row.pp-section');
    return !$fullpageSection.length;
  }).liquidDynamicShape();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidBlurImage';
  var defaults = {
    imgSrc: 'backgroundImage',
    // 'backgroundImage', 'imgSrc'
    radius: 10,
    duration: 200,
    handlerElement: 'self',
    handlerRel: null,
    blurHandlerOn: 'static',
    blurHandlerOff: null
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.currentBlurVal = 0;
      this.sourceImage = null;
      this.targetCanvas = null;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.onImageLoad();
      }
    }, {
      key: "onImageLoad",
      value: function onImageLoad() {
        var _this = this;

        var imgLoad = imagesLoaded(this.element, {
          background: true
        });
        imgLoad.on('done', function () {
          _this.initMarkup();

          _this.options.blurHandlerOn === 'static' && _this.initBlur();

          _this.eventHandlers();
        });
      }
    }, {
      key: "getImageSource",
      value: function getImageSource() {
        var element = $(this.element);
        var options = this.options;
        return options.imgSrc == 'backgroundImage' ? element.css('backgroundImage').slice(4, -1).replace(/"/g, "") : element.children('img').attr('src');
      }
    }, {
      key: "createImage",
      value: function createImage() {
        var imageID = "lqd-blur-img-".concat(Math.floor(Math.random() * 1000000));
        var img = $("<img class=\"blur-main-image invisible\" id=\"".concat(imageID, "\" alt=\"Blur Image\" />"));
        img.attr('src', this.getImageSource());
        return img;
      }
    }, {
      key: "createContainer",
      value: function createContainer() {
        var container = $('<div class="blur-image-container" />');
        var inner = $('<div class="blur-image-inner" />');
        return container.append(inner);
      }
    }, {
      key: "createCanvas",
      value: function createCanvas() {
        var canvasID = "lqd-blur-canvas-".concat(Math.floor(Math.random() * 1000000));
        var canvas = $("<canvas class=\"blur-image-canvas\" id=\"blur-image-canvas-".concat(canvasID, "\" />"));
        return canvas;
      }
    }, {
      key: "initMarkup",
      value: function initMarkup() {
        var img = this.createImage();
        var blurImgContainer = this.createContainer();
        var inner = blurImgContainer.find('.blur-image-inner');
        var canvas = this.createCanvas();
        inner.append(img).append(canvas);
        blurImgContainer.prependTo(this.element);
        this.sourceImage = img;
        this.targetCanvas = canvas;
      }
    }, {
      key: "initBlur",
      value: function initBlur(radius) {
        var imageID = this.sourceImage.attr('id');
        var canvasID = this.targetCanvas.attr('id');
        var blurRadius = radius || this.options.radius;
        stackBlurImage(imageID, canvasID, blurRadius, false);
      }
    }, {
      key: "eventHandlers",
      value: function eventHandlers() {
        var options = this.options;
        var handlerElement = options.handlerElement == 'self' ? this.$element : options.handlerElement;
        var handlerRel = options.handlerRel;
        var onHandler = options.blurHandlerOn;
        var offHandler = options.blurHandlerOff;

        if (onHandler != 'static' && handlerRel != null) {
          this.$element[handlerRel](handlerElement).on(onHandler, this.onHandler.bind(this));
        }

        if (offHandler != null && handlerRel != null) {
          this.$element[handlerRel](handlerElement).on(offHandler, this.offHandler.bind(this));
        }
      }
    }, {
      key: "onHandler",
      value: function onHandler() {
        this.blurImage();
      }
    }, {
      key: "blurImage",
      value: function blurImage() {
        var _this2 = this;

        var radius = {
          radius: this.currentBlurVal
        };
        var blurRadius = this.options.radius;
        var imageID = this.sourceImage.attr('id');
        var canvasID = this.targetCanvas.attr('id');
        anime.remove(radius);
        anime({
          targets: radius,
          radius: blurRadius,
          easing: 'linear',
          duration: this.options.duration,
          round: 1,
          update: function update(e) {
            _this2.currentBlurVal = e.animatables[0].target.radius;
            stackBlurImage(imageID, canvasID, e.animatables[0].target.radius, false);
          }
        });
      }
    }, {
      key: "offHandler",
      value: function offHandler() {
        this.unblurImage();
      }
    }, {
      key: "unblurImage",
      value: function unblurImage() {
        var _this3 = this;

        var radius = {
          radius: this.currentBlurVal
        };
        var imageID = this.sourceImage.attr('id');
        var canvasID = this.targetCanvas.attr('id');
        anime.remove(radius);
        anime({
          targets: radius,
          radius: 0,
          easing: 'linear',
          duration: this.options.duration,
          round: 1,
          update: function update(e) {
            _this3.currentBlurVal = e.animatables[0].target.radius;
            stackBlurImage(imageID, canvasID, e.animatables[0].target.radius, false);
          }
        });
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('blur-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-liquid-blur=true]').filter(function (i, el) {
    return !$(el).is('[data-responsive-bg]');
  }).liquidBlurImage();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidIconboxCircle';
  var defaults = {
    startAngle: 45,
    itemSelector: '.one-ib-circ-icn',
    contentsContainer: '.one-ib-circ-inner'
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.$parent = $(this.options.contentsContainer);
      this.$items = $(this.options.itemSelector, this.element);
      this.anglesArray = [this.options.startAngle];
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.addAngles(this.$items);
        this.setTransformOrigin();
        this.setIntersectionObserver();
        this.windowResize();
      }
    }, {
      key: "getItemsArray",
      value: function getItemsArray() {
        var $items = this.$items;
        var itemsLength = $items.length;
        var itemsArray = [];

        for (var i = 0; i < itemsLength; i++) {
          itemsArray.push($items[i]);
        }

        return itemsArray;
      }
    }, {
      key: "getElementDimension",
      value: function getElementDimension($element) {
        return {
          width: $element.width(),
          height: $element.height()
        };
      }
    }, {
      key: "addAngles",
      value: function addAngles($elements) {
        var _this = this;

        var elementsLength = $elements.length;
        $elements.each(function (i) {
          _this.anglesArray.push(360 / elementsLength + _this.anglesArray[i]);
        });
      }
    }, {
      key: "setTransformOrigin",
      value: function setTransformOrigin() {
        var _this2 = this;

        var parentDimensions = this.getElementDimension(this.$parent);
        this.$items.each(function (i, element) {
          var $element = $(element);
          $element.css({
            transformOrigin: ''
          });
          $element.css({
            transformOrigin: "".concat(parentDimensions.width / 2, "px ").concat(parentDimensions.height / 2, "px")
          });
          $element.children().css({
            transform: "rotate(".concat(_this2.anglesArray[i] * -1, "deg)")
          });
        });
      }
    }, {
      key: "setIntersectionObserver",
      value: function setIntersectionObserver() {
        var _this3 = this;

        new IntersectionObserver(function (enteries, observer) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this3.animateIcons();

              observer.unobserve(entery.target);
            }
          });
        }, {
          threshold: 0.25
        }).observe(this.element);
      }
    }, {
      key: "animateIcons",
      value: function animateIcons() {
        var _this4 = this;

        var icons = this.getItemsArray();
        anime({
          targets: icons,
          opacity: {
            value: 1,
            duration: 200,
            easing: 'linear',
            delay: function delay(el, i) {
              return i * 220;
            }
          },
          duration: 850,
          easing: 'easeOutQuint',
          rotate: function rotate(el, i) {
            return _this4.anglesArray[i];
          },
          delay: function delay(el, i) {
            return i * 150;
          }
        });
      }
    }, {
      key: "windowResize",
      value: function windowResize() {
        $(window).on('resize', this.setTransformOrigin.bind(this));
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-spread-incircle]').liquidIconboxCircle();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidTextRotator';
  var defaults = {
    delay: 2000,
    activeKeyword: 0,
    duration: 800,
    easing: 'easeInOutCirc'
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.$keywordsContainer = $('.txt-rotate-keywords', this.element);
      this.$keywords = $('.keyword', this.$keywordsContainer);
      this.keywordsLength = this.$keywords.length;
      this.$activeKeyword = this.$keywords.eq(this.options.activeKeyword);
      this.isFirstItterate = true;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.setContainerWidth(this.$activeKeyword);
        this.setIntersectionObserver();
        this.$element.addClass('text-rotator-activated');
      }
    }, {
      key: "getNextKeyword",
      value: function getNextKeyword() {
        return this.$activeKeyword.next().length ? this.$activeKeyword.next() : this.$keywords.eq(0);
      }
    }, {
      key: "setContainerWidth",
      value: function setContainerWidth($keyword) {
        this.$keywordsContainer.addClass('is-changing ws-nowrap');
        var keywordContainer = this.$keywordsContainer.get(0);
        anime.remove(keywordContainer);
        anime({
          targets: keywordContainer,
          width: $keyword.outerWidth() + 1,
          duration: this.options.duration / 1.25,
          easing: this.options.easing
        });
      }
    }, {
      key: "setActiveKeyword",
      value: function setActiveKeyword($keyword) {
        this.$activeKeyword = $keyword;
        $keyword.addClass('active').siblings().removeClass('active');
      }
    }, {
      key: "slideInNextKeyword",
      value: function slideInNextKeyword() {
        var _this = this;

        var $nextKeyword = this.getNextKeyword();
        this.$activeKeyword.addClass('will-change');
        anime.remove($nextKeyword.get(0));
        anime({
          targets: $nextKeyword.get(0),
          translateY: function translateY() {
            return !liquidIsMobile() && ['65%', '0%'];
          },
          // translateZ: [-120, 0],
          rotateX: function rotateX() {
            return !liquidIsMobile() && [-95, -1];
          },
          opacity: [0, 1],
          duration: this.options.duration,
          easing: this.options.easing,
          delay: this.isFirstItterate ? this.options.delay / 2 : this.options.delay,
          changeBegin: function changeBegin() {
            _this.isFirstItterate = false;

            _this.setContainerWidth($nextKeyword);

            _this.slideOutAciveKeyword();
          },
          complete: function complete() {
            _this.$keywordsContainer.removeClass('is-changing ws-nowrap');

            _this.setActiveKeyword($nextKeyword);

            _this.$keywords.removeClass('is-next will-change');

            _this.getNextKeyword().addClass('is-next will-change');
          }
        });
      }
    }, {
      key: "slideOutAciveKeyword",
      value: function slideOutAciveKeyword() {
        var _this2 = this;

        var activeKeyword = this.$activeKeyword.get(0);
        anime.remove(activeKeyword);
        anime({
          targets: activeKeyword,
          translateY: function translateY() {
            return !liquidIsMobile() && ['0%', '-65%'];
          },
          // translateZ: [0, -120],
          rotateX: function rotateX() {
            return !liquidIsMobile() && [1, 95];
          },
          opacity: [1, 0],
          duration: this.options.duration,
          easing: this.options.easing,
          complete: function complete() {
            _this2.slideInNextKeyword();
          }
        });
      }
    }, {
      key: "initAnimations",
      value: function initAnimations() {
        this.slideInNextKeyword();
      }
    }, {
      key: "setIntersectionObserver",
      value: function setIntersectionObserver() {
        var _this3 = this;

        var inViewCallback = function inViewCallback(enteries, observer) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this3.initAnimations();

              observer.unobserve(entery.target);
            }
          });
        };

        var observer = new IntersectionObserver(inViewCallback);
        observer.observe(this.element);
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-text-rotator]').filter(function (i, element) {
    return !$(element).parents('[data-custom-animations]').length && !$(element).is('[data-custom-animations]') && !$(element).is('[data-split-text]');
  }).liquidTextRotator();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidCountdown';
  var defaults = {
    daysLabel: "Days",
    hoursLabel: "Hours",
    minutesLabel: "Minutes",
    secondsLabel: "Seconds",
    timezone: null
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        var self = this,
            el = $(self.element),
            options = self.options,
            targetTime = options.until,
            opTimeZone = options.timezone;
        console.log(targetTime);
        console.log(targetTime.replace(/-/g, "/"));
        $(el).countdown({
          until: new Date(targetTime.replace(/-/g, "/")),
          padZeroes: true,
          timezone: opTimeZone,
          // Have to specify the layout due to errors on mobile devices
          layout: '<span class="countdown-row">' + '<span class="countdown-section">' + '<span class="countdown-amount">{dn}</span>' + '<span class="countdown-period">' + options.daysLabel + '</span>' + '</span>' + '<span class="countdown-sep">:</span>' + '<span class="countdown-section">' + '<span class="countdown-amount">{hn}</span>' + '<span class="countdown-period">' + options.hoursLabel + '</span>' + '</span>' + '<span class="countdown-sep">:</span>' + '<span class="countdown-section">' + '<span class="countdown-amount">{mn}</span>' + '<span class="countdown-period">' + options.minutesLabel + '</span>' + '</span>' + '<span class="countdown-sep">:</span>' + '<span class="countdown-section">' + '<span class="countdown-amount">{sn}</span>' + '<span class="countdown-period">' + options.secondsLabel + '</span>' + '</span>' + '</span>'
        });
        return this;
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('countdown-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-plugin-countdown=true]').liquidCountdown();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidAjaxLoadMore';
  var defaults = {
    trigger: "inview" // "inview", "click"

  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.observer = null;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        var trigger = this.options.trigger;
        trigger == 'inview' && this.setupIntersectionObserver();
        trigger == 'click' && this.onClick();
      }
    }, {
      key: "onClick",
      value: function onClick() {
        this.$element.on('click', this.loadItems.bind(this));
      }
    }, {
      key: "setupIntersectionObserver",
      value: function setupIntersectionObserver() {
        var _this = this;

        ;
        this.observer = new IntersectionObserver(function (enteries) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this.loadItems();
            }
          });
        }, {
          threshold: [1]
        });
        this.observer.observe(this.element);
      }
    }, {
      key: "loadItems",
      value: function loadItems(event) {
        event && event.preventDefault();
        var self = this;
        var options = self.options;
        var target = self.$element.attr('href'); // Loading State

        self.$element.addClass('items-loading'); // Load Items

        $.ajax({
          type: 'GET',
          url: target,
          error: function error(MLHttpRequest, textStatus, errorThrown) {
            alert(errorThrown);
          },
          success: function success(data) {
            var $data = $(data);
            var $newItemsWrapper = $data.find(options.wrapper);
            var $newItems = $newItemsWrapper.find(options.items);
            var $wrapper = $(options.wrapper);
            var nextPageUrl = $data.find('[data-ajaxify=true]').attr('href'); // Add New Items on imagesLoaded

            $newItems.imagesLoaded(function () {
              if (nextPageUrl && target != nextPageUrl) {
                self.$element.attr('href', nextPageUrl);
              } else {
                self.observer && self.observer.unobserve(self.element);
                self.$element.removeClass('items-loading').addClass('all-items-loaded');
              } // Append new items


              $newItems.appendTo($wrapper);
              $wrapper.get(0).hasAttribute('data-liquid-masonry') && $wrapper.isotope('appended', $newItems); // Calling function for the new items

              self.onSuccess($wrapper);
            });
          }
        });
      }
    }, {
      key: "onSuccess",
      value: function onSuccess($wrapper) {
        if (!$('body').hasClass('lazyload-enabled')) {
          $('[data-responsive-bg=true]', $wrapper).liquidResponsiveBG();
        }

        if ($('body').hasClass('lazyload-enabled')) {
          window.liquidLazyload = new LazyLoad({
            elements_selector: '.ld-lazyload',
            callback_loaded: function callback_loaded(e) {
              $(e).closest('[data-responsive-bg=true]').liquidResponsiveBG();
              $(e).parent().not('#wrap, #content').addClass('loaded');
            }
          });
        }

        $('[data-split-text]', $wrapper).filter(function (i, element) {
          return !$(element).parents('[data-custom-animations]').length && !element.hasAttribute('data-custom-animations');
        }).liquidSplitText();
        $('[data-fittext]', $wrapper).liquidFitText();
        $('[data-custom-animations]', $wrapper).map(function (i, element) {
          var $element = $(element);
          var $customAnimationParent = $element.parents('.wpb_wrapper[data-custom-animations]');

          if ($customAnimationParent.length) {
            $element.removeAttr('data-custom-animations');
            $element.removeAttr('data-ca-options');
          }
        });
        $('[data-custom-animations]', $wrapper).filter(function (i, element) {
          var $element = $(element);
          var $rowBgparent = $element.closest('.vc_row[data-row-bg]');
          var $slideshowBgParent = $element.closest('.vc_row[data-slideshow-bg]');
          return !$rowBgparent.length && !$slideshowBgParent.length;
        }).liquidCustomAnimations();
        $('[data-lqd-flickity]', $wrapper).liquidCarousel();
        $('[data-parallax]', $wrapper).liquidParallax();
        $('[data-hover3d=true]', $wrapper).liquidHover3d();
        this.$element.removeClass('items-loading');
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('ajaxify-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if ($('body').hasClass('compose-mode')) return false;
  $('[data-ajaxify=true]').liquidAjaxLoadMore();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidStickyFooter';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.$window = $(window);
      this.$contentsContainer = $('main#content');
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.$element.outerHeight() < this.$contentsContainer.outerHeight() && this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        var _this = this;

        this.$element.imagesLoaded(function () {
          _this._addWrapper();

          _this._addSentinel();

          _this._setupSentinelIO();

          _this._setupFooterIO();

          _this._handleResize();
        });
      }
    }, {
      key: "_addWrapper",
      value: function _addWrapper() {
        this.$element.wrap('<div class="lqd-sticky-footer-wrap" />');
      }
    }, {
      key: "_addSentinel",
      value: function _addSentinel() {
        var sentinel = $('<div class="lqd-sticky-footer-sentinel" />');
        this.$sentinel = sentinel.insertBefore(this.element);
      }
    }, {
      key: "_getFooterHeight",
      value: function _getFooterHeight() {
        return this.$element.outerHeight();
      }
    }, {
      key: "_setupSentinelIO",
      value: function _setupSentinelIO() {
        var _this2 = this;

        var inViewCallback = function inViewCallback(enteries) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this2.$element.addClass('is-inview');

              _this2.$window.addClass('footer-is-inview');
            } else {
              _this2.$element.removeClass('is-inview');

              _this2.$window.removeClass('footer-is-inview');
            }
          });
        };

        var observer = new IntersectionObserver(inViewCallback, {
          rootMargin: '150px'
        });
        observer.observe(this.$sentinel.get(0));
      }
    }, {
      key: "_setupFooterIO",
      value: function _setupFooterIO() {
        var _this3 = this;

        var heightApplied = false;
        this.$element.siblings('.lqd-sticky-footer-sentinel').css('height', '').removeClass('height-applied');

        var inViewCallback = function inViewCallback(enteries) {
          enteries.forEach(function (entery) {
            var rootBounds = entery.rootBounds,
                boundingClientRect = entery.boundingClientRect;

            if (!heightApplied && boundingClientRect.height < rootBounds.height) {
              heightApplied = true;

              _this3.$element.siblings('.lqd-sticky-footer-sentinel').css('height', boundingClientRect.height - 2).addClass('height-applied');

              _this3.$element.addClass('footer-stuck');
            }
          });
        };

        var observer = new IntersectionObserver(inViewCallback);
        observer.observe(this.element);
      }
    }, {
      key: "_handleResize",
      value: function _handleResize() {
        this.$window.on('resize', this._onResize.bind(this));
      }
    }, {
      key: "_onResize",
      value: function _onResize() {
        this._setupFooterIO();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('sticky-footer-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if ($('body').hasClass('header-style-side')) return false;
  $('[data-sticky-footer=true]').liquidStickyFooter();
});
"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidVideoBg';
  var defaultInlineVideoOptions = {
    startVolume: false,
    controls: false,
    loop: true,
    muted: true,
    hideVideoControlsOnLoad: true,
    hideVideoControlsOnPause: true,
    clickToPlayPause: false,
    disableOnMobile: false
  };
  var defaultYoutubeOptions = {
    autoPlay: true,
    showControls: false,
    loop: true,
    mute: true,
    showYTLogo: false,
    stopMovieOnBlur: false,
    disableOnMobile: false
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, inlineVideoOptions, youtubeOptions) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.inlineVideoOptions = $.extend({}, defaultInlineVideoOptions, inlineVideoOptions);
      this.youtubeOptions = $.extend({}, defaultYoutubeOptions, youtubeOptions);
      this._name = pluginName;
      this.lqdVBG = null;
      this.lqdYTPlayer = null;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        var isMobile = liquidIsMobile();

        if (this.$element.is('video') && this.inlineVideoOptions.disableOnMobile && isMobile) {
          this.$element.closest('.lqd-vbg-wrap').addClass('hidden');
        } else if (this.$element.is('video')) {
          this.initInlineVideo();
        }

        if (!this.$element.is('video') && this.youtubeOptions.disableOnMobile && isMobile) {
          this.$element.closest('.lqd-vbg-wrap').addClass('hidden');
        } else if (!this.$element.is('video')) {
          this.initYoutubeVideo();
        }
      }
    }, {
      key: "initInlineVideo",
      value: function initInlineVideo() {
        var _this = this;

        var $vBgWrap = this.$element.closest('.lqd-vbg-wrap');
        var elementToObserve = $vBgWrap.length ? $vBgWrap.get(0) : this.element;
        var videoOptions = $.extend({}, this.inlineVideoOptions, {
          stretching: 'responsive',
          success: function success(mediaElement) {
            mediaElement.pause();

            _this.initInlineVidIO(elementToObserve);
          }
        });
        this.lqdVBG = new MediaElementPlayer(this.element, videoOptions);
      }
    }, {
      key: "initYoutubeVideo",
      value: function initYoutubeVideo() {
        var _this2 = this;

        var videoOptions = $.extend({}, this.youtubeOptions, {
          containment: this.$element
        });
        this.lqdYTPlayer = this.$element.YTPlayer(videoOptions);
        this.lqdYTPlayer.on('YTPReady', function () {
          _this2.lqdYTPlayer.YTPPause();

          _this2.initYTIO();
        });
      }
    }, {
      key: "initInlineVidIO",
      value: function initInlineVidIO(elementToObserve) {
        var _this3 = this;

        new IntersectionObserver(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 1),
              entry = _ref2[0];

          if (entry.isIntersecting) {
            _this3.lqdVBG && _this3.lqdVBG.play();
          } else {
            _this3.lqdVBG && _this3.lqdVBG.pause();
          }

          ;
        }).observe(elementToObserve);
      }
    }, {
      key: "initYTIO",
      value: function initYTIO() {
        var _this4 = this;

        new IntersectionObserver(function (_ref3) {
          var _ref4 = _slicedToArray(_ref3, 1),
              entry = _ref4[0];

          if (entry.isIntersecting) {
            _this4.lqdYTPlayer && _this4.lqdYTPlayer.YTPPlay();
          } else {
            _this4.lqdYTPlayer && _this4.lqdYTPlayer.YTPPause();
          }
        }).observe(this.element);
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function () {
    return this.each(function () {
      var inlineVideoOptions = $(this).data('inlinevideo-options') || inlineVideoOptions;
      var youtubeOptions = $(this).data('youtube-options') || youtubeOptions;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, inlineVideoOptions, youtubeOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-video-bg]').liquidVideoBg();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidShrinkBorders';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.controller = new ScrollMagic.Controller();
      this.$parentRow = this.$element.closest('.vc_row');
      this.$contents = this.$parentRow.children('.container').length ? this.$parentRow.children('.container') : this.$parentRow.children('.ld-container');
      this.contentsHeight = this.$contents.height();
      this.$animatables = this.$element.children();
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.timeline = this._createTimeline();
        this.scene = this._initSM();

        this._handleResize();

        this.$element.addClass('sticky-applied');
      }
    }, {
      key: "_createTimeline",
      value: function _createTimeline() {
        var timeline = anime.timeline();
        var $stickyBg = this.$element.siblings('.lqd-sticky-bg');

        if ($stickyBg.length) {
          this.$animatables = this.$animatables.add($stickyBg);
        }

        $.each(this.$animatables, function (i, border) {
          var $border = $(border);
          var scaleAxis = $border.attr('data-axis');
          var animeOptions = {
            targets: border,
            duration: 100,
            scaleX: 1,
            scaleY: 1,
            easing: 'linear',
            round: 1000
          };
          scaleAxis === 'x' ? animeOptions.scaleX = [1, 0] : scaleAxis === 'y' ? animeOptions.scaleY = [1, 0] : animeOptions.scale = [1.05, 1];
          timeline.add(animeOptions, 0).pause();
        });
        return timeline;
      }
    }, {
      key: "_initSM",
      value: function _initSM() {
        var _this = this;

        var scene = new ScrollMagic.Scene({
          triggerElement: this.$element.closest('.vc_row').get(0),
          triggerHook: 'onLeave',
          duration: this.contentsHeight
        }).addTo(this.controller); // .addIndicators();

        scene.on('progress', function (e) {
          _this.timeline.seek(e.progress.toFixed(3) * _this.timeline.duration);
        });
        return scene;
      }
    }, {
      key: "_handleResize",
      value: function _handleResize() {
        var onResize = liquidDebounce(this._onWindowResize, 250);
        $(window).on('resize', onResize.bind(this));
      }
    }, {
      key: "_onWindowResize",
      value: function _onWindowResize() {
        this.contentsHeight = this.$contents.height();
        this.scene.duration(this.contentsHeight);
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if (liquidWindowWidth() <= liquidMobileNavBreakpoint()) return false;
  $('[data-shrink-borders]').liquidShrinkBorders();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidParticles';
  var defaults = {
    asBG: false,
    "particles": {
      "number": {
        "value": 40,
        "density": {
          "enable": false,
          "value_area": 800
        }
      },
      "color": {
        "value": ["#f7ccaf", "#f6cacd", "dbf5f8", "#c5d8f8", "#c5f8ce", "#f7afbd", "#b2d6ef", "#f1ecb7"]
      },
      "shape": {
        "type": "triangle"
      },
      "size": {
        "value": 55,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 1
        }
      },
      "move": {
        "direction": "right",
        "attract": {
          "enable": true
        }
      },
      "line_linked": {
        "enable": false
      }
    },
    "interactivity": {
      "events": {
        "onhover": {
          "enable": false
        },
        "onclick": {
          "enable": false
        }
      }
    }
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this.options.particles = $.extend({}, defaults.particles, options.particles);
      this.options.interactivity = $.extend({}, defaults.interactivity, options.interactivity);
      this._defaults = defaults;
      this._name = pluginName;
      this.build();
    }

    _createClass(Plugin, [{
      key: "build",
      value: function build() {
        this.id = this.element.id;
        this.isInitialized = false;
        this.asSectionBg();
        this.initIO();
      }
    }, {
      key: "initIO",
      value: function initIO() {
        var _this = this;

        var inviewCallback = function inviewCallback(enteries, observer) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this.$element.removeClass('invisible');

              if (!_this.isInitialized) {
                _this.isInitialized = true;

                _this.init();
              }
            } else {
              _this.$element.addClass('invisible');
            }
          });
        };

        var observer = new IntersectionObserver(inviewCallback, {
          'rootMargin': '10%'
        });
        observer.observe(this.element);
      }
    }, {
      key: "init",
      value: function init() {
        particlesJS(this.id, this.options);
      }
    }, {
      key: "asSectionBg",
      value: function asSectionBg() {
        if (this.options.asBG) {
          var particlesBgWrap = $('<div class="lqd-particles-bg-wrap"></div>');
          var elementContainer = this.$element.parent('.ld-particles-container');
          var parentSection = this.$element.parents('.vc_row').last();
          var sectionContainerElement = parentSection.children('.ld-container');
          var $stickyWrap = parentSection.children('.lqd-sticky-bg-wrap');
          particlesBgWrap.append(elementContainer);

          if ($stickyWrap.length) {
            particlesBgWrap.appendTo($stickyWrap);
          } else if (parentSection.hasClass('pp-section')) {
            particlesBgWrap.prependTo(parentSection);
          } else {
            particlesBgWrap.insertBefore(sectionContainerElement);
          }
        }
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('particles-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-particles=true]').filter(function (i, element) {
    var $element = $(element);
    var $fullpageSection = $element.closest('.vc_row.pp-section');
    return !$fullpageSection.length;
  }).liquidParticles();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidPin';
  var defaults = {
    duration: 'contentsHeight',
    // [ 'contentsHeight', 'last-link', 'docHeight', number ] // 'last-link' used in custom css for sticky menu
    offset: 0,
    // it can be a number, or a css selector
    pushFollowers: true,
    spacerClass: 'scrollmagic-pin-spacer'
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.$spacerElement = null;
      this.elementOuterHeight = this.$element.outerHeight();
      this.init();
      this.setSpacerWidth();
      this.events();
      this.handleResize();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        var _this$options = this.options,
            pushFollowers = _this$options.pushFollowers,
            spacerClass = _this$options.spacerClass;
        var controller = new ScrollMagic.Controller();
        var duration = this.getDuration();
        var offset = this.getOffset() * -1;
        this.scene = new ScrollMagic.Scene({
          triggerElement: this.element,
          triggerHook: 'onLeave',
          offset: offset,
          duration: duration
        }).setPin(this.element, {
          pushFollowers: pushFollowers,
          spacerClass: spacerClass
        }).addTo(controller);
        this.$spacerElement = this.$element.parent();
      }
    }, {
      key: "getOffset",
      value: function getOffset() {
        var options = this.options;

        if (isNaN(options.offset)) {
          return this.getOffsetElementsHeight();
        } else {
          return options.offset;
        }
      }
    }, {
      key: "getOffsetElementsHeight",
      value: function getOffsetElementsHeight() {
        var options = this.options;
        var offset = 0;
        $.each($(options.offset), function (i, element) {
          var $element = $(element);

          if ($element.length) {
            offset += $element.outerHeight();
          }
        });
        return offset;
      }
    }, {
      key: "getDuration",
      value: function getDuration() {
        var options = this.options;
        var duration = options.duration;

        if (duration === 'contentsHeight' && this.$element.is('.lqd-sticky-bg-wrap') || this.$element.is('.lqd-section-borders-wrap')) {
          var $contentsContainer = this.scene ? this.$element.parent().siblings('.ld-container') : this.$element.siblings('.ld-container');
          var contentsContainerHeight = $contentsContainer.height();
          duration = contentsContainerHeight;
        }

        if (duration === 'contentsHeight') {
          duration = this.elementOuterHeight;
        }

        if (duration === 'last-link') {
          var $lastLink = $('a', this.element).last();

          if ($lastLink.get(0).hasAttribute('href') && $lastLink.length && $lastLink.get(0).getAttribute('href').indexOf('#') >= 0 && $($lastLink.attr('href')).length) {
            duration = $($lastLink.attr('href')).offset().top;
          } else {
            duration = '100%';
          }
        }

        if (duration === 'docHeight') {
          duration = $('body').height();
        }

        return duration;
      }
    }, {
      key: "setSpacerWidth",
      value: function setSpacerWidth() {
        if (this.$element.is('.wpb_column') || this.$element.is('.lqd-column')) {
          this.elementWidth = this.$element.width();
          this.$element.css('width', '');
          this.$spacerElement.css('float', 'left');
          this.$element.css('width', this.elementWidth);
        }

        ;
      }
    }, {
      key: "events",
      value: function events() {
        document.addEventListener('lqd-header-sticky-change', this.updateOffset.bind(this));
        document.addEventListener('lqd-carousel-initialized', this.updateDuration.bind(this));
        document.addEventListener('lqd-masonry-layout-complete', this.updateDuration.bind(this));
        document.addEventListener('lqd-masonry-filter-change', this.updateDuration.bind(this));
        this.scene.on('enter', this.onSceneEnter.bind(this));
        this.scene.on('leave', this.onSceneLeave.bind(this));
      }
    }, {
      key: "updateOffset",
      value: function updateOffset() {
        this.scene.offset(this.getOffset() * -1);
      }
    }, {
      key: "updateDuration",
      value: function updateDuration() {
        this.scene.duration(this.getDuration());
      }
    }, {
      key: "onSceneEnter",
      value: function onSceneEnter() {
        this.$spacerElement.addClass('scene-entered').removeClass('scene-left');
      }
    }, {
      key: "onSceneLeave",
      value: function onSceneLeave() {
        this.$spacerElement.addClass('scene-left').removeClass('scene-entered');
      }
    }, {
      key: "handleResize",
      value: function handleResize() {
        var onResize = liquidDebounce(this.onWindowResize, 250);
        $(window).on('resize', onResize.bind(this));
      }
    }, {
      key: "onWindowResize",
      value: function onWindowResize() {
        this.setSpacerWidth();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('pin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  var pinElements = $($('[data-pin=true]').get().reverse());
  pinElements.map(function (i, element) {
    if (liquidWindowWidth() >= 1200 || $(element).is('.lqd-custom-menu')) {
      return element;
    }
  }).liquidPin();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// https://github.com/CodyHouse/image-comparison-slider
;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidImageComparison';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.dragging = false;
      this.resizing = false;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.initIO();

        this._drags(this.$element.find('.cd-handle'), this.$element.find('.cd-resize-img'), this.$element);
      }
    }, {
      key: "initIO",
      value: function initIO() {
        var _this = this;

        new IntersectionObserver(function (enteries, observer) {
          enteries.forEach(function (entery) {
            if (entery.isIntersecting) {
              _this.$element.addClass('is-visible');
            }
          });
        }).observe(this.element, {
          threshold: 0.35
        });
      } //draggable funtionality - credits to http://css-tricks.com/snippets/jquery/draggable-without-jquery-ui/

    }, {
      key: "_drags",
      value: function _drags(dragElement, resizeElement, container) {
        var _this2 = this;

        dragElement.on("mousedown touchstart", function (event) {
          event.preventDefault();
          dragElement.addClass('draggable');
          resizeElement.addClass('resizable');
          var dragWidth = dragElement.outerWidth(),
              x = event.pageX || event.originalEvent.touches[0].pageX,
              xPosition = dragElement.offset().left + dragWidth - x,
              containerOffset = container.offset().left,
              containerWidth = container.outerWidth(),
              minLeft = containerOffset + 10,
              maxLeft = containerOffset + containerWidth - dragWidth - 10;
          $(document).on("mousemove touchmove", function (event) {
            if (!_this2.dragging) {
              _this2.dragging = true;
              requestAnimationFrame(function () {
                _this2._animateDraggedHandle(event, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement);
              });
            }
          });
        });
        $(document).on("mouseup touchend", function () {
          dragElement.removeClass('draggable');
          resizeElement.removeClass('resizable');
          $(document).off('mousemove touchmove');
          _this2.dragging = false;
        });
      }
    }, {
      key: "_animateDraggedHandle",
      value: function _animateDraggedHandle(e, xPosition, dragWidth, minLeft, maxLeft, containerOffset, containerWidth, resizeElement) {
        var x = e.pageX || e.originalEvent.touches[0].pageX;
        var leftValue = x + xPosition - dragWidth; //constrain the draggable element to move inside his container

        if (leftValue < minLeft) {
          leftValue = minLeft;
        } else if (leftValue > maxLeft) {
          leftValue = maxLeft;
        }

        var widthValue = (leftValue + dragWidth / 2 - containerOffset) * 100 / containerWidth + '%';
        $('.draggable').css('left', widthValue).on("mouseup touchend", function () {
          $(this).removeClass('draggable');
          resizeElement.removeClass('resizable');
        });
        $('.resizable').css('width', widthValue);
        this.dragging = false;
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('.cd-image-container').liquidImageComparison();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidStack';
  var $mainFooter = $('.main-footer');
  var defaults = {
    sectionSelector: '#content > .vc_row',
    // outer rows only
    anchors: [],
    easing: 'linear',
    css3: true,
    scrollingSpeed: 1000,
    loopTop: false,
    loopBottom: false,
    navigation: false,
    defaultTooltip: 'Section',
    prevNextButtons: true,
    animateAnchor: false,
    prevNextLabels: {
      prev: 'Previous',
      next: 'Next'
    },
    pageNumber: true,
    effect: 'none',
    // [  'none', 'fadeScale', 'slideOver' ]
    disableOnMobile: true
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      if (this.options.disableOnMobile && (liquidIsMobile() || liquidWindowWidth() <= liquidMobileNavBreakpoint())) return false;
      this.anchors = [];
      this.tooltips = [];
      this.sectionsLuminance = [];
      this.$body = $('body');
      this.$sections = $(this.options.sectionSelector);
      this.$ppNav = null;
      this.$prevNextButtons = $('.lqd-stack-prevnext-wrap');
      this.$pageNumber = $('.lqd-stack-page-number');
      this.$backToTopButton = $('[data-back-to-top]');
      this.build();
      this.addClassnames();
      this.eachSection();
      this.init();
    }

    _createClass(Plugin, [{
      key: "build",
      value: function build() {
        var hiddenSection = this.$sections.filter(':hidden').remove();
        this.$sections = this.$sections.not(hiddenSection);

        if ($mainFooter.length) {
          this.$sections.push($mainFooter.get(0));
          this.$element.append($mainFooter);
          $mainFooter.prev('.vc_row').addClass('section-before-footer');
        } // style tags preventing scrolling


        this.$element.children('style').appendTo('head');
        this.$element.children('.vc_row-full-width').remove();
      }
    }, {
      key: "addClassnames",
      value: function addClassnames() {
        var options = this.options;
        $mainFooter.length && $mainFooter.addClass('vc_row pp-section pp-auto-height');
        options.navigation && this.$body.addClass('lqd-stack-has-nav');
        options.prevNextButtons && this.$body.addClass('lqd-stack-has-prevnext-buttons');
        options.pageNumber && this.$body.addClass('lqd-stack-has-page-numbers');
        options.effect !== 'none' && this.$body.addClass('lqd-stack-effect-enabled');
        this.$body.addClass("lqd-stack-effect-".concat(options.effect));
        this.$body.add('html').addClass('overflow-hidden');
        $('html').addClass('pp-enabled');
      }
    }, {
      key: "eachSection",
      value: function eachSection() {
        var _this = this;

        $.each(this.$sections, function (i, section) {
          _this.wrapInnerContent(section);

          _this.makeScrollable(section);

          _this.setSectionsLuminance(section);

          _this.setAnchors(i, section);

          _this.setTooltips(i, section);
        });
      }
    }, {
      key: "wrapInnerContent",
      value: function wrapInnerContent(section) {
        $(section).wrapInner('<div class="lqd-stack-section-inner" />');
      }
    }, {
      key: "makeScrollable",
      value: function makeScrollable(section) {
        var $section = $(section);
        var $sectionContainer = $section.children('.lqd-stack-section-inner');

        if ($sectionContainer.height() > $section.height()) {
          $section.addClass('pp-scrollable');
        }
      }
    }, {
      key: "setAnchors",
      value: function setAnchors(i, section) {
        if (section.hasAttribute('id')) {
          this.anchors[i] = section.getAttribute('id');
        } else if (section.hasAttribute('data-tooltip')) {
          this.anchors[i] = section.getAttribute('data-tooltip').replace(new RegExp(' ', 'g'), '-').toLowerCase();
        } else {
          if (!section.hasAttribute('data-anchor')) {
            this.anchors[i] = "".concat(this.options.defaultTooltip, "-").concat(i + 1);
          } else {
            this.anchors[i] = section.getAttribute('data-anchor');
          }
        }
      }
    }, {
      key: "setTooltips",
      value: function setTooltips(i, section) {
        if (!section.hasAttribute('data-tooltip')) {
          this.tooltips[i] = "".concat(this.options.defaultTooltip, " ").concat(i + 1);
        } else {
          this.tooltips[i] = section.getAttribute('data-tooltip');
        }
      }
    }, {
      key: "setSectionsLuminance",
      value: function setSectionsLuminance(section) {
        var $section = $(section);
        var contentBgColor = this.$element.css('backgroundColor');
        var sectionBgColor = $section.css('backgroundColor') || contentBgColor || '#fff';

        if (section.hasAttribute('data-section-luminance')) {
          this.sectionsLuminance.push($section.attr('data-section-luminance'));
        } else {
          this.sectionsLuminance.push(tinycolor(sectionBgColor).getLuminance() <= 0.5 ? 'dark' : 'light');
        }
      }
    }, {
      key: "init",
      value: function init() {
        var _this$options = this.options,
            anchors = _this$options.anchors,
            easing = _this$options.easing,
            css3 = _this$options.css3,
            scrollingSpeed = _this$options.scrollingSpeed,
            loopTop = _this$options.loopTop,
            loopBottom = _this$options.loopBottom,
            navigation = _this$options.navigation,
            animateAnchor = _this$options.animateAnchor;

        if (navigation && this.tooltips.length > 0) {
          navigation = {};
          navigation.tooltips = this.tooltips;
        }

        if (anchors) {
          anchors = this.anchors;
        }

        this.$element.pagepiling({
          sectionSelector: this.$sections.get(),
          anchors: anchors,
          easing: easing,
          css3: css3,
          scrollingSpeed: scrollingSpeed,
          loopTop: loopTop,
          loopBottom: loopBottom,
          animateAnchor: animateAnchor,
          navigation: navigation,
          afterRender: this.afterRender.bind(this),
          onLeave: this.onLeave.bind(this),
          afterLoad: this.afterLoad.bind(this)
        });
      }
    }, {
      key: "appendPrevNextButtons",
      value: function appendPrevNextButtons() {
        var prevNextLabels = this.options.prevNextLabels;
        this.$prevNextButtons = $('<div class="lqd-stack-prevnext-wrap" />');
        var $prevButton = $("<button class=\"lqd-stack-prevnext-button lqd-stack-prev-button\">\n\t\t\t\t<span class=\"lqd-stack-button-labbel\">".concat(prevNextLabels.prev, "</span>\n\t\t\t\t<span class=\"lqd-stack-button-ext\">\n\t\t\t\t\t<svg width=\"36px\" height=\"36px\" class=\"lqd-stack-button-circ\" viewBox=\"0 0 36 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#000\">\n\t\t\t\t\t\t<path d=\"M17.89548,35.29096 C27.5027383,35.29096 35.29096,27.5027383 35.29096,17.89548 C35.29096,8.28822168 27.5027383,0.5 17.89548,0.5 C8.28822168,0.5 0.5,8.28822168 0.5,17.89548 C0.5,27.5027383 8.28822168,35.29096 17.89548,35.29096 Z\"></path>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<svg width=\"36px\" height=\"36px\" class=\"lqd-stack-button-circ lqd-stack-button-circ-clone\" viewBox=\"0 0 36 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#000\">\n\t\t\t\t\t\t<path d=\"M17.89548,35.29096 C27.5027383,35.29096 35.29096,27.5027383 35.29096,17.89548 C35.29096,8.28822168 27.5027383,0.5 17.89548,0.5 C8.28822168,0.5 0.5,8.28822168 0.5,17.89548 C0.5,27.5027383 8.28822168,35.29096 17.89548,35.29096 Z\"></path>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"lqd-stack-button-arrow\" width=\"12.5px\" height=\"13.5px\" viewbox=\"0 0 12.5 13.5\" fill=\"none\" stroke=\"#000\">\n\t\t\t\t\t\t<path d=\"M11.489,6.498 L0.514,12.501 L0.514,0.495 L11.489,6.498 Z\"/>\n\t\t\t\t\t</svg>\n\t\t\t\t</span>\n\t\t\t</button>"));
        var $nextButton = $("<button class=\"lqd-stack-prevnext-button lqd-stack-next-button\">\n\t\t\t\t<span class=\"lqd-stack-button-labbel\">".concat(prevNextLabels.next, "</span>\n\t\t\t\t<span class=\"lqd-stack-button-ext\">\n\t\t\t\t\t<svg width=\"36px\" height=\"36px\" class=\"lqd-stack-button-circ\" viewBox=\"0 0 36 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#000\">\n\t\t\t\t\t\t<path d=\"M17.89548,35.29096 C27.5027383,35.29096 35.29096,27.5027383 35.29096,17.89548 C35.29096,8.28822168 27.5027383,0.5 17.89548,0.5 C8.28822168,0.5 0.5,8.28822168 0.5,17.89548 C0.5,27.5027383 8.28822168,35.29096 17.89548,35.29096 Z\"></path>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<svg width=\"36px\" height=\"36px\" class=\"lqd-stack-button-circ lqd-stack-button-circ-clone\" viewBox=\"0 0 36 36\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" stroke=\"#000\">\n\t\t\t\t\t\t<path d=\"M17.89548,35.29096 C27.5027383,35.29096 35.29096,27.5027383 35.29096,17.89548 C35.29096,8.28822168 27.5027383,0.5 17.89548,0.5 C8.28822168,0.5 0.5,8.28822168 0.5,17.89548 C0.5,27.5027383 8.28822168,35.29096 17.89548,35.29096 Z\"></path>\n\t\t\t\t\t</svg>\n\t\t\t\t\t<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"lqd-stack-button-arrow\" width=\"12.5px\" height=\"13.5px\" viewbox=\"0 0 12.5 13.5\" fill=\"none\" stroke=\"#000\">\n\t\t\t\t\t\t<path d=\"M11.489,6.498 L0.514,12.501 L0.514,0.495 L11.489,6.498 Z\"/>\n\t\t\t\t\t</svg>\n\t\t\t\t</span>\n\t\t\t</button>"));
        this.$prevNextButtons.append($prevButton.add($nextButton));
        !this.$body.children('.lqd-stack-prevnext-wrap').length && this.$body.append(this.$prevNextButtons);
      }
    }, {
      key: "prevNextButtonsEvents",
      value: function prevNextButtonsEvents() {
        var $prevButton = this.$prevNextButtons.find('.lqd-stack-prev-button');
        var $nextButton = this.$prevNextButtons.find('.lqd-stack-next-button');
        $prevButton.on('click', function () {
          $.fn.pagepiling.moveSectionUp();
        });
        $nextButton.on('click', function () {
          $.fn.pagepiling.moveSectionDown();
        });
      }
    }, {
      key: "appendPageNumber",
      value: function appendPageNumber() {
        var totalSections = this.$sections.not('.main-footer').length;
        this.$pageNumber = $('<div class="lqd-stack-page-number" />');
        var $pageNumnerCounter = $("<span class=\"lqd-stack-page-number-counter\">\n\t\t\t\t<span class=\"lqd-stack-page-number-current\"></span>\n\t\t\t\t<span class=\"lqd-stack-page-number-passed\"></span>\n\t\t\t</span>");
        var $pageNumnerTotal = $("<span class=\"lqd-stack-page-number-total\">".concat(totalSections < 10 ? '0' : '').concat(totalSections, "</span>"));
        this.$pageNumber.append($pageNumnerCounter);
        this.$pageNumber.append($pageNumnerTotal);
        !this.$body.children('.lqd-stack-page-number').length && this.$body.append(this.$pageNumber);
      }
    }, {
      key: "setPageNumber",
      value: function setPageNumber(index) {
        var $currentPageNumber = this.$pageNumber.find('.lqd-stack-page-number-current');
        var $passedPageNumber = this.$pageNumber.find('.lqd-stack-page-number-passed');
        $passedPageNumber.html($currentPageNumber.html());
        $currentPageNumber.html("".concat(index < 10 ? '0' : '').concat(index));
      }
    }, {
      key: "addDirectionClassname",
      value: function addDirectionClassname(direction) {
        if (direction == 'down') {
          this.$body.removeClass('lqd-stack-moving-up').addClass('lqd-stack-moving-down');
        } else if (direction == 'up') {
          this.$body.removeClass('lqd-stack-moving-down').addClass('lqd-stack-moving-up');
        }
      }
    }, {
      key: "addLuminanceClassnames",
      value: function addLuminanceClassnames(index) {
        this.$body.removeClass('lqd-stack-active-row-dark lqd-stack-active-row-light').addClass("lqd-stack-active-row-".concat(this.sectionsLuminance[index]));
      }
    }, {
      key: "initShortcodes",
      value: function initShortcodes($destinationRow) {
        $('[data-custom-animations]', $destinationRow).liquidCustomAnimations();
        $destinationRow.is('[data-custom-animations]') && $destinationRow.liquidCustomAnimations();
        $('[data-dynamic-shape]', $destinationRow).liquidDynamicShape();
        $('[data-reveal]', $destinationRow).liquidReveal();
        $('[data-particles=true]', $destinationRow).liquidParticles();
      }
    }, {
      key: "initBackToTop",
      value: function initBackToTop(rowIndex) {
        if (rowIndex > 1) {
          this.$backToTopButton.addClass('is-visible');
        } else {
          this.$backToTopButton.removeClass('is-visible');
        }

        $('a', this.$backToTopButton).on('click', function (event) {
          event.preventDefault();
          $.fn.pagepiling.moveTo(1);
        });
      }
    }, {
      key: "afterRender",
      value: function afterRender() {
        this.$body.addClass('lqd-stack-initiated');
        this.$ppNav = $('#pp-nav'); // Hide the last nav item if it's for the main footer

        if ($mainFooter.length) {
          this.$ppNav.find('li').last().addClass('hide');
          this.$body.addClass('lqd-stack-has-footer');
        }

        this.initShortcodes(this.$sections.first());
        this.addLuminanceClassnames(0);
        this.options.prevNextButtons && this.appendPrevNextButtons();
        this.options.prevNextButtons && this.prevNextButtonsEvents();
        this.options.pageNumber && this.appendPageNumber();
        this.options.pageNumber && this.setPageNumber(1);
      }
    }, {
      key: "onLeave",
      value: function onLeave(index, nextIndex, direction) {
        var $destinationRow = $(this.$sections[nextIndex - 1]);
        var $originRow = $(this.$sections[index - 1]);

        if (!$destinationRow.is('.main-footer') && !$originRow.is('.main-footer')) {
          this.$body.addClass('lqd-stack-moving');
          this.setPageNumber(nextIndex);
          $destinationRow.removeClass('lqd-stack-row-leaving').addClass('lqd-stack-row-entering');
          $originRow.removeClass('lqd-stack-row-entering').addClass('lqd-stack-row-leaving');
          this.addLuminanceClassnames(nextIndex - 1);
        } else if ($originRow.is('.main-footer')) {
          $originRow.addClass('lqd-stack-row-leaving');
        }

        if ($destinationRow.is('.main-footer')) {
          this.$body.addClass('lqd-stack-footer-active');
          $originRow.css('transform', 'none');
        } else {
          this.$body.removeClass('lqd-stack-footer-active');
        }

        this.addDirectionClassname(direction);
        this.initShortcodes($destinationRow);
        this.$backToTopButton.length && this.initBackToTop(nextIndex);
      }
    }, {
      key: "afterLoad",
      value: function afterLoad(anchorLink, index) {
        $(this.$sections).removeClass('lqd-stack-row-entering lqd-stack-row-leaving');
        this.$body.removeClass('lqd-stack-moving lqd-stack-moving-up lqd-stack-moving-down');
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('stack-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if ($('body').hasClass('compose-mode')) return false;
  $('[data-liquid-stack=true]').liquidStack();
});
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
* http://www.codrops.com
*
* Licensed under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 
* Copyright 2017, Codrops
* http://www.codrops.com
*
* Modified by LiquidThemes
*/
;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidAnimatedFrames';
  var defaults = {
    direction: 'vertical',
    // horizontal, vertical
    animation: {
      slides: {
        duration: 500,
        easing: 'easeOutQuint'
      },
      shape: {
        duration: 300,
        easing: {
          in: 'easeOutCubic',
          out: 'easeInOutCirc'
        }
      }
    },
    frameFill: '#000'
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.DOM = {};
      this.DOM.el = element;
      this.DOM.slides = Array.from(this.DOM.el.querySelectorAll('.lqd-af-slides > .lqd-af-slide'));
      this.slidesTotal = this.DOM.slides.length;
      this.DOM.nav = this.DOM.el.querySelector('.lqd-af-slidenav');
      this.DOM.nextCtrl = this.DOM.nav.querySelector('.lqd-af-slidenav__item--next');
      this.DOM.prevCtrl = this.DOM.nav.querySelector('.lqd-af-slidenav__item--prev');
      this.current = 0;
      this.init();
      this.createFrame();
      this.initEvents();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.DOM.slides[this.current].classList.add('lqd-af-slide--current');
        this.DOM.el.classList.add('lqd-af--initial');
      }
    }, {
      key: "createFrame",
      value: function createFrame() {
        var _this = this;

        this.rect = this.DOM.el.getBoundingClientRect();
        this.clipPathID = "lqd-af-clippath-".concat(anime.random(0, 100));
        this.maskPositions = ['top', 'right', 'bottom', 'left'];
        this.DOM.mask = document.createElement('div');
        this.DOM.mask.classList.add('lqd-af-mask');
        this.maskPositions.forEach(function (maskPosition) {
          var span = _this.DOM.mask[maskPosition] = document.createElement('span');
          span.classList.add("lqd-af-mask-".concat(maskPosition));
          span.dataset.position = maskPosition;
          span.style.backgroundColor = _this.options.frameFill;

          _this.DOM.mask.appendChild(span);
        });
        this.DOM.el.appendChild(this.DOM.mask);
        this.DOM.el.insertBefore(this.DOM.mask, this.DOM.nav);
      }
    }, {
      key: "initEvents",
      value: function initEvents() {
        var _this2 = this;

        this.DOM.nextCtrl.addEventListener('click', function () {
          return _this2.navigate('next');
        });
        this.DOM.prevCtrl.addEventListener('click', function () {
          return _this2.navigate('prev');
        });
        document.addEventListener('keydown', function (ev) {
          var keyCode = ev.keyCode || ev.which;

          if (keyCode === 37) {
            _this2.navigate('prev');
          } else if (keyCode === 39) {
            _this2.navigate('next');
          }
        });
      }
    }, {
      key: "navigate",
      value: function navigate() {
        var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'next';
        if (this.isAnimating) return false;
        this.isAnimating = true;
        var animateShapeIn = anime({
          targets: [this.DOM.mask.top, this.DOM.mask.right, this.DOM.mask.bottom, this.DOM.mask.left],
          duration: this.options.animation.shape.duration,
          easing: this.options.animation.shape.easing.in,
          translateX: function translateX(el) {
            var elPosition = el.dataset.position;
            if (elPosition === 'right') return ['100%', '78%'];
            if (elPosition === 'left') return ['-100%', '-78%'];
          },
          translateY: function translateY(el) {
            var elPosition = el.dataset.position;
            if (elPosition === 'top') return ['-100%', '-78%'];
            if (elPosition === 'bottom') return ['100%', '78%'];
          },
          begin: function begin(anime) {
            anime.animatables.forEach(function (animatable) {
              animatable.target.style.willChange = 'transform';
            });
          }
        });
        var currentSlide = this.DOM.slides[this.current];
        var currentSlideImg = currentSlide.querySelector('.lqd-af-slide__img');
        var currentSlideFigureEl = currentSlideImg.querySelector('figure');
        anime.remove(currentSlideFigureEl);
        anime({
          targets: currentSlideFigureEl,
          duration: this.options.animation.shape.duration * 1.5,
          easing: this.options.animation.shape.easing.in,
          scale: [1, 0.6]
        });
        animateShapeIn.finished.then(this.animateSlides.bind(this, dir)).then(this.animateShapeOut.bind(this, dir));
      }
    }, {
      key: "animateSlides",
      value: function animateSlides() {
        var _this3 = this;

        var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'next';
        return new Promise(function (resolve, reject) {
          var _anime, _currentSlideContentT3, _anime2, _newSlideContentTimel3;

          // Current Slide
          var direction = _this3.options.direction;
          var transVal = direction === 'horizontal' ? _this3.rect.width : _this3.rect.height;
          var currentSlide = _this3.DOM.slides[_this3.current];
          var currentSlideImg = currentSlide.querySelector('.lqd-af-slide__img');
          currentSlide.classList.add('lqd-af-slide--movin-out');
          anime.remove(currentSlideImg);
          anime((_anime = {
            targets: currentSlideImg,
            duration: _this3.options.animation.slides.duration * 4,
            easing: _this3.options.animation.slides.easing,
            delay: 100
          }, _defineProperty(_anime, direction === 'horizontal' ? 'translateX' : 'translateY', dir === 'next' ? transVal * -1 / 3 : transVal / 3), _defineProperty(_anime, "complete", function complete() {
            currentSlide.classList.remove('lqd-af-slide--movin-out');
          }), _anime));
          var currentSlideContentTimeline = anime.timeline({
            duration: _this3.options.animation.slides.duration,
            easing: _this3.options.animation.shape.easing.out,
            delay: 0,
            complete: function complete(anime) {
              currentSlide.classList.remove('lqd-af-slide--current');

              _this3.DOM.el.classList.add('lqd-af--initial');

              resolve();
            }
          });
          currentSlideContentTimeline.add(_defineProperty({
            targets: currentSlide.querySelectorAll('.lqd-af-slide__title .lqd-words .split-inner')
          }, direction === 'horizontal' ? 'translateX' : 'translateY', ['0%', dir === 'next' ? '-115%' : '115%']));
          currentSlideContentTimeline.add(_defineProperty({
            targets: currentSlide.querySelectorAll('.lqd-af-slide__desc .split-inner')
          }, direction === 'horizontal' ? 'translateX' : 'translateY', [0, dir === 'next' ? -50 : 50]), 100);
          currentSlideContentTimeline.add((_currentSlideContentT3 = {
            targets: currentSlide.querySelector('.lqd-af-slide__link')
          }, _defineProperty(_currentSlideContentT3, direction === 'horizontal' ? 'translateX' : 'translateY', [0, dir === 'next' ? -50 : 50]), _defineProperty(_currentSlideContentT3, "opacity", [1, 0]), _currentSlideContentT3), 150);
          _this3.current = dir === 'next' ? _this3.current < _this3.slidesTotal - 1 ? _this3.current + 1 : 0 : _this3.current > 0 ? _this3.current - 1 : _this3.slidesTotal - 1; // New slide

          var newSlide = _this3.DOM.slides[_this3.current];
          newSlide.classList.add('lqd-af-slide--current', 'lqd-af-slide--movin-in');

          _this3.DOM.el.classList.add('lqd-af--initial');

          var newSlideImg = newSlide.querySelector('.lqd-af-slide__img');
          anime.remove(newSlideImg);
          anime((_anime2 = {
            targets: newSlideImg,
            duration: _this3.options.animation.slides.duration * 2,
            easing: _this3.options.animation.slides.easing
          }, _defineProperty(_anime2, direction === 'horizontal' ? 'translateX' : 'translateY', [dir === 'next' ? transVal : transVal * -1, 0]), _defineProperty(_anime2, "complete", function complete() {
            newSlide.classList.remove('lqd-af-slide--movin-in');
          }), _anime2));
          var newSlideContentTimeline = anime.timeline({
            duration: _this3.options.animation.slides.duration * 2,
            easing: _this3.options.animation.slides.easing
          });
          newSlideContentTimeline.add(_defineProperty({
            targets: newSlide.querySelectorAll('.lqd-af-slide__title .lqd-words .split-inner')
          }, direction === 'horizontal' ? 'translateX' : 'translateY', [dir === 'next' ? '115%' : '-115%', '0%']));
          newSlideContentTimeline.add(_defineProperty({
            targets: newSlide.querySelectorAll('.lqd-af-slide__desc .split-inner')
          }, direction === 'horizontal' ? 'translateX' : 'translateY', [dir === 'next' ? 70 : -70, 0]), 150);
          newSlideContentTimeline.add((_newSlideContentTimel3 = {
            targets: newSlide.querySelector('.lqd-af-slide__link')
          }, _defineProperty(_newSlideContentTimel3, direction === 'horizontal' ? 'translateX' : 'translateY', [dir === 'next' ? 70 : -70, 0]), _defineProperty(_newSlideContentTimel3, "opacity", [0, 1]), _newSlideContentTimel3), 200);
        });
      }
    }, {
      key: "animateShapeOut",
      value: function animateShapeOut() {
        var _this4 = this;

        var dir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'next';
        anime({
          targets: [this.DOM.mask.top, this.DOM.mask.right, this.DOM.mask.bottom, this.DOM.mask.left],
          duration: this.options.animation.shape.duration * 1.75,
          easing: this.options.animation.shape.easing.out,
          translateX: function translateX(el) {
            var elPosition = el.dataset.position;
            if (elPosition === 'right') return ['78%', '100%'];
            if (elPosition === 'left') return ['-78%', '-100%'];
          },
          translateY: function translateY(el) {
            var elPosition = el.dataset.position;
            if (elPosition === 'top') return ['-78%', '-100%'];
            if (elPosition === 'bottom') return ['78%', '100%'];
          },
          complete: function complete(anime) {
            _this4.isAnimating = false;
            anime.animatables.forEach(function (animatable) {
              animatable.target.style.willChange = '';
            });
          }
        });
        var currentSlide = this.DOM.slides[this.current];
        var currentSlideImg = currentSlide.querySelector('.lqd-af-slide__img');
        var currentSlideFigureEl = currentSlideImg.querySelector('figure');
        anime.remove(currentSlideFigureEl);
        anime({
          targets: currentSlideFigureEl,
          duration: this.options.animation.shape.duration * 1.45,
          easing: this.options.animation.shape.easing.out,
          scale: [0.6, 1]
        });
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('animatedframes-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-liquid-animatedframes=true]').liquidAnimatedFrames();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidVideoTrigger';
  var defaults = {
    triggerType: ['mouseenter', 'mouseleave'],
    // [on, off]
    videoPlacement: "parent"
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.$videoElement = this.$element[this.options.videoPlacement]().find('video');
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        if (!this.$videoElement.length) return;
        this.videoElement = this.$videoElement.get(0);
        this.videoElement.oncanplay = this.events.call(this);
      }
    }, {
      key: "events",
      value: function events() {
        this.$element.on(this.options.triggerType[0], this.triggerOn.bind(this));
        this.$element.on(this.options.triggerType[1], this.triggerOff.bind(this));
      }
    }, {
      key: "triggerOn",
      value: function triggerOn() {
        this.videoElement.play();
      }
    }, {
      key: "triggerOff",
      value: function triggerOff() {
        this.videoElement.pause();
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('trigger-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-video-trigger]').liquidVideoTrigger();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidLightBox';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.events();
      }
    }, {
      key: "events",
      value: function events() {
        var _this = this;

        $(document).on('lity:close', function (event) {
          _this.onClose(event);
        });
      }
    }, {
      key: "onClose",
      value: function onClose(event) {
        var $target = $(event.target);
        var $video = $target.find('video');
        var $audio = $target.find('audio');

        if ($video.length) {
          var video = $video.get(0);
          video.oncanplay = video.pause();
        }

        if ($audio.length) {
          var audio = $audio.get(0);
          audio.oncanplay = audio.pause();
        }
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('lightbox-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $('[data-lity]').liquidLightBox();
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidLocalScroll';
  var defaults = {
    scrollSpeed: 600,
    scrollBelowSection: false,
    offsetElements: '.main-header[data-sticky-header] .mainbar-wrap, .lqd-custom-menu[data-pin]'
  };

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.$window = $(window);
      this.$windowHeight = this.$window.height();
      this.$mainHeader = $('.main-header');
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.getScrollSpeed();
      this.getElement();
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        var _this = this;

        this.$element.each(function (i, element) {
          if (!element.hasAttribute('href')) return;

          _this.eventListeners(element);

          _this.onWindowScroll(element);
        });
      }
    }, {
      key: "getScrollSpeed",
      value: function getScrollSpeed() {
        if (window.liquidParams && window.liquidParams.localscrollSpeed) {
          this.options.scrollSpeed = window.liquidParams.localscrollSpeed;
        } else {
          this.options.scrollSpeed = 600;
        }
      }
    }, {
      key: "getElement",
      value: function getElement() {
        if (this.$element.is('li')) {
          this.$element = this.$element.children('a');
        } else if (this.$element.is('.main-nav')) {
          this.$element = this.$element.children('li').children('a');
        }
      }
    }, {
      key: "eventListeners",
      value: function eventListeners(element) {
        $(element).on('click', this.onClick.bind(this, element));
        this.$window.on('scroll', this.onWindowScroll.bind(this, element));
      }
    }, {
      key: "getDestinationOffsetTop",
      value: function getDestinationOffsetTop($targetSection) {
        if (!$targetSection.length) return 0;
        var targetSectionOffsetTop = $targetSection.offset().top;
        var $navbarCollapse = $('.navbar-collapse', this.$mainHeader);

        if (liquidIsMobile() && this.$element.closest('.main-nav').length && $navbarCollapse.length && $navbarCollapse.is(':visible') && !$('.mainbar-wrap', this.$mainHeader).hasClass('is-stuck')) {
          targetSectionOffsetTop = targetSectionOffsetTop - $navbarCollapse.outerHeight();
        }

        return targetSectionOffsetTop;
      }
    }, {
      key: "getOffsetElementsHeight",
      value: function getOffsetElementsHeight() {
        var _this2 = this;

        var options = this.options;
        var offsetElements = options.offsetElements;
        var offset = 0;

        if (!offsetElements) {
          return offset;
        }

        ;
        $.each(offsetElements.replace(/, /g, ',').split(','), function (i, element) {
          var $closesLqdMenu = _this2.$element.closest('.lqd-custom-menu');

          var $element;

          if (element == 'parent' && $closesLqdMenu.length && $closesLqdMenu.is('[data-pin]')) {
            $element = $closesLqdMenu;
          } else if (element == 'parent' && _this2.$element.closest('.main-nav').length) {
            $element = _this2.$element.closest('.main-nav');
          } else if (element == 'parent') {
            $element = _this2.$element.parent();
          } else {
            $element = $(element);
          }

          if ($element.length) {
            // we don't want to calculate main header's height because mobile nav can be expanded and give a wrong height for mobile header
            if (liquidIsMobile() && ($element.is('.main-header') || $element.closest('.main-header').length || $element.is('.navbar-collapse-clone') || // offscreen nav
            $element.closest('.navbar-collapse-clone').length // offscreen nav
            )) {
              offset = $('.navbar-header', _this2.$mainHeader).outerHeight() - 2;
            } else {
              offset += $element.outerHeight() - 2;
            }
          }
        });
        return offset;
      }
    }, {
      key: "onClick",
      value: function onClick(element) {
        var $targetSection = $(this.getTarget(element));
        if (!$targetSection) return false;
        var destination = this.getDestinationOffsetTop($targetSection);
        var offsetElementsHeight = this.getOffsetElementsHeight($targetSection);
        var $navbarCollapse = this.$element.closest('.navbar-collapse');

        if ($targetSection.length) {
          event.preventDefault();
          event.stopPropagation();

          if (liquidWindowWidth() <= liquidMobileNavBreakpoint() && $navbarCollapse.length || liquidWindowWidth() > liquidMobileNavBreakpoint() && $navbarCollapse.is('.navbar-fullscreen')) {
            $navbarCollapse.collapse('hide');
          }

          $('html, body').animate({
            scrollTop: destination - offsetElementsHeight
          }, this.options.scrollSpeed);
        }
      }
    }, {
      key: "getTarget",
      value: function getTarget(element) {
        var $element = $(element);
        var $elementParentRow = $element.parents('.vc_row').last();
        var $nextRow = $elementParentRow.nextAll('.vc_row').first();
        if (!element.hasAttribute('href')) return false;
        var href = element.getAttribute('href');
        var target = href.match(/#/g) && $("#".concat(href.split('#')[1])).get(0);

        if (this.options.scrollBelowSection) {
          return $nextRow.get(0);
        }

        if ($(target).is('.lqd-css-sticky')) {
          target = $(target).closest('.lqd-css-sticky-wrap').get(0);
        }

        return target;
      }
    }, {
      key: "onWindowScroll",
      value: function onWindowScroll(element) {
        var href = element.getAttribute('href').replace(/\s+/g, '-').replace(/%20/g, '-');
        if (!element.hasAttribute('href') || !href.match(/#/g)) return false;

        if ($("#".concat(href.split('#')[1])).length) {
          var $linkElement = $(element);
          var $targetSection = $("#".concat(href.split('#')[1]));
          var targetSectionHeight = $targetSection.outerHeight();
          var targetSectionOffsetTop = this.getDestinationOffsetTop($targetSection);
          var offsetElementsHeight = this.getOffsetElementsHeight($targetSection);
          var scrollPosition = document.documentElement.scrollTop || document.body.scrollTop;

          if (scrollPosition >= targetSectionOffsetTop - offsetElementsHeight - 50 && scrollPosition <= targetSectionHeight + targetSectionOffsetTop - (offsetElementsHeight - 50)) {
            $linkElement.parent().addClass('is-active').siblings().removeClass('is-active');
          } else {
            $linkElement.parent().removeClass('is-active');
          }
        }
      }
    }]);

    return Plugin;
  }();

  ;

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('localscroll-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if (!$('html').hasClass('pp-enabled')) {
    $('[data-localscroll]').liquidLocalScroll();
  }
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidBackToTop';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.$pageContentElement = $('#content');
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        this.firstSectionIO();
      }
    }, {
      key: "firstSectionIO",
      value: function firstSectionIO() {
        var _this = this;

        var $firstSection = this.$pageContentElement.children().not('style').first();

        if ($firstSection.is('.liquid-portfolio')) {
          $firstSection = $firstSection.children('.pf-single-contents').children('.vc_row').first();
        }

        new IntersectionObserver(function (enteries) {
          enteries.forEach(function (entery) {
            var boundingClientRect = entery.boundingClientRect,
                rootBounds = entery.rootBounds;

            if (rootBounds && rootBounds.top >= boundingClientRect.bottom) {
              _this.$element.addClass('is-visible');
            } else {
              _this.$element.removeClass('is-visible');
            }
          });
        }).observe($firstSection.get(0));
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('back-to-top-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  if (!$('html').hasClass('pp-enabled')) {
    $('[data-back-to-top]').liquidBackToTop();
  }
});
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

;

(function ($, window, document, undefined) {
  'use strict';

  var pluginName = 'liquidShop';
  var defaults = {};

  var Plugin =
  /*#__PURE__*/
  function () {
    function Plugin(element, options) {
      _classCallCheck(this, Plugin);

      this.element = element;
      this.$element = $(element);
      this.options = $.extend({}, defaults, options);
      this._defaults = defaults;
      this._name = pluginName;
      this.init();
    }

    _createClass(Plugin, [{
      key: "init",
      value: function init() {
        var _this = this;

        $(document).ajaxSuccess(function (event, request, settings) {
          _this.initPlugins();
        });
        $(document).on('added_to_cart', function () {
          _this.triggerOffcanvasCart();
        });
        $(document).on('removed_from_cart', function () {
          _this.initPlugins();
        });
        $(document).on('qv_loading', function (e, s, v) {
          _this.initPlugins();

          console.log(e);
          console.log(s);
          console.log(v);
        });
      }
    }, {
      key: "initPlugins",
      value: function initPlugins() {
        $('form').liquidFormInputs();

        if ($('body').hasClass('lazyload-enabled')) {
          window.liquidLazyload = new LazyLoad({
            elements_selector: '.ld-lazyload',
            callback_loaded: function callback_loaded(e) {
              $(e).closest('[data-responsive-bg=true]').liquidResponsiveBG();
              $(e).parent().not('#wrap, #content').addClass('loaded');
            }
          });
        }
      }
    }, {
      key: "triggerOffcanvasCart",
      value: function triggerOffcanvasCart() {
        var $offcanvasCart = $('.ld-module-cart-offcanvas');

        if (liquidWindowWidth() > liquidMobileNavBreakpoint() && $offcanvasCart.length && $offcanvasCart.parent().hasClass('lqd-show-on-addtocart')) {
          $offcanvasCart.find('.ld-module-dropdown').collapse('show');
        }
      }
    }]);

    return Plugin;
  }();

  $.fn[pluginName] = function (options) {
    return this.each(function () {
      var pluginOptions = $(this).data('plugin-options') || options;

      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin(this, pluginOptions));
      }
    });
  };
})(jQuery, window, document);

jQuery(document).ready(function ($) {
  $(document).liquidShop();
});

//# sourceMappingURL=theme.js.map
