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
var Dot = (function () {
    function Dot(radius, x) {
        this._radius = radius;
        this._y = -this._radius;
        this._x = x;
        this._worth = 11 + (-.1 * radius);
        this._color = this.getRandomColor();
    }
    Dot.prototype.fall = function (fallSpeed) {
        this.y += fallSpeed;
    };
    Dot.prototype.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this._x, this._y, this._radius, 0, 2 * Math.PI);
        ctx.fillStyle = this._color;
        ctx.fill();
        ctx.stroke();
    };
    Dot.prototype.getRandomColor = function () {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };
    Object.defineProperty(Dot.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dot.prototype, "x", {
        get: function () {
            return this._x;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dot.prototype, "radius", {
        get: function () {
            return this._radius;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dot.prototype, "color", {
        get: function () {
            return this._color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dot.prototype, "worth", {
        get: function () {
            return this._worth;
        },
        enumerable: true,
        configurable: true
    });
    return Dot;
}());
exports.Dot = Dot;

},{}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dot_1 = require("./dot");
var MathUtil_1 = require("./MathUtil");
var Game = (function () {
    function Game() {
        this.state = [];
        this.tickRate = 10;
        this.spawnRate = 1000;
        this.fallSpeed = 0;
        this.maxSpeed = 100;
        this.minSpeed = 10;
        this.speedSlope = (this.maxSpeed - this.minSpeed) / 100;
        this.clicksToHandle = [];
        this.maxRadius = 100;
        this.minRadius = 10;
        this.score = 0;
    }
    Game.prototype.start = function () {
        var _this = this;
        console.log("Starting Game");
        this.spawnPID = setInterval(function () {
            _this.spawn(1);
        }, this.spawnRate);
        this.tickPID = setInterval(this.tick.bind(this), this.tickRate);
        this.spawn(1);
    };
    Game.prototype.tick = function () {
        var _this = this;
        this.state = this.state.sort(function (left, right) {
            var yPos = right.y - left.y;
            if (yPos == 0) {
                return right.color.localeCompare(left.color);
            }
            return yPos;
        });
        var context = Game.Canvas.getContext('2d');
        context.clearRect(0, 0, Game.Canvas.width, Game.Canvas.height);
        this.state.forEach(function (dot) {
            dot.fall(_this.fallSpeed);
            dot.draw(context);
        });
        Game.Ctx = context;
        this.handleClicks();
        this.pruneSorted();
    };
    Game.prototype.spawn = function (count) {
        console.log("Spawning: " + count);
        for (var a = 0; a < count; a++) {
            var radius = MathUtil_1.MathUtil.GetRandomInRange(this.minRadius, this.maxRadius);
            var xPos = MathUtil_1.MathUtil.GetRandomInRange(radius, (this.width - radius));
            var dot = new dot_1.Dot(radius, xPos);
            this.state.push(dot);
        }
    };
    Game.prototype.queueClick = function (event) {
        var x = event.clientX;
        var y = event.clientY;
        var rect = Game.Canvas.getBoundingClientRect();
        this.clicksToHandle.push({ x: x - rect.left, y: y - rect.top });
    };
    Game.prototype.speedChange = function (event) {
        var sliderValue = +event.target.value;
        var pixPerSec = this.speedSlope * sliderValue + this.minSpeed;
        this.speedChangeCalc(pixPerSec);
    };
    Game.prototype.speedChangeCalc = function (totalPixels) {
        this.fallSpeed = totalPixels * this.tickRate / 1000;
    };
    Game.prototype.initialize = function () {
        var slider = document.getElementById("speedSlider");
        slider.addEventListener("input", this.speedChange.bind(this));
        slider.value = "0";
        this.speedChangeCalc(this.minSpeed);
        var window = document.getElementById("game-window");
        Game.Canvas.width = window.clientWidth;
        Game.Canvas.height = window.clientHeight;
        this.width = Game.Canvas.width;
        this.height = Game.Canvas.height;
        Game.Canvas.addEventListener("mousedown", this.queueClick.bind(this));
    };
    Game.prototype.pruneSorted = function () {
        var newStart = 0;
        for (var a = 0; a < this.state.length; a++) {
            if (this.state[a].y - (this.state[a].radius) > this.height) {
                newStart++;
            }
            else {
                break;
            }
        }
        if (newStart != 0) {
            console.log("Pruned: " + newStart);
            this.state.splice(0, newStart);
        }
    };
    Game.prototype.handleClicks = function () {
        var _this = this;
        this.clicksToHandle.forEach(function (clickPos) {
            _this.handleClick(clickPos.x, clickPos.y);
        });
        this.clicksToHandle = [];
    };
    Game.prototype.handleClick = function (x, y) {
        var _this = this;
        var aPotentialIndex = this.binaryTreeFind(y);
        if (aPotentialIndex == -1) {
            return;
        }
        var start;
        var end;
        for (start = aPotentialIndex - 1; start >= 0; start--) {
            var cur = this.state[start];
            if (!(this.isWithinYMaxRadius(cur, y) == 0)) {
                break;
            }
        }
        start++;
        for (end = aPotentialIndex + 1; end < this.state.length; end++) {
            var cur = this.state[end];
            if (!(this.isWithinYMaxRadius(cur, y) == 0)) {
                break;
            }
        }
        end--;
        var spliceStart = -1;
        var spliceCount = -1;
        var splicedScore = 0;
        for (var a = end; a >= start; a--) {
            var cur = this.state[a];
            if (this.isWithinRadius(cur, x, y)) {
                if (spliceStart == -1) {
                    spliceStart = a;
                    spliceCount = 1;
                }
                else {
                    spliceStart--;
                    spliceCount++;
                }
                splicedScore += cur.worth;
            }
            else {
                if (spliceStart != -1) {
                    this.state.splice(spliceStart, spliceCount);
                    setTimeout(function (count) { return _this.spawn(count); }, 1000, new Number(spliceCount));
                    this.updateScore(splicedScore);
                }
                spliceStart = -1;
                spliceCount = -1;
                splicedScore = 0;
            }
        }
        if (spliceStart != -1) {
            this.state.splice(spliceStart, spliceCount);
            setTimeout(function (count) { return _this.spawn(count); }, 1000, new Number(spliceCount));
            this.updateScore(splicedScore);
        }
    };
    Game.prototype.binaryTreeFind = function (y) {
        if (this.state.length == 0) {
            return -1;
        }
        return this.binaryTreeFindRecurse(y, 0, this.state.length - 1, this.state, this.isWithinYMaxRadius.bind(this));
    };
    Game.prototype.binaryTreeFindRecurse = function (y, start, end, arr, comparetor) {
        if (end < start) {
            return -1;
        }
        if (end - start == 0) {
            if (comparetor(arr[start], y) == 0) {
                return start;
            }
            else {
                return -1;
            }
        }
        var half = Math.floor((start + end) / 2);
        var val = arr[half];
        var compare = comparetor(val, y);
        if (compare == 0) {
            return half;
        }
        else if (compare == -1) {
            return this.binaryTreeFindRecurse(y, start, half, arr, comparetor);
        }
        else {
            return this.binaryTreeFindRecurse(y, half + 1, end, arr, comparetor);
        }
    };
    Game.prototype.isWithinYMaxRadius = function (dot, y) {
        var isWithin = Math.pow(dot.y - y, 2) < Math.pow(this.maxRadius, 2);
        if (isWithin) {
            return 0;
        }
        if (dot.y < y) {
            return -1;
        }
        else {
            return 1;
        }
    };
    Game.prototype.isWithinRadius = function (dot, x, y) {
        var dotX = dot.x;
        var dotY = dot.y;
        var distanceSquared = Math.pow(dotX - x, 2) + Math.pow(dotY - y, 2);
        return distanceSquared < Math.pow(dot.radius, 2);
    };
    Game.prototype.updateScore = function (score) {
        this.score += score;
        Game.Scoreboard.innerText = this.score.toFixed(2);
    };
    Game.Canvas = document.getElementById("game-canvas");
    Game.Ctx = Game.Canvas.getContext("2d");
    Game.Scoreboard = document.getElementById("score-display");
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
