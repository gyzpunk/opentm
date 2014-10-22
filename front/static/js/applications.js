var wkldApp = new angular.module('wkldApp', ['ngResource']);

wkldApp.config(['$httpProvider', '$resourceProvider', function($httpProvider, $resourceProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);