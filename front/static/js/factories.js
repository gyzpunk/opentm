wkldApp.factory('User', ['$resource', function($resource) {
    return $resource(
        '/api/users/:userId/',
        {userId: '@id'}
    );
}]);

wkldApp.factory('Task', ['$resource', function($resource) {
    return $resource(
        '/api/tasks/:taskId/',
        {taskId: '@id'},
        {update: {method: 'PUT'}}
    );
}]);

wkldApp.factory('Assignation', ['$resource', function($resource) {
    return $resource(
        '/api/assignations/:assignationId/',
        {assignationId: '@id'},
        {update: {method: 'PUT'}}
    );
}]);