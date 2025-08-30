import { MarvelCharacter, MarvelComic, MarvelSeries, QuizQuestion } from '../../types/marvel';
import { marvelApi } from '../../services/marvelApi';

interface QuizFilters {
  categories?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
}

export class QuestionGenerator {
  private apiClient: typeof marvelApi;
  private characterCache: Map<string, MarvelCharacter[]> = new Map();
  private comicCache: Map<string, MarvelComic[]> = new Map();
  private seriesCache: Map<string, MarvelSeries[]> = new Map();
  private characters: MarvelCharacter[] = [];
  private comics: MarvelComic[] = [];
  private series: MarvelSeries[] = [];
  private questionTemplates: QuestionTemplate[] = [];
  private difficultyWeights = { easy: 0.4, medium: 0.4, hard: 0.2 };

  constructor(apiClient: typeof marvelApi) {
    this.apiClient = apiClient;
  }

  async initialize(): Promise<void> {
    try {
      // Load initial data from Marvel API
      const [charactersResponse, comicsResponse] = await Promise.all([
        this.apiClient.getCharacters({ limit: 100, offset: 0 }),
        this.apiClient.getComics({ limit: 50, offset: 0 })
      ]);

      this.characters = charactersResponse.data.results;
      this.comics = comicsResponse.data.results;
      this.series = []; // Initialize empty series array
    } catch (error) {
      console.error('Failed to initialize question generator:', error);
      throw error;
    }
  }

  async generateQuestions(count: number, filters?: QuizFilters): Promise<QuizQuestion[]> {
    if (this.characters.length === 0) {
      await this.initialize();
    }

    const questions: QuizQuestion[] = [];
    const usedCharacters = new Set<number>();
    const usedComics = new Set<number>();

    for (let i = 0; i < count; i++) {
      const difficulty = this.selectDifficulty();
      const category = filters?.categories?.length 
        ? filters.categories[Math.floor(Math.random() * filters.categories.length)]
        : this.selectRandomCategory();

      let question: QuizQuestion | null = null;
      let attempts = 0;
      const maxAttempts = 10;

      while (!question && attempts < maxAttempts) {
        try {
          question = await this.generateQuestionByCategory(
            category, 
            difficulty, 
            usedCharacters, 
            usedComics
          );
          attempts++;
        } catch (error) {
          console.warn(`Failed to generate question (attempt ${attempts}):`, error);
          attempts++;
        }
      }

      if (question) {
        questions.push(question);
        // Track used resources to avoid duplicates
        if (question.character) usedCharacters.add(question.character.id);
        if (question.comic) usedComics.add(question.comic.id);
      }
    }

    return questions;
  }

  private initializeTemplates(): void {
    this.questionTemplates = [
      {
        id: 'character-identification',
        category: 'characters',
        difficulty: 'easy',
        template: 'Who is this character?',
        generator: this.generateCharacterIdentificationQuestion.bind(this)
      },
      {
        id: 'character-power',
        category: 'characters', 
        difficulty: 'medium',
        template: 'What is {character}\'s primary power?',
        generator: this.generateCharacterPowerQuestion.bind(this)
      },
      {
        id: 'character-origin',
        category: 'characters',
        difficulty: 'hard',
        template: 'What is {character}\'s origin story?',
        generator: this.generateCharacterOriginQuestion.bind(this)
      },
      {
        id: 'comic-character',
        category: 'comics',
        difficulty: 'medium',
        template: 'Which character appears in "{comic}"?',
        generator: this.generateComicCharacterQuestion.bind(this)
      },
      {
        id: 'team-member',
        category: 'teams',
        difficulty: 'medium',
        template: 'Which of these characters is a member of {team}?',
        generator: this.generateTeamMemberQuestion.bind(this)
      }
    ];
  }

  private selectDifficulty(): 'easy' | 'medium' | 'hard' {
    const rand = Math.random();
    if (rand < this.difficultyWeights.easy) return 'easy';
    if (rand < this.difficultyWeights.easy + this.difficultyWeights.medium) return 'medium';
    return 'hard';
  }

  private selectRandomCategory(): string {
    const categories = ['characters', 'comics', 'teams', 'powers', 'origins'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private async generateQuestionByCategory(
    category: string,
    difficulty: 'easy' | 'medium' | 'hard',
    usedCharacters: Set<number>,
    usedComics: Set<number>
  ): Promise<QuizQuestion | null> {
    const availableTemplates = this.questionTemplates.filter(
      t => t.category === category && t.difficulty === difficulty
    );

    if (availableTemplates.length === 0) {
      // Fallback to any template of the right difficulty
      const fallbackTemplates = this.questionTemplates.filter(t => t.difficulty === difficulty);
      if (fallbackTemplates.length === 0) return null;
      
      const template = fallbackTemplates[Math.floor(Math.random() * fallbackTemplates.length)];
      return await template.generator(usedCharacters, usedComics);
    }

    const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    return await template.generator(usedCharacters, usedComics);
  }

  private async generateCharacterIdentificationQuestion(
    usedCharacters: Set<number>,
    usedComics: Set<number>
  ): Promise<QuizQuestion | null> {
    const availableCharacters = this.characters.filter(c => 
      !usedCharacters.has(c.id) && 
      c.thumbnail && 
      !c.thumbnail.path.includes('image_not_available')
    );

    if (availableCharacters.length < 4) return null;

    const correctCharacter = availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    const wrongCharacters = availableCharacters
      .filter(c => c.id !== correctCharacter.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctCharacter, ...wrongCharacters]
      .sort(() => 0.5 - Math.random())
      .map(char => char.name);

    return {
      id: `char-id-${correctCharacter.id}`,
      type: 'multiple-choice',
      category: 'characters',
      difficulty: 'easy',
      question: 'Who is this character?',
      options,
      correctAnswer: correctCharacter.name,
      explanation: `This is ${correctCharacter.name}. ${correctCharacter.description || 'A Marvel character.'}`,
      imageUrl: this.apiClient.getImageUrl(correctCharacter.thumbnail, 'standard_large'),
      character: correctCharacter,
      points: 10,
      timeLimit: 15
    };
  }

  private async generateCharacterPowerQuestion(
    usedCharacters: Set<number>,
    usedComics: Set<number>
  ): Promise<QuizQuestion | null> {
    const powerfulCharacters = this.characters.filter(c => 
      !usedCharacters.has(c.id) && 
      c.description && 
      c.description.length > 50
    );

    if (powerfulCharacters.length === 0) return null;

    const character = powerfulCharacters[Math.floor(Math.random() * powerfulCharacters.length)];
    const powers = this.extractPowersFromDescription(character.description || '');
    
    if (powers.length === 0) {
      // Fallback to known character powers
      const knownPowers = this.getKnownCharacterPowers(character.name);
      if (knownPowers.length === 0) return null;
      powers.push(...knownPowers);
    }

    const correctPower = powers[0];
    const wrongPowers = this.generateWrongPowers(correctPower);
    const options = [correctPower, ...wrongPowers].sort(() => 0.5 - Math.random());

    return {
      id: `char-power-${character.id}`,
      type: 'multiple-choice',
      category: 'characters',
      difficulty: 'medium',
      question: `What is ${character.name}'s primary power or ability?`,
      options,
      correctAnswer: correctPower,
      explanation: `${character.name} is known for ${correctPower.toLowerCase()}.`,
      character: character,
      points: 15,
      timeLimit: 20
    };
  }

  private async generateCharacterOriginQuestion(
    usedCharacters: Set<number>,
    usedComics: Set<number>
  ): Promise<QuizQuestion | null> {
    const charactersWithOrigins = this.characters.filter(c => 
      !usedCharacters.has(c.id) && 
      this.hasKnownOrigin(c.name)
    );

    if (charactersWithOrigins.length === 0) return null;

    const character = charactersWithOrigins[Math.floor(Math.random() * charactersWithOrigins.length)];
    const origin = this.getCharacterOrigin(character.name);
    const wrongOrigins = this.generateWrongOrigins(origin);
    const options = [origin, ...wrongOrigins].sort(() => 0.5 - Math.random());

    return {
      id: `char-origin-${character.id}`,
      type: 'multiple-choice',
      category: 'characters',
      difficulty: 'hard',
      question: `What is ${character.name}'s origin?`,
      options,
      correctAnswer: origin,
      explanation: `${character.name} ${this.getOriginExplanation(character.name)}.`,
      character: character,
      points: 25,
      timeLimit: 30
    };
  }

  private async generateComicCharacterQuestion(
    usedCharacters: Set<number>,
    usedComics: Set<number>
  ): Promise<QuizQuestion | null> {
    const availableComics = this.comics.filter(c => 
      !usedComics.has(c.id) && 
      c.characters && 
      c.characters.available > 0
    );

    if (availableComics.length === 0) return null;

    const comic = availableComics[Math.floor(Math.random() * availableComics.length)];
    
    // For this demo, we'll use character names that commonly appear in comics
    const commonCharacters = ['Spider-Man', 'Iron Man', 'Captain America', 'Thor', 'Hulk', 'Black Widow'];
    const correctCharacter = commonCharacters[Math.floor(Math.random() * commonCharacters.length)];
    const wrongCharacters = commonCharacters
      .filter(name => name !== correctCharacter)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctCharacter, ...wrongCharacters].sort(() => 0.5 - Math.random());

    return {
      id: `comic-char-${comic.id}`,
      type: 'multiple-choice',
      category: 'comics',
      difficulty: 'medium',
      question: `Which character commonly appears in "${comic.title}"?`,
      options,
      correctAnswer: correctCharacter,
      explanation: `${correctCharacter} is a main character in ${comic.title}.`,
      comic: comic,
      points: 15,
      timeLimit: 20
    };
  }

  private async generateTeamMemberQuestion(
    usedCharacters: Set<number>,
    usedComics: Set<number>
  ): Promise<QuizQuestion | null> {
    const teams = {
      'Avengers': ['Iron Man', 'Captain America', 'Thor', 'Hulk', 'Black Widow', 'Hawkeye'],
      'X-Men': ['Wolverine', 'Cyclops', 'Storm', 'Jean Grey', 'Professor X', 'Beast'],
      'Fantastic Four': ['Mr. Fantastic', 'Invisible Woman', 'Human Torch', 'Thing'],
      'Guardians of the Galaxy': ['Star-Lord', 'Gamora', 'Drax', 'Rocket', 'Groot']
    };

    const teamNames = Object.keys(teams);
    const selectedTeam = teamNames[Math.floor(Math.random() * teamNames.length)];
    const teamMembers = teams[selectedTeam as keyof typeof teams];
    
    const correctMember = teamMembers[Math.floor(Math.random() * teamMembers.length)];
    
    // Get wrong answers from other teams
    const otherMembers = Object.values(teams)
      .flat()
      .filter(member => !teamMembers.includes(member))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    const options = [correctMember, ...otherMembers].sort(() => 0.5 - Math.random());

    return {
      id: `team-${selectedTeam.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      type: 'multiple-choice',
      category: 'teams',
      difficulty: 'medium',
      question: `Which of these characters is a member of the ${selectedTeam}?`,
      options,
      correctAnswer: correctMember,
      explanation: `${correctMember} is a core member of the ${selectedTeam}.`,
      points: 15,
      timeLimit: 20
    };
  }

  // Helper methods
  private extractPowersFromDescription(description: string): string[] {
    const powerKeywords = [
      'super strength', 'flight', 'telepathy', 'telekinesis', 'invisibility',
      'super speed', 'healing factor', 'energy projection', 'shape-shifting',
      'time manipulation', 'reality warping', 'cosmic awareness'
    ];

    return powerKeywords.filter(power => 
      description.toLowerCase().includes(power.toLowerCase())
    );
  }

  private getKnownCharacterPowers(characterName: string): string[] {
    const knownPowers: { [key: string]: string[] } = {
      'Spider-Man': ['Web-slinging', 'Wall-crawling', 'Spider-sense', 'Super strength'],
      'Iron Man': ['Powered armor', 'Flight', 'Repulsors', 'Genius intellect'],
      'Thor': ['Mjolnir', 'Lightning control', 'Super strength', 'Flight'],
      'Hulk': ['Super strength', 'Regeneration', 'Invulnerability', 'Rage empowerment'],
      'Captain America': ['Super soldier serum', 'Vibranium shield', 'Enhanced reflexes', 'Leadership'],
      'Wolverine': ['Adamantium claws', 'Healing factor', 'Enhanced senses', 'Berserker rage']
    };

    return knownPowers[characterName] || [];
  }

  private generateWrongPowers(correctPower: string): string[] {
    const allPowers = [
      'Super strength', 'Flight', 'Telepathy', 'Telekinesis', 'Invisibility',
      'Super speed', 'Healing factor', 'Energy projection', 'Shape-shifting',
      'Time manipulation', 'Reality warping', 'Cosmic awareness', 'Web-slinging',
      'Lightning control', 'Adamantium claws', 'Vibranium shield'
    ];

    return allPowers
      .filter(power => power !== correctPower)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }

  private hasKnownOrigin(characterName: string): boolean {
    const knownOrigins = [
      'Spider-Man', 'Iron Man', 'Thor', 'Hulk', 'Captain America',
      'Wolverine', 'Deadpool', 'Daredevil', 'Doctor Strange'
    ];
    return knownOrigins.includes(characterName);
  }

  private getCharacterOrigin(characterName: string): string {
    const origins: { [key: string]: string } = {
      'Spider-Man': 'Bitten by radioactive spider',
      'Iron Man': 'Built powered armor to escape captivity',
      'Thor': 'Asgardian god of thunder',
      'Hulk': 'Gamma radiation exposure',
      'Captain America': 'Super soldier serum experiment',
      'Wolverine': 'Weapon X program',
      'Deadpool': 'Weapon X program gone wrong',
      'Daredevil': 'Blinded by radioactive chemicals',
      'Doctor Strange': 'Learned mystic arts after car accident'
    };

    return origins[characterName] || 'Unknown origin';
  }

  private generateWrongOrigins(correctOrigin: string): string[] {
    const allOrigins = [
      'Bitten by radioactive spider',
      'Built powered armor to escape captivity',
      'Asgardian god of thunder',
      'Gamma radiation exposure',
      'Super soldier serum experiment',
      'Weapon X program',
      'Blinded by radioactive chemicals',
      'Learned mystic arts after car accident',
      'Born with mutant abilities',
      'Cosmic radiation exposure',
      'Ancient mystical artifact',
      'Alien technology implant'
    ];

    return allOrigins
      .filter(origin => origin !== correctOrigin)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }

  private getOriginExplanation(characterName: string): string {
    const explanations: { [key: string]: string } = {
      'Spider-Man': 'gained his powers after being bitten by a radioactive spider',
      'Iron Man': 'created his first suit while imprisoned and continued to improve it',
      'Thor': 'is the Asgardian god of thunder, wielding the mystical hammer Mjolnir',
      'Hulk': 'was transformed by gamma radiation during a bomb test',
      'Captain America': 'was enhanced by the super soldier serum during WWII'
    };

    return explanations[characterName] || 'has a unique origin story in the Marvel universe';
  }
}

interface QuestionTemplate {
  id: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  template: string;
  generator: (usedCharacters: Set<number>, usedComics: Set<number>) => Promise<QuizQuestion | null>;
}

export default QuestionGenerator;