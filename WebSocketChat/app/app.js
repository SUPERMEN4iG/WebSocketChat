var App;
(function (App) {
    var Services;
    (function (Services) {
        var BaseService = (function () {
            function BaseService($rootScope) {
                this.scope = $rootScope;
            }
            return BaseService;
        })();
        Services.BaseService = BaseService;
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
/// <reference path="baseservice.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var App;
(function (App) {
    var Services;
    (function (Services) {
        (function (MessageType) {
            MessageType[MessageType["Open"] = 0] = "Open";
            MessageType[MessageType["Close"] = 1] = "Close";
            MessageType[MessageType["Error"] = 2] = "Error";
            MessageType[MessageType["Text"] = 3] = "Text";
            MessageType[MessageType["Command"] = 4] = "Command";
        })(Services.MessageType || (Services.MessageType = {}));
        var MessageType = Services.MessageType;
        ;
        var AbstractApplication = (function () {
            function AbstractApplication() {
                this.isDebugMode = true;
            }
            return AbstractApplication;
        })();
        Services.AbstractApplication = AbstractApplication;
        var WebSocketService = (function (_super) {
            __extends(WebSocketService, _super);
            function WebSocketService($rootScope) {
                _super.call(this);
                //TODO: Transfrom parser
                this.parseMessage = function (textMessage, messageType) {
                    return;
                    JSON.stringify({
                        Type: messageType,
                        Text: textMessage
                    });
                };
                this.scope = $rootScope;
            }
            WebSocketService.prototype.onOpen = function (wrappedWebSocket) {
                console.log('openned websocket', wrappedWebSocket.endPoint);
                wrappedWebSocket.isEnabled = true;
            };
            WebSocketService.prototype.onError = function (wrappedWebSocket, errorMessage) {
                console.log("Error: ", wrappedWebSocket.endPoint, errorMessage);
                wrappedWebSocket.messages.push("Error");
            };
            WebSocketService.prototype.onMessage = function (wrappedWebSocket, message) {
                console.log(message);
                wrappedWebSocket.messages.push(message);
                this.scope.$apply();
            };
            WebSocketService.prototype.send = function (wrappedWebSocket, textMessage) {
                console.log(textMessage);
                if (wrappedWebSocket.isEnabled) {
                    wrappedWebSocket.webSocket.send(textMessage);
                }
                else {
                    wrappedWebSocket.messages.push(textMessage);
                }
            };
            WebSocketService.$inject = ['$rootScope'];
            return WebSocketService;
        })(AbstractApplication);
        Services.WebSocketService = WebSocketService;
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Services;
    (function (Services) {
        var WebSocketChatService = (function (_super) {
            __extends(WebSocketChatService, _super);
            //public sessionFactory: SessionFactory;
            function WebSocketChatService($rootScope) {
                _super.call(this, $rootScope);
            }
            WebSocketChatService.prototype.onLogin = function (message) {
                //this.sessionFactory.updateSession(new DataSessionFactory(message.UserName, message.Text));
                App.SessionFactory._Session.updateSession(new App.DataSessionFactory(message.UserName, message.Text));
            };
            WebSocketChatService.prototype.onLoginOut = function () {
                //this.sessionFactory.clearSession();
                App.SessionFactory._Session.clearSession();
            };
            WebSocketChatService.prototype.onOpen = function (wrappedWebSocket) {
                _super.prototype.onOpen.call(this, wrappedWebSocket);
            };
            WebSocketChatService.prototype.onError = function (wrappedWebSocket, errorMessage) {
                _super.prototype.onError.call(this, wrappedWebSocket, errorMessage);
            };
            WebSocketChatService.prototype.onMessage = function (wrappedWebSocket, message) {
                //super.onMessage(wrappedWebSocket, message);
                var parsedMessage = angular.fromJson(message.data);
                //console.log(App.Services.MessageType[parsedMessage.Type]);
                //console.log(App.Services.MessageType.Error);
                //var msgTest = new App.Controllers.Message({ Text: "OnLogin()", Type: App.Services.MessageType.Open });
                //console.log(msgTest);
                switch (parseInt(App.Services.MessageType[parsedMessage.Type])) {
                    case App.Services.MessageType.Open:
                        console.log("LOGIN ON");
                        this.onLogin(parsedMessage);
                        break;
                    case App.Services.MessageType.Close:
                        console.log("LOGIN OFF");
                        this.onLoginOut();
                        break;
                    case App.Services.MessageType.Text:
                        console.log("TEXT MESSAGE: " + parsedMessage.Text);
                        _super.prototype.onMessage.call(this, wrappedWebSocket, parsedMessage.Text);
                        break;
                    case App.Services.MessageType.Error:
                        console.log("ERROR: " + parsedMessage.Text);
                        this.onError(wrappedWebSocket, parsedMessage.Text);
                        break;
                    default:
                        console.log("SOMTHING IS WRONG");
                        break;
                }
                console.log(message.toString().IsNullOrEmpty());
            };
            WebSocketChatService.prototype.send = function (wrappedWebSocket, textMessage) {
                if (!(App.SessionFactory._Session.isAvalible()))
                    console.log("SESSION IS NOT AVALIBLE");
                _super.prototype.send.call(this, wrappedWebSocket, textMessage);
            };
            return WebSocketChatService;
        })(Services.WebSocketService);
        Services.WebSocketChatService = WebSocketChatService;
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
var App;
(function (App) {
    var ApplicationFactory = (function () {
        function ApplicationFactory(appName) {
            this.addController = function () { };
            this.addService = function () { };
            this.app = angular.module(appName, ['websocket']);
        }
        return ApplicationFactory;
    })();
    App.ApplicationFactory = ApplicationFactory;
})(App || (App = {}));
var _this = this;
String.prototype.IsNullOrEmpty = function () {
    return !(_this == null || _this.length == 0);
};
Storage.prototype.setObject = function (key, value) {
    this.setItem(key, JSON.stringify(value));
};
Storage.prototype.getObject = function (key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
};
//Application Extensions
var App;
(function (App) {
    var Extensions;
    (function (Extensions) {
        var ApplicationExtension = (function () {
            function ApplicationExtension() {
            }
            ApplicationExtension.ParseMessage = function (message) {
                return JSON.stringify(message);
            };
            ApplicationExtension.DefaultStroageName = "session_stroage";
            return ApplicationExtension;
        })();
        Extensions.ApplicationExtension = ApplicationExtension;
    })(Extensions = App.Extensions || (App.Extensions = {}));
})(App || (App = {}));
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
                    emit: function (message) {
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
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var BaseController = (function () {
            function BaseController($scope) {
                this.scope = $scope;
                this.scope.events = this;
            }
            return BaseController;
        })();
        Controllers.BaseController = BaseController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var MyController = (function (_super) {
            __extends(MyController, _super);
            function MyController($scope) {
                _super.call(this, $scope);
                $scope.message = { title: "Hello World!!" };
            }
            MyController.prototype.clickMe = function () {
                alert(this.scope.message.title);
            };
            MyController.$inject = ['$scope'];
            return MyController;
        })(App.Controllers.BaseController);
        Controllers.MyController = MyController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
var App;
(function (App) {
    var Controllers;
    (function (Controllers) {
        var Message = (function () {
            //Text: String;
            //Type: App.Services.MessageType;
            //UserName: String;
            //ClientGuid: String;
            function Message(options) {
                var _this = this;
                if (options === void 0) { options = {}; }
                angular.forEach(options, function (option, key) {
                    _this[key] = option;
                });
            }
            return Message;
        })();
        Controllers.Message = Message;
        var OpenMessage = (function (_super) {
            __extends(OpenMessage, _super);
            function OpenMessage() {
                _super.call(this, { Text: "OnLogin()", Type: App.Services.MessageType.Open });
            }
            return OpenMessage;
        })(Message);
        Controllers.OpenMessage = OpenMessage;
        var CloseMessage = (function (_super) {
            __extends(CloseMessage, _super);
            function CloseMessage(clientGuid, userName) {
                _super.call(this, { Text: clientGuid, ClientGuid: clientGuid, UserName: userName, Type: App.Services.MessageType.Close });
            }
            return CloseMessage;
        })(Message);
        Controllers.CloseMessage = CloseMessage;
        var TextMessage = (function (_super) {
            __extends(TextMessage, _super);
            function TextMessage(text, clientGuid, userName) {
                _super.call(this, { Text: text, ClientGuid: clientGuid, UserName: userName, Type: App.Services.MessageType.Text });
            }
            return TextMessage;
        })(Message);
        Controllers.TextMessage = TextMessage;
        var WebSocketController = (function (_super) {
            __extends(WebSocketController, _super);
            function WebSocketController($scope, $timeout, $websocket, $window) {
                var _this = this;
                _super.call(this, $scope);
                this.DefaultUserName = "DefaultName";
                this.Initialize = function () {
                    _this.Login();
                    $(window).on('beforeunload', function () {
                        _this.Logout();
                    });
                };
                //TODO: Imply to OpenMessage
                this.Login = function () {
                    //this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new Message({ Text: "OnLogin()", Type: App.Services.MessageType.Open })));
                    _this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new OpenMessage()));
                };
                this.Logout = function () {
                    if (!App.SessionFactory._Session.isAvalible())
                        console.log("SESSION IS NOT AVALIBLE");
                    _this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new CloseMessage(App.SessionFactory._Session.data.sessionUniqKey, App.SessionFactory._Session.data.userName)));
                    App.SessionFactory._Session.clearSession();
                };
                this.webSocket = $websocket.connect('ws://localhost:55555/WebSocketChat');
                $scope.messages = this.webSocket.messages;
                $scope.name = this.DefaultUserName;
                //$timeout(this.Login, 1000);
                //$(window).on('beforeunload', () => {
                //    return 'Exit?';
                //});
                $timeout(this.Initialize, 1000);
            }
            WebSocketController.prototype.sendMessage = function (message) {
                if (!App.SessionFactory._Session.isAvalible())
                    console.log("SESSION IS NOT AVALIBLE");
                //this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new Message({
                //    Text: message, Type: App.Services.MessageType.Text,
                //    ClientGuid: App.SessionFactory._SessionFactory.data.sessionUniqKey,
                //    UserName: App.SessionFactory._SessionFactory.data.userName
                //})));
                this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new TextMessage(message, App.SessionFactory._Session.data.sessionUniqKey, App.SessionFactory._Session.data.userName)));
            };
            WebSocketController.$inject = ['$scope', '$timeout', '$websocket', '$window'];
            return WebSocketController;
        })(App.Controllers.BaseController);
        Controllers.WebSocketController = WebSocketController;
    })(Controllers = App.Controllers || (App.Controllers = {}));
})(App || (App = {}));
var App;
(function (App) {
    var DataSessionFactory = (function () {
        function DataSessionFactory(uName, uSessionKey) {
            this.lastUpdateTime = Date.now();
            this.userName = uName;
            this.sessionUniqKey = uSessionKey;
        }
        return DataSessionFactory;
    })();
    App.DataSessionFactory = DataSessionFactory;
    var SessionFactory = (function () {
        function SessionFactory() {
            var _this = this;
            this.defaultDataStroage = new DataSessionFactory("Admin", "Test");
            this.isAvalible = function () {
                return localStorage.getItem(App.Extensions.ApplicationExtension.DefaultStroageName) != null ? true : false;
            };
            this.saveSession = function () {
                localStorage.setObject(App.Extensions.ApplicationExtension.DefaultStroageName, _this.defaultDataStroage);
                _this.data = _this.defaultDataStroage;
                App.SessionFactory._SessionFactory = _this;
            };
            this.updateSession = function (obj) {
                localStorage.setObject(App.Extensions.ApplicationExtension.DefaultStroageName, obj);
                _this.data = obj;
                App.SessionFactory._SessionFactory = _this;
            };
            this.clearSession = function () {
                if (localStorage.getItem(App.Extensions.ApplicationExtension.DefaultStroageName) == null)
                    console.log("ERROR: clearSession()");
                localStorage.removeItem(App.Extensions.ApplicationExtension.DefaultStroageName);
                App.SessionFactory._SessionFactory = null;
            };
        }
        SessionFactory._Session = new SessionFactory();
        return SessionFactory;
    })();
    App.SessionFactory = SessionFactory;
})(App || (App = {}));
//# sourceMappingURL=app.js.map