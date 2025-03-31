document.addEventListener('DOMContentLoaded', () => {
    const bird = document.getElementById('bird');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score-display');
    const gameOverDisplay = document.getElementById('game-over');
    const startScreen = document.getElementById('start-screen');
    
    let birdPosition = 300;
    let birdVelocity = 0;
    let gravity = 0.5;
    let gameRunning = false;
    let score = 0;
    let pipes = [];
    let pipeGap = 150;
    let pipeFrequency = 1500; // milliseconds
    let lastPipeTime = 0;
    let gameSpeed = 2;
    let gameAreaHeight = 600;
    let gameAreaWidth = 400;
    
    // Start game
    function startGame() {
        gameRunning = true;
        score = 0;
        scoreDisplay.textContent = score;
        birdPosition = 300;
        birdVelocity = 0;
        pipes.forEach(pipe => pipe.element.remove());
        pipes = [];
        gameOverDisplay.style.display = 'none';
        startScreen.style.display = 'none';
        lastPipeTime = 0;
        
        // Reset bird position
        bird.style.top = birdPosition + 'px';
        bird.style.transform = 'rotate(0deg)';
        
        // Start game loop
        requestAnimationFrame(gameLoop);
    }
    
    // Game over
    function endGame() {
        gameRunning = false;
        gameOverDisplay.style.display = 'block';
    }
    
    // Game loop
    function gameLoop(timestamp) {
        if (!gameRunning) return;
        
        // Update bird
        birdVelocity += gravity;
        birdPosition += birdVelocity;
        bird.style.top = birdPosition + 'px';
        
        // Rotate bird based on velocity
        let rotation = Math.min(birdVelocity * 5, 90);
        bird.style.transform = `rotate(${rotation}deg)`;
        
        // Check for collisions with ground or ceiling
        if (birdPosition > gameAreaHeight - 30 || birdPosition < 0) {
            endGame();
            return;
        }
        
        // Generate pipes
        if (timestamp - lastPipeTime > pipeFrequency) {
            createPipe();
            lastPipeTime = timestamp;
        }
        
        // Move pipes and check for collisions
        for (let i = pipes.length - 1; i >= 0; i--) {
            const pipe = pipes[i];
            pipe.x -= gameSpeed;
            pipe.element.style.left = pipe.x + 'px';
            
            // Check if bird passed the pipe
            if (!pipe.passed && pipe.x + 60 < 50) {
                pipe.passed = true;
                score++;
                scoreDisplay.textContent = score;
                
                // Increase difficulty
                if (score % 5 === 0) {
                    gameSpeed += 0.5;
                    pipeFrequency = Math.max(800, pipeFrequency - 100);
                }
            }
            
            // Check for collisions with pipes
            if (
                50 < pipe.x + 60 && 
                50 + 40 > pipe.x && 
                (birdPosition < pipe.topHeight || birdPosition + 30 > pipe.topHeight + pipeGap)
            ) {
                endGame();
                return;
            }
            
            // Remove pipes that are off screen
            if (pipe.x < -60) {
                pipe.element.remove();
                pipes.splice(i, 1);
            }
        }
        
        requestAnimationFrame(gameLoop);
    }
    
    // Create a new pipe
    function createPipe() {
        const topHeight = Math.floor(Math.random() * (gameAreaHeight - pipeGap - 100)) + 50;
        const bottomHeight = gameAreaHeight - topHeight - pipeGap;
        
        const topPipe = document.createElement('div');
        topPipe.className = 'pipe';
        topPipe.style.height = topHeight + 'px';
        topPipe.style.top = '0';
        
        const bottomPipe = document.createElement('div');
        bottomPipe.className = 'pipe';
        bottomPipe.style.height = bottomHeight + 'px';
        bottomPipe.style.bottom = '0';
        
        gameContainer.appendChild(topPipe);
        gameContainer.appendChild(bottomPipe);
        
        pipes.push({
            element: topPipe,
            x: gameAreaWidth,
            topHeight: topHeight,
            passed: false
        });
        
        pipes.push({
            element: bottomPipe,
            x: gameAreaWidth,
            topHeight: topHeight,
            passed: false
        });
    }
    
    // Handle keyboard input
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            if (!gameRunning) {
                startGame();
            } else {
                birdVelocity = -8;
            }
            e.preventDefault();
        }
    });
    
    // Handle touch input for mobile
    gameContainer.addEventListener('click', () => {
        if (!gameRunning) {
            startGame();
        } else {
            birdVelocity = -8;
        }
    });
});
