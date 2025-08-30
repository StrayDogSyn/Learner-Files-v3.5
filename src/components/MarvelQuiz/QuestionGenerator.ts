import { 
  QuizQuestion, 
  QuizConfig, 
  QuestionType, 
  DifficultyLevel, 
  QuizCategory,
  MarvelCharacter,
  MarvelComic,
  MarvelSeries
} from '../../types/marvel';
import { MarvelApiClient } from '../../services/marvelApi';

export class QuestionGenerator {
  private api: MarvelApiClient;
  private questionTemplates: Map<QuestionType, QuestionTemplate[]>;
  private difficultyWeights: Record<DifficultyLevel, number>;
  private categoryFilters: Record<QuizCategory, (character: MarvelCharacter) => boolean>;

  constructor(apiClient: MarvelApiClient) {
    this.api = apiClient;
    this.initializeTemplates();
    this.initializeDifficultyWeights();
    this.initializeCategoryFilters();
  }

  private initializeDifficultyWeights() {
    this.difficultyWeights = {
      easy: 1,
      medium: 2,
      hard: 3,
      expert: 4
    };
  }

  private initializeCategoryFilters() {
    this.categoryFilters = {
      heroes: (char) => this.isHero(char),
      villains: (char) => this.isVillain(char),
      teams: (char) => this.isTeamMember(char),
      cosmic: (char) => this.isCosmicCharacter(char),
      street: (char) => this.isStreetLevelCharacter(char),
      mutants: (char) => this.isMutant(char),
      avengers: (char) => this.isAvenger(char),
      xmen: (char) => this.isXMen(char),
      spiderman: (char) => this.isSpiderVerse(char),
      fantastic4: (char) => this.isFantasticFour(char)
    };
  }

  private initializeTemplates() {
    this.questionTemplates = new Map();

    // Character identification questions
    this.questionTemplates.set('character', [
      {
        template: "Who is this character?",
        generateQuestion: this.generateCharacterIdentificationQuestion.bind(this),
        difficulty: 'easy',
        points: 100
      },
      {
        template: "Which character has the real name {realName}?",
        generateQuestion: this.generateRealNameQuestion.bind(this),
        difficulty: 'medium',
        points: 150
      },
      {
        template: "Who is known as '{alias}'?",
        generateQuestion: this.generateAliasQuestion.bind(this),
        difficulty: 'hard',
        points: 200
      }
    ]);

    // Power-related questions
    this.questionTemplates.set('power', [
      {
        template: "What is {characterName}'s primary superpower?",
        generateQuestion: this.generatePowerQuestion.bind(this),
        difficulty: 'medium',
        points: 150
      },
      {
        template: "Which character possesses the power of {power}?",
        generateQuestion: this.generatePowerOwnerQuestion.bind(this),
        difficulty: 'hard',
        points: 200
      }
    ]);

    // Creator questions
    this.questionTemplates.set('creator', [
      {
        template: "Who created the character {characterName}?",
        generateQuestion: this.generateCreatorQuestion.bind(this),
        difficulty: 'expert',
        points: 250
      }
    ]);

    // First appearance questions
    this.questionTemplates.set('appearance', [
      {
        template: "In which comic did {characterName} first appear?",
        generateQuestion: this.generateFirstAppearanceQuestion.bind(this),
        difficulty: 'expert',
        points: 300
      }
    ]);

    // Comic-related questions
    this.questionTemplates.set('comic', [
      {
        template: "Which comic series features {characterName} as the main character?",
        generateQuestion: this.generateComicSeriesQuestion.bind(this),
        difficulty: 'medium',
        points: 150
      }
    ]);

    // Team affiliation questions
    this.questionTemplates.set('team', [
      {
        template: "Which team is {characterName} most associated with?",
        generateQuestion: this.generateTeamQuestion.bind(this),
        difficulty: 'easy',
        points: 100
      }
    ]);

    // Origin story questions
    this.questionTemplates.set('origin', [
      {
        template: "How did {characterName} get their powers?",
        generateQuestion: this.generateOriginQuestion.bind(this),
        difficulty: 'medium',
        points: 175
      }
    ]);

    // Alias questions
    this.questionTemplates.set('alias', [
      {
        template: "What is {characterName}'s secret identity?",
        generateQuestion: this.generateSecretIdentityQuestion.bind(this),
        difficulty: 'easy',
        points: 100
      }
    ]);
  }

  async generateQuestions(config: QuizConfig): Promise<QuizQuestion[]> {
    const questions: QuizQuestion[] = [];
    const usedCharacters = new Set<number>();
    const questionTypes: QuestionType[] = ['character', 'power', 'team', 'origin', 'alias', 'comic'];
    
    // Add more complex question types for higher difficulties
    if (config.difficulty === 'hard' || config.difficulty === 'expert') {
      questionTypes.push('creator', 'appearance');
    }

    try {
      // Get characters for each category
      const allCharacters: MarvelCharacter[] = [];
      
      for (const category of config.categories) {
        const categoryCharacters = await this.getCharactersForCategory(category, 50);
        allCharacters.push(...categoryCharacters);
      }

      if (allCharacters.length === 0) {
        throw new Error('No characters found for selected categories');
      }

      // Remove duplicates
      const uniqueCharacters = allCharacters.filter((char, index, self) => 
        index === self.findIndex(c => c.id === char.id)
      );

      // Generate questions
      for (let i = 0; i < config.totalQuestions; i++) {
        const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        const templates = this.questionTemplates.get(questionType) || [];
        
        if (templates.length === 0) continue;

        // Filter templates by difficulty
        const suitableTemplates = templates.filter(template => 
          this.isDifficultyAppropriate(template.difficulty, config.difficulty)
        );

        if (suitableTemplates.length === 0) continue;

        const template = suitableTemplates[Math.floor(Math.random() * suitableTemplates.length)];
        
        // Find a character that hasn't been used yet
        const availableCharacters = uniqueCharacters.filter(char => !usedCharacters.has(char.id));
        
        if (availableCharacters.length === 0) {
          // Reset used characters if we've used them all
          usedCharacters.clear();
        }

        const character = availableCharacters[Math.floor(Math.random() * availableCharacters.length)] || 
                         uniqueCharacters[Math.floor(Math.random() * uniqueCharacters.length)];
        
        if (!character) continue;

        try {
          const question = await template.generateQuestion(character, config);
          if (question) {
            questions.push({
              ...question,
              id: `q_${i}_${Date.now()}`,
              difficulty: config.difficulty,
              timeLimit: config.timePerQuestion,
              category: this.determineQuestionCategory(character)
            });
            usedCharacters.add(character.id);
          }
        } catch (error) {
          console.warn(`Failed to generate question for character ${character.name}:`, error);
        }
      }

      // Shuffle questions
      return this.shuffleArray(questions);
      
    } catch (error) {
      console.error('Failed to generate questions:', error);
      return [];
    }
  }

  private async getCharactersForCategory(category: QuizCategory, limit: number): Promise<MarvelCharacter[]> {
    try {
      const characters = await this.api.getRandomCharacters(limit * 2); // Get more to filter
      const filter = this.categoryFilters[category];
      
      if (!filter) {
        return characters.slice(0, limit);
      }
      
      return characters.filter(filter).slice(0, limit);
    } catch (error) {
      console.error(`Failed to get characters for category ${category}:`, error);
      return [];
    }
  }

  private isDifficultyAppropriate(templateDifficulty: DifficultyLevel, configDifficulty: DifficultyLevel): boolean {
    const templateWeight = this.difficultyWeights[templateDifficulty];
    const configWeight = this.difficultyWeights[configDifficulty];
    
    // Allow questions up to one level above the selected difficulty
    return templateWeight <= configWeight + 1;
  }

  private determineQuestionCategory(character: MarvelCharacter): QuizCategory {
    if (this.isAvenger(character)) return 'avengers';
    if (this.isXMen(character)) return 'xmen';
    if (this.isSpiderVerse(character)) return 'spiderman';
    if (this.isFantasticFour(character)) return 'fantastic4';
    if (this.isCosmicCharacter(character)) return 'cosmic';
    if (this.isMutant(character)) return 'mutants';
    if (this.isVillain(character)) return 'villains';
    if (this.isTeamMember(character)) return 'teams';
    return 'heroes';
  }

  // Character classification methods
  private isHero(character: MarvelCharacter): boolean {
    const heroKeywords = ['hero', 'avenger', 'defender', 'guardian', 'protector', 'champion'];
    const villainKeywords = ['villain', 'enemy', 'criminal', 'evil', 'dark', 'destroyer'];
    
    const description = character.description.toLowerCase();
    const name = character.name.toLowerCase();
    
    const heroScore = heroKeywords.reduce((score, keyword) => 
      score + (description.includes(keyword) ? 1 : 0) + (name.includes(keyword) ? 1 : 0), 0
    );
    
    const villainScore = villainKeywords.reduce((score, keyword) => 
      score + (description.includes(keyword) ? 1 : 0) + (name.includes(keyword) ? 1 : 0), 0
    );
    
    return heroScore > villainScore;
  }

  private isVillain(character: MarvelCharacter): boolean {
    const villainKeywords = ['villain', 'enemy', 'criminal', 'evil', 'dark', 'destroyer', 'doom', 'death', 'shadow'];
    const description = character.description.toLowerCase();
    const name = character.name.toLowerCase();
    
    return villainKeywords.some(keyword => 
      description.includes(keyword) || name.includes(keyword)
    );
  }

  private isTeamMember(character: MarvelCharacter): boolean {
    const teamKeywords = ['team', 'group', 'squad', 'force', 'alliance', 'league', 'society'];
    const description = character.description.toLowerCase();
    
    return teamKeywords.some(keyword => description.includes(keyword)) || 
           character.series.available > 3; // Characters in multiple series are likely team members
  }

  private isCosmicCharacter(character: MarvelCharacter): boolean {
    const cosmicKeywords = ['cosmic', 'space', 'galaxy', 'universe', 'planet', 'alien', 'star', 'celestial'];
    const description = character.description.toLowerCase();
    const name = character.name.toLowerCase();
    
    return cosmicKeywords.some(keyword => 
      description.includes(keyword) || name.includes(keyword)
    );
  }

  private isStreetLevelCharacter(character: MarvelCharacter): boolean {
    const streetKeywords = ['street', 'city', 'crime', 'detective', 'police', 'neighborhood', 'urban'];
    const description = character.description.toLowerCase();
    
    return streetKeywords.some(keyword => description.includes(keyword));
  }

  private isMutant(character: MarvelCharacter): boolean {
    const mutantKeywords = ['mutant', 'x-men', 'xavier', 'gene', 'evolution', 'born with'];
    const description = character.description.toLowerCase();
    const name = character.name.toLowerCase();
    
    return mutantKeywords.some(keyword => 
      description.includes(keyword) || name.includes(keyword)
    );
  }

  private isAvenger(character: MarvelCharacter): boolean {
    const avengerKeywords = ['avenger', 'stark', 'shield', 'captain america', 'iron man', 'thor', 'hulk'];
    const description = character.description.toLowerCase();
    const name = character.name.toLowerCase();
    
    return avengerKeywords.some(keyword => 
      description.includes(keyword) || name.includes(keyword)
    );
  }

  private isXMen(character: MarvelCharacter): boolean {
    const xmenKeywords = ['x-men', 'xavier', 'mutant', 'school', 'professor x', 'cyclops', 'wolverine'];
    const description = character.description.toLowerCase();
    const name = character.name.toLowerCase();
    
    return xmenKeywords.some(keyword => 
      description.includes(keyword) || name.includes(keyword)
    );
  }

  private isSpiderVerse(character: MarvelCharacter): boolean {
    const spiderKeywords = ['spider', 'web', 'parker', 'spider-man', 'spider-woman', 'silk', 'venom'];
    const description = character.description.toLowerCase();
    const name = character.name.toLowerCase();
    
    return spiderKeywords.some(keyword => 
      description.includes(keyword) || name.includes(keyword)
    );
  }

  private isFantasticFour(character: MarvelCharacter): boolean {
    const f4Keywords = ['fantastic four', 'reed richards', 'sue storm', 'johnny storm', 'ben grimm', 'thing', 'invisible'];
    const description = character.description.toLowerCase();
    const name = character.name.toLowerCase();
    
    return f4Keywords.some(keyword => 
      description.includes(keyword) || name.includes(keyword)
    );
  }

  // Question generation methods
  private async generateCharacterIdentificationQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    try {
      // Get similar characters for wrong options
      const similarCharacters = await this.getSimilarCharacters(character, 3);
      
      if (similarCharacters.length < 3) {
        return null;
      }

      const options = this.shuffleArray([
        character.name,
        ...similarCharacters.map(c => c.name)
      ]);

      return {
        type: 'character',
        question: "Who is this character?",
        character,
        options,
        correctAnswer: character.name,
        explanation: `This is ${character.name}. ${character.description || 'A notable Marvel character.'}`,
        points: 100,
        imageUrl: this.api.getImageUrl(character.thumbnail, 'portrait_medium')
      };
    } catch (error) {
      console.error('Failed to generate character identification question:', error);
      return null;
    }
  }

  private async generateRealNameQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    // This would require additional character data that includes real names
    // For now, return null to skip this question type
    return null;
  }

  private async generateAliasQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    // This would require additional character data that includes aliases
    // For now, return null to skip this question type
    return null;
  }

  private async generatePowerQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    // Extract powers from description
    const powers = this.extractPowersFromDescription(character.description);
    
    if (powers.length === 0) {
      return null;
    }

    const correctPower = powers[0];
    const wrongPowers = ['Super strength', 'Flight', 'Telepathy', 'Invisibility', 'Time manipulation', 'Energy projection']
      .filter(p => p !== correctPower)
      .slice(0, 3);

    const options = this.shuffleArray([correctPower, ...wrongPowers]);

    return {
      type: 'power',
      question: `What is ${character.name}'s primary superpower?`,
      character,
      options,
      correctAnswer: correctPower,
      explanation: `${character.name} possesses ${correctPower}. ${character.description}`,
      points: 150
    };
  }

  private async generatePowerOwnerQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    const powers = this.extractPowersFromDescription(character.description);
    
    if (powers.length === 0) {
      return null;
    }

    const power = powers[0];
    const similarCharacters = await this.getSimilarCharacters(character, 3);
    
    if (similarCharacters.length < 3) {
      return null;
    }

    const options = this.shuffleArray([
      character.name,
      ...similarCharacters.map(c => c.name)
    ]);

    return {
      type: 'power',
      question: `Which character possesses the power of ${power}?`,
      character,
      options,
      correctAnswer: character.name,
      explanation: `${character.name} possesses ${power}. ${character.description}`,
      points: 200
    };
  }

  private async generateCreatorQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    // This would require creator information from the API
    // For now, return null to skip this question type
    return null;
  }

  private async generateFirstAppearanceQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    // This would require first appearance information from the API
    // For now, return null to skip this question type
    return null;
  }

  private async generateComicSeriesQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    try {
      if (character.series.available === 0) {
        return null;
      }

      // Get character's series
      const seriesResponse = await this.api.getSeries({ 
        limit: 4,
        titleStartsWith: character.name.split(' ')[0] // Use first name part
      });

      if (seriesResponse.data.results.length === 0) {
        return null;
      }

      const correctSeries = seriesResponse.data.results[0];
      const wrongSeries = seriesResponse.data.results.slice(1, 4);

      if (wrongSeries.length < 3) {
        // Add some generic series names
        wrongSeries.push(
          ...['Amazing Adventures', 'Marvel Team-Up', 'Secret Wars']
            .slice(0, 3 - wrongSeries.length)
            .map(title => ({ title } as any))
        );
      }

      const options = this.shuffleArray([
        correctSeries.title,
        ...wrongSeries.map(s => s.title)
      ]);

      return {
        type: 'comic',
        question: `Which comic series features ${character.name} as the main character?`,
        character,
        options,
        correctAnswer: correctSeries.title,
        explanation: `${character.name} appears in ${correctSeries.title}. ${correctSeries.description || ''}`,
        points: 150
      };
    } catch (error) {
      console.error('Failed to generate comic series question:', error);
      return null;
    }
  }

  private async generateTeamQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    const teams = this.extractTeamsFromDescription(character.description);
    
    if (teams.length === 0) {
      return null;
    }

    const correctTeam = teams[0];
    const wrongTeams = ['Avengers', 'X-Men', 'Fantastic Four', 'Defenders', 'Guardians of the Galaxy', 'Inhumans']
      .filter(t => t !== correctTeam)
      .slice(0, 3);

    const options = this.shuffleArray([correctTeam, ...wrongTeams]);

    return {
      type: 'team',
      question: `Which team is ${character.name} most associated with?`,
      character,
      options,
      correctAnswer: correctTeam,
      explanation: `${character.name} is associated with ${correctTeam}. ${character.description}`,
      points: 100
    };
  }

  private async generateOriginQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    const origins = this.extractOriginFromDescription(character.description);
    
    if (!origins) {
      return null;
    }

    const wrongOrigins = [
      'Bitten by a radioactive spider',
      'Exposed to gamma radiation',
      'Born with mutant abilities',
      'Trained by ancient masters',
      'Alien technology',
      'Scientific experiment gone wrong'
    ].filter(o => o !== origins).slice(0, 3);

    const options = this.shuffleArray([origins, ...wrongOrigins]);

    return {
      type: 'origin',
      question: `How did ${character.name} get their powers?`,
      character,
      options,
      correctAnswer: origins,
      explanation: `${character.name}'s origin: ${origins}. ${character.description}`,
      points: 175
    };
  }

  private async generateSecretIdentityQuestion(character: MarvelCharacter, config: QuizConfig): Promise<Partial<QuizQuestion> | null> {
    // This would require secret identity information
    // For now, return null to skip this question type
    return null;
  }

  // Helper methods
  private async getSimilarCharacters(character: MarvelCharacter, count: number): Promise<MarvelCharacter[]> {
    try {
      // Get random characters from the same category
      const category = this.determineQuestionCategory(character);
      const characters = await this.getCharactersForCategory(category, count * 2);
      
      return characters
        .filter(c => c.id !== character.id)
        .slice(0, count);
    } catch (error) {
      console.error('Failed to get similar characters:', error);
      return [];
    }
  }

  private extractPowersFromDescription(description: string): string[] {
    const powerKeywords = {
      'super strength': ['strength', 'strong', 'powerful'],
      'flight': ['fly', 'flight', 'soar'],
      'telepathy': ['telepathy', 'mind', 'psychic'],
      'invisibility': ['invisible', 'unseen'],
      'energy projection': ['energy', 'blast', 'beam'],
      'healing factor': ['heal', 'regenerat', 'recover'],
      'super speed': ['speed', 'fast', 'quick'],
      'shape-shifting': ['shape', 'transform', 'morph']
    };

    const powers: string[] = [];
    const lowerDesc = description.toLowerCase();

    for (const [power, keywords] of Object.entries(powerKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        powers.push(power);
      }
    }

    return powers;
  }

  private extractTeamsFromDescription(description: string): string[] {
    const teamKeywords = {
      'Avengers': ['avenger'],
      'X-Men': ['x-men', 'xavier'],
      'Fantastic Four': ['fantastic four', 'fantastic 4'],
      'Defenders': ['defender'],
      'Guardians of the Galaxy': ['guardian', 'galaxy'],
      'Inhumans': ['inhuman'],
      'S.H.I.E.L.D.': ['shield', 's.h.i.e.l.d']
    };

    const teams: string[] = [];
    const lowerDesc = description.toLowerCase();

    for (const [team, keywords] of Object.entries(teamKeywords)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        teams.push(team);
      }
    }

    return teams;
  }

  private extractOriginFromDescription(description: string): string | null {
    const originPatterns = {
      'Bitten by a radioactive spider': ['spider', 'bite', 'radioactive'],
      'Exposed to gamma radiation': ['gamma', 'radiation'],
      'Born with mutant abilities': ['mutant', 'born', 'gene'],
      'Alien technology': ['alien', 'technology', 'extraterrestrial'],
      'Scientific experiment': ['experiment', 'science', 'laboratory'],
      'Mystical powers': ['magic', 'mystical', 'supernatural']
    };

    const lowerDesc = description.toLowerCase();

    for (const [origin, keywords] of Object.entries(originPatterns)) {
      if (keywords.some(keyword => lowerDesc.includes(keyword))) {
        return origin;
      }
    }

    return null;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

interface QuestionTemplate {
  template: string;
  generateQuestion: (character: MarvelCharacter, config: QuizConfig) => Promise<Partial<QuizQuestion> | null>;
  difficulty: DifficultyLevel;
  points: number;
}

export default QuestionGenerator;