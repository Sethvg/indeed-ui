(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MathUtil = (function () {
    function MathUtil() {
    }
    MathUtil.GetRandomInRange = function (lower, higher) {
        return Math.floor(Math.random() * higher) + lower;
    };
    return MathUtil;
}());
exports.MathUtil = MathUtil;

},{}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var Dot = (function () {
    function Dot(radius, x) {
        this.totalFall = 0;
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
        game_1.Game.Window.appendChild(this.visual);
    }
    Dot.prototype.fall = function (fallSpeed) {
        this.totalFall += fallSpeed;
        this.visual.style.top = (this.totalFall + this.y).toString();
    };
    Dot.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    return Dot;
}());
exports.Dot = Dot;

},{"./game":3}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dot_1 = require("./dot");
var MathUtil_1 = require("./MathUtil");
var Game = (function () {
    function Game() {
        this.state = [];
        this.tickRate = 1;
        this.spawnRate = 1000;
        this.fallSpeed = 10;
        this.width = +Game.Window.offsetWidth;
        this.height = +Game.Window.offsetHeight;
        this.maxSpeed = 100;
        this.minSpeed = 10;
    }
    Game.prototype.start = function () {
        console.log("Starting Game");
        this.spawnPID = setInterval(this.spawn.bind(this), this.spawnRate);
        this.tickPID = setInterval(this.tick.bind(this), this.tickRate);
    };
    Game.prototype.tick = function () {
        var _this = this;
        this.state.forEach(function (dot) {
            dot.fall(_this.fallSpeed);
        });
    };
    Game.prototype.spawn = function () {
        var radius = MathUtil_1.MathUtil.GetRandomInRange(10, 100);
        var xPos = MathUtil_1.MathUtil.GetRandomInRange(0, this.width - radius);
        var dot = new dot_1.Dot(radius, xPos);
        this.state.push(dot);
    };
    Game.prototype.handleClick = function (x, y) {
    };
    Game.prototype.speedChange = function (event) {
        var sliderValue = +event.target.value;
        var compValue = ((this.maxSpeed - this.minSpeed) / 100) * sliderValue + this.minSpeed;
        var pixPerSec = compValue;
        this.speedChangeCalc(pixPerSec);
    };
    Game.prototype.speedChangeCalc = function (totalPixels) {
        this.fallSpeed = totalPixels * this.tickRate / 1000;
        console.log(this.fallSpeed);
    };
    Game.prototype.initialize = function () {
        var slider = document.getElementById("speedSlider");
        slider.addEventListener("input", this.speedChange.bind(this));
        slider.value = "0";
        this.speedChangeCalc(this.minSpeed);
    };
    Game.Window = document.getElementById("GameWindow");
    return Game;
}());
exports.Game = Game;

},{"./MathUtil":1,"./dot":2}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var game = new game_1.Game();
game.initialize();
game.start();

},{"./game":3}]},{},[4]);
