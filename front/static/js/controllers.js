var wkldApp = angular.module('wkldApp', []);

wkldApp.controller('wkldTable', function($scope) {
	$scope.sel_date = new Date();
	
	$scope.slot_type = 'month';
	$scope.nb_slots = 6;

	$scope.task_rows = {};

	$scope.new_task_name = '';

	$scope.resources = [
		{
			name: 'Florent'
		},
		{
			name: 'Jeremy'
		}
	];

	$scope.wkld = {
		'Task 1': {
			'2014-44': {
				'planned': 4,
				'current': 4
			},
			'2014-45': {
				'planned': 4,
				'current': 3
			}
		},
		'Task 2': {
			'2014-46': {
				'planned': 5,
				'current': 3
			},
			'2014-48': {
				'planned': 5,
				'current': 1
			}
		}
	};

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
		for(var i in $scope.wkld) {
			ret[i] = initializeTaskRow();
			for(var j in $scope.wkld[i]) {
				var index = slots.indexOf(j);
				if(index >= 0) {ret[i][index] = $scope.wkld[i][j];}
			}
		}
		return ret;
	}

	function initializeTaskRow() {
		var ret = [];
		for(var i=0; i<$scope.nb_slots; i++) {
			ret.push(
				{'planned':0, 'current':0}
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
		return current*100/total
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
		$scope.wkld[$scope.new_task_name] = {};
		$scope.new_task_name = '';
	}

	$scope.task_rows = getTaskRows();
});