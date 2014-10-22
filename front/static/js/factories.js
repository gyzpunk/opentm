wkldApp.factory('User', ['$resource', function($resource) {
    return $resource(
        '/api/users/:id/',
        {id: '@id'}
    );
}]);

wkldApp.factory('Task', ['$resource', function($resource) {
    return $resource(
        '/api/tasks/:id/',
        {id: '@id'},
        {update: {method: 'PUT'}}
    );
}]);

wkldApp.factory('Assignation', ['$resource', function($resource) {
    return $resource(
        '/api/assignations/:id/',
        {id: '@id'},
        {
            update: {
                method:'PUT',
                transformRequest: function(data, headersGetter) {
                    data.user_id = data.user.id;
                    data.task_id = data.task.id;
                    return angular.toJson(data);
                }
            }
        }
    );
}]);