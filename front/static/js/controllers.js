var wkldApp = new angular.module('wkldApp', ['ngResource']);

wkldApp.config(function($httpProvider) {
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

wkldApp.controller('wkldTable', function($scope, $resource) {
    var User = $resource('/api/users/:userId/', {userId: '@id'});
    var Task = $resource('/api/tasks/:taskId/', {taskId: '@id'}, {}, {stripTrailingSlashes: false});
    var Assignation = $resource('/api/assignations/:assignationId/', {assignationId: '@id'});

    $scope.sel_date = new Date();
    
    $scope.slot_type = 'week';
    $scope.nb_slots = 6;

    $scope.task_rows = {};

    $scope.new_task_name = '';

    $scope.users = User.query();

    $scope.prevSlot = function() {$scope.sel_date.setInterval($scope.slot_type, -1);}
    $scope.nextSlot = function() {$scope.sel_date.setInterval($scope.slot_type, 1);}

    $scope.getSlots = function() {
        var ret = [];
        var cur_date = new Date(+$scope.sel_date);
        cur_date.setInterval($scope.slot_type, -1);
        for(var i=0; i<$scope.nb_slots; i++) {
            cur_date.setInterval($scope.slot_type, 1);
            if($scope.slot_type === 'year') {ret.push(cur_date.getFullYear());}
            if($scope.slot_type === 'month') {ret.push(cur_date.getFullYear() + '-' + (cur_date.getMonth()+1));}
            if($scope.slot_type === 'week') {ret.push(cur_date.getFullYear() + '-' + cur_date.getWeek());}
        }
        return ret;
    };

    function getTaskRows() {
        var ret = {};
        var slots = $scope.getSlots();
        var assignations = Assignation.query({user:$scope.current_userId}, function() {
            for(var i in assignations) {
                if(!(assignations[i] instanceof Assignation)) {continue;}
                if(ret[assignations[i]['task_name']] == undefined) {ret[assignations[i]['task_name']] = initializeTaskRow();}
                var index = slots.indexOf(assignations[i]['year']+'-'+assignations[i][$scope.slot_type]);
                if(index >= 0) {ret[assignations[i]['task_name']][index] = assignations[i];}
            }
        });
        return ret;
    }

    function initializeTaskRow() {
        var ret = [];
        for(var i=0; i<$scope.nb_slots; i++) {
            ret.push(
                {'wkld_planned':0, 'wkld_current':0}
            );
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
        switch($scope.slot_type) {
            case 'year':
                return 250;
            case 'month':
                return 30;
            case 'week':
                return 5;
        }
    }

    $scope.addNewTask = function() {
        Task.save({name:$scope.new_task_name}, function() {
            $scope.task_rows[$scope.new_task_name] = initializeTaskRow();
		    $scope.new_task_name = '';
        });
    }

    $scope.task_rows = getTaskRows();
});