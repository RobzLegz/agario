const docCanvas = document.getElementById("canvas")

const canvas: HTMLCanvasElement = docCanvas as HTMLCanvasElement;

const ctx = canvas.getContext("2d");

const wWidth = window.innerWidth;
const wHeight = window.innerHeight;
const P = 300;

let blobs: BlobX[] = [];
window.addEventListener("resize", () => {
    setup();
})

const game = () => {
    setup();

    const blob = new BlobX(wWidth / 2, wHeight / 2, 25);
    blob.draw();
    blob.update(0);
    
    incBlobs();
}

const setup = () => {
    const w = 5000;
    const h = 5000;

    canvas.width = w;
    canvas.height = h;

    if(ctx){
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

const incBlobs = () => {
    setInterval(() => {
        for(let i = 0; i< 20; i++){
            const x = genRandBetween(P, canvas.width - P);
            const y = genRandBetween(P, canvas.height - P);

            const nBlob = new BlobX(x, y, 10);

            blobs = [...blobs, nBlob];
        }
    }, 4000);
}

const drawBlobs = (blob: BlobX) => {
    for(let i = blobs.length - 1; i > 0; i --){
        const nBlob = blobs[i];

        nBlob.draw();

        if(blob.eats(nBlob)){
            blobs.splice(i, 1);
        }
    }
}

const colors = [
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
]

const getColor = () => {
    const colorIndex = genRandBetween(0, colors.length - 1);

    return colors[colorIndex]
}

let mouseX = 0;
let mouseY = 0;
let moveAnim: number | null = null;

document.addEventListener("mousemove", (e) => {
    const {clientX, clientY} = e;

    mouseX = clientX;
    mouseY = clientY;
})

document.addEventListener("resize", () => {
    if(moveAnim){
        cancelAnimationFrame(moveAnim);
    }
})

class BlobX{
    speed: number;
    lastTime: number;
    interval: number;
    timer: number;
    zoom: number;
    color: string;

    constructor(public x: number, public y: number, public r: number){
        this.x = x;
        this.y = y;
        this.r = r;
        this.speed = 5;
        this.lastTime = 0;
        this.interval = 1;
        this.timer = 0;
        this.zoom = 25/this.r;
        this.color = getColor();
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke()
    }

    update(timestamp: number){
        const delta = timestamp - this.lastTime;
        this.lastTime = timestamp;

        if(this.timer > this.interval){
            const rotation = Math.atan2(mouseY - wHeight / 2, mouseX - wWidth / 2);

            const newX = this.x + this.speed * Math.cos(rotation);
            const newY = this.y + this.speed * Math.sin(rotation);

            if(newX > P && newX < canvas.width - P){
                this.x = newX;
            }

            if(newY > P && newY < canvas.height - P){
                this.y = newY;
            }

            this.zoom = 70 / this.r;

            this.speed = 5 * this.zoom;

            ctx.resetTransform()
            ctx.restore()
            ctx.translate(wWidth / 2 - this.x * this.zoom, wHeight / 2 - this.y * this.zoom);
            ctx.scale(this.zoom, this.zoom);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#000000";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            drawBlobs(this);

            this.draw();

            this.timer = 0;
        }else{
            this.timer += delta
        }

        moveAnim = requestAnimationFrame(this.update.bind(this))
    }

    eats(blob: BlobX){
        let dX = this.x - blob.x;
        let dY = this.y - blob.y;

        if(dX < 0){
            dX = -dX;
        }

        if(dY < 0){
            dY = -dY;
        }

        if(dX < blob.r + this.r && dY < blob.r + this.r){
            const sum = Math.PI * this.r * this.r + Math.PI * blob.r * blob.r;

            this.r = Math.sqrt(sum / Math.PI);
            return true
        }else{
            return false;
        }
    }
}

const genRandBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

game();