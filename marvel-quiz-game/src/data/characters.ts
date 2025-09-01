export interface MarvelCharacterDetailed {
  id: number;
  name: string;
  realName?: string;
  aliases?: string[];
  powers: string[];
  abilities: string[];
  affiliations: string[];
  firstAppearance: {
    comic: string;
    year: number;
    issue?: string;
  };
  relationships: {
    allies?: string[];
    enemies?: string[];
    family?: string[];
    romanticInterests?: string[];
  };
  origin: string;
  occupation?: string;
  baseOfOperations?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  species?: string;
  citizenship?: string;
  maritalStatus?: string;
  education?: string;
  creators: string[];
  imageUrl?: string;
  biography: string;
  notableStoryArcs: string[];
  teams: string[];
  category: 'hero' | 'villain' | 'antihero' | 'neutral';
  powerLevel: 1 | 2 | 3 | 4 | 5 | 6 | 7; // 1-7 scale
  popularity: number; // 1-100 scale
}

export const marvelCharacters: MarvelCharacterDetailed[] = [
  {
    id: 1,
    name: "Spider-Man",
    realName: "Peter Benjamin Parker",
    aliases: ["Spidey", "Web-Slinger", "Wall-Crawler", "Amazing Spider-Man"],
    powers: ["Spider-sense", "Wall-crawling", "Superhuman strength", "Superhuman agility", "Superhuman reflexes"],
    abilities: ["Genius-level intellect", "Web-shooters", "Photography", "Science expertise"],
    affiliations: ["Avengers", "Fantastic Four", "Daily Bugle"],
    firstAppearance: {
      comic: "Amazing Fantasy",
      year: 1962,
      issue: "#15"
    },
    relationships: {
      allies: ["Iron Man", "Captain America", "Daredevil", "Human Torch"],
      enemies: ["Green Goblin", "Doctor Octopus", "Venom", "Sandman", "Rhino"],
      family: ["Aunt May", "Uncle Ben"],
      romanticInterests: ["Mary Jane Watson", "Gwen Stacy"]
    },
    origin: "Bitten by radioactive spider",
    occupation: "Photographer, Scientist, Superhero",
    baseOfOperations: "New York City",
    height: "5'10\"",
    weight: "167 lbs",
    eyeColor: "Hazel",
    hairColor: "Brown",
    species: "Human mutate",
    citizenship: "American",
    maritalStatus: "Married",
    education: "College graduate",
    creators: ["Stan Lee", "Steve Ditko"],
    biography: "Peter Parker gained spider powers after being bitten by a radioactive spider. Learning that with great power comes great responsibility, he became Spider-Man to protect New York City.",
    notableStoryArcs: ["The Night Gwen Stacy Died", "Kraven's Last Hunt", "Civil War", "Spider-Verse"],
    teams: ["Avengers", "Future Foundation", "New Avengers"],
    category: "hero",
    powerLevel: 4,
    popularity: 95
  },
  {
    id: 2,
    name: "Iron Man",
    realName: "Anthony Edward Stark",
    aliases: ["Tony Stark", "Shellhead", "Golden Avenger"],
    powers: ["Powered armor suit", "Flight", "Energy repulsors", "Enhanced strength"],
    abilities: ["Genius-level intellect", "Master engineer", "Business acumen", "Leadership"],
    affiliations: ["Avengers", "Stark Industries", "S.H.I.E.L.D."],
    firstAppearance: {
      comic: "Tales of Suspense",
      year: 1963,
      issue: "#39"
    },
    relationships: {
      allies: ["Captain America", "Thor", "Hulk", "War Machine"],
      enemies: ["Mandarin", "Iron Monger", "Whiplash", "Justin Hammer"],
      family: ["Howard Stark", "Maria Stark"],
      romanticInterests: ["Pepper Potts", "Black Widow"]
    },
    origin: "Built armor to escape captivity",
    occupation: "Inventor, Industrialist, Superhero",
    baseOfOperations: "Stark Tower, New York",
    height: "6'1\"",
    weight: "185 lbs",
    eyeColor: "Blue",
    hairColor: "Black",
    species: "Human",
    citizenship: "American",
    maritalStatus: "Single",
    education: "MIT graduate",
    creators: ["Stan Lee", "Larry Lieber", "Don Heck", "Jack Kirby"],
    biography: "Billionaire genius Tony Stark created the Iron Man armor to escape captivity and has since used his technology to protect the world as a founding member of the Avengers.",
    notableStoryArcs: ["Demon in a Bottle", "Armor Wars", "Civil War", "Extremis"],
    teams: ["Avengers", "Illuminati", "Force Works"],
    category: "hero",
    powerLevel: 6,
    popularity: 90
  },
  {
    id: 3,
    name: "Captain America",
    realName: "Steven Grant Rogers",
    aliases: ["Steve Rogers", "Cap", "Sentinel of Liberty", "First Avenger"],
    powers: ["Enhanced strength", "Enhanced speed", "Enhanced durability", "Enhanced healing"],
    abilities: ["Master tactician", "Expert martial artist", "Shield mastery", "Leadership"],
    affiliations: ["Avengers", "S.H.I.E.L.D.", "U.S. Army"],
    firstAppearance: {
      comic: "Captain America Comics",
      year: 1941,
      issue: "#1"
    },
    relationships: {
      allies: ["Iron Man", "Thor", "Black Widow", "Falcon"],
      enemies: ["Red Skull", "Baron Zemo", "Crossbones", "Hydra"],
      family: [],
      romanticInterests: ["Peggy Carter", "Sharon Carter"]
    },
    origin: "Enhanced by Super Soldier Serum",
    occupation: "Soldier, Superhero, Leader",
    baseOfOperations: "Avengers Mansion, New York",
    height: "6'2\"",
    weight: "240 lbs",
    eyeColor: "Blue",
    hairColor: "Blond",
    species: "Human mutate",
    citizenship: "American",
    maritalStatus: "Single",
    education: "High school",
    creators: ["Joe Simon", "Jack Kirby"],
    biography: "Steve Rogers was transformed from a frail young man into the peak of human perfection by the Super Soldier Serum. As Captain America, he leads the Avengers and embodies American ideals.",
    notableStoryArcs: ["The Winter Soldier", "Civil War", "The Death of Captain America", "Secret Empire"],
    teams: ["Avengers", "Invaders", "Secret Avengers"],
    category: "hero",
    powerLevel: 4,
    popularity: 85
  },
  {
    id: 4,
    name: "Thor",
    realName: "Thor Odinson",
    aliases: ["God of Thunder", "Donald Blake", "Thunderer"],
    powers: ["Superhuman strength", "Weather control", "Flight", "Immortality", "Mjolnir mastery"],
    abilities: ["Combat expertise", "Asgardian magic", "Leadership", "Warrior training"],
    affiliations: ["Avengers", "Asgard", "Warriors Three"],
    firstAppearance: {
      comic: "Journey into Mystery",
      year: 1962,
      issue: "#83"
    },
    relationships: {
      allies: ["Iron Man", "Captain America", "Hulk", "Sif"],
      enemies: ["Loki", "Malekith", "Enchantress", "Destroyer"],
      family: ["Odin", "Frigga", "Loki", "Balder"],
      romanticInterests: ["Jane Foster", "Sif"]
    },
    origin: "Asgardian God",
    occupation: "God, Prince of Asgard, Superhero",
    baseOfOperations: "Asgard, Earth",
    height: "6'6\"",
    weight: "640 lbs",
    eyeColor: "Blue",
    hairColor: "Blond",
    species: "Asgardian",
    citizenship: "Asgardian",
    maritalStatus: "Single",
    education: "Asgardian tutoring",
    creators: ["Stan Lee", "Larry Lieber", "Jack Kirby"],
    biography: "Thor is the Asgardian God of Thunder, wielder of the enchanted hammer Mjolnir. Banished to Earth, he learned humility and became a founding member of the Avengers.",
    notableStoryArcs: ["Ragnarok", "The Mighty Thor", "War of the Realms", "God Butcher"],
    teams: ["Avengers", "Warriors Three", "Asgardians"],
    category: "hero",
    powerLevel: 7,
    popularity: 80
  },
  {
    id: 5,
    name: "Hulk",
    realName: "Robert Bruce Banner",
    aliases: ["Bruce Banner", "Green Goliath", "Jade Giant", "Strongest One There Is"],
    powers: ["Superhuman strength", "Invulnerability", "Regeneration", "Anger empowerment"],
    abilities: ["Genius-level intellect (Banner)", "Scientific expertise", "Gamma radiation immunity"],
    affiliations: ["Avengers", "Defenders", "S.H.I.E.L.D."],
    firstAppearance: {
      comic: "The Incredible Hulk",
      year: 1962,
      issue: "#1"
    },
    relationships: {
      allies: ["Iron Man", "Thor", "Doctor Strange", "Rick Jones"],
      enemies: ["Abomination", "Leader", "General Ross", "Absorbing Man"],
      family: ["Betty Ross"],
      romanticInterests: ["Betty Ross", "Caiera"]
    },
    origin: "Gamma radiation exposure",
    occupation: "Scientist, Superhero",
    baseOfOperations: "Mobile",
    height: "5'9\" (Banner), 8'0\" (Hulk)",
    weight: "128 lbs (Banner), 1,040 lbs (Hulk)",
    eyeColor: "Brown (Banner), Green (Hulk)",
    hairColor: "Brown (Banner), Green (Hulk)",
    species: "Human mutate",
    citizenship: "American",
    maritalStatus: "Divorced",
    education: "Ph.D. in Nuclear Physics",
    creators: ["Stan Lee", "Jack Kirby"],
    biography: "Dr. Bruce Banner was exposed to gamma radiation during a bomb test, causing him to transform into the incredible Hulk when angry. The stronger his rage, the stronger he becomes.",
    notableStoryArcs: ["Planet Hulk", "World War Hulk", "Future Imperfect", "Immortal Hulk"],
    teams: ["Avengers", "Defenders", "Warbound"],
    category: "hero",
    powerLevel: 7,
    popularity: 85
  }
];

export const getCharacterById = (id: number): MarvelCharacterDetailed | undefined => {
  return marvelCharacters.find(character => character.id === id);
};

export const getCharactersByCategory = (category: 'hero' | 'villain' | 'antihero' | 'neutral'): MarvelCharacterDetailed[] => {
  return marvelCharacters.filter(character => character.category === category);
};

export const getCharactersByTeam = (team: string): MarvelCharacterDetailed[] => {
  return marvelCharacters.filter(character => 
    character.teams.some(t => t.toLowerCase().includes(team.toLowerCase()))
  );
};

export const getCharactersByPowerLevel = (minLevel: number, maxLevel: number): MarvelCharacterDetailed[] => {
  return marvelCharacters.filter(character => 
    character.powerLevel >= minLevel && character.powerLevel <= maxLevel
  );
};

export const searchCharacters = (query: string): MarvelCharacterDetailed[] => {
  const lowercaseQuery = query.toLowerCase();
  return marvelCharacters.filter(character => 
    character.name.toLowerCase().includes(lowercaseQuery) ||
    character.realName?.toLowerCase().includes(lowercaseQuery) ||
    character.aliases?.some(alias => alias.toLowerCase().includes(lowercaseQuery))
  );
};