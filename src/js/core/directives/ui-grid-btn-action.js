(function() {
    'use strict';
    
    angular.module('ui.grid')
        .directive('uiGridBtnEdit', function() {
            return {
                restrict: 'E',
                replace: true,
                require: '^uiGrid',
                templateUrl: 'ui-grid/uiGridBtnEdit'
            };
        })
        .directive('uiGridBtnDelete', function() {
            return {
                restrict: 'E',
                replace: true,
                require: '^uiGrid',
                templateUrl: 'ui-grid/uiGridBtnDelete'
            };
        });
})();
