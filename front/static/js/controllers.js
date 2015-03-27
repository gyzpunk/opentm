wkldApp.controller('wkldTable', ['$scope', '$resource', 'User', 'Task', 'Assignation', function($scope, $resource, User, Task, Assignation) {

    $scope.currentUserId = 0;
    $scope.sel_date = new Date();
    $scope.nb_slots = 6;
    $scope.task_rows = {};
    $scope.hSlots = [];
    $scope.newTaskName = '';
    $scope.alerts = [];
    $scope.users = User.query();
    $scope.tasks = Task.query();

    $scope.prevSlot = function() {$scope.sel_date.setInterval('week', -1);}
    $scope.nextSlot = function() {$scope.sel_date.setInterval('week', 1);}

    function addAlert(type, msg) {
        $scope.alerts.push({type: type, msg: msg});
    }

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    }

    function getSlots() {
        /**
         * Returns a 2-dimensional array containing years and weeks.
         * ex: [[2014, 1], [2014, 2]]
         */
        var ret = [];
        var cur_date = new Date(+$scope.sel_date);
        cur_date.setInterval('week', -1);
        for(var i=0; i<$scope.nb_slots; i++) {
            cur_date.setInterval('week', 1);
            ret.push([cur_date.getFullYear(), cur_date.getWeek()]);
        }
        return ret;
    }

    function getTaskRows() {
        var ret = {};
        var assignations = {};

        Assignation.query({user:$scope.currentUserId}, function(e) {
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
                    angular.forEach($scope.hSlots, function(d) {
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

    $scope.refresh = function() {
        $scope.hSlots = getSlots();
        $scope.task_rows = getTaskRows();
    }

    function fillEmptyTaskRow(task) {
        $scope.task_rows[task.name] = [];
        angular.forEach($scope.hSlots, function(d) {
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
                    addAlert('success', 'The task '+task.name+' was properly created.');
                }, function() {
                    addAlert('danger', 'The task '+task.name+' failed to be created.');
                }
            );
        } else {
            fillEmptyTaskRow(task);
        }

        $scope.newTaskName = '';
    }


}])

.controller('assignationCellController', ['$scope', '$log', function($scope, $log) {
    $scope.assignation = $scope.slot;
    $scope.consumption = 0;

    $scope.save = function() {
        if(assignation.id) {
            assignation.$update(
                function() {addAlert('success', 'Assignation #'+assignation.id+' was properly updated.')},
                function() {addAlert('danger', 'Assignation #'+assignation.id+' failed to be updated.')}
            );
        } else {
            assignation.$save(
                function() {addAlert('success', 'Assignation #'+assignation.id+' was properly created.')},
                function() {addAlert('danger', 'Assignation #'+assignation.id+' failed to be created.')}
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
        $scope.consumption = ($scope.slot.wkld_planned == 0) ? $scope.slot.wkld_current*100 : Math.floor($scope.slot.wkld_current*100/$scope.slot.wkld_planned);
    });
}]);