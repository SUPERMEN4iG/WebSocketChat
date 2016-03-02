/// <reference path="services/websocketservice.ts" />
/// <reference path="services/websocketchatservice.ts" />
/// <reference path="applicationfactory.ts" />
/// <reference path="extensions.ts" />

var applicationFactory = new App.ApplicationFactory("myApp");

applicationFactory.app.factory("sessionFactory", function () {
    return new App.SessionFactory();
});

var websocketModule = angular
    .module('websocket', []).factory('$websocket', ['$rootScope', function ($rootScope) {
        var serviceProvider = new App.Services.WebSocketChatService($rootScope);

        return {
            connect: function (endpoint) {
                var wrapped_websocket = {
                    webSocket: null,
                    endPoint: endpoint,
                    isEnabled: false,
                    messages: [],

                    emit: function (message: string) {
                        serviceProvider.send(this, message);
                    }
                };
                console.log('connect to', endpoint);
                wrapped_websocket.webSocket = new WebSocket(endpoint);

                wrapped_websocket.webSocket.onopen = function () {
                    return serviceProvider.onOpen(wrapped_websocket);
                };

                wrapped_websocket.webSocket.onerror = function (error) {
                    return serviceProvider.onError(wrapped_websocket, error);
                };

                wrapped_websocket.webSocket.onmessage = function (msg) {
                    return serviceProvider.onMessage(wrapped_websocket, msg);
                };

                return wrapped_websocket;
            },
        };
    }]);

applicationFactory.app.controller('MyController', ['$scope', function ($scope) {
    return new App.Controllers.MyController($scope);
}]);

applicationFactory.app.controller('WebSocketController', ['$scope', '$timeout', '$websocket', '$window', function ($scope, $timeout, $websocket, $window) {
    return new App.Controllers.WebSocketController($scope, $timeout, $websocket, $window);
}]);