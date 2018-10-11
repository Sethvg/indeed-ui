import {Dot} from "./dot";
import {MathUtil} from "./MathUtil";

export class Game{
    public static Canvas : HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("game-canvas");
    public static Ctx : CanvasRenderingContext2D = Game.Canvas.getContext("2d")
    private static Scoreboard : HTMLSpanElement = <HTMLSpanElement>document.getElementById("score-display");

    private state : Dot[] = [];
    private spawnPID : number;
    private tickPID : number;
    private tickRate : number = 10;
    private spawnRate : number = 1000;
    private fallSpeed : number = 0;

    private width: number;
    private height: number;

    private maxSpeed = 100;
    private minSpeed = 10;
    private speedSlope = (this.maxSpeed - this.minSpeed) / 100;
    private clicksToHandle : {x : number, y : number}[] = [];
    private maxRadius = 100;
    private minRadius = 10;
    private score: number = 0;


    public start() {
        console.log("Starting Game");
        this.spawnPID = setInterval(() => { this.spawn(1); }, this.spawnRate);
        this.tickPID = setInterval(this.tick.bind(this), this.tickRate);
        this.spawn(1);
    }

    public tick() {
        this.state = this.state.sort((left : Dot, right : Dot) => {
            let yPos = right.y - left.y;

            if(yPos == 0){
                return right.color.localeCompare(left.color);
            }

            return yPos;
        });

        const context = Game.Canvas.getContext('2d');
        context.clearRect(0, 0, Game.Canvas.width, Game.Canvas.height);

        this.state.forEach(dot => {
            dot.fall(this.fallSpeed);
            dot.draw(context);
        });
        Game.Ctx = context;
        this.handleClicks();
        this.pruneSorted();
    }

    public spawn( count : number ){
        console.log("Spawning: " + count);
        for(let a = 0; a < count; a++){
            let radius = MathUtil.GetRandomInRange(this.minRadius,this.maxRadius);
            let xPos = MathUtil.GetRandomInRange(0, (this.width-radius*2);
            let dot = new Dot(radius, xPos);
            this.state.push(dot);
        }

    }

    public queueClick(event : MouseEvent){
        let x = event.clientX;
        let y = event.clientY;
        let rect = Game.Canvas.getBoundingClientRect();
        this.clicksToHandle.push({x : x - rect.left,y: y - rect.top});
    }

    public speedChange(event : any){
        let sliderValue = +event.target.value;
        let pixPerSec = this.speedSlope * sliderValue + this.minSpeed;
       this.speedChangeCalc(pixPerSec);
    }

    private speedChangeCalc(totalPixels : number){
        this.fallSpeed = totalPixels * this.tickRate / 1000;
    }

    public initialize() {
        let slider : HTMLInputElement = <HTMLInputElement>document.getElementById("speedSlider");
        slider.addEventListener("input", this.speedChange.bind(this));
        slider.value = "0";
        this.speedChangeCalc(this.minSpeed);
        let window = document.getElementById("game-window");

        Game.Canvas.width = window.clientWidth;
        Game.Canvas.height = window.clientHeight;
        this.width = Game.Canvas.width;
        this.height = Game.Canvas.height;

        Game.Canvas.addEventListener("mousedown", this.queueClick.bind(this));
    }

    private pruneSorted() {
        let newStart = 0;
        for(let a = 0; a < this.state.length; a++){
            if(this.state[a].y - (this.state[a].radius) > this.height){
                newStart++;
            }else{
                break;
            }
        }

        if(newStart != 0){
            console.log("Pruned: " + newStart);
            this.state.splice(0, newStart);
        }
    }

    private handleClicks() {
        this.clicksToHandle.forEach(clickPos => {
            this.handleClick(clickPos.x, clickPos.y);
        })

        this.clicksToHandle = [];
    }

    private handleClick(x : number, y : number){
        let aPotentialIndex = this.binaryTreeFind(y);

        if(aPotentialIndex == -1){
            return;
        }

        let start;
        let end;

        for( start = aPotentialIndex-1; start >= 0; start--){
            let cur = this.state[start];
            if(! (this.isWithinYMaxRadius(cur, y) == 0)){
                break;
            }
        }
        start++;

        for(end = aPotentialIndex + 1; end < this.state.length; end++){
            let cur = this.state[end];
            if(!(this.isWithinYMaxRadius(cur, y) == 0)){
                break;
            }
        }
        end--;

        let spliceStart = -1;
        let spliceCount = -1;
        let splicedScore = 0;

        for(let a = end; a >= start; a--){
            let cur = this.state[a];

            if(this.isWithinRadius(cur, x, y)){
                if(spliceStart == -1){
                    spliceStart = a;
                    spliceCount = 1;
                }else{
                    spliceStart--;
                    spliceCount++;
                }
                splicedScore += cur.worth;
            }else{
                if(spliceStart != -1){
                    this.state.splice(spliceStart, spliceCount);
                    setTimeout((count)=> this.spawn(count), 1000, new Number(spliceCount));
                    this.updateScore(splicedScore);
                }

                spliceStart = -1;
                spliceCount = -1;
                splicedScore = 0;
            }
        }

        if(spliceStart != -1){
            this.state.splice(spliceStart, spliceCount);
            setTimeout((count)=> this.spawn(count), 1000, new Number(spliceCount));
            this.updateScore(splicedScore);
        }

    }

    private binaryTreeFind(y: number) : number {
        if(this.state.length == 0){
            return -1;
        }

        return this.binaryTreeFindRecurse(y, 0, this.state.length-1, this.state, this.isWithinYMaxRadius.bind(this))
    }

    private binaryTreeFindRecurse(y: number, start : number, end : number, arr : Dot[], comparetor : (d : Dot, n : number) => number) : number{

        if(end < start){
            return -1;
        }

        if(end - start == 0){
            if(comparetor(arr[start], y) == 0){
                return start;
            }else{
                return -1;
            }
        }

        let half = Math.floor((start+end) / 2)

        let val = arr[half];

        let compare = comparetor(val, y);
        if(compare == 0){
            return half;
        }else if(compare == -1){
            return this.binaryTreeFindRecurse(y, start, half, arr, comparetor);
        }else{
            return this.binaryTreeFindRecurse(y, half+1, end, arr, comparetor)
        }

    }

    private isWithinYMaxRadius(dot : Dot, y : number) : number{


        let isWithin = Math.pow(dot.y - y, 2) < Math.pow(this.maxRadius, 2);

        if(isWithin){
            return 0;
        }

        if(dot.y < y){
            return -1;
        }else{
            return 1;
        }
    }

    private isWithinRadius(dot : Dot, x : number, y : number){
        let dotX = dot.x;
        let dotY = dot.y;

        let distanceSquared = Math.pow(dotX - x, 2) + Math.pow(dotY - y, 2);
        return distanceSquared < Math.pow(dot.radius, 2);
    }

    private updateScore(score : number){
        this.score += score;
        Game.Scoreboard.innerText = this.score.toFixed(2);
    }
}