// Question Generator - Dynamic Marvel Quiz Questions
// Handles question creation, difficulty scaling, and question types

class QuestionGenerator {
    constructor() {
        this.marvelAPI = new MarvelAPI();
        this.questionTypes = [
            'character_name',
            'character_power',
            'character_origin',
            'character_team',
            'comic_series',
            'character_appearance'
        ];
        
        this.difficultySettings = {
            easy: {
                questionTypes: ['character_name', 'character_power'],
                obscurityLevel: 'popular',
                distractorSimilarity: 'low'
            },
            medium: {
                questionTypes: ['character_name', 'character_power', 'character_origin', 'character_team'],
                obscurityLevel: 'moderate',
                distractorSimilarity: 'medium'
            },
            hard: {
                questionTypes: this.questionTypes,
                obscurityLevel: 'obscure',
                distractorSimilarity: 'high'
            }
        };
        
        this.questionTemplates = {
            character_name: [
                "What is the real name of {character}?",
                "Who is the alter ego of {character}?",
                "What is {character}'s civilian identity?"
            ],
            character_power: [
                "What is {character}'s primary superpower?",
                "Which ability is {character} most known for?",
                "What makes {character} a formidable hero/villain?"
            ],
            character_origin: [
                "Where did {character} first appear?",
                "In which comic series did {character} debut?",
                "What is {character}'s origin story?"
            ],
            character_team: [
                "Which team is {character} most associated with?",
                "What superhero group does {character} belong to?",
                "Which organization has {character} been a member of?"
            ],
            comic_series: [
                "In which comic series does {character} regularly appear?",
                "What is {character}'s main comic book title?",
                "Which ongoing series features {character}?"
            ],
            character_appearance: [
                "What is {character}'s most distinctive visual feature?",
                "How would you describe {character}'s appearance?",
                "What color is primarily associated with {character}?"
            ]
        };
        
        this.cache = {
            characters: new Map(),
            questions: new Map(),
            lastGenerated: null
        };
    }
    
    async generateQuestions(count, difficulty = 'medium') {
        try {
            console.log(`Generating ${count} questions for ${difficulty} difficulty`);
            
            const questions = [];
            const settings = this.difficultySettings[difficulty];
            const usedCharacters = new Set();
            
            // Get character pool
            const characterPool = await this.getCharacterPool(settings.obscurityLevel, count * 3);
            
            if (characterPool.length === 0) {
                throw new Error('No characters available for question generation');
            }
            
            for (let i = 0; i < count; i++) {
                try {
                    const question = await this.generateSingleQuestion(
                        characterPool,
                        settings,
                        usedCharacters
                    );
                    
                    if (question) {
                        questions.push(question);
                    }
                } catch (error) {
                    console.warn(`Failed to generate question ${i + 1}:`, error);
                    // Continue with next question
                }
            }
            
            if (questions.length === 0) {
                throw new Error('Failed to generate any questions');
            }
            
            // Shuffle questions
            this.shuffleArray(questions);
            
            // Cache generated questions
            this.cache.questions.set(`${difficulty}_${count}`, questions);
            this.cache.lastGenerated = Date.now();
            
            console.log(`Successfully generated ${questions.length} questions`);
            return questions;
            
        } catch (error) {
            console.error('Question generation failed:', error);
            return this.getFallbackQuestions(count, difficulty);
        }
    }
    
    async generateSingleQuestion(characterPool, settings, usedCharacters) {
        const maxAttempts = 10;
        let attempts = 0;
        
        while (attempts < maxAttempts) {
            try {
                // Select random character
                const character = this.selectRandomCharacter(characterPool, usedCharacters);
                if (!character) {
                    throw new Error('No available characters');
                }
                
                // Select question type
                const questionType = this.selectQuestionType(settings.questionTypes);
                
                // Generate question
                const question = await this.createQuestion(character, questionType, settings);
                
                if (question && this.validateQuestion(question)) {
                    usedCharacters.add(character.id);
                    return question;
                }
                
            } catch (error) {
                console.warn(`Question generation attempt ${attempts + 1} failed:`, error);
            }
            
            attempts++;
        }
        
        return null;
    }
    
    async createQuestion(character, questionType, settings) {
        const template = this.selectTemplate(questionType);
        const questionText = template.replace('{character}', character.name);
        
        let correct, options;
        
        switch (questionType) {
            case 'character_name':
                correct = character.realName || character.name;
                options = await this.generateNameOptions(character, settings);
                break;
                
            case 'character_power':
                correct = character.powers?.[0] || 'Enhanced abilities';
                options = await this.generatePowerOptions(character, settings);
                break;
                
            case 'character_origin':
                correct = character.origin || character.firstAppearance || 'Marvel Comics';
                options = await this.generateOriginOptions(character, settings);
                break;
                
            case 'character_team':
                correct = character.teams?.[0] || 'Independent';
                options = await this.generateTeamOptions(character, settings);
                break;
                
            case 'comic_series':
                correct = character.series?.[0] || `${character.name} Comics`;
                options = await this.generateSeriesOptions(character, settings);
                break;
                
            case 'character_appearance':
                correct = character.appearance || 'Distinctive costume';
                options = await this.generateAppearanceOptions(character, settings);
                break;
                
            default:
                throw new Error(`Unknown question type: ${questionType}`);
        }
        
        if (!correct || !options || options.length < 4) {
            throw new Error('Failed to generate valid options');
        }
        
        // Ensure correct answer is in options
        if (!options.includes(correct)) {
            options[0] = correct;
        }
        
        // Shuffle options
        this.shuffleArray(options);
        
        return {
            id: `${character.id}_${questionType}_${Date.now()}`,
            question: questionText,
            options: options.slice(0, 4),
            correct: correct,
            type: questionType,
            character: character,
            difficulty: settings,
            image: character.image || null,
            explanation: this.generateExplanation(character, questionType, correct)
        };
    }
    
    async getCharacterPool(obscurityLevel, count) {
        try {
            // Check cache first
            const cacheKey = `${obscurityLevel}_${count}`;
            if (this.cache.characters.has(cacheKey)) {
                const cached = this.cache.characters.get(cacheKey);
                if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
                    return cached.data;
                }
            }
            
            // Try to get from API first
            const characters = await this.marvelAPI.fetchCharacters({
                limit: count,
                offset: Math.floor(Math.random() * 100)
            });
            
            if (characters && characters.length > 0) {
                // Process and enhance character data
                const processedCharacters = characters.map(char => this.processCharacterData(char));
                
                // Cache the results
                this.cache.characters.set(cacheKey, {
                    data: processedCharacters,
                    timestamp: Date.now()
                });
                
                return processedCharacters;
            }
            
            // Fallback to cached or default characters
            return this.getFallbackCharacters(obscurityLevel);
            
        } catch (error) {
            console.warn('Failed to get character pool from API:', error);
            return this.getFallbackCharacters(obscurityLevel);
        }
    }
    
    selectRandomCharacter(characterPool, usedCharacters) {
        const availableCharacters = characterPool.filter(char => !usedCharacters.has(char.id));
        
        if (availableCharacters.length === 0) {
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * availableCharacters.length);
        return availableCharacters[randomIndex];
    }
    
    selectQuestionType(availableTypes) {
        const randomIndex = Math.floor(Math.random() * availableTypes.length);
        return availableTypes[randomIndex];
    }
    
    selectTemplate(questionType) {
        const templates = this.questionTemplates[questionType];
        const randomIndex = Math.floor(Math.random() * templates.length);
        return templates[randomIndex];
    }
    
    async generateNameOptions(character, settings) {
        const options = [character.realName || character.name];
        
        // Add similar character names as distractors
        const distractors = await this.getNameDistractors(character, settings.distractorSimilarity);
        options.push(...distractors);
        
        return this.padOptions(options, [
            'Peter Parker',
            'Tony Stark',
            'Bruce Banner',
            'Steve Rogers',
            'Natasha Romanoff',
            'Wade Wilson'
        ]);
    }
    
    async generatePowerOptions(character, settings) {
        const options = [character.powers?.[0] || 'Enhanced abilities'];
        
        const commonPowers = [
            'Super strength',
            'Flight',
            'Telepathy',
            'Energy projection',
            'Invisibility',
            'Time manipulation',
            'Healing factor',
            'Enhanced agility'
        ];
        
        return this.padOptions(options, commonPowers);
    }
    
    async generateOriginOptions(character, settings) {
        const options = [character.origin || character.firstAppearance || 'Marvel Comics'];
        
        const commonOrigins = [
            'X-Men #1',
            'Fantastic Four #1',
            'Amazing Spider-Man #1',
            'Avengers #1',
            'Iron Man #1',
            'Thor #1'
        ];
        
        return this.padOptions(options, commonOrigins);
    }
    
    async generateTeamOptions(character, settings) {
        const options = [character.teams?.[0] || 'Independent'];
        
        const commonTeams = [
            'Avengers',
            'X-Men',
            'Fantastic Four',
            'Guardians of the Galaxy',
            'S.H.I.E.L.D.',
            'Defenders',
            'Inhumans',
            'Alpha Flight'
        ];
        
        return this.padOptions(options, commonTeams);
    }
    
    async generateSeriesOptions(character, settings) {
        const options = [character.series?.[0] || `${character.name} Comics`];
        
        const commonSeries = [
            'Amazing Spider-Man',
            'Uncanny X-Men',
            'Fantastic Four',
            'Iron Man',
            'Thor',
            'Captain America',
            'Hulk',
            'Daredevil'
        ];
        
        return this.padOptions(options, commonSeries);
    }
    
    async generateAppearanceOptions(character, settings) {
        const options = [character.appearance || 'Distinctive costume'];
        
        const commonAppearances = [
            'Red and blue costume',
            'Metal armor',
            'Green skin',
            'Claws and mask',
            'Cape and hammer',
            'Shield and uniform',
            'Black leather suit',
            'Cosmic energy aura'
        ];
        
        return this.padOptions(options, commonAppearances);
    }
    
    padOptions(options, fallbackOptions) {
        const needed = 4 - options.length;
        const available = fallbackOptions.filter(option => !options.includes(option));
        
        for (let i = 0; i < needed && i < available.length; i++) {
            options.push(available[i]);
        }
        
        return options;
    }
    
    async getNameDistractors(character, similarity) {
        try {
            // Try to get similar characters from API
            const similarChars = await this.marvelAPI.getRandomCharacters(6);
            
            if (similarChars && similarChars.length > 0) {
                return similarChars
                    .map(char => char.name || 'Unknown')
                    .filter(name => name !== character.realName && name !== character.name)
                    .slice(0, 3);
            }
        } catch (error) {
            console.warn('Failed to get name distractors from API:', error);
        }
        
        // Fallback to common Marvel character names
        const commonNames = [
            'Peter Parker', 'Tony Stark', 'Bruce Banner', 'Steve Rogers',
            'Natasha Romanoff', 'Clint Barton', 'Thor Odinson', 'Wade Wilson',
            'Scott Summers', 'Jean Grey', 'Logan', 'Ororo Munroe',
            'Reed Richards', 'Susan Storm', 'Johnny Storm', 'Ben Grimm'
        ];
        
        return commonNames
            .filter(name => name !== character.realName && name !== character.name)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
    }
    
    generateExplanation(character, questionType, correct) {
        switch (questionType) {
            case 'character_name':
                return `${character.name}'s real name is ${correct}.`;
            case 'character_power':
                return `${character.name} is known for ${correct}.`;
            case 'character_origin':
                return `${character.name} first appeared in ${correct}.`;
            case 'character_team':
                return `${character.name} is associated with ${correct}.`;
            case 'comic_series':
                return `${character.name} appears in ${correct}.`;
            case 'character_appearance':
                return `${character.name} is known for ${correct}.`;
            default:
                return `The correct answer is ${correct}.`;
        }
    }
    
    validateQuestion(question) {
        return question &&
               question.question &&
               question.options &&
               question.options.length === 4 &&
               question.correct &&
               question.options.includes(question.correct);
    }
    
    getFallbackQuestions(count, difficulty) {
        console.log('Using fallback questions');
        
        const fallbackQuestions = [
            {
                id: 'fallback_1',
                question: "What is Spider-Man's real name?",
                options: ['Peter Parker', 'Tony Stark', 'Bruce Banner', 'Steve Rogers'],
                correct: 'Peter Parker',
                type: 'character_name',
                difficulty: difficulty,
                explanation: "Spider-Man's real name is Peter Parker."
            },
            {
                id: 'fallback_2',
                question: "What is Iron Man's primary ability?",
                options: ['Powered armor suit', 'Super strength', 'Flight', 'Telepathy'],
                correct: 'Powered armor suit',
                type: 'character_power',
                difficulty: difficulty,
                explanation: "Iron Man's primary ability comes from his powered armor suit."
            },
            {
                id: 'fallback_3',
                question: "Which team is Captain America most associated with?",
                options: ['Avengers', 'X-Men', 'Fantastic Four', 'Guardians of the Galaxy'],
                correct: 'Avengers',
                type: 'character_team',
                difficulty: difficulty,
                explanation: "Captain America is most associated with the Avengers."
            }
        ];
        
        // Repeat questions to reach desired count
        const questions = [];
        for (let i = 0; i < count; i++) {
            const question = { ...fallbackQuestions[i % fallbackQuestions.length] };
            question.id = `fallback_${i + 1}`;
            questions.push(question);
        }
        
        return questions;
    }
    
    getFallbackCharacters(obscurityLevel) {
        return [
            {
                id: 1,
                name: 'Spider-Man',
                realName: 'Peter Parker',
                powers: ['Web-slinging', 'Wall-crawling', 'Spider-sense'],
                teams: ['Avengers'],
                origin: 'Amazing Fantasy #15',
                series: ['Amazing Spider-Man'],
                appearance: 'Red and blue costume'
            },
            {
                id: 2,
                name: 'Iron Man',
                realName: 'Tony Stark',
                powers: ['Powered armor', 'Genius intellect'],
                teams: ['Avengers'],
                origin: 'Tales of Suspense #39',
                series: ['Iron Man'],
                appearance: 'Red and gold armor'
            },
            {
                id: 3,
                name: 'Captain America',
                realName: 'Steve Rogers',
                powers: ['Enhanced strength', 'Shield mastery'],
                teams: ['Avengers'],
                origin: 'Captain America Comics #1',
                series: ['Captain America'],
                appearance: 'Red, white, and blue uniform'
            }
        ];
    }
    
    processCharacterData(character) {
        // Process and normalize character data from Marvel API
        return {
            id: character.id,
            name: character.name,
            realName: this.extractRealName(character.description),
            powers: this.extractPowers(character.description),
            teams: this.extractTeams(character.description),
            origin: character.comics?.items?.[0]?.name || 'Marvel Comics',
            series: character.series?.items?.map(s => s.name) || [character.name],
            appearance: this.extractAppearance(character.description),
            image: character.thumbnail ? `${character.thumbnail.path}.${character.thumbnail.extension}` : null,
            description: character.description || 'A Marvel character'
        };
    }
    
    extractRealName(description) {
        // Try to extract real name from description
        const patterns = [
            /real name is ([^,\.]+)/i,
            /born ([^,\.]+)/i,
            /alter ego of ([^,\.]+)/i
        ];
        
        for (const pattern of patterns) {
            const match = description?.match(pattern);
            if (match) {
                return match[1].trim();
            }
        }
        
        return null;
    }
    
    extractPowers(description) {
        // Extract powers from description
        const powerKeywords = [
            'super strength', 'flight', 'telepathy', 'telekinesis',
            'invisibility', 'healing', 'speed', 'agility',
            'energy projection', 'time manipulation', 'shapeshifting'
        ];
        
        const foundPowers = powerKeywords.filter(power => 
            description?.toLowerCase().includes(power)
        );
        
        return foundPowers.length > 0 ? foundPowers : ['Enhanced abilities'];
    }
    
    extractTeams(description) {
        // Extract team affiliations from description
        const teamKeywords = [
            'Avengers', 'X-Men', 'Fantastic Four', 'Guardians of the Galaxy',
            'S.H.I.E.L.D.', 'Defenders', 'Inhumans', 'Alpha Flight'
        ];
        
        const foundTeams = teamKeywords.filter(team => 
            description?.toLowerCase().includes(team.toLowerCase())
        );
        
        return foundTeams.length > 0 ? foundTeams : ['Independent'];
    }
    
    extractAppearance(description) {
        // Extract appearance details from description
        const appearanceKeywords = [
            'red and blue', 'metal armor', 'green skin', 'claws',
            'cape', 'shield', 'black leather', 'cosmic energy'
        ];
        
        const foundFeatures = appearanceKeywords.filter(feature => 
            description?.toLowerCase().includes(feature)
        );
        
        return foundFeatures.length > 0 ? foundFeatures[0] : 'Distinctive costume';
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    clearCache() {
        this.cache.characters.clear();
        this.cache.questions.clear();
        this.cache.lastGenerated = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuestionGenerator;
}