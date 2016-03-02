/// <reference path="../scope/iappscope.ts" />
/// <reference path="../scope/userscope.ts" />

module App.Controllers {
    "use strict";
    export class TestController {

        static $inject = ["$scope"];

        constructor(private $scope: Scope.IAppScope) {
            if (this.$scope.user === null || this.$scope.user === undefined) {
                this.$scope.user = new Scope.User();
            }
        }

        public clear(): void {
            this.$scope.user.Name = "";
            this.$scope.user.SessionUniqKey = "";
        }
    }
} 