wkldApp.factory('User', ['$resource', function($resource) {
    return $resource(
        '/api/users/:id/',
        {id: '@id'}
    );
}])

.factory('Task', ['$resource', function($resource) {
    return $resource(
        '/api/tasks/:id/',
        {id: '@id'},
        {update: {method: 'PUT'}}
    );
}])

.factory('Assignation', ['$resource', function($resource) {
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
            },
            save: {
                method:'POST',
                transformRequest: function(data, headersGetter) {
                    data.user_id = data.user.id;
                    data.task_id = data.task.id;
                    return angular.toJson(data);
                }
            }
        }
    );
}])

.factory('alert', ['$timeout', function alertFactory($timeout) {
    var alert = {}

    alert.list = [];

    alert.add = function(type, msg) {
        alert.list.push({type: type, msg: msg});
        $timeout(this.close, 5000, true, alert.list.length - 1);
    };

    alert.close = function(id) {
        alert.list.splice(id, 1);
    };

    return alert;
}])

.factory('slots', [function slotsFactory() {
    var slots = {};
    var selectedDate = new Date();
    var nb = 6;

    var initialize = function() {
        // Built slots array
        var cur_date = new Date(+selectedDate);
        slots.slots = [];
        cur_date.setInterval('week', -1);
        for(var i=0; i<nb; i++) {
            cur_date.setInterval('week', 1);
            slots.slots.push([cur_date.getFullYear(), cur_date.getWeek()]);
        }
    };

    slots.previous = function() {
        selectedDate.setInterval('week', -1);
        initialize();
    };

    slots.next = function() {
        selectedDate.setInterval('week', +1);
        initialize();
    };

    slots.setNb = function(value) {
        nb = value;
        initialize();
    };

    slots.slots = [];

    initialize();

    return slots;
}]);