var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var docCanvas = document.getElementById("canvas");
var canvas = docCanvas;
var ctx = canvas.getContext("2d");
var wWidth = window.innerWidth;
var wHeight = window.innerHeight;
var P = 300;
var blobs = [];
window.addEventListener("resize", function () {
    setup();
});
var game = function () {
    setup();
    var blob = new BlobX(wWidth / 2, wHeight / 2, 25);
    blob.draw();
    blob.update(0);
    incBlobs();
};
var setup = function () {
    var w = 5000;
    var h = 5000;
    canvas.width = w;
    canvas.height = h;
    if (ctx) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
};
var incBlobs = function () {
    setInterval(function () {
        for (var i = 0; i < 20; i++) {
            var x = genRandBetween(P, canvas.width - P);
            var y = genRandBetween(P, canvas.height - P);
            var nBlob = new BlobX(x, y, 10);
            blobs = __spreadArray(__spreadArray([], blobs, true), [nBlob], false);
        }
    }, 4000);
};
var drawBlobs = function (blob) {
    for (var i = blobs.length - 1; i > 0; i--) {
        var nBlob = blobs[i];
        nBlob.draw();
        if (blob.eats(nBlob)) {
            blobs.splice(i, 1);
        }
    }
};
var colors = [
    '#FFFE34',
    '#F9BC02',
    '#FD5309',
    '#FD5309',
    '#FF2713',
    '#FFFFFF',
    '#8601B0',
    '#3E02A6',
    '#0246FF',
    '#0493CD',
    '#0491C8',
    '#CFE92A',
];
var getColor = function () {
    var colorIndex = genRandBetween(0, colors.length - 1);
    return colors[colorIndex];
};
var mouseX = 0;
var mouseY = 0;
var moveAnim = null;
document.addEventListener("mousemove", function (e) {
    var clientX = e.clientX, clientY = e.clientY;
    mouseX = clientX;
    mouseY = clientY;
});
document.addEventListener("resize", function () {
    if (moveAnim) {
        cancelAnimationFrame(moveAnim);
    }
});
var BlobX = /** @class */ (function () {
    function BlobX(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = 5;
        this.lastTime = 0;
        this.interval = 1;
        this.timer = 0;
        this.zoom = 25 / this.r;
        this.color = getColor();
    }
    BlobX.prototype.draw = function () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
    };
    BlobX.prototype.update = function (timestamp) {
        var delta = timestamp - this.lastTime;
        this.lastTime = timestamp;
        if (this.timer > this.interval) {
            var rotation = Math.atan2(mouseY - wHeight / 2, mouseX - wWidth / 2);
            var newX = this.x + this.speed * Math.cos(rotation);
            var newY = this.y + this.speed * Math.sin(rotation);
            if (newX > P && newX < canvas.width - P) {
                this.x = newX;
            }
            if (newY > P && newY < canvas.height - P) {
                this.y = newY;
            }
            this.zoom = 70 / this.r;
            this.speed = 5 * this.zoom;
            ctx.resetTransform();
            ctx.restore();
            ctx.translate(wWidth / 2 - this.x * this.zoom, wHeight / 2 - this.y * this.zoom);
            ctx.scale(this.zoom, this.zoom);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawBlobs(this);
            this.draw();
            this.timer = 0;
        }
        else {
            this.timer += delta;
        }
        moveAnim = requestAnimationFrame(this.update.bind(this));
    };
    BlobX.prototype.eats = function (blob) {
        var dX = this.x - blob.x;
        var dY = this.y - blob.y;
        if (dX < 0) {
            dX = -dX;
        }
        if (dY < 0) {
            dY = -dY;
        }
        if (dX < blob.r + this.r && dY < blob.r + this.r) {
            var sum = Math.PI * this.r * this.r + Math.PI * blob.r * blob.r;
            this.r = Math.sqrt(sum / Math.PI);
            return true;
        }
        else {
            return false;
        }
    };
    return BlobX;
}());
var genRandBetween = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
game();
