wkldApp.directive('otmProgressBar', function() {
    return {
        restrict: 'A',
        scope: {
            total: "=",
            actual: "="
        },
        template: `
            <div class="progress">
                <div class="progress-bar" data-ng-class="getBarClass()" role="progressbar" aria-valuenow="{{consumption()}}" aria-valuemin="0" aria-valuemax="100" style="width: {{ (consumption() < 100) ? consumption() : 100 }}%;">
                    {{ consumption() }}%
                </div>
            </div>
        `,
        link: function(scope, element, attrs) {
            scope.consumption = function() {
                return (scope.total == 0) ? scope.actual*100 : Math.floor(scope.actual*100/scope.total);
            };

            scope.getBarClass = function() {
                if(scope.total < scope.actual) {return 'progress-bar-danger';}
                if(scope.total == scope.actual) {return 'progress-bar-success';}
                return 'progress-bar-info';
            };
        }
    };
});