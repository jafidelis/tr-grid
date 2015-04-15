

angular.module('ui.grid')
  .factory('maskService', function() {

      var service = {};

      var DOT = '.';
      var COMMA = ',';
      var NONE = '';
      var ZERO = 0;

      service.formatarCampoDecimal = function(element, attrs, align) {

        var precision = (attrs.decimal) ? attrs.decimal : 2;
        precision = Number(precision);

        return element.
        maskMoney({thousands: DOT, decimal: COMMA, allowZero: true, precision: precision}).
        css('text-align', align);
      };

      service.formatarCampoInteiro = function(element, attrs, align) {

          return element.
          maskMoney({precision: ZERO, thousands: NONE, decimal: NONE}).
          css('text-align', align);
      };

      return service;
  })
  .controller('cpfController', function($scope) {

    $scope.validarCPF = function(cpf) {
      var filtro = /^\d{3}.\d{3}.\d{3}-\d{2}$/i;

      if(!filtro.test(cpf)) {
        //window.alert("CPF inválido. Tente novamente.");
        return false;
      }

      cpf = remove(cpf, '.');
      cpf = remove(cpf, '-');

      if(cpf.length !== 11 || cpf === '00000000000' || cpf === '11111111111' ||
        cpf === '22222222222' || cpf === '33333333333' || cpf === '44444444444' ||
        cpf === '55555555555' || cpf === '66666666666' || cpf === '77777777777' ||
        cpf === '88888888888' || cpf === '99999999999') {
        //window.alert("CPF inválido. Tente novamente.");
        return false;
      }

      var soma = 0;
      for(var i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }

      var resto = 11 - (soma % 11);
      if(resto === 10 || resto === 11) {
        resto = 0;
      }

      if(resto !== parseInt(cpf.charAt(9))) {
        //window.alert("CPF inválido. Tente novamente.");
        return false;
      }

      soma = 0;
      for(i = 0; i < 10; i ++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }

      resto = 11 - (soma % 11);
      if(resto === 10 || resto === 11) {
        resto = 0;
      }

      if(resto !== parseInt(cpf.charAt(10))) {
        //window.alert("CPF inválido. Tente novamente.");
        return false;
      }

      return true;
    };

    function remove(str, sub) {
      var i = str.indexOf(sub);
      var r = '';
      if (i == -1) return str; {
        r += str.substring(0,i) + remove(str.substring(i + sub.length), sub);
      }

      return r;
    }

    $scope.cpfMask = function (v) {
      v = v.replace(/\D/g,'');                 //Remove tudo o que não é dígito
      v = v.replace(/(\d{3})(\d)/,'$1.$2');    //Coloca ponto entre o terceiro e o quarto dígitos
      v = v.replace(/(\d{3})(\d)/,'$1.$2');    //Coloca ponto entre o setimo e o oitava dígitos
      v = v.replace(/(\d{3})(\d)/,'$1-$2');   //Coloca ponto entre o decimoprimeiro e o decimosegundo dígitos

      return v;
    };
  })
  .directive('trCpf', function() {

      return {
          restrict: 'A',
          require: 'ngModel',
          controller: 'cpfController',
          link: function(scope, element, attrs, ctrl) {

            ctrl.$parsers.unshift(function() {

            });

            ctrl.$formatters.unshift(function(value) {

              return scope.cpfMask(value);
            });

            element.mask('999.999.999-99');
          },
      };
  })
  .controller('cnpjController', function($scope) {

    $scope.validarCnpj = function(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g,'');

   if(cnpj === '') {
     return false;
   }
   if (cnpj.length !== 14) {
     return false;
   }

   // Elimina CNPJs invalidos conhecidos
   if (cnpj === '00000000000000' ||
       cnpj === '11111111111111' ||
       cnpj === '22222222222222' ||
       cnpj === '33333333333333' ||
       cnpj === '44444444444444' ||
       cnpj === '55555555555555' ||
       cnpj === '66666666666666' ||
       cnpj === '77777777777777' ||
       cnpj === '88888888888888' ||
       cnpj === '99999999999999') {

       return false;
     }

   // Valida DVs
   var tamanho = cnpj.length - 2;
   var numeros = cnpj.substring(0,tamanho);
   var digitos = cnpj.substring(tamanho);
   var soma = 0;
   var pos = tamanho - 7;
   for (var i = tamanho; i >= 1; i--) {
     soma += numeros.charAt(tamanho - i) * pos--;
     if (pos < 2) {
        pos = 9;
     }
   }
   var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

   if (resultado !== Number(digitos.charAt(0))) {
     return false;
   }

   tamanho = tamanho + 1;
   numeros = cnpj.substring(0,tamanho);
   soma = 0;
   pos = tamanho - 7;
   for (i = tamanho; i >= 1; i--) {
     soma += numeros.charAt(tamanho - i) * pos--;
     if (pos < 2) {
        pos = 9;
     }
   }
   resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
   if (resultado !== Number(digitos.charAt(1))) {
     return false;
   }

   return true;

  };

  $scope.cnpjMask = function (v) {
    v = v.replace(/\D/g,'');                 //Remove tudo o que não é dígito
    v = v.replace(/(\d{2})(\d)/,'$1.$2');    //Coloca ponto entre o segundo e o terceiro dígitos
    v = v.replace(/(\d{3})(\d)/,'$1.$2');    //Coloca ponto entre o sexto e o sétimo dígitos
    v = v.replace(/(\d{3})(\d)/,'$1/$2');    //Coloca barra entre o oitavo e o nono dígitos
    v = v.replace(/(\d{4})(\d)/,'$1-$2');    //Coloca ífem entre o décimo segundo e o décimo terceiro dígitos

    return v;
  };

  })
  .directive('trCnpj', function() {

      return{
          restrict: 'A',
          require: 'ngModel',
          controller: 'cnpjController',
          link: function(scope, element, attrs, ctrl) {

            ctrl.$parsers.unshift(function() {

            });

            ctrl.$formatters.unshift(function(value) {

              return scope.cnpjMask(value);
            });

            element.mask('99.999.999/9999-99');
          }
      };

  })
  .controller('telefoneController', function($scope) {

    $scope.telefoneMask10Digits = function (v) {
      v = v.replace(/\D/g,'');                 //Remove tudo o que não é dígito
      v = v.replace(/(\d{0})(\d)/,'$1($2');    //Coloca ponto entre o segundo e o terceiro dígitos
      v = v.replace(/(\d{2})(\d)/,'$1) $2');    //Coloca ponto entre o sexto e o sétimo dígitos
      v = v.replace(/(\d{4})(\d)/,'$1-$2');    //Coloca barra entre o oitavo e o nono dígitos

      return v;
    };

    $scope.telefoneMask11Digits = function(v) {
      v = v.replace(/\D/g,'');                 //Remove tudo o que não é dígito
      v = v.replace(/(\d{0})(\d)/,'$1($2');    //Coloca ponto entre o segundo e o terceiro dígitos
      v = v.replace(/(\d{2})(\d)/,'$1) $2');    //Coloca ponto entre o sexto e o sétimo dígitos
      v = v.replace(/(\d{5})(\d)/,'$1-$2');    //Coloca barra entre o oitavo e o nono dígitos

      return v;
    };

  })
  .directive('trTelefone', function() {

      return {
          restrict: 'A',
          require: 'ngModel',
          controller: 'telefoneController',
          scope: {
            bindModel:'=ngModel'
          },
          link: function(scope, element, attrs, ctrl) {

            element.mask('(99) 9999?9-9999');

              $(element).on('change', function() {
                var value = this.value.replace(/\D/g, '');

                if(value.length > 10) {
                  element.mask('(99) 99999-999?9');
                }else{
                  element.mask('(99) 9999-9999?9');
                }

              });

            ctrl.$parsers.unshift(function() {

            });

            ctrl.$formatters.unshift(function(value) {

              if(!value){return;}

              value = value.replace(/\D/g,'');

               if(value.length > 10){
                 return scope.telefoneMask11Digits(value);
               }else{
                 return scope.telefoneMask10Digits(value);
               }

            });

          }
      };
  })
  .controller('mesAnoController', function($scope) {

    $scope.mesAnoMask = function (v) {
      v = v.replace(/\D/g,'');                 //Remove tudo o que não é dígito
      v = v.replace(/(\d{2})(\d)/,'$1/$2');    //Coloca barra entre o segundo e o terceiro dígitos

      return v;
    };

  })
  .directive('trMesAno', function() {

      return {
          restrict: 'A',
          require: 'ngModel',
          controller: 'mesAnoController',

          link: function(scope, element, attrs, ctrl) {

            ctrl.$parsers.unshift(function() {

            });

            ctrl.$formatters.unshift(function(value) {

              if(!value) {return;}

              value = value.replace(/\D/g,'');

              return scope.mesAnoMask(value);
            });

            element.mask('99/9999');

          }
      };
  })
  .controller('cepController', function($scope) {

    $scope.cepMask = function (v) {
      v = v.replace(/\D/g,'');                 //Remove tudo o que não é dígito
      v = v.replace(/(\d{2})(\d)/,'$1.$2');    //Coloca ponto entre o segundo e o terceiro dígitos
      v = v.replace(/(\d{3})(\d)/,'$1-$2');    //Coloca ífem entre o quinto e o sexto

      return v;
    };

  })
  .directive('trCep', function() {

      return {
          restrict: 'A',
          require: 'ngModel',
          controller: 'cepController',

          link: function(scope, element, attrs, ctrl) {

            ctrl.$parsers.unshift(function() {

            });

            ctrl.$formatters.unshift(function(value) {

              if(!value) {return;}

              value = value.replace(/\D/g,'');

              return scope.cepMask(value);
            });

            element.mask('99.999-999');

          }
      };
  })
  .directive('trInteger', function(maskService) {

      return {
          restrict: 'A',
          require: 'ngModel',

          link: function(scope, element, attrs) {

            maskService.formatarCampoInteiro(element, attrs, '');

          }
      };
  })
  .directive('trDecimal', function(maskService) {

      return {
          restrict: 'A',
          require: 'ngModel',
          link: function(scope, element, attrs, ctrl) {

            ctrl.$parsers.unshift(function(value) {

              value = value.replace('.', '');
              value = value.replace(',', '.');

              return value;
            });

            ctrl.$formatters.unshift(function(value) {

              if(!value) {return;}

              if(value.indexOf(',') !== -1) {

                value = value.replace(',', '.');
              }

              if(value.indexOf('.') === -1 && value.indexOf(',') === -1) {

                value = value + '.00';
              }

              return value;
            });

            maskService.formatarCampoDecimal(element, attrs, 'right');
          }
      };
  });
