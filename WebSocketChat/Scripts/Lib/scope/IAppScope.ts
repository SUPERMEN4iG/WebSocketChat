/// <reference path="userscope.ts" />

module App.Scope
{
    export interface IAppScope extends ng.IScope
    {
        user: User;
    }
}