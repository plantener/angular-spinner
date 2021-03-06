 (function (factory) {
   if (typeof define === 'function' && define.amd) {
     // AMD
     define(['angular', 'spinjs'], factory);
   } else if (typeof exports === 'object') {
     // CommonJS
     factory(require('angular'), require('spinjs'));
   } else {
     // Browser globals
     factory(window.angular, window.Spinner)
   }
 }(function (angular, Spinner) {
   'use strict';

   angular.module('plantener.spinner', [])

     .value('spinnerOptions', {
       active: false, // Defines current loading state
       text: 'Loading...', // Display text
       className: '', // Custom class, added to directive
       overlay: true, // Display overlay
       spinner: true, // Display spinner
       valign: 'middle', // Vertical alignment of the spinner
       spinnerOptions: {
         lines: 12, // The number of lines to draw
         length: 7, // The length of each line
         width: 4, // The line thickness
         radius: 10, // The radius of the inner circle
         rotate: 0, // Rotation offset
         corners: 1, // Roundness (0..1)
         color: '#000', // #rgb or #rrggbb
         direction: 1, // 1: clockwise, -1: counterclockwise
         speed: 2, // Rounds per second
         trail: 100, // Afterglow percentage
         opacity: 1 / 4, // Opacity of the lines
         fps: 20, // Frames per second when using setTimeout()
         zIndex: 2e9, // Use a high z-index by default
         className: 'plantener-spin', // CSS class to assign to the element
         top: 'auto', // Center vertically
         left: '50%', // Center horizontally
         position: 'relative' // Element position
       }
     })

     .service('$spinner', ['$rootScope', 'spinnerOptions', function ($rootScope, spinnerOptions) {
       var self = this;

       /**
        * Overrides default options
        * @param {object} options
        */
       self.setDefaultOptions = function (options) {
         extend(true, spinnerOptions, options);
       };

       /**
        * Activates loading state by key
        * @param {string} key
        */
       self.start = function (key) {
         $rootScope.$evalAsync(function() {
           $rootScope.$broadcast('$loadingStart', key);
         });
       };

       /**
        * Update loading state by key with loadingOptions object
        * @param {string} key
        * @param {object} options
        */
       self.update = function (key, options) {
         $rootScope.$evalAsync(function() {
           $rootScope.$broadcast('$loadingUpdate', key, options);
         });
       };

       /**
        * Deactivates loading state by key
        * @param {string} key
        */
       self.stop = function (key) {
         $rootScope.$evalAsync(function() {
           $rootScope.$broadcast('$loadingStopped', key);
         });
       };
     }])

     .directive('plantenerSpinner', ['$rootScope', 'spinnerOptions', function ($rootScope, spinnerOptions) {
       return {
         link: function (scope, element, attrs) {
           var spinner = null,
             key = attrs.plantenerSpinner || false,
             options,
             container,
             body,
             spinnerContainer,
             text;

           /**
            * Starts spinner
            */
           var start = function () {
             if (container) {
               container.addClass('plantener-spinner-active');
             }
             if (spinner) {
               spinner.spin(spinnerContainer[0]);
             }
           };

           /**
            * Update spinner, use force to update when loader is already started
            */
           var update = function (newOptions, force) {
                 stop();

                 options = extend(true, {}, spinnerOptions, newOptions);

                 // Build template
                 body = angular.element('<div></div>')
                   .addClass('plantener-spinner-body');
                 container = angular.element('<div></div>')
                   .addClass('plantener-spinner')
                   .append(body);

                 if (options.valign !== 'middle'){
                   body.css('vertical-align', options.valign);
                 }
                 if (options.overlay) {
                   container.addClass('plantener-spinner-overlay');
                 }
                 if (options.className) {
                   container.addClass(options.className);
                 }
                 if (options.spinner) {
                   spinnerContainer = angular.element('<div></div>')
                     .addClass('plantener-spinner-spinner');
                   body.append(spinnerContainer);
                   spinner = new Spinner(options.spinnerOptions);
                 }
                 if (options.text) {
                   text = angular.element('<div></div>')
                     .addClass('plantener-spinner-text')
                     .text(options.text);

                     if (options.spinnerOptions.top.indexOf('px') > -1){
                       text.css('top', parseFloat(options.spinnerOptions.top) + 25 + 'px'); // 25px is the default styling
                     }

                   body.append(text);
                 }

                 element.append(container);

                 if ( options.active || !key || force) {
                     start();
                 }
           };

           /**
            * Stops spinner
            */
           var stop = function () {
             if (container) {
               container.removeClass('plantener-spinner-active');
             }
             if (spinner) {
               spinner.stop();
             }
           };

           scope.$watch(attrs.plantenerSpinnerOptions, function (newOptions) {
             update(newOptions);
           }, true);

           $rootScope.$on('$loadingStart', function (event, loadKey) {
             if (loadKey === key) {
               start();
             }
           });

           $rootScope.$on('$loadingUpdate', function (event, loadKey, options) {
             if (loadKey === key) {
               update(options, true);
             }
           });

           $rootScope.$on('$loadingStopped', function (event, loadKey) {
             if (loadKey === key) {
               stop();
             }
           });

           scope.$on('$destroy', function () {
             stop();
             spinner = null;
           });
         }
       };
     }]);

   /**
    * Extends the destination object `dst` by copying all of the properties from the `src` object(s)
    * to `dst`. You can specify multiple `src` objects.
    *
    * @param   {Boolean} deep If true, the merge becomes recursive (optional)
    * @param   {Object}  dst  Destination object.
    * @param   {Object}  src  Source object(s).
    * @returns {Object}       Reference to `dst`.
    */
   function extend(dst) {
     var deep = false,
       i = 1;

     if (typeof dst === 'boolean') {
       deep = dst;
       dst = arguments[1] || {};
       i++;
     }

     angular.forEach([].slice.call(arguments, i), function (obj) {
       var array, clone, copy, key, src;

       for (key in obj) {
         src = dst[key];
         copy = obj[key];

         if (dst === copy) {
           continue;
         }

         if (deep && copy && (angular.isObject(copy) ||
           (array = angular.isArray(copy)))) {

           if (array) {
             clone = (src && angular.isArray(src)) ? src : [];
           } else {
             clone = (src && angular.isObject(src)) ? src : {};
           }

           dst[key] = extend(deep, clone, copy);
         }
         else if (copy !== undefined) {
           dst[key] = copy;
         }
       }
     });

     return dst;
   }

 }));
