module App.Services {

    export class BaseService {
        scope: ng.IScope;

        constructor($rootScope) {
            this.scope = $rootScope;
        }
    }
}