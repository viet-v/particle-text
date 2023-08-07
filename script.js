const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
let particlesArray = [];
let adjustX = 0;
let adjustY = 0;
let textX = 0;
let textY = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;    
})

let textSize = canvas.width / 100;

const mouse = {
    x: undefined,
    y: undefined,
    radius: 100
}

canvas.addEventListener("click", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;

})
canvas.addEventListener("mousemove", function(event) {
    mouse.x = event.x;
    mouse.y = event.y;
})

ctx.fillStyle = "white";
ctx.font = "21px sans-serif";
ctx.textAlign = "left";    
ctx.textBaseline = "top";
ctx.fillText("sunday", (canvas.width/6)/textSize, (canvas.height/6)/textSize);

const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);


class Particle {
    constructor(x, y) {
        // Random Position, Size and Speed of Each Particle
        this.x = x;
        this.y = y;
        this.size = 5;
        this.baseX = this.x;
        this.baseY = this.y;
    }
    update() {
        // Make The Particle Move
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        let directionX = dx / distance;
        let directionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let forceDirectionX = directionX * force;
        let forceDirectionY = directionY * force;
        
        if (distance < mouse.radius) {
            this.x -= forceDirectionX * 5;
            this.y -= forceDirectionY * 5;
        } else {
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx/15;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy/15;
            }
        }
    }
    draw() {
        // How The Particle Looks
        ctx.fillStyle = "orange";
        ctx.strokeStyle = "lightblue";
        ctx.lineWidth = 1/6;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }
}

// Initiate a Number of Particles (constructor is called)
function init() {
    for (y = 0; y < textCoordinates.height; y++) {
        for (x = 0; x < textCoordinates.width; x++) {
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 200) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                console.log(positionX, positionY)
                particlesArray.push(new Particle(positionX * textSize, positionY * textSize));
            }
        }
    }
}
init();

// Call update method to make particle move, draw method to draw each particle
// And use Pythagorean Theorem to create connecting lines
function handleParticles() {
    for (let i = 0; i < particlesArray.length; i++) {

        // Draw Each Particle
        particlesArray[i].draw();
        // Make Particles Move
        particlesArray[i].update();

        // Keep Particles Inside Canvas
        // if ((particlesArray[i].x >= canvas.width) || (particlesArray[i].x <= 0)) {
        //     particlesArray[i].speedX *= -1;
        // }
        // if ((particlesArray[i].y >= canvas.height) || (particlesArray[i].y <= 0)) {
        //     particlesArray[i].speedY *= -1;
        // }

    }
}

function connectParticles() {
    for (i = 0; i < particlesArray.length; i++) {
        for (j = i; j < particlesArray.length; j++) {
            let dx = particlesArray[i].x - particlesArray[j].x;
            let dy = particlesArray[i].y - particlesArray[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 40) {
                ctx.strokeStyle = "yellow";
                ctx.lineWidth = 1;
                ctx.beginPath(); // Start a new path
                ctx.moveTo(particlesArray[i].x, particlesArray[i].y); // Move the pen to
                ctx.lineTo(particlesArray[j].x, particlesArray[j].y); // Draw a line to
                ctx.stroke(); // Render the path
            }
        }
    }
}



function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    connectParticles();
    requestAnimationFrame(animate);
}
animate();