module App.Controllers {

    export interface IScope extends ng.IScope {
        events: BaseController;
    }

    export class BaseController {
        scope: IScope;

        constructor($scope: IScope) {
            this.scope = $scope;
            this.scope.events = this;
        }
    }
} 