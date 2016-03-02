module App.Controllers {

    export interface IWebSocket {
        connect(endPoint: string);
        emit(message: String): void;
        messages: Array<String>;
    }

    export interface IWebSocketScope extends App.Controllers.IScope {
        messages: Array<String>;
        name: String;
        friends: Array<String>;
    }

    export interface IMessage {
        Text?: String;
        Type?: App.Services.MessageType;
        UserName?: String;
        ClientGuid?: String;
    }

    export class Message implements IMessage {
        //Text: String;
        //Type: App.Services.MessageType;
        //UserName: String;
        //ClientGuid: String;

        constructor(options: IMessage = {}) {
            angular.forEach(options, (option, key) => {
                this[key] = option;
            });
        }

        //constructor(text: String, type: App.Services.MessageType, userName: String = '', clientGuid: String = '') {
        //    this.Text = text;
        //    this.Type = type;
        //    this.UserName = userName;
        //    this.ClientGuid = clientGuid;
        //}
    }

    export class OpenMessage extends Message {

        constructor() {
            super({ Text: "OnLogin()", Type: App.Services.MessageType.Open });
        }
    }

    export class CloseMessage extends Message {

        constructor(clientGuid: String, userName: String) {
            super({ Text: clientGuid, ClientGuid: clientGuid, UserName: userName, Type: App.Services.MessageType.Close });
        }
    }

    export class TextMessage extends Message {

        constructor(text: String, clientGuid: String, userName) {
            super({ Text: text, ClientGuid: clientGuid, UserName: userName, Type: App.Services.MessageType.Text });
        }
    }

    export class WebSocketController extends App.Controllers.BaseController {

        scope: IWebSocketScope;
        private webSocket: IWebSocket;
        private DefaultUserName: String = "DefaultName";

        static $inject = ['$scope', '$timeout', '$websocket', '$window'];

        constructor($scope: IWebSocketScope, $timeout, $websocket: IWebSocket, $window: Window) {
            super($scope);
            this.webSocket = $websocket.connect('ws://localhost:55555/WebSocketChat');
            $scope.messages = this.webSocket.messages;
            $scope.name = this.DefaultUserName;

            //$timeout(this.Login, 1000);

            //$(window).on('beforeunload', () => {
            //    return 'Exit?';
            //});

            $timeout(this.Initialize, 1000);
        }

        private Initialize = (): void => {

            this.Login();

            $(window).on('beforeunload', () => {
                this.Logout();
            });
        }

        //TODO: Imply to OpenMessage
        Login = (): void => {
            //this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new Message({ Text: "OnLogin()", Type: App.Services.MessageType.Open })));
            this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new OpenMessage()));
        }

        Logout = (): void => {
            if (!App.SessionFactory._Session.isAvalible())
                console.log("SESSION IS NOT AVALIBLE");

            this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new CloseMessage(App.SessionFactory._Session.data.sessionUniqKey, App.SessionFactory._Session.data.userName)));
            App.SessionFactory._Session.clearSession();
        }

        sendMessage(message: String): void {
            if (!App.SessionFactory._Session.isAvalible())
                console.log("SESSION IS NOT AVALIBLE");

            //this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new Message({
            //    Text: message, Type: App.Services.MessageType.Text,
            //    ClientGuid: App.SessionFactory._SessionFactory.data.sessionUniqKey,
            //    UserName: App.SessionFactory._SessionFactory.data.userName
            //})));

            this.webSocket.emit(App.Extensions.ApplicationExtension.ParseMessage(new TextMessage(message, App.SessionFactory._Session.data.sessionUniqKey, App.SessionFactory._Session.data.userName)));
        }
    }
}