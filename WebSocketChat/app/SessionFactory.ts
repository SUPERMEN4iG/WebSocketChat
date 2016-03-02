module App {

    export class DataSessionFactory {
        constructor(uName: String, uSessionKey: String) {
            this.lastUpdateTime = Date.now();
            this.userName = uName;
            this.sessionUniqKey = uSessionKey;
        }

        lastUpdateTime: Number;
        userName: String;
        sessionUniqKey: String;
    }

    export class SessionFactory {
        private defaultDataStroage = new DataSessionFactory("Admin", "Test");
        data: DataSessionFactory;

        //TODO: re-make static cast session
        public static _SessionFactory: SessionFactory;

        public static _Session: SessionFactory = new SessionFactory();

        isAvalible = (): Boolean => {
            return localStorage.getItem(App.Extensions.ApplicationExtension.DefaultStroageName) != null ? true : false;
        }

        saveSession = () => {
            localStorage.setObject(App.Extensions.ApplicationExtension.DefaultStroageName, this.defaultDataStroage);
            this.data = this.defaultDataStroage;
            App.SessionFactory._SessionFactory = this;
        }

        updateSession = (obj: DataSessionFactory) => {
            localStorage.setObject(App.Extensions.ApplicationExtension.DefaultStroageName, obj);
            this.data = obj;
            App.SessionFactory._SessionFactory = this;
        }

        clearSession = () => {
            if (localStorage.getItem(App.Extensions.ApplicationExtension.DefaultStroageName) == null)
                console.log("ERROR: clearSession()");

            localStorage.removeItem(App.Extensions.ApplicationExtension.DefaultStroageName);
            App.SessionFactory._SessionFactory = null;
        }
    }
}