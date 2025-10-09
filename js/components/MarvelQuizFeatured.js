/**
 * MarvelQuizFeatured.js
 * Interactive Featured Project Component
 * Auto-playing quiz demo with pause-on-hover functionality
 */

class MarvelQuizFeatured {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id "${containerId}" not found`);
            return;
        }
        
        this.currentQuestion = 0;
        this.score = 0;
        this.isPlaying = true;
        this.isPaused = false;
        this.autoPlayDelay = 4000; // 4 seconds per question
        this.autoPlayTimer = null;
        
        this.questions = [
            {
                question: "Who is the Norse God of Thunder?",
                options: ["Loki", "Thor", "Odin", "Hela"],
                correct: 1
            },
            {
                question: "What is Tony Stark's superhero name?",
                options: ["War Machine", "Iron Man", "Iron Patriot", "Steel Man"],
                correct: 1
            },
            {
                question: "Which infinity stone is housed in the Mind Stone?",
                options: ["Vision's Forehead", "Loki's Scepter", "Tesseract", "Eye of Agamotto"],
                correct: 0
            },
            {
                question: "What is Captain America's real name?",
                options: ["Steve Rogers", "Bucky Barnes", "Sam Wilson", "John Walker"],
                correct: 0
            },
            {
                question: "Who is the guardian of the Soul Stone?",
                options: ["Thanos", "Red Skull", "Gamora", "Nebula"],
                correct: 1
            }
        ];
        
        this.init();
    }
    
    init() {
        this.render();
        this.attachEventListeners();
        this.startAutoPlay();
    }
    
    render() {
        const question = this.questions[this.currentQuestion];
        
        this.container.innerHTML = `
            <div class="quiz-preview-screen">
                <div class="quiz-header">
                    <h3 class="quiz-title">🎮 Marvel Universe Quiz</h3>
                    <div class="quiz-stats">
                        <span class="stat-badge">Question ${this.currentQuestion + 1}/${this.questions.length}</span>
                        <span class="stat-badge">Score: ${this.score}</span>
                    </div>
                </div>
                
                <div class="quiz-content">
                    <div class="question-container">
                        <p class="question-number">Question ${this.currentQuestion + 1} of ${this.questions.length}</p>
                        <h2 class="question-text">${question.question}</h2>
                    </div>
                    
                    <div class="quiz-options">
                        ${question.options.map((option, index) => `
                            <button class="quiz-option" data-index="${index}">
                                ${option}
                            </button>
                        `).join('')}
                    </div>
                </div>
                
                <div class="quiz-progress">
                    <div class="progress-text">
                        ${this.isPlaying ? '▶️ Auto-playing...' : '✅ Complete!'}
                    </div>
                    ${this.isPlaying ? `
                        <button class="btn-next" disabled>Next Question</button>
                    ` : `
                        <button class="btn-next" onclick="location.href='./marvel-quiz-game/index.html'">
                            Play Full Game
                        </button>
                    `}
                </div>
                
                <div class="pause-overlay">
                    <div class="pause-content">
                        <div class="pause-icon">⏸️</div>
                        <p class="pause-text">Demo Paused</p>
                        <p class="pause-subtext">Click any answer to interact</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    attachEventListeners() {
        // Answer selection
        const options = this.container.querySelectorAll('.quiz-option');
        options.forEach((option) => {
            option.addEventListener('click', (e) => {
                this.handleAnswer(parseInt(e.target.dataset.index));
            });
        });
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });
        
        this.container.addEventListener('mouseleave', () => {
            if (this.isPlaying) {
                this.resumeAutoPlay();
            }
        });
    }
    
    handleAnswer(selectedIndex) {
        this.stopAutoPlay();
        
        const question = this.questions[this.currentQuestion];
        const options = this.container.querySelectorAll('.quiz-option');
        
        // Disable all options
        options.forEach(opt => opt.disabled = true);
        
        // Show correct/incorrect
        options[selectedIndex].classList.add(
            selectedIndex === question.correct ? 'correct' : 'incorrect'
        );
        
        if (selectedIndex !== question.correct) {
            options[question.correct].classList.add('correct');
        } else {
            this.score++;
        }
        
        // Move to next question after delay
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }
    
    autoAnswer() {
        if (!this.isPlaying || this.isPaused) return;
        
        const question = this.questions[this.currentQuestion];
        const correctIndex = question.correct;
        
        // Simulate correct answer for auto-play
        this.score++;
        
        const options = this.container.querySelectorAll('.quiz-option');
        options[correctIndex].classList.add('correct');
        options.forEach(opt => opt.disabled = true);
        
        setTimeout(() => {
            this.nextQuestion();
        }, 1500);
    }
    
    nextQuestion() {
        this.currentQuestion++;
        
        if (this.currentQuestion >= this.questions.length) {
            this.endQuiz();
        } else {
            this.render();
            this.attachEventListeners();
            
            if (this.isPlaying && !this.isPaused) {
                this.startAutoPlay();
            }
        }
    }
    
    startAutoPlay() {
        if (!this.isPlaying || this.isPaused) return;
        
        this.autoPlayTimer = setTimeout(() => {
            this.autoAnswer();
        }, this.autoPlayDelay);
    }
    
    pauseAutoPlay() {
        this.isPaused = true;
        if (this.autoPlayTimer) {
            clearTimeout(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
    
    resumeAutoPlay() {
        this.isPaused = false;
        if (this.isPlaying && this.currentQuestion < this.questions.length) {
            this.startAutoPlay();
        }
    }
    
    stopAutoPlay() {
        this.isPlaying = false;
        this.pauseAutoPlay();
    }
    
    endQuiz() {
        this.isPlaying = false;
        this.stopAutoPlay();
        
        this.container.innerHTML = `
            <div class="quiz-preview-screen">
                <div class="quiz-header">
                    <h3 class="quiz-title">🎮 Marvel Universe Quiz</h3>
                    <div class="quiz-stats">
                        <span class="stat-badge">Complete!</span>
                    </div>
                </div>
                
                <div class="quiz-content" style="text-align: center; justify-content: center;">
                    <div style="margin-bottom: 2rem;">
                        <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
                        <h2 class="question-text" style="margin-bottom: 1rem;">
                            Quiz Complete!
                        </h2>
                        <p style="font-size: 1.25rem; color: var(--primary); font-weight: 600;">
                            Final Score: ${this.score}/${this.questions.length}
                        </p>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 1rem; max-width: 300px; margin: 0 auto;">
                        <button class="btn-primary" onclick="location.href='./marvel-quiz-game/index.html'" style="width: 100%; justify-content: center;">
                            🎮 Play Full Game
                        </button>
                        <button class="btn-secondary" onclick="window.marvelQuizDemo.restart()" style="width: 100%; justify-content: center;">
                            🔄 Restart Demo
                        </button>
                    </div>
                </div>
                
                <div class="quiz-progress">
                    <div class="progress-text">Demo finished</div>
                </div>
            </div>
        `;
    }
    
    restart() {
        this.currentQuestion = 0;
        this.score = 0;
        this.isPlaying = true;
        this.isPaused = false;
        this.render();
        this.attachEventListeners();
        this.startAutoPlay();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Make globally accessible for restart button
    window.marvelQuizDemo = new MarvelQuizFeatured('quiz-embed-container');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarvelQuizFeatured;
}
