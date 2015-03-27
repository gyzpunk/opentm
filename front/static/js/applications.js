var wkldApp = new angular.module('wkldApp', ['ngResource', 'ui.bootstrap']);

wkldApp.config(['$httpProvider', '$resourceProvider', function($httpProvider, $resourceProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $httpProvider.defaults.cache = false;
    $resourceProvider.defaults.stripTrailingSlashes = false;
}])

.value('currentUser', {id: 0});