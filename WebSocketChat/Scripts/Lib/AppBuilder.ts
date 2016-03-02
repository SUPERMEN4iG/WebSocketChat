/// <reference path="scope/iappscope.ts" />
/// <reference path="controllers/testcontroller.ts" />

module App
{
    "use strict";

    export class AppBuilder
    {
        app: ng.IModule;

        constructor(name : string)
        {
            this.app = angular.module(name, [
                "ngRoute",
                "ngAnimate",
                "ngResource"
            ]);

            this.app.controller("userController", [
                "$scope", ($scope: Scope.IAppScope)
                    => new App.Controllers.TestController($scope)
            ]);

            this.app.config([
                "$routeProvider",
                ($routeProvider: ng.route.IRouteProvider) => {
                    $routeProvider
                        .when("/user",
                        {
                            controller: "userController",
                            controllerAs: "demoController",
                            templateUrl: "Scripts/Lib/views/userView.html"
                        })
                        .otherwise({
                            redirectTo: "/user"
                        });
                }
            ]);

            this.app.run([
                "$route", $route => {
                    // Include $route to kick start the router.
                }
            ]);
        }


        public Start()
        {
            $(document).ready(() =>
            {
                console.log("Loading app " + this.app.name);
                angular.bootstrap(document, [this.app.name]);
            });
        }
    }
}