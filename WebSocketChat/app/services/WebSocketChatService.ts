module App.Services {

    export class WebSocketChatService extends WebSocketService {

        //public sessionFactory: SessionFactory;

        constructor($rootScope) {
            super($rootScope);
        }

        onLogin(message: App.Controllers.IMessage): any {
            //this.sessionFactory.updateSession(new DataSessionFactory(message.UserName, message.Text));
            App.SessionFactory._Session.updateSession(new DataSessionFactory(message.UserName, message.Text));
        }

        onLoginOut(): any {
            //this.sessionFactory.clearSession();
            App.SessionFactory._Session.clearSession();
        }

        onOpen (wrappedWebSocket: IWebSocket): any {
            super.onOpen(wrappedWebSocket);
        }

        onError (wrappedWebSocket: IWebSocket, errorMessage: String): any {
            super.onError(wrappedWebSocket, errorMessage);
        }

        onMessage(wrappedWebSocket: IWebSocket, message: any): any {
            //super.onMessage(wrappedWebSocket, message);

            var parsedMessage: App.Controllers.IMessage = angular.fromJson(message.data);

            //console.log(App.Services.MessageType[parsedMessage.Type]);
            //console.log(App.Services.MessageType.Error);
            //var msgTest = new App.Controllers.Message({ Text: "OnLogin()", Type: App.Services.MessageType.Open });
            //console.log(msgTest);

            switch (parseInt(App.Services.MessageType[parsedMessage.Type]))
            {
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
                    super.onMessage(wrappedWebSocket, parsedMessage.Text);
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
        }

        send(wrappedWebSocket: IWebSocket, textMessage: string): any {

            if (!(App.SessionFactory._Session.isAvalible()))
                console.log("SESSION IS NOT AVALIBLE");

            super.send(wrappedWebSocket, textMessage);
        }
    }
}