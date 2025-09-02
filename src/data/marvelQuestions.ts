import { QuizQuestion } from '../types/marvel';

export const marvelQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the real name of Spider-Man?',
    options: ['Peter Parker', 'Tony Stark', 'Bruce Wayne', 'Clark Kent'],
    correctAnswer: 'Peter Parker',
    explanation: 'Peter Parker is the alter ego of Spider-Man, created by Stan Lee and Steve Ditko.',
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    id: 'q2',
    question: 'Which Infinity Stone is housed in the Eye of Agamotto?',
    options: ['Time Stone', 'Space Stone', 'Reality Stone', 'Power Stone'],
    correctAnswer: 'Time Stone',
    explanation: 'The Eye of Agamotto contains the Time Stone, one of the six Infinity Stones.',
    difficulty: 'medium',
    category: 'powers',
    points: 15
  },
  {
    id: 'q3',
    question: 'Who is the leader of the X-Men?',
    options: ['Wolverine', 'Cyclops', 'Professor X', 'Storm'],
    correctAnswer: 'Professor X',
    explanation: 'Professor Charles Xavier, also known as Professor X, is the founder and leader of the X-Men.',
    difficulty: 'easy',
    category: 'teams',
    points: 10
  },
  {
    id: 'q4',
    question: 'What is the name of Thor\'s hammer?',
    options: ['Stormbreaker', 'Mjolnir', 'Gungnir', 'Gram'],
    correctAnswer: 'Mjolnir',
    explanation: 'Mjolnir is Thor\'s enchanted hammer, which can only be lifted by those who are worthy.',
    difficulty: 'easy',
    category: 'characters',
    points: 10
  },
  {
    id: 'q5',
    question: 'Which villain is known as the "Mad Titan"?',
    options: ['Loki', 'Ultron', 'Thanos', 'Galactus'],
    correctAnswer: 'Thanos',
    explanation: 'Thanos, the Mad Titan, is obsessed with bringing balance to the universe through destruction.',
    difficulty: 'medium',
    category: 'characters',
    points: 15
  },
  {
    id: 'q6',
    question: 'What is the source of the Hulk\'s powers?',
    options: ['Gamma radiation', 'Super soldier serum', 'Alien technology', 'Magic'],
    correctAnswer: 'Gamma radiation',
    explanation: 'Bruce Banner was exposed to gamma radiation during a bomb test, transforming him into the Hulk.',
    difficulty: 'easy',
    category: 'powers',
    points: 10
  },
  {
    id: 'q7',
    question: 'Which team did Iron Man help found?',
    options: ['X-Men', 'Fantastic Four', 'Avengers', 'Defenders'],
    correctAnswer: 'Avengers',
    explanation: 'Tony Stark (Iron Man) was one of the founding members of the Avengers.',
    difficulty: 'easy',
    category: 'teams',
    points: 10
  },
  {
    id: 'q8',
    question: 'What is the real name of the Winter Soldier?',
    options: ['Steve Rogers', 'Bucky Barnes', 'Sam Wilson', 'John Walker'],
    correctAnswer: 'Bucky Barnes',
    explanation: 'James Buchanan "Bucky" Barnes is Captain America\'s childhood friend who became the Winter Soldier.',
    difficulty: 'medium',
    category: 'characters',
    points: 15
  },
  {
    id: 'q9',
    question: 'Which cosmic entity devours planets?',
    options: ['Dormammu', 'Galactus', 'Eternity', 'The Living Tribunal'],
    correctAnswer: 'Galactus',
    explanation: 'Galactus is a cosmic entity who consumes planets to sustain his life force.',
    difficulty: 'hard',
    category: 'characters',
    points: 20
  },
  {
    id: 'q10',
    question: 'What is the name of Black Panther\'s home country?',
    options: ['Genosha', 'Latveria', 'Wakanda', 'Atlantis'],
    correctAnswer: 'Wakanda',
    explanation: 'Wakanda is the fictional African nation ruled by the Black Panther.',
    difficulty: 'easy',
    category: 'characters',
    points: 10
  }
];

export const getRandomQuestions = (count: number = 5): QuizQuestion[] => {
  const shuffled = [...marvelQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getQuestionsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): QuizQuestion[] => {
  return marvelQuestions.filter(q => q.difficulty === difficulty);
};

export const getQuestionsByCategory = (category: 'characters' | 'powers' | 'teams' | 'history'): QuizQuestion[] => {
  return marvelQuestions.filter(q => q.category === category);
};