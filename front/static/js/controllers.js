wkldApp.controller('wkldTable', ['$scope', 'User', 'Task', 'slots', 'currentUser', 'alert', function($scope, User, Task, slots, currentUser, alert) {
    $scope.currentUserId = currentUser.id;
    $scope.users = User.query();
    $scope.tasks = Task.query();
    $scope.alert = alert;

    $scope.prevSlot = function() {slots.previous();};
    $scope.nextSlot = function() {slots.next();};

    $scope.$watch('currentUserId', function(value) {
        currentUser.id = value;
    });
}])

.controller('wkldTableController', ['$scope', 'slots', 'Assignation', 'User', 'Task', 'currentUser', 'alert', function($scope, slots, Assignation, User, Task, currentUser, alert) {
    $scope.nbSlots = slots.slots.length;
    $scope.task_rows = {};
    $scope.newTaskName = '';
    $scope.slots = slots;

    function getTaskRows() {
        var ret = {};
        var assignations = {};

        Assignation.query({user:currentUser.id}, function(e) {
            // Normalize assignations for selected user in a hashtable
            angular.forEach(e, function(e) {
                if(!assignations[e.task.id]) {assignations[e.task.id] = {};}
                if(!assignations[e.task.id][e.year]) {assignations[e.task.id][e.year] = {};}
                assignations[e.task.id][e.year][e.week] = e;
            });

            // Fill the ret hash
            angular.forEach(assignations, function(as, t_id) {
                Task.get({id:t_id}, function(task) {
                    ret[task.name] = [];
                    angular.forEach(slots.slots, function(d) {
                        var y = d[0];
                        var w = d[1];
                        var t_as;
                        if(as[y] && as[y][w]) {
                            t_as = as[y][w];
                        } else {
                            t_as = new Assignation({year:y, week:w, wkld_planned:0, wkld_current:0});
                            t_as.task = new Task({id:task.id});
                            t_as.user = new User({id:$scope.currentUserId});
                        }
                        ret[task.name].push(t_as);
                    });
                });
            });
        });

        return ret;
    }

    var refresh = function() {
        $scope.task_rows = getTaskRows();
    }

    function fillEmptyTaskRow(task) {
        $scope.task_rows[task.name] = [];
        angular.forEach(slots.slots, function(d) {
            y = d[0];
            w = d[1];
            var t_as;
            t_as = new Assignation({year:y, week:w, wkld_planned:0, wkld_current:0});
            t_as.task = new Task({id:task.id});
            t_as.user = new User({id:$scope.currentUserId});
            $scope.task_rows[task.name].push(t_as);
        });
    }

    $scope.addNewTask = function() {
        var task;

        angular.forEach($scope.tasks, function(t) {
            if(t.name == $scope.newTaskName) {task = t; return;}
        });

        if(!task) {
            task = new Task();
            task.name = $scope.newTaskName;
            var tt = task.$save(
                function() {
                    fillEmptyTaskRow(task);
                    alert.add('success', 'The task '+task.name+' was properly created.');
                }, function() {
                    alert.add('danger', 'The task '+task.name+' failed to be created.');
                }
            );
        } else {
            fillEmptyTaskRow(task);
        }

        $scope.newTaskName = '';
    };

    $scope.$watch('nbSlots', function(newValue, oldValue) {
        slots.setNb(newValue);
    });

    $scope.$watch(function() { return currentUser.id }, function() {
        refresh();
    });

    $scope.$watch(function() { return slots.slots }, function() {
        refresh();
    });
}])

.controller('assignationCellController', ['$scope', '$log', 'alert', function($scope, $log, alert) {
    $scope.consumption = 0;

    $scope.save = function() {
        if($scope.assignation.id) {
            $scope.assignation.$update(
                function() {alert.add('success', 'Assignation #'+$scope.assignation.id+' was properly updated.')},
                function() {alert.add('danger', 'Assignation #'+$scope.assignation.id+' failed to be updated.')}
            );
        } else {
            $scope.assignation.$save(
                function() {alert.add('success', 'Assignation #'+$scope.assignation.id+' was properly created.')},
                function() {alert.add('danger', 'Assignation #'+$scope.assignation.id+' failed to be created.')}
            );
        }
    };

    $scope.getInputMax = function() {
        return 5;
    }

    var getPercentage = function() {
        if($scope.assignation.wkld_planned == 0) {
            if($scope.assignation.wkld_current > 0) {return 101;}
            return -1;
        }
        return Math.floor($scope.assignation.wkld_current*100/$scope.assignation.wkld_planned)
    }

    $scope.getAchClass = function() {
        if($scope.assignation.wkld_planned < $scope.assignation.wkld_current) {return 'progress-bar-danger';}
        if($scope.assignation.wkld_planned == $scope.assignation.wkld_current) {return 'progress-bar-success';}
        return 'progress-bar-info';
    }

    $scope.$watchCollection('assignation', function(newAssignation, oldAssignation) {
        $log.info('Assignation changed');
        $scope.consumption = (newAssignation.wkld_planned == 0) ? newAssignation.wkld_current*100 : Math.floor(newAssignation.wkld_current*100/newAssignation.wkld_planned);
    });
}]);