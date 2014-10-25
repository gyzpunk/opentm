wkldApp.controller('wkldTable', ['$scope', '$resource', 'User', 'Task', 'Assignation', function($scope, $resource, User, Task, Assignation) {

    $scope.currentUserId = 0;

    $scope.sel_date = new Date();

    $scope.nb_slots = 6;

    $scope.task_rows = {};
    $scope.hSlots = [];

    $scope.new_task_name = '';

    $scope.users = User.query();

    $scope.prevSlot = function() {$scope.sel_date.setInterval('week', -1);}
    $scope.nextSlot = function() {$scope.sel_date.setInterval('week', 1);}

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
    };

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
                        y = d[0];
                        w = d[1];
                        var t_as;
                        if(as[y][w]) {
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

    $scope.getPercentage = function(current, total) {
        if(total == 0) {
            if(current > 0) {return 101;}
            return -1;
        }
        return Math.floor(current*100/total)
    };

    $scope.getAchClass = function(current, planned) {
        if(planned < current) {return 'progress-bar-danger';}
        if(planned == current) {return 'progress-bar-success';}
        return 'progress-bar-info';
    };

    $scope.getInputMax = function() {
        return 5;
    };

    $scope.addNewTask = function() {
        Task.save({name:$scope.new_task_name}, function(task) {
            $scope.task_rows[task.name] = [];
            $scope.new_task_name = '';
            angular.forEach($scope.hSlots, function(d) {
                y = d[0];
                w = d[1];
                var t_as;
                t_as = new Assignation({year:y, week:w, wkld_planned:0, wkld_current:0});
                t_as.task = new Task({id:task.id});
                t_as.user = new User({id:$scope.currentUserId});
                $scope.task_rows[task.name].push(t_as);
            });
        });
    };

    $scope.saveAssignation = function(assignation) {
        if(assignation.id) {
            assignation.$update();
        } else {
            assignation.$save();
        }
    };

    $scope.refresh();
}]);