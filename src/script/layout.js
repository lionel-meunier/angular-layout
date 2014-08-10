/**
 * 
 * Sidebar left and right
 */
_.mixin(_.str.exports());
angular.module('lme-layout', []);

angular.module('lme-layout').directive('layout', ['$http', '$templateCache', '$compile', function($http, $templateCache, $compile) {
        return {
            name: 'layout',
            restrict: 'A',
            controller: function($scope, $element, $attrs) {
                this.section = {};
                this.render = {};
                var self = this;
                this.addSection = function(name, data) {
                    self.section[name] = data;
                };

                this.addRender = function(name, data) {
                    self.render[name] = data;
                    self.render[name].html(self.section[name]);
                    self.render[name].addClass('compiled');
                    $compile(self.render[name])($scope);
                };
            },
            link: function($scope, $element, $attrs, ctrl) {
                var element;
                $scope.$watch($attrs.layout, function(n, o) {
                    $http.get(n).success(function(data) {
                        if (element) {
                            //Todo fonctionne par car pert la correspondance du scope initiale
                            element.remove();
                        }
                        element = angular.element(data);
                        $element.append(element);
                        ctrl.layoutCompiled = $compile(element)($scope);
                    });
                });

            }
        };
    }]);
angular.module('lme-layout').directive('render', [function() {
        return {
            restrict: 'A',
            controller: function($scope, $element, $attrs) {
                if (!$element.hasClass('compiled')) {
                    var layoutCtrl = $element.controller('layout');
                    console.log(layoutCtrl);
                    if (layoutCtrl) {
                        layoutCtrl.addRender($attrs.render, $element);
                    }
                }
            },
        };
    }]);

angular.module('lme-layout').directive('section', [function() {
        return {
            restrict: 'A',
            required: '^layout',
            controller: function($scope, $element, $attrs) {
                /*
                 this.layoutCtrl = $element.controller('layout');
                 var layoutCtrl = $element.controller('layout');
                 if(layoutCtrl){
                 
                 layoutCtrl.addSection($attrs.section, $element);
                 //Todo fonctionne par car pert la correspondance du scope initiale
                 $element.wrap('<div class="ng-hide"></div>');
                 }
                 */
            },
            compile: function compile(tElement, tAttrs, transclude) {
                var template = tElement.html();
                return function postLink($scope, $element, $attrs, ctrl) {
                    var layoutCtrl = $element.controller('layout');
                    layoutCtrl.addSection($attrs.section, template);
                    $element.wrap('<div class="ng-hide"></div>');
                }
            }
        };
    }]);
