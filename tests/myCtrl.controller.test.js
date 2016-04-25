describe('wordCount', function() {
  beforeEach(module('myApp'));
  beforeEach(module('templates'));

  beforeEach(inject(function($controller, $rootScope, $templateCache, $compile) {
    scope = $rootScope.$new();
    var view1Ctrl = $controller('myCtrl', {
      '$scope': $rootScope.$new()
    });

    templateHtml = $templateCache.get('pages/home.html');
    formElem = angular.element(templateHtml);
    $compile(formElem)(scope);
    scope.$digest();
    form = scope.wordCountForm;
  }));

  it('should pass with valid string with length min word length of 5', function() {
    form.wordCountArea.$setViewValue('This is a test string');
    expect(form.wordCountArea.$valid).toBe(true);
  });

  it('should pass($valid is false) with string with length less than 5 words', function() {
    form.wordCountArea.$setViewValue('This is a test');
    expect(form.wordCountArea.$valid).toBe(false);
  });

  it('should pass($valid is false) string contains a number', function() {
    form.wordCountArea.$setViewValue('There are 2 tests available');
    expect(form.wordCountArea.$valid).toBe(false);
  });

  it('should pass string contains a special character', function() {
    form.wordCountArea.$setViewValue('There are [tests] available for this string');
    expect(form.wordCountArea.$valid).toBe(true);
  });

  it('should pass string length with value of 8 words', function() {
    var wordLength = myApp.textLength('This is a test value, for this string.');
    expect(wordLength).toEqual(8);
  });

  it('submit form without anything', function() {
    formElem.find('button').triggerHandler('click');
    expect(form.wordCountArea.$viewValue).toEqual(undefined);
  });

  it('get total number of comma values', function() {
    var textAreaContent = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?';
    expect(textAreaContent.match(/,/g).length).toEqual(9);
  });


  it('get total number of full stops', function() {
    var textAreaContent = 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?';
    expect(textAreaContent.match(/\./g).length).toEqual(3);
  });

});



