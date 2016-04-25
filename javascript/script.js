var myApp = myApp || {};
var app = angular.module('myApp', ['ngRoute'])

.config(['$routeProvider',function($routeProvider) {
  $routeProvider
  // route for the home page
    .when('/', {
      templateUrl : 'pages/home.html',
      controller  : 'myCtrl'
  })
}])

.controller('myCtrl', ["$scope", function($scope) {

  $scope.total = 0;
  $scope.commaTotal = 0;
  $scope.fullstopTotal = 0;

  // Count words as user is typing.
  $scope.countWord = function(text) {
    var data = (text) ? text : 0;
    return myApp.textLength(data);
  };

  /* On form submission get the string and format in correct way to get the items ordered alphabetically and count the total */
  $scope.formSubmit = function(wordCountForm) {
    $scope.countSubmitted = true;

    if(wordCountForm.$valid && typeof wordCountForm.wordCountArea.$viewValue !== 'undefined') {
      var text = myApp.formattedText(wordCountForm.wordCountArea.$viewValue).replace(/,/g,'');
      var items = text.split(' ').sort();
      $scope.textArray = myApp.compressArray(items);
      $scope.total = items.length;
      $scope.commaTotal = myApp.formattedText(wordCountForm.wordCountArea.$viewValue).match(/,/g) || 0;
      if($scope.commaTotal !== null && $scope.commaTotal !== 0) {
        $scope.commaTotal = $scope.commaTotal.length;
      }
      $scope.fullstopTotal = myApp.formattedText(wordCountForm.wordCountArea.$viewValue).match(/\./g) || 0;
      if($scope.fullstopTotal !== null && $scope.fullstopTotal !== 0) {
        $scope.fullstopTotal = $scope.fullstopTotal.length;
      }
      $scope.countSubmitted = false;
    }   
  }
}]);

/* Custom validation method added to count the max words allowed - config set in HTML */
app.directive('maxWordCount', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      var maxLimit = attrs.maxWordCount;
      ctrl.$parsers.unshift(function(value){
        var valid = true;
        var data = (value) ? value : 0;
        var stringLength = myApp.textLength(data);

        if(value){
          valid = stringLength <= maxLimit;
        }

        ctrl.$setValidity('maxWordCount', valid);
        return valid ? value : value;
      });

      ctrl.$formatters.unshift(function(value) {
        var valid = true;
        var data = (value) ? value : 0;
        var stringLength = myApp.textLength(data);
        
        if(value){
          valid = stringLength <= maxLimit;
        }

        ctrl.$setValidity('maxWordCount',valid);
        return value;
      });
    }
  };
});

/* Custom validation method added to count the min words allowed - config set in HTML */
app.directive('minWordCount', function() {
  return {
      require: 'ngModel',
      link: function(scope, elm, attrs, ctrl) {
        var minLimit = parseInt(attrs.minWordCount);
        ctrl.$parsers.unshift(function(value){
          var valid = true;
          var data = (value) ? value : 0;
          var stringLength = myApp.textLength(data);
          
          if(value){
              valid = minLimit <= stringLength;
          }

          ctrl.$setValidity('minWordCount', valid);
          return valid ? value : value;
        });

        ctrl.$formatters.unshift(function(value) {
          var valid = true;
          var data = (value) ? value : 0;
          var stringLength = myApp.textLength(data);
          
          if(value){
            valid = minLimit <= stringLength;
          }

          ctrl.$setValidity('minWordCount',valid);
          return value;
        });
      }
  };
});



/* Used to get the total length of word */
myApp.textLength = function(text) {
 var textFormat = [];
 var res = text ? text
    .match(/[[a-z-_^[\]{},.()\'£$&%!:;\/|]+|[^\d+.\d+\s+[.]\s]+/ig) : 0;

  if(text) {
    var elem = res;

    for(i=0; i< elem.length; i++) {
      if(elem[i].match(/[a-z]/g) !== null) {
        textFormat.push(elem[i]);
      }
    }

    var s = textFormat ? textFormat.length : 0; 
  }
  return s ? s : '';
};

/* Used to get the format the text */
myApp.formattedText = function(text) {
var textFormat = [];
 var res = text ? text
    .match(/[[a-z-_^[\]{},.()\'£$&%!:;\/|]+|[^\d+.\d+\s+[.]\s]+/ig) : 0;

  if(text) {
    var elem = res;
    for(i=0; i< elem.length; i++) {
      if(elem[i].charAt(0).match(/[^a-z]/)) {
        elem[i] = elem[i].substring(1);
      }
      if(elem[i].match(/[a-z]/g) !== null) {
        textFormat.push(elem[i]);
      }
    }
  }
  return textFormat.join(' ');
}

/* Group all words starting with same letter and add the count */
myApp.compressArray = function(orig) {
  var compressed = {}
  var copy = orig.slice(0);
  for (var i = 0; i < orig.length; i++) {
    var myCount = 0;    
  
    for (var w = 0; w < copy.length; w++) {
      if (orig[i] == copy[w]) {
        myCount++;
        delete copy[w];
      }
    }

    if (myCount > 0) {
      var item = orig[i];
      var firstChar = item.charAt(0);
      compressed[firstChar] = compressed[ firstChar ] || [];
      compressed[ firstChar ].push({
        'word': item,
        'count': myCount 
      });
    }
  }

  return compressed;
}