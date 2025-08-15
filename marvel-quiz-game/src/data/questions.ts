import { Question } from '../context/GameContext';

export const marvelQuestions: Question[] = [
  {
    id: 1,
    question: "What is the real name of Spider-Man?",
    options: ["Peter Parker", "Miles Morales", "Ben Reilly", "Miguel O'Hara"],
    correctAnswer: 0,
    character: "Spider-Man",
    difficulty: "easy"
  },
  {
    id: 2,
    question: "Which Infinity Stone is hidden on Vormir?",
    options: ["Power Stone", "Time Stone", "Soul Stone", "Reality Stone"],
    correctAnswer: 2,
    character: "Thanos",
    difficulty: "medium"
  },
  {
    id: 3,
    question: "What is the name of Thor's hammer?",
    options: ["Stormbreaker", "Mjolnir", "Gungnir", "Hofund"],
    correctAnswer: 1,
    character: "Thor",
    difficulty: "easy"
  },
  {
    id: 4,
    question: "Who is the leader of the Guardians of the Galaxy?",
    options: ["Rocket Raccoon", "Gamora", "Star-Lord", "Drax"],
    correctAnswer: 2,
    character: "Star-Lord",
    difficulty: "easy"
  },
  {
    id: 5,
    question: "What is the name of Black Widow's sister?",
    options: ["Natasha Romanoff", "Yelena Belova", "Melina Vostokoff", "Antonia Dreykov"],
    correctAnswer: 1,
    character: "Black Widow",
    difficulty: "medium"
  },
  {
    id: 6,
    question: "Which planet is Thanos from?",
    options: ["Asgard", "Titan", "Xandar", "Sakaar"],
    correctAnswer: 1,
    character: "Thanos",
    difficulty: "medium"
  },
  {
    id: 7,
    question: "What is Captain America's shield made of?",
    options: ["Adamantium", "Vibranium", "Uru Metal", "Steel"],
    correctAnswer: 1,
    character: "Captain America",
    difficulty: "easy"
  },
  {
    id: 8,
    question: "Who created the Winter Soldier program?",
    options: ["HYDRA", "S.H.I.E.L.D.", "A.I.M.", "The Red Room"],
    correctAnswer: 0,
    character: "Winter Soldier",
    difficulty: "hard"
  },
  {
    id: 9,
    question: "What is the name of the AI that replaces JARVIS?",
    options: ["FRIDAY", "KAREN", "EDITH", "VERONICA"],
    correctAnswer: 0,
    character: "Iron Man",
    difficulty: "medium"
  },
  {
    id: 10,
    question: "Which Avenger can shrink to subatomic size?",
    options: ["Wasp", "Ant-Man", "Both A and B", "Neither"],
    correctAnswer: 2,
    character: "Ant-Man",
    difficulty: "medium"
  },
  {
    id: 11,
    question: "What is the name of the Wakandan herb that gives Black Panther his powers?",
    options: ["Heart-Shaped Herb", "Vibranium Flower", "Panther Root", "Wakandan Leaf"],
    correctAnswer: 0,
    character: "Black Panther",
    difficulty: "hard"
  },
  {
    id: 12,
    question: "Who is the God of Mischief?",
    options: ["Thor", "Odin", "Loki", "Heimdall"],
    correctAnswer: 2,
    character: "Loki",
    difficulty: "easy"
  },
  {
    id: 13,
    question: "What is the name of Doctor Strange's sanctum?",
    options: ["Sanctum Sanctorum", "Kamar-Taj", "The Mirror Dimension", "The Dark Dimension"],
    correctAnswer: 0,
    character: "Doctor Strange",
    difficulty: "hard"
  },
  {
    id: 14,
    question: "Which Infinity Stone does Vision have in his forehead?",
    options: ["Power Stone", "Mind Stone", "Reality Stone", "Space Stone"],
    correctAnswer: 1,
    character: "Vision",
    difficulty: "medium"
  },
  {
    id: 15,
    question: "What is the name of Hawkeye's wife?",
    options: ["Laura Barton", "Natasha Romanoff", "Pepper Potts", "Jane Foster"],
    correctAnswer: 0,
    character: "Hawkeye",
    difficulty: "hard"
  },
  {
    id: 16,
    question: "Who is the Winter Soldier?",
    options: ["Steve Rogers", "Bucky Barnes", "Sam Wilson", "John Walker"],
    correctAnswer: 1,
    character: "Winter Soldier",
    difficulty: "easy"
  },
  {
    id: 17,
    question: "What is the name of the blue cube that contains the Space Stone?",
    options: ["Cosmic Cube", "Tesseract", "Orb", "Aether"],
    correctAnswer: 1,
    character: "Tesseract",
    difficulty: "medium"
  },
  {
    id: 18,
    question: "Which character says 'I am Groot'?",
    options: ["Rocket", "Star-Lord", "Groot", "Drax"],
    correctAnswer: 2,
    character: "Groot",
    difficulty: "easy"
  },
  {
    id: 19,
    question: "What is the name of Tony Stark's father?",
    options: ["Howard Stark", "Edwin Jarvis", "Obadiah Stane", "Happy Hogan"],
    correctAnswer: 0,
    character: "Iron Man",
    difficulty: "medium"
  },
  {
    id: 20,
    question: "Which realm is Asgard located in?",
    options: ["Midgard", "Jotunheim", "Asgard", "Nine Realms"],
    correctAnswer: 3,
    character: "Thor",
    difficulty: "hard"
  }
];

export function getRandomQuestions(count: number = 10): Question[] {
  const shuffled = [...marvelQuestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getQuestionsByDifficulty(difficulty: 'easy' | 'medium' | 'hard', count: number = 5): Question[] {
  const filtered = marvelQuestions.filter(q => q.difficulty === difficulty);
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}