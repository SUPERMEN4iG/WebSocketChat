module App.Controllers {

    declare class Point {
        X: number;
        Y: number;

        constructor(x: number, y: number);
    }

    declare class DollarRecognizer {
        Unistrokes: Array<Object>;
        Recognize: (points: Array<Point>, useProtractor) => any;
        AddGesture: (name, points: Array<Point>) => number;
        DeleteUserGestures: () => void;
    }

    export interface IMyMessage {
        title: string;
    }

    export interface IMyScope extends App.Controllers.IScope {
        message: IMyMessage;
    }

    export class MyController extends App.Controllers.BaseController {
        scope: IMyScope;
        private _isDown: boolean;
        private _points: Array<Point>;
        private _rc: any;
        private _g: any;
        private _r: DollarRecognizer;

        static $inject = ['$scope'];

        constructor($scope: IMyScope) {
            super($scope);
            $scope.message = { title: "Hello World!!" };

            this.onLoadController();
        }

        clickMe() {
            alert(this.scope.message.title);
        }

        private getCanvasRect(canvas: any): Object {
            var w = canvas.width;
            var h = canvas.height;

            var cx = canvas.offsetLeft;
            var cy = canvas.offsetTop;
            while (canvas.offsetParent != null) {
                canvas = canvas.offsetParent;
                cx += canvas.offsetLeft;
                cy += canvas.offsetTop;
            }
            return { x: cx, y: cy, width: w, height: h };
        }

        private getScrollY() {
            var scrollY = 0;
            if (typeof (document.body.parentElement) != 'undefined') {
                scrollY = document.body.parentElement.scrollTop; // IE
            }
            else if (typeof (window.pageYOffset) != 'undefined') {
                scrollY = window.pageYOffset; // FF
            }
            return scrollY;
        }

        private drawConnectedPoint(from, to) {
            this._g.beginPath();
            this._g.moveTo(this._points[from].X, this._points[from].Y);
            this._g.lineTo(this._points[to].X, this._points[to].Y);
            this._g.closePath();
            this._g.stroke();
        }

        onLoadController(): void {
            this._isDown = false;
            this._points = new Array<Point>();
            this._r = new DollarRecognizer();
            var canvas = <HTMLCanvasElement>document.getElementById('touchCanvas');
            this._g = canvas.getContext('2d');
            this._g.fillStyle = "rgb(0,0,225)";
            this._g.strokeStyle = "rgb(0,0,225)";
            this._g.lineWidth = 3;
            this._g.font = "16px Gentilis";
            this._rc = this.getCanvasRect(canvas); // canvas rect on page
            this._g.fillStyle = "rgb(255,255,136)";
            this._g.fillRect(0, 0, this._rc.width, 20);
        }

        mouseMoveEvent(x: number, y :number) {
            if (this._isDown) {
                x -= this._rc.x;
                y -= this._rc.y - this.getScrollY();
                this._points[this._points.length] = new Point(x, y); // append
                this.drawConnectedPoint(this._points.length - 2, this._points.length - 1);
            }
        }

        mouseDownEvent(x: number, y: number) {
            document.onselectstart = function () { return false; } // disable drag-select
            document.onmousedown = function () { return false; } // disable drag-select
            this._isDown = true;
            x -= this._rc.x;
            y -= this._rc.y - this.getScrollY();
            if (this._points.length > 0)
                this._g.clearRect(0, 0, this._rc.width, this._rc.height);
            this._points.length = 1; // clear
            this._points[0] = new Point(x, y);
            this._g.fillRect(x - 4, y - 3, 9, 9);
        }

        mouseUpEvent(x: number, y: number) {
            document.onselectstart = function () { return true; } // enable drag-select
            document.onmousedown = function () { return true; } // enable drag-select
            if (this._isDown) {
                this._isDown = false;
                if (this._points.length >= 10) {
                    var result = this._r.Recognize(this._points, true);
                    console.log(result);
                }
                else // fewer than 10 points were inputted
                {
                   
                }
            }
        }
    }
}