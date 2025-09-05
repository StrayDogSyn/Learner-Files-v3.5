// Marvel Quiz Application - Main Logic
// Advanced quiz game with dynamic questions, scoring, and state management

class MarvelQuizApp {
    constructor() {
        this.gameState = {
            currentScreen: 'home',
            difficulty: 'medium',
            currentQuestion: 0,
            totalQuestions: 10,
            score: 0,
            timeRemaining: 30,
            streak: 0,
            maxStreak: 0,
            startTime: null,
            endTime: null,
            questions: [],
            answers: [],
            isGameActive: false,
            isPaused: false
        };
        
        this.config = {
            difficulties: {
                easy: { timeLimit: 30, scoreMultiplier: 1, questionCount: 10 },
                medium: { timeLimit: 20, scoreMultiplier: 1.5, questionCount: 15 },
                hard: { timeLimit: 15, scoreMultiplier: 2, questionCount: 20 }
            },
            animations: {
                transitionDuration: 300,
                scoreAnimationDuration: 1000
            }
        };
        
        this.timer = null;
        this.questionGenerator = null;
        this.scoreCalculator = null;
        
        this.init();
    }
    
    async init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    async setup() {
        // Initialize components
        this.questionGenerator = new QuestionGenerator();
        this.scoreCalculator = new ScoreCalculator();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load saved game state
        this.loadGameState();
        
        // Initialize UI
        this.updateUI();
        
        // Setup PWA features
        this.setupPWA();
        
        console.log('Marvel Quiz App initialized successfully');
    }
    
    setupEventListeners() {
        // Difficulty selection
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectDifficulty(e.target.dataset.difficulty);
            });
        });
        
        // Start game button
        const startButton = document.getElementById('startButton');
        if (startButton) {
            startButton.addEventListener('click', () => this.startGame());
        }
        
        // Answer options
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-option')) {
                this.selectAnswer(e.target);
            }
        });
        
        // Next question button
        const nextButton = document.getElementById('nextButton');
        if (nextButton) {
            nextButton.addEventListener('click', () => this.nextQuestion());
        }
        
        // Restart game button
        const restartButton = document.getElementById('restartButton');
        if (restartButton) {
            restartButton.addEventListener('click', () => this.restartGame());
        }
        
        // Pause/Resume button
        const pauseButton = document.getElementById('pauseButton');
        if (pauseButton) {
            pauseButton.addEventListener('click', () => this.togglePause());
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Network status
        window.addEventListener('marvelAPINetworkStatus', (e) => {
            this.handleNetworkStatus(e.detail);
        });
        
        // Visibility change (for pause on tab switch)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && this.gameState.isGameActive) {
                this.pauseGame();
            }
        });
    }
    
    selectDifficulty(difficulty) {
        this.gameState.difficulty = difficulty;
        const config = this.config.difficulties[difficulty];
        this.gameState.totalQuestions = config.questionCount;
        
        // Update UI
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-difficulty="${difficulty}"]`).classList.add('selected');
        
        // Update question count display
        const questionCountElement = document.getElementById('questionCount');
        if (questionCountElement) {
            questionCountElement.textContent = config.questionCount;
        }
        
        this.saveGameState();
    }
    
    async startGame() {
        try {
            // Reset game state
            this.gameState = {
                ...this.gameState,
                currentQuestion: 0,
                score: 0,
                streak: 0,
                maxStreak: 0,
                startTime: Date.now(),
                endTime: null,
                questions: [],
                answers: [],
                isGameActive: true,
                isPaused: false
            };
            
            // Generate questions
            this.showLoadingScreen();
            this.gameState.questions = await this.questionGenerator.generateQuestions(
                this.gameState.totalQuestions,
                this.gameState.difficulty
            );
            
            // Start the game
            this.gameState.currentScreen = 'game';
            this.updateUI();
            this.startQuestion();
            
        } catch (error) {
            console.error('Failed to start game:', error);
            this.showError('Failed to start game. Please try again.');
        }
    }
    
    startQuestion() {
        if (this.gameState.currentQuestion >= this.gameState.questions.length) {
            this.endGame();
            return;
        }
        
        const question = this.gameState.questions[this.gameState.currentQuestion];
        const config = this.config.difficulties[this.gameState.difficulty];
        
        // Reset timer
        this.gameState.timeRemaining = config.timeLimit;
        
        // Display question
        this.displayQuestion(question);
        
        // Start timer
        this.startTimer();
        
        // Update progress
        this.updateProgress();
    }
    
    displayQuestion(question) {
        const questionContainer = document.getElementById('questionContainer');
        if (!questionContainer) return;
        
        // Update question text
        const questionText = document.getElementById('questionText');
        if (questionText) {
            questionText.textContent = question.question;
        }
        
        // Update character image if present
        const characterImage = document.getElementById('characterImage');
        if (characterImage && question.image) {
            characterImage.src = question.image;
            characterImage.style.display = 'block';
        } else if (characterImage) {
            characterImage.style.display = 'none';
        }
        
        // Update answer options
        const answerOptions = document.querySelectorAll('.answer-option');
        question.options.forEach((option, index) => {
            if (answerOptions[index]) {
                answerOptions[index].textContent = option;
                answerOptions[index].classList.remove('selected', 'correct', 'incorrect');
                answerOptions[index].dataset.answer = option;
            }
        });
        
        // Reset next button
        const nextButton = document.getElementById('nextButton');
        if (nextButton) {
            nextButton.style.display = 'none';
        }
    }
    
    startTimer() {
        this.clearTimer();
        
        this.timer = setInterval(() => {
            if (this.gameState.isPaused) return;
            
            this.gameState.timeRemaining--;
            this.updateTimerDisplay();
            
            if (this.gameState.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.gameState.timeRemaining;
            
            // Add warning class for low time
            if (this.gameState.timeRemaining <= 5) {
                timerElement.classList.add('warning');
            } else {
                timerElement.classList.remove('warning');
            }
        }
    }
    
    selectAnswer(answerElement) {
        if (!this.gameState.isGameActive || this.gameState.isPaused) return;
        
        const selectedAnswer = answerElement.dataset.answer;
        const question = this.gameState.questions[this.gameState.currentQuestion];
        const isCorrect = selectedAnswer === question.correct;
        
        // Stop timer
        this.clearTimer();
        
        // Record answer
        this.gameState.answers.push({
            question: question.question,
            selected: selectedAnswer,
            correct: question.correct,
            isCorrect: isCorrect,
            timeRemaining: this.gameState.timeRemaining
        });
        
        // Update UI
        this.showAnswerResult(answerElement, isCorrect);
        
        // Calculate score
        if (isCorrect) {
            const points = this.scoreCalculator.calculateScore(
                this.gameState.timeRemaining,
                this.gameState.difficulty,
                this.gameState.streak
            );
            this.gameState.score += points;
            this.gameState.streak++;
            this.gameState.maxStreak = Math.max(this.gameState.maxStreak, this.gameState.streak);
            
            this.animateScoreIncrease(points);
        } else {
            this.gameState.streak = 0;
        }
        
        // Update score display
        this.updateScoreDisplay();
        
        // Show next button
        setTimeout(() => {
            const nextButton = document.getElementById('nextButton');
            if (nextButton) {
                nextButton.style.display = 'block';
            }
        }, 1000);
    }
    
    showAnswerResult(selectedElement, isCorrect) {
        const question = this.gameState.questions[this.gameState.currentQuestion];
        
        // Mark selected answer
        selectedElement.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Show correct answer if wrong
        if (!isCorrect) {
            document.querySelectorAll('.answer-option').forEach(option => {
                if (option.dataset.answer === question.correct) {
                    option.classList.add('correct');
                }
            });
        }
        
        // Disable all options
        document.querySelectorAll('.answer-option').forEach(option => {
            option.style.pointerEvents = 'none';
        });
    }
    
    timeUp() {
        this.clearTimer();
        
        const question = this.gameState.questions[this.gameState.currentQuestion];
        
        // Record timeout
        this.gameState.answers.push({
            question: question.question,
            selected: null,
            correct: question.correct,
            isCorrect: false,
            timeRemaining: 0
        });
        
        // Reset streak
        this.gameState.streak = 0;
        
        // Show correct answer
        document.querySelectorAll('.answer-option').forEach(option => {
            if (option.dataset.answer === question.correct) {
                option.classList.add('correct');
            }
            option.style.pointerEvents = 'none';
        });
        
        // Show timeout message
        this.showTimeoutMessage();
        
        // Show next button
        setTimeout(() => {
            const nextButton = document.getElementById('nextButton');
            if (nextButton) {
                nextButton.style.display = 'block';
            }
        }, 1000);
    }
    
    nextQuestion() {
        this.gameState.currentQuestion++;
        
        // Re-enable answer options
        document.querySelectorAll('.answer-option').forEach(option => {
            option.style.pointerEvents = 'auto';
        });
        
        this.startQuestion();
    }
    
    endGame() {
        this.gameState.isGameActive = false;
        this.gameState.endTime = Date.now();
        this.clearTimer();
        
        // Calculate final statistics
        const stats = this.calculateFinalStats();
        
        // Save high score
        this.saveHighScore(stats);
        
        // Show results
        this.showResults(stats);
        
        // Save game state
        this.saveGameState();
    }
    
    calculateFinalStats() {
        const totalTime = this.gameState.endTime - this.gameState.startTime;
        const correctAnswers = this.gameState.answers.filter(a => a.isCorrect).length;
        const accuracy = (correctAnswers / this.gameState.answers.length) * 100;
        const averageTime = totalTime / this.gameState.answers.length;
        
        return {
            score: this.gameState.score,
            correctAnswers,
            totalQuestions: this.gameState.answers.length,
            accuracy: Math.round(accuracy),
            maxStreak: this.gameState.maxStreak,
            totalTime: Math.round(totalTime / 1000),
            averageTime: Math.round(averageTime / 1000),
            difficulty: this.gameState.difficulty
        };
    }
    
    // Additional methods for UI updates, state management, etc.
    updateUI() {
        // Implementation for updating the user interface
        this.updateScoreDisplay();
        this.updateProgress();
    }
    
    updateScoreDisplay() {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            scoreElement.textContent = this.gameState.score.toLocaleString();
        }
        
        const streakElement = document.getElementById('streak');
        if (streakElement) {
            streakElement.textContent = this.gameState.streak;
        }
    }
    
    updateProgress() {
        const progressElement = document.getElementById('progress');
        if (progressElement) {
            const progress = (this.gameState.currentQuestion / this.gameState.totalQuestions) * 100;
            progressElement.style.width = `${progress}%`;
        }
        
        const questionNumberElement = document.getElementById('questionNumber');
        if (questionNumberElement) {
            questionNumberElement.textContent = `${this.gameState.currentQuestion + 1} / ${this.gameState.totalQuestions}`;
        }
    }
    
    // State management
    saveGameState() {
        try {
            localStorage.setItem('marvelQuiz_gameState', JSON.stringify(this.gameState));
        } catch (error) {
            console.error('Failed to save game state:', error);
        }
    }
    
    loadGameState() {
        try {
            const saved = localStorage.getItem('marvelQuiz_gameState');
            if (saved) {
                const savedState = JSON.parse(saved);
                this.gameState = { ...this.gameState, ...savedState };
            }
        } catch (error) {
            console.error('Failed to load game state:', error);
        }
    }
    
    // Additional utility methods...
    showLoadingScreen() {
        this.gameState.currentScreen = 'loading';
        const loadingElement = document.getElementById('loadingScreen');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }
    }
    
    hideLoadingScreen() {
        const loadingElement = document.getElementById('loadingScreen');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
    
    showError(message) {
        console.error(message);
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            setTimeout(() => {
                errorElement.style.display = 'none';
            }, 5000);
        }
    }
    
    animateScoreIncrease(points) {
        const scoreElement = document.getElementById('score');
        if (scoreElement) {
            const pointsElement = document.createElement('div');
            pointsElement.className = 'score-popup';
            pointsElement.textContent = `+${points}`;
            pointsElement.style.cssText = `
                position: absolute;
                color: #4caf50;
                font-weight: bold;
                font-size: 1.2em;
                animation: scorePopup 1s ease-out forwards;
                pointer-events: none;
                z-index: 1000;
            `;
            
            scoreElement.parentElement.appendChild(pointsElement);
            
            setTimeout(() => {
                pointsElement.remove();
            }, 1000);
        }
    }
    
    showTimeoutMessage() {
        const messageElement = document.getElementById('timeoutMessage');
        if (messageElement) {
            messageElement.style.display = 'block';
            messageElement.textContent = 'Time\'s up!';
            setTimeout(() => {
                messageElement.style.display = 'none';
            }, 2000);
        }
    }
    
    showResults(stats) {
        this.gameState.currentScreen = 'results';
        this.hideLoadingScreen();
        
        // Update results display
        const elements = {
            finalScore: document.getElementById('finalScore'),
            correctAnswers: document.getElementById('correctAnswers'),
            accuracy: document.getElementById('accuracy'),
            maxStreak: document.getElementById('maxStreak'),
            totalTime: document.getElementById('totalTime'),
            difficulty: document.getElementById('difficultyResult')
        };
        
        if (elements.finalScore) elements.finalScore.textContent = stats.score.toLocaleString();
        if (elements.correctAnswers) elements.correctAnswers.textContent = `${stats.correctAnswers}/${stats.totalQuestions}`;
        if (elements.accuracy) elements.accuracy.textContent = `${stats.accuracy}%`;
        if (elements.maxStreak) elements.maxStreak.textContent = stats.maxStreak;
        if (elements.totalTime) elements.totalTime.textContent = `${stats.totalTime}s`;
        if (elements.difficulty) elements.difficulty.textContent = stats.difficulty.toUpperCase();
        
        // Show results screen
        const resultsScreen = document.getElementById('resultsScreen');
        if (resultsScreen) {
            resultsScreen.style.display = 'flex';
        }
        
        // Hide game screen
        const gameScreen = document.getElementById('gameScreen');
        if (gameScreen) {
            gameScreen.style.display = 'none';
        }
    }
    
    saveHighScore(stats) {
        try {
            const highScores = JSON.parse(localStorage.getItem('marvelQuiz_highScores') || '[]');
            
            const newScore = {
                score: stats.score,
                accuracy: stats.accuracy,
                difficulty: stats.difficulty,
                date: new Date().toISOString(),
                maxStreak: stats.maxStreak,
                totalTime: stats.totalTime
            };
            
            highScores.push(newScore);
            highScores.sort((a, b) => b.score - a.score);
            highScores.splice(10); // Keep only top 10
            
            localStorage.setItem('marvelQuiz_highScores', JSON.stringify(highScores));
        } catch (error) {
            console.error('Failed to save high score:', error);
        }
    }
    
    setupPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
        
        // Handle install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            const installButton = document.getElementById('installButton');
            if (installButton) {
                installButton.style.display = 'block';
                installButton.addEventListener('click', () => {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult) => {
                        if (choiceResult.outcome === 'accepted') {
                            console.log('User accepted the install prompt');
                        }
                        deferredPrompt = null;
                        installButton.style.display = 'none';
                    });
                });
            }
        });
    }
    
    handleKeyboard(e) {
        if (!this.gameState.isGameActive) return;
        
        switch(e.key) {
            case '1':
            case '2':
            case '3':
            case '4':
                const optionIndex = parseInt(e.key) - 1;
                const options = document.querySelectorAll('.answer-option');
                if (options[optionIndex] && !this.gameState.isPaused) {
                    this.selectAnswer(options[optionIndex]);
                }
                break;
            case ' ':
            case 'Escape':
                e.preventDefault();
                this.togglePause();
                break;
            case 'Enter':
                const nextButton = document.getElementById('nextButton');
                if (nextButton && nextButton.style.display !== 'none') {
                    this.nextQuestion();
                }
                break;
        }
    }
    
    handleNetworkStatus(status) {
        const networkIndicator = document.getElementById('networkStatus');
        if (networkIndicator) {
            networkIndicator.className = `network-status ${status.isOnline ? 'online' : 'offline'}`;
            networkIndicator.textContent = status.isOnline ? 'Online' : 'Offline';
        }
        
        if (!status.isOnline) {
            this.showError('You are offline. Using cached data.');
        }
    }
    
    togglePause() {
        if (!this.gameState.isGameActive) return;
        
        this.gameState.isPaused = !this.gameState.isPaused;
        
        const pauseButton = document.getElementById('pauseButton');
        const pauseOverlay = document.getElementById('pauseOverlay');
        
        if (this.gameState.isPaused) {
            if (pauseButton) pauseButton.textContent = 'Resume';
            if (pauseOverlay) pauseOverlay.style.display = 'flex';
        } else {
            if (pauseButton) pauseButton.textContent = 'Pause';
            if (pauseOverlay) pauseOverlay.style.display = 'none';
        }
    }
    
    pauseGame() {
        if (this.gameState.isGameActive && !this.gameState.isPaused) {
            this.togglePause();
        }
    }
    
    restartGame() {
        // Reset game state
        this.gameState = {
            currentScreen: 'home',
            difficulty: this.gameState.difficulty,
            currentQuestion: 0,
            totalQuestions: this.config.difficulties[this.gameState.difficulty].questionCount,
            score: 0,
            timeRemaining: 30,
            streak: 0,
            maxStreak: 0,
            startTime: null,
            endTime: null,
            questions: [],
            answers: [],
            isGameActive: false,
            isPaused: false
        };
        
        // Clear timer
        this.clearTimer();
        
        // Hide all screens
        const screens = ['gameScreen', 'resultsScreen', 'loadingScreen', 'pauseOverlay'];
        screens.forEach(screenId => {
            const screen = document.getElementById(screenId);
            if (screen) screen.style.display = 'none';
        });
        
        // Show home screen
        const homeScreen = document.getElementById('homeScreen');
        if (homeScreen) {
            homeScreen.style.display = 'flex';
        }
        
        // Update UI
        this.updateUI();
        this.saveGameState();
    }
}

// Initialize the app when the page loads
window.marvelQuizApp = new MarvelQuizApp();