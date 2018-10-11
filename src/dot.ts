import {Game} from "./game";

export class Dot{
    private _radius : number;
    private _x : number;
    private _y : number;
    private _worth : number;
    private visual : Path2D;
    private _color : string;

    constructor(radius : number, x : number) {
        this._radius = radius;
        this._y = -this._radius;
        this._x = x + this._radius;
        this._worth = 11 + (-.1 * radius);
        this._color = this.getRandomColor();
    }

    fall(fallSpeed: number) {
        this.y += fallSpeed;
    }

    draw(ctx : CanvasRenderingContext2D){
        ctx.beginPath();
        ctx.arc(this._x, this._y, this._radius, 0 , 2 * Math.PI);
        ctx.fillStyle = this._color;
        ctx.fill();
        ctx.stroke();
    }

    private getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }


    get y(): number {
        return this._y;
    }


    get x(): number {
        return this._x;
    }


    get radius(): number {
        return this._radius;
    }

    set y(value: number) {
        this._y = value;
    }


    get color(): string {
        return this._color;
    }


    get worth(): number {
        return this._worth;
    }
}