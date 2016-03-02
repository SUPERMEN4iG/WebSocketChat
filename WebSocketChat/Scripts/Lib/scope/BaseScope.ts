module App.Scope
{
    "use strict";

    export class BaseScope
    {
        public Id: number;
        public CreationDateTime: number;

        constructor()
        {
            this.Id = 0;
            this.CreationDateTime = Date.now();
        }
    }
} 