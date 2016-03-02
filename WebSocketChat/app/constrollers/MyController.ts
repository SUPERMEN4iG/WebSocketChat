module App.Controllers {

    export interface IMyMessage {
        title: string;
    }

    export interface IMyScope extends App.Controllers.IScope {
        message: IMyMessage;
    }

    export class MyController extends App.Controllers.BaseController {
        scope: IMyScope;

        static $inject = ['$scope'];

        constructor($scope: IMyScope) {
            super($scope);
            $scope.message = { title: "Hello World!!" };
        }

        clickMe() {
            alert(this.scope.message.title);
        }
    }
}