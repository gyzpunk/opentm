wkldApp.controller('wkldTable', ['$scope', '$resource', 'User', 'Task', 'Assignation', function($scope, $resource, User, Task, Assignation) {

    $scope.currentUserId = 0;

    $scope.sel_date = new Date();

    $scope.nb_slots = 6;

    $scope.task_rows = {};

    $scope.new_task_name = '';

    $scope.users = User.query();

    $scope.prevSlot = function() {$scope.sel_date.setInterval('week', -1);}
    $scope.nextSlot = function() {$scope.sel_date.setInterval('week', 1);}

    $scope.getSlots = function() {
        var ret = [];
        var cur_date = new Date(+$scope.sel_date);
        cur_date.setInterval('week', -1);
        for(var i=0; i<$scope.nb_slots; i++) {
            cur_date.setInterval('week', 1);
            ret.push(cur_date.getFullYear() + '-' + cur_date.getWeek());
        }
        return ret;
    };

    function getTaskRows() {
        var ret = {};
        var slots = $scope.getSlots();
        Assignation.query({user:$scope.currentUserId}, function(e) {
            angular.forEach(e, function(e) {
                if(!ret[e.task.name]) {ret[e.task.name] = initializeTaskRow();}
                var index = slots.indexOf(e.year+'-'+e.week);
                if(index >= 0) {ret[e.task.name][index] = e;}
            });
        });
        return ret;
    }

    function initializeTaskRow() {
        var ret = [];
        for(var i=0; i<$scope.nb_slots; i++) {
            ret.push(new Assignation({
                'wkld_planned':0,
                'wkld_current':0
            }));
        }
        return ret;
    }

    $scope.refresh = function() {
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
    }

    $scope.addNewTask = function() {
        Task.save({name:$scope.new_task_name}, function(e) {
            $scope.task_rows[$scope.new_task_name] = initializeTaskRow();
            $scope.new_task_name = '';
        });
    }

    $scope.task_rows = getTaskRows();
}]);