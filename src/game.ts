import {Dot} from "./dot";
import {MathUtil} from "./MathUtil";

export class Game{
    public static Window : HTMLElement = document.getElementById("GameWindow");

    private state : Dot[] = [];
    private spawnPID : number;
    private tickPID : number;
    private tickRate : number = 1;
    private spawnRate : number = 1000;
    private fallSpeed : number = 0;

    private width: number = +Game.Window.offsetWidth;
    private height: number = +Game.Window.offsetHeight;

    private maxSpeed = 100;
    private minSpeed = 10;
    private speedSlope = (this.maxSpeed - this.minSpeed) / 100;


    public start() {
        console.log("Starting Game");
        this.spawnPID = setInterval(this.spawn.bind(this), this.spawnRate);
        this.tickPID = setInterval(this.tick.bind(this), this.tickRate);
    }

    public tick(){
        this.state.forEach(dot => {
            dot.fall(this.fallSpeed);
        });
    }

    public spawn(){
        let radius = MathUtil.GetRandomInRange(10,100);
        let xPos = MathUtil.GetRandomInRange(0, this.width-radius);
        let dot = new Dot(radius, xPos);
        this.state.push(dot);
    }

    public handleClick(x : number, y : number){

    }

    public speedChange(event : any){
        let sliderValue = +event.target.value;
        let pixPerSec = this.speedSlope * sliderValue + this.minSpeed;
       this.speedChangeCalc(pixPerSec);
    }

    private speedChangeCalc(totalPixels : number){
        this.fallSpeed = totalPixels * this.tickRate / 1000;
        console.log(this.fallSpeed);
    }

    public initialize() {
        let slider : HTMLInputElement = <HTMLInputElement>document.getElementById("speedSlider");
        slider.addEventListener("input", this.speedChange.bind(this));
        slider.value = "0";
        this.speedChangeCalc(this.minSpeed);
    }
}