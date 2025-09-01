import { MarvelCharacterDetailed } from './characters';

export type QuestionType = 
  | 'multiple-choice'
  | 'character-relationship'
  | 'power-matching'
  | 'timeline'
  | 'visual-identification'
  | 'comic-cover'
  | 'team-affiliation'
  | 'true-false'
  | 'fill-in-blank';

export interface EnhancedQuizQuestion {
  id: string;
  type: QuestionType;
  category: 'characters' | 'powers' | 'teams' | 'history' | 'comics' | 'relationships' | 'origins';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  imageUrl?: string;
  characterId?: number;
  relatedCharacters?: number[];
  timeLimit?: number; // in seconds
  points: number;
  hints?: string[];
  tags: string[];
}

export const enhancedQuestions: EnhancedQuizQuestion[] = [
  // Character Relationship Questions
  {
    id: 'rel_001',
    type: 'character-relationship',
    category: 'relationships',
    difficulty: 'easy',
    question: 'Who is Spider-Man\'s uncle who taught him that "with great power comes great responsibility"?',
    options: ['Uncle Ben', 'Uncle Sam', 'Uncle Bob', 'Uncle Joe'],
    correctAnswer: 'Uncle Ben',
    explanation: 'Uncle Ben Parker was Peter Parker\'s father figure who instilled in him the moral foundation that guides Spider-Man.',
    characterId: 1,
    timeLimit: 15,
    points: 10,
    hints: ['He was killed by a burglar', 'His death motivated Peter to become Spider-Man'],
    tags: ['spider-man', 'family', 'origin']
  },
  {
    id: 'rel_002',
    type: 'character-relationship',
    category: 'relationships',
    difficulty: 'medium',
    question: 'Which character is Thor\'s adoptive brother and frequent adversary?',
    options: ['Balder', 'Loki', 'Heimdall', 'Tyr'],
    correctAnswer: 'Loki',
    explanation: 'Loki is the God of Mischief and Thor\'s adoptive brother, often serving as his greatest enemy.',
    characterId: 4,
    relatedCharacters: [4],
    timeLimit: 20,
    points: 15,
    hints: ['Known as the God of Mischief', 'Often tries to rule Asgard'],
    tags: ['thor', 'loki', 'asgard', 'family']
  },
  
  // Power Matching Questions
  {
    id: 'pow_001',
    type: 'power-matching',
    category: 'powers',
    difficulty: 'easy',
    question: 'Which power does NOT belong to Spider-Man?',
    options: ['Wall-crawling', 'Spider-sense', 'Weather control', 'Web-shooting'],
    correctAnswer: 'Weather control',
    explanation: 'Weather control is Thor\'s power, not Spider-Man\'s. Spider-Man has spider-based abilities.',
    characterId: 1,
    timeLimit: 15,
    points: 10,
    hints: ['Think about spider abilities', 'This power belongs to a god'],
    tags: ['spider-man', 'powers', 'abilities']
  },
  {
    id: 'pow_002',
    type: 'power-matching',
    category: 'powers',
    difficulty: 'medium',
    question: 'What is the source of Hulk\'s incredible strength?',
    options: ['Gamma radiation', 'Super soldier serum', 'Asgardian heritage', 'Alien technology'],
    correctAnswer: 'Gamma radiation',
    explanation: 'Bruce Banner was exposed to gamma radiation during a bomb test, which gave him the ability to transform into the Hulk.',
    characterId: 5,
    timeLimit: 20,
    points: 15,
    hints: ['It was an accident during a scientific experiment', 'This type of radiation is dangerous'],
    tags: ['hulk', 'origin', 'science']
  },
  
  // Timeline Questions
  {
    id: 'time_001',
    type: 'timeline',
    category: 'history',
    difficulty: 'medium',
    question: 'Which Marvel character appeared first in comics?',
    options: ['Spider-Man (1962)', 'Iron Man (1963)', 'Captain America (1941)', 'Thor (1962)'],
    correctAnswer: 'Captain America (1941)',
    explanation: 'Captain America first appeared in 1941, making him one of Marvel\'s oldest characters, predating the Marvel Age.',
    timeLimit: 25,
    points: 20,
    hints: ['This character fought in World War II', 'He appeared before Marvel was even called Marvel'],
    tags: ['history', 'timeline', 'captain-america']
  },
  {
    id: 'time_002',
    type: 'timeline',
    category: 'history',
    difficulty: 'hard',
    question: 'In what year did the first Avengers comic book debut?',
    options: ['1961', '1963', '1965', '1967'],
    correctAnswer: '1963',
    explanation: 'The Avengers #1 was published in September 1963, featuring the original team of Iron Man, Thor, Hulk, Ant-Man, and Wasp.',
    timeLimit: 30,
    points: 25,
    hints: ['Same year as X-Men', 'Early 1960s during the Marvel Age'],
    tags: ['avengers', 'history', 'comics']
  },
  
  // Team Affiliation Questions
  {
    id: 'team_001',
    type: 'team-affiliation',
    category: 'teams',
    difficulty: 'easy',
    question: 'Which team is Spider-Man most commonly associated with?',
    options: ['X-Men', 'Fantastic Four', 'Avengers', 'Defenders'],
    correctAnswer: 'Avengers',
    explanation: 'While Spider-Man has worked with many teams, he is most notably a member of the Avengers.',
    characterId: 1,
    timeLimit: 15,
    points: 10,
    hints: ['Earth\'s Mightiest Heroes', 'He joined this team later in his career'],
    tags: ['spider-man', 'teams', 'avengers']
  },
  {
    id: 'team_002',
    type: 'team-affiliation',
    category: 'teams',
    difficulty: 'medium',
    question: 'Who are the founding members of the Avengers?',
    options: [
      'Iron Man, Thor, Hulk, Ant-Man, Wasp',
      'Captain America, Iron Man, Thor, Hulk, Black Widow',
      'Spider-Man, Iron Man, Captain America, Thor, Hulk',
      'Iron Man, Captain America, Thor, Hawkeye, Black Widow'
    ],
    correctAnswer: 'Iron Man, Thor, Hulk, Ant-Man, Wasp',
    explanation: 'The original Avengers team consisted of Iron Man, Thor, Hulk, Ant-Man, and Wasp. Captain America joined in issue #4.',
    timeLimit: 25,
    points: 20,
    hints: ['Captain America was not a founding member', 'Ant-Man and Wasp were original members'],
    tags: ['avengers', 'founding', 'teams']
  },
  
  // True/False Questions
  {
    id: 'tf_001',
    type: 'true-false',
    category: 'characters',
    difficulty: 'easy',
    question: 'True or False: Tony Stark is a genius-level intellect.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Tony Stark is indeed considered to have genius-level intellect, which allows him to create advanced technology.',
    characterId: 2,
    timeLimit: 10,
    points: 5,
    tags: ['iron-man', 'intelligence']
  },
  {
    id: 'tf_002',
    type: 'true-false',
    category: 'powers',
    difficulty: 'medium',
    question: 'True or False: Thor\'s hammer Mjolnir can only be lifted by those who are worthy.',
    options: ['True', 'False'],
    correctAnswer: 'True',
    explanation: 'Mjolnir has an enchantment placed by Odin that only allows those who are worthy to lift it.',
    characterId: 4,
    timeLimit: 15,
    points: 10,
    tags: ['thor', 'mjolnir', 'worthiness']
  },
  
  // Visual Identification Questions
  {
    id: 'vis_001',
    type: 'visual-identification',
    category: 'characters',
    difficulty: 'easy',
    question: 'Which character is known for wearing a red and blue costume with a spider emblem?',
    options: ['Captain America', 'Spider-Man', 'Superman', 'Iron Man'],
    correctAnswer: 'Spider-Man',
    explanation: 'Spider-Man\'s iconic costume features red and blue colors with a distinctive spider emblem on the chest.',
    characterId: 1,
    timeLimit: 15,
    points: 10,
    tags: ['spider-man', 'costume', 'visual']
  },
  
  // Comic Cover Questions
  {
    id: 'comic_001',
    type: 'comic-cover',
    category: 'comics',
    difficulty: 'hard',
    question: 'Which comic featured Spider-Man\'s first appearance?',
    options: ['Amazing Spider-Man #1', 'Amazing Fantasy #15', 'Marvel Comics #1', 'Fantastic Four #1'],
    correctAnswer: 'Amazing Fantasy #15',
    explanation: 'Spider-Man first appeared in Amazing Fantasy #15 in August 1962, created by Stan Lee and Steve Ditko.',
    characterId: 1,
    timeLimit: 30,
    points: 25,
    hints: ['It was an anthology series', 'The series was cancelled after this issue'],
    tags: ['spider-man', 'first-appearance', 'comics']
  },
  
  // Fill in the Blank Questions
  {
    id: 'fill_001',
    type: 'fill-in-blank',
    category: 'origins',
    difficulty: 'medium',
    question: 'Complete Spider-Man\'s famous motto: "With great power comes great ________."',
    options: ['responsibility', 'strength', 'wisdom', 'courage'],
    correctAnswer: 'responsibility',
    explanation: 'This famous quote from Uncle Ben became Spider-Man\'s guiding principle throughout his superhero career.',
    characterId: 1,
    timeLimit: 20,
    points: 15,
    tags: ['spider-man', 'motto', 'responsibility']
  },
  
  // Expert Level Questions
  {
    id: 'exp_001',
    type: 'multiple-choice',
    category: 'characters',
    difficulty: 'expert',
    question: 'What is the real name of the original Captain Marvel in Marvel Comics?',
    options: ['Carol Danvers', 'Monica Rambeau', 'Mar-Vell', 'Genis-Vell'],
    correctAnswer: 'Mar-Vell',
    explanation: 'Mar-Vell was the original Captain Marvel in Marvel Comics, a Kree warrior who came to Earth.',
    timeLimit: 35,
    points: 30,
    hints: ['He was a Kree warrior', 'His name sounds like Marvel'],
    tags: ['captain-marvel', 'kree', 'expert']
  },
  {
    id: 'exp_002',
    type: 'character-relationship',
    category: 'relationships',
    difficulty: 'expert',
    question: 'Who is the mother of Franklin Richards, one of the most powerful mutants in the Marvel Universe?',
    options: ['Jean Grey', 'Sue Storm', 'Emma Frost', 'Wanda Maximoff'],
    correctAnswer: 'Sue Storm',
    explanation: 'Sue Storm (Invisible Woman) and Reed Richards (Mr. Fantastic) are the parents of Franklin Richards.',
    timeLimit: 40,
    points: 35,
    hints: ['She\'s a member of the Fantastic Four', 'She can turn invisible'],
    tags: ['fantastic-four', 'franklin-richards', 'family']
  }
];

export const getQuestionsByType = (type: QuestionType): EnhancedQuizQuestion[] => {
  return enhancedQuestions.filter(q => q.type === type);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | 'expert'): EnhancedQuizQuestion[] => {
  return enhancedQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByCategory = (category: string): EnhancedQuizQuestion[] => {
  return enhancedQuestions.filter(q => q.category === category);
};

export const getRandomQuestions = (count: number, difficulty?: string, type?: QuestionType): EnhancedQuizQuestion[] => {
  let filteredQuestions = enhancedQuestions;
  
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  if (type) {
    filteredQuestions = filteredQuestions.filter(q => q.type === type);
  }
  
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const getQuestionById = (id: string): EnhancedQuizQuestion | undefined => {
  return enhancedQuestions.find(q => q.id === id);
};

export const getQuestionsForCharacter = (characterId: number): EnhancedQuizQuestion[] => {
  return enhancedQuestions.filter(q => 
    q.characterId === characterId || 
    q.relatedCharacters?.includes(characterId)
  );
};

export const getQuestionsByTags = (tags: string[]): EnhancedQuizQuestion[] => {
  return enhancedQuestions.filter(q => 
    tags.some(tag => q.tags.includes(tag))
  );
};

export const getQuestionsByType = (type: QuestionType): EnhancedQuizQuestion[] => {
  return enhancedQuestions.filter(q => q.type === type);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard' | 'expert'): EnhancedQuizQuestion[] => {
  return enhancedQuestions.filter(q => q.difficulty === difficulty);
};