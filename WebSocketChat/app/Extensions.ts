//String Extensions
interface String {
    IsNullOrEmpty(): boolean;
}

String.prototype.IsNullOrEmpty = () => {
    return !(this == null || this.length == 0);
}

//Stroage Extensions
interface Storage {
    setObject(key: string, value: Object): void;
    getObject(key: string): Object;
}

Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}

Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

//Application Extensions
module App.Extensions {

    export class ApplicationExtension {
        static DefaultStroageName = "session_stroage";

        static ParseMessage(message: App.Controllers.IMessage): string {
            return JSON.stringify(message);
        }
    }
}