import {Game} from "./game";

export class Dot{
    private radius : number;
    private x : number;
    private y : number;
    private worth : number;
    private visual : HTMLElement;
    private totalFall : number = 0;

    constructor(radius : number, x : number) {
        this.radius = radius;
        this.y = -this.radius;
        this.x = x;
        this.worth = 11 + (-.1 * radius);

        this.visual = document.createElement("div");
        this.visual.className = "dot";
        this.visual.style.left = (this.x).toString();
        this.visual.style.top = this.y.toString();
        this.visual.style.width = this.radius.toString();
        this.visual.style.height = this.radius.toString();
        this.visual.style.backgroundColor = this.getRandomColor();
        Game.Window.appendChild(this.visual);
    }

    fall(fallSpeed: number) {
        this.totalFall += fallSpeed;
        this.visual.style.top = (this.totalFall + this.y).toString()
    }

    private getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
}