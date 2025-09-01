import { marvelApi } from './marvelApi';
import { shuffleArray, getRandomItem } from '../lib/utils';

interface Character {
  id: number;
  name: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  comics: {
    available: number;
  };
  series: {
    available: number;
  };
  stories: {
    available: number;
  };
}

interface Comic {
  id: number;
  title: string;
  description: string;
  thumbnail: {
    path: string;
    extension: string;
  };
  creators: {
    items: Array<{
      name: string;
      role: string;
    }>;
  };
  characters: {
    items: Array<{
      name: string;
    }>;
  };
}



export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'characters' | 'comics' | 'movies' | 'general' | 'powers' | 'teams';
  timeLimit: number;
  explanation?: string;
  imageUrl?: string;
}

class QuestionGenerator {
  private characters: Character[] = [];
  private comics: Comic[] = [];
  private isInitialized = false;

  // Predefined question templates for different categories
  private questionTemplates = {
    characters: [
      {
        template: "What is {character}'s real name?",
        difficulty: 'easy',
        correctAnswer: 0,
        generateOptions: (character: Character, _allCharacters: Character[]) => {
          const realNames = this.getCharacterRealNames();
          const correctName = realNames[character.name] || 'Unknown';
          const wrongNames = Object.values(realNames)
            .filter(name => name !== correctName)
            .slice(0, 3);
          return shuffleArray([correctName, ...wrongNames]);
        }
      },
      {
        template: "Which character has the power of {power}?",
        difficulty: 'medium',
        correctAnswer: 0,
        generateOptions: (character: Character, allCharacters: Character[]) => {
          const powers = this.getCharacterPowers();
          const characterPower = powers[character.name];
          if (!characterPower) return null;
          
          const otherCharacters = allCharacters
            .filter(c => c.name !== character.name)
            .slice(0, 3)
            .map(c => c.name);
          
          return shuffleArray([character.name, ...otherCharacters]);
        }
      },
      {
        template: "In how many comics has {character} appeared?",
        difficulty: 'hard',
        correctAnswer: 0,
        generateOptions: (character: Character) => {
          const correct = character.comics.available;
          const options = [
            correct,
            Math.max(0, correct - Math.floor(Math.random() * 50)),
            correct + Math.floor(Math.random() * 100),
            Math.max(0, correct - Math.floor(Math.random() * 100))
          ];
          return shuffleArray(options.map(String));
        }
      }
    ],
    comics: [
      {
        template: "Who created the comic series '{comic}'?",
        difficulty: 'medium',
        correctAnswer: 0,
        generateOptions: (comic: Comic) => {
          const creators = comic.creators.items
            .filter(creator => creator.role.includes('writer') || creator.role.includes('artist'))
            .map(creator => creator.name);
          
          if (creators.length === 0) return null;
          
          const correct = creators[0];
          const famousCreators = [
            'Stan Lee', 'Jack Kirby', 'Steve Ditko', 'John Byrne',
            'Chris Claremont', 'Frank Miller', 'Alan Moore', 'Grant Morrison'
          ].filter(name => name !== correct);
          
          const wrongOptions = shuffleArray(famousCreators).slice(0, 3);
          return shuffleArray([correct, ...wrongOptions]);
        }
      },
      {
        template: "Which character appears in '{comic}'?",
        difficulty: 'easy',
        correctAnswer: 0,
        generateOptions: (comic: Comic, allCharacters: Character[]) => {
          const comicCharacters = comic.characters.items.map(char => char.name);
          if (comicCharacters.length === 0) return null;
          
          const correct = comicCharacters[0];
          const otherCharacters = allCharacters
            .filter(char => !comicCharacters.includes(char.name))
            .slice(0, 3)
            .map(char => char.name);
          
          return shuffleArray([correct, ...otherCharacters]);
        }
      }
    ],
    movies: [
      {
        template: "In which year was '{movie}' released?",
        difficulty: 'medium',
        correctAnswer: 0,
        generateOptions: (movieData: any) => {
          const correct = movieData.year;
          const options = [
            correct,
            correct - 1,
            correct + 1,
            correct - 2
          ];
          return shuffleArray(options.map(String));
        }
      }
    ],
    general: [
      {
        template: "What does S.H.I.E.L.D. stand for?",
        difficulty: 'medium',
        staticOptions: [
          "Strategic Homeland Intervention, Enforcement and Logistics Division",
          "Strategic Hazard Intelligence Emergency Leadership Division",
          "Special Headquarters Intelligence and Emergency Law Division",
          "Strategic Heroes Intelligence and Emergency Logistics Division"
        ],
        correctAnswer: 0
      },
      {
        template: "What is the name of Thor's hammer?",
        difficulty: 'easy',
        staticOptions: ["Mjolnir", "Stormbreaker", "Gungnir", "Gram"],
        correctAnswer: 0
      },
      {
        template: "Which Infinity Stone is red?",
        difficulty: 'medium',
        staticOptions: ["Reality Stone", "Power Stone", "Soul Stone", "Mind Stone"],
        correctAnswer: 0
      },
      {
        template: "What is Spider-Man's real name?",
        difficulty: 'easy',
        staticOptions: ["Peter Parker", "Miles Morales", "Ben Reilly", "Kaine Parker"],
        correctAnswer: 0
      },
      {
        template: "Who is the leader of the X-Men?",
        difficulty: 'easy',
        staticOptions: ["Professor X", "Cyclops", "Wolverine", "Storm"],
        correctAnswer: 0
      },
      {
        template: "What is the name of Tony Stark's AI assistant?",
        difficulty: 'easy',
        staticOptions: ["JARVIS", "FRIDAY", "KAREN", "EDITH"],
        correctAnswer: 0
      },
      {
        template: "Which planet is Thanos from?",
        difficulty: 'medium',
        staticOptions: ["Titan", "Asgard", "Xandar", "Sakaar"],
        correctAnswer: 0
      },
      {
        template: "What is the name of the Wakandan metal?",
        difficulty: 'easy',
        staticOptions: ["Vibranium", "Adamantium", "Uru", "Carbonadium"],
        correctAnswer: 0
      }
    ],
    powers: [
      {
        template: "Which character has the power of telepathy?",
        difficulty: 'medium',
        staticOptions: ["Professor X", "Cyclops", "Wolverine", "Beast"],
        correctAnswer: 0
      },
      {
        template: "What is Wolverine's primary mutant ability?",
        difficulty: 'easy',
        staticOptions: ["Healing Factor", "Super Strength", "Telepathy", "Energy Blasts"],
        correctAnswer: 0
      },
      {
        template: "Which character can control magnetism?",
        difficulty: 'easy',
        staticOptions: ["Magneto", "Storm", "Iceman", "Nightcrawler"],
        correctAnswer: 0
      }
    ],
    teams: [
      {
        template: "Which team is known as 'Earth's Mightiest Heroes'?",
        difficulty: 'easy',
        staticOptions: ["Avengers", "X-Men", "Fantastic Four", "Guardians of the Galaxy"],
        correctAnswer: 0
      },
      {
        template: "Who founded the X-Men?",
        difficulty: 'medium',
        staticOptions: ["Professor X", "Magneto", "Wolverine", "Cyclops"],
        correctAnswer: 0
      },
      {
        template: "Which team protects the galaxy?",
        difficulty: 'easy',
        staticOptions: ["Guardians of the Galaxy", "Avengers", "X-Men", "Fantastic Four"],
        correctAnswer: 0
      }
    ]
  };

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Fetch data from Marvel API
      const [charactersResponse, comicsResponse] = await Promise.all([
        marvelApi.fetchCharacters({ limit: 100 }),
        marvelApi.getComics({ limit: 50 })
      ]);

      this.characters = charactersResponse;
      this.comics = comicsResponse;
      this.isInitialized = true;
    } catch (error) {
      console.warn('Failed to fetch Marvel API data, using fallback questions:', error);
      this.isInitialized = true; // Still mark as initialized to use static questions
    }
  }

  async generateQuestion(
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    category?: 'characters' | 'comics' | 'movies' | 'general' | 'powers' | 'teams'
  ): Promise<Question> {
    await this.initialize();

    // If no category specified, choose randomly
    if (!category) {
      const categories: Array<'characters' | 'comics' | 'movies' | 'general' | 'powers' | 'teams'> = ['characters', 'comics', 'general', 'powers', 'teams'];
      category = getRandomItem(categories);
    }

    // Try to generate from API data first, fallback to static questions
    if (category === 'characters' && this.characters.length > 0) {
      return this.generateCharacterQuestion(difficulty);
    } else if (category === 'comics' && this.comics.length > 0) {
      return this.generateComicQuestion(difficulty);
    } else {
      return this.generateStaticQuestion(difficulty, category);
    }
  }

  async generateQuestions(
    count: number,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    category?: 'characters' | 'comics' | 'movies' | 'general' | 'powers' | 'teams'
  ): Promise<Question[]> {
    const questions: Question[] = [];
    const usedQuestions = new Set<string>();

    for (let i = 0; i < count; i++) {
      let attempts = 0;
      let question: Question;

      do {
        question = await this.generateQuestion(difficulty, category);
        attempts++;
      } while (usedQuestions.has(question.question) && attempts < 10);

      usedQuestions.add(question.question);
      questions.push(question);
    }

    return questions;
  }

  private generateCharacterQuestion(difficulty: 'easy' | 'medium' | 'hard'): Question {
    const templates = this.questionTemplates.characters.filter(t => t.difficulty === difficulty);
    const template = getRandomItem(templates);
    const character = getRandomItem(this.characters);

    const options = template.generateOptions(character, this.characters);
    if (!options) {
      // Fallback to static question if generation fails
      return this.generateStaticQuestion(difficulty, 'general');
    }

    const correctAnswer = template.correctAnswer || 0;
    const question = template.template.replace('{character}', character.name);

    return {
      id: `char_${Date.now()}_${Math.random()}`,
      question,
      options,
      correctAnswer,
      difficulty,
      category: 'characters',
      timeLimit: this.getTimeLimit(difficulty),
      imageUrl: `${character.thumbnail.path}.${character.thumbnail.extension}`
    };
  }

  private generateComicQuestion(difficulty: 'easy' | 'medium' | 'hard'): Question {
    const templates = this.questionTemplates.comics.filter(t => t.difficulty === difficulty);
    const template = getRandomItem(templates);
    const comic = getRandomItem(this.comics);

    const options = template.generateOptions(comic, this.characters);
    if (!options) {
      return this.generateStaticQuestion(difficulty, 'general');
    }

    const correctAnswer = template.correctAnswer || 0;
    const question = template.template.replace('{comic}', comic.title);

    return {
      id: `comic_${Date.now()}_${Math.random()}`,
      question,
      options,
      correctAnswer,
      difficulty,
      category: 'comics',
      timeLimit: this.getTimeLimit(difficulty),
      imageUrl: `${comic.thumbnail.path}.${comic.thumbnail.extension}`
    };
  }

  private generateStaticQuestion(
    difficulty: 'easy' | 'medium' | 'hard',
    category: 'characters' | 'comics' | 'movies' | 'general' | 'powers' | 'teams'
  ): Question {
    // Use general static questions as fallback
    const staticQuestions = [
      {
        question: "Who is the alter ego of Spider-Man?",
        options: ["Peter Parker", "Tony Stark", "Steve Rogers", "Bruce Banner"],
        correctAnswer: 0,
        category: 'characters' as const
      },
      {
        question: "What is the name of Thor's hammer?",
        options: ["Mjolnir", "Stormbreaker", "Gungnir", "Gram"],
        correctAnswer: 0,
        category: 'general' as const
      },
      {
        question: "Which Infinity Stone is red?",
        options: ["Reality Stone", "Power Stone", "Time Stone", "Space Stone"],
        correctAnswer: 0,
        category: 'general' as const
      }
    ];

    const question = getRandomItem(staticQuestions);

    return {
      id: `static_${Date.now()}_${Math.random()}`,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      difficulty,
      category,
      timeLimit: this.getTimeLimit(difficulty)
    };
  }

  private getTimeLimit(difficulty: 'easy' | 'medium' | 'hard'): number {
    switch (difficulty) {
      case 'easy': return 15;
      case 'medium': return 20;
      case 'hard': return 25;
      default: return 20;
    }
  }

  private getCharacterRealNames(): Record<string, string> {
    return {
      'Spider-Man': 'Peter Parker',
      'Iron Man': 'Tony Stark',
      'Captain America': 'Steve Rogers',
      'Thor': 'Thor Odinson',
      'Hulk': 'Bruce Banner',
      'Black Widow': 'Natasha Romanoff',
      'Hawkeye': 'Clint Barton',
      'Wolverine': 'James Howlett',
      'Cyclops': 'Scott Summers',
      'Storm': 'Ororo Munroe',
      'Professor X': 'Charles Xavier',
      'Magneto': 'Erik Lehnsherr',
      'Deadpool': 'Wade Wilson',
      'Daredevil': 'Matt Murdock',
      'Punisher': 'Frank Castle',
      'Ghost Rider': 'Johnny Blaze',
      'Doctor Strange': 'Stephen Strange',
      'Ant-Man': 'Scott Lang',
      'Wasp': 'Janet van Dyne',
      'Captain Marvel': 'Carol Danvers',
      'Black Panther': 'T\'Challa',
      'Falcon': 'Sam Wilson',
      'Winter Soldier': 'Bucky Barnes',
      'Scarlet Witch': 'Wanda Maximoff',
      'Quicksilver': 'Pietro Maximoff',
      'Vision': 'Vision',
      'War Machine': 'James Rhodes'
    };
  }

  private getCharacterPowers(): Record<string, string> {
    return {
      'Spider-Man': 'wall-crawling and spider-sense',
      'Iron Man': 'powered armor suit',
      'Captain America': 'super soldier serum enhancement',
      'Thor': 'godly strength and lightning control',
      'Hulk': 'gamma radiation transformation',
      'Wolverine': 'healing factor and adamantium claws',
      'Cyclops': 'optic energy blasts',
      'Storm': 'weather manipulation',
      'Professor X': 'telepathy',
      'Magneto': 'magnetism control',
      'Deadpool': 'accelerated healing',
      'Daredevil': 'enhanced senses',
      'Doctor Strange': 'mystic arts',
      'Ant-Man': 'size manipulation',
      'Captain Marvel': 'cosmic energy absorption',
      'Scarlet Witch': 'chaos magic',
      'Quicksilver': 'super speed',
      'Vision': 'density manipulation'
    };
  }

  // Generate questions for specific game modes
  async generateStoryModeQuestions(chapter: number): Promise<Question[]> {
    const difficulty = chapter <= 3 ? 'easy' : chapter <= 6 ? 'medium' : 'hard';
    const questionsPerChapter = 10;
    
    return this.generateQuestions(questionsPerChapter, difficulty);
  }

  async generateBlitzModeQuestion(level: number): Promise<Question> {
    const difficulty = level <= 5 ? 'easy' : level <= 15 ? 'medium' : 'hard';
    return this.generateQuestion(difficulty);
  }

  async generateSurvivalModeQuestion(level: number): Promise<Question> {
    // Survival mode gets progressively harder
    const difficulty = level <= 3 ? 'easy' : level <= 8 ? 'medium' : 'hard';
    return this.generateQuestion(difficulty);
  }

  async generateMultiplayerQuestion(round: number): Promise<Question> {
    // Multiplayer uses mixed difficulties
    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    const difficulty = difficulties[round % 3];
    return this.generateQuestion(difficulty);
  }
}

export const questionGenerator = new QuestionGenerator();
export default questionGenerator;