var App;
(function (App) {
    (function (Scope) {
        "use strict";

        var BaseScope = (function () {
            function BaseScope() {
                this.Id = 0;
                this.CreationDateTime = Date.now();
            }
            return BaseScope;
        })();
        Scope.BaseScope = BaseScope;
    })(App.Scope || (App.Scope = {}));
    var Scope = App.Scope;
})(App || (App = {}));
/// <reference path="basescope.ts" />
var App;
(function (App) {
    (function (Scope) {
        "use strict";

        //export interface IUserOptions
        //{
        //    SessionUniqKey: string;
        //    Name: string;
        //}
        var User = (function () {
            function User() {
            }
            return User;
        })();
        Scope.User = User;
    })(App.Scope || (App.Scope = {}));
    var Scope = App.Scope;
})(App || (App = {}));
/// <reference path="userscope.ts" />
/// <reference path="../scope/iappscope.ts" />
/// <reference path="../scope/userscope.ts" />
var App;
(function (App) {
    (function (Controllers) {
        "use strict";
        var TestController = (function () {
            function TestController($scope) {
                this.$scope = $scope;
                if (this.$scope.user === null || this.$scope.user === undefined) {
                    this.$scope.user = new App.Scope.User();
                }
            }
            TestController.prototype.clear = function () {
                this.$scope.user.Name = "";
                this.$scope.user.SessionUniqKey = "";
            };
            TestController.$inject = ["$scope"];
            return TestController;
        })();
        Controllers.TestController = TestController;
    })(App.Controllers || (App.Controllers = {}));
    var Controllers = App.Controllers;
})(App || (App = {}));
/// <reference path="scope/iappscope.ts" />
/// <reference path="controllers/testcontroller.ts" />
var App;
(function (App) {
    "use strict";

    var AppBuilder = (function () {
        function AppBuilder(name) {
            this.app = angular.module(name, [
                "ngRoute",
                "ngAnimate",
                "ngResource"
            ]);

            this.app.controller("userController", [
                "$scope", function ($scope) {
                    return new App.Controllers.TestController($scope);
                }
            ]);

            this.app.config([
                "$routeProvider",
                function ($routeProvider) {
                    $routeProvider.when("/user", {
                        controller: "userController",
                        controllerAs: "demoController",
                        templateUrl: "Scripts/Lib/views/userView.html"
                    }).otherwise({
                        redirectTo: "/user"
                    });
                }
            ]);

            this.app.run([
                "$route", function ($route) {
                    // Include $route to kick start the router.
                }
            ]);
        }
        AppBuilder.prototype.Start = function () {
            var _this = this;
            $(document).ready(function () {
                console.log("Loading app " + _this.app.name);
                angular.bootstrap(document, [_this.app.name]);
            });
        };
        return AppBuilder;
    })();
    App.AppBuilder = AppBuilder;
})(App || (App = {}));
/// <reference path="AppBuilder.ts" />
new App.AppBuilder('WebSocketServer').Start();
//# sourceMappingURL=App.js.map
