module App {

    export class ApplicationFactory {
        app: ng.IModule;


        constructor(appName: string) {
            this.app = angular.module(appName, ['websocket']);
        }

        addController = () => { };
        addService = () => { };
    }
}