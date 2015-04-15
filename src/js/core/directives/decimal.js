

angular.module('ui.grid').directive('decimal', function(maskService){

    return{
        restrict: 'A',
        scope: {
          ngModel:'='
        },
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel){

          maskService.formatarCampoDecimal(element, attrs, 'right');

          ngModel.$parsers.push(function toModel(value) {
            if(!value){ return;}

            var modifiedInput = value.replace('.', '');
            modifiedInput = modifiedInput.replace(',', '.');

            return modifiedInput;
          });

          ngModel.$formatters.push(function toView(value) {
              if(!value){ return;}

              var modifiedInput = value.replace('.', ',');

              return modifiedInput;
          });

        }
    };
});
