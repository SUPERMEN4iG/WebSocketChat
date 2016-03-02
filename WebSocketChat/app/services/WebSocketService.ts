/// <reference path="baseservice.ts" />

module App.Services {

    export interface IWebSocket {
        webSocket: WebSocket;
        endPoint: String;
        isEnabled: Boolean;
        messages: Array<string>
    }

    export interface IUser {
        Name: string;
        SessionUniqKey: string;
        CreationDateTime: number;
    }

    export enum MessageType {
        Open,
        Close,
        Error,
        Text,
        Command
    };

    export class AbstractApplication
    {
        public isDebugMode: Boolean;

        constructor() {
            this.isDebugMode = true;
        }
    }

    export class WebSocketService extends AbstractApplication {

        scope: ng.IScope;

        static $inject = ['$rootScope'];

        constructor($rootScope) {
            super();
            this.scope = $rootScope;
        }

        //TODO: Transfrom parser
        public parseMessage = (textMessage: string, messageType: string): string => {
            return
            JSON.stringify({
                Type: messageType,
                Text: textMessage
            });
        }

        public onOpen (wrappedWebSocket: IWebSocket): any {
            console.log('openned websocket', wrappedWebSocket.endPoint);
            wrappedWebSocket.isEnabled = true;
        }

        public onError (wrappedWebSocket: IWebSocket, errorMessage: String): any {
            console.log("Error: ", wrappedWebSocket.endPoint, errorMessage);
            wrappedWebSocket.messages.push("Error");
        }

        public onMessage (wrappedWebSocket: IWebSocket, message: any): any {
            console.log(message);
            wrappedWebSocket.messages.push(message);
            this.scope.$apply();
        }

        public send (wrappedWebSocket: IWebSocket, textMessage: string): any {
            console.log(textMessage);
            if (wrappedWebSocket.isEnabled) {
                wrappedWebSocket.webSocket.send(textMessage);
            } else {
                wrappedWebSocket.messages.push(textMessage);
            }
        }
    }
} 