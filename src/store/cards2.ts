import { Indexable } from "./util";

/** todo
 * card images:
 * type
 * small logo
 * background
 *
 * add tests for network:
 * 1 root
 * all leafs give something
 * no cycles
 * no misspellings
 * list all types to see if enums look good
 * numbers don't jump too high between nodes
 * numbers always increase in one direction in graph
 *
 * card updates:
 * add city x concepts
 * add more food and gold
 * add require tools to tech and buildings per era?
 * remove population/culture/happiness?
 */

export interface SimpleCard {
  researchPoints?: number;
  industryPoints?: number;
  industryUpkeep?: number;
  gold?: number;
  food?: number;
  addResearch?: string[];
  addBuilding?: string[];
  addMilitary?: string[];
  removeMilitary?: string[];
  addForeign?: string[];
  addFood?: number;
  addIndustryPoints?: number;
  addResearchPoints?: number;
  addPopulationPoints?: number;
  addDefensePoints?: number;
  addGold?: number;
  hasIron?: boolean;
  hasOil?: boolean;
  hasHorses?: boolean;
  hasCoal?: boolean;
  hasAluminum?: boolean;
  hasMelee?: boolean;
  hasHandguns?: boolean;
  hasRifles?: boolean;
  hasShotguns?: boolean;
  hasSniperRifels?: boolean;
  requiresIron?: boolean;
  requiresOil?: boolean;
  requiresHorses?: boolean;
  requiresCoal?: boolean;
  requiresAluminum?: boolean;
  immediatePlay?: boolean;
  reuse?: boolean;
  addCulturePoints?: number;
  addHappinessPoints?: number;

  combatType?: string;
  strength?: number;
  rangedStrength?: number;
  range?: number;
  speed?: number;
}

export interface SimpleMilitaryCard extends SimpleCard {
  industryPoints: number;
  combatType: string;
  strength?: number;
  rangedStrength?: number;
  range?: number;
  speed?: number;
}

export type SetType = "alpha";
export type AdvisorType = "domestic" | "science" | "foreign" | "defense";
export type ResourceType =
  | "iron"
  | "oil"
  | "horses"
  | "coal"
  | "aluminum"
  | "melee"
  | "handguns"
  | "rifles"
  | "shotguns"
  | "sniperRifles";
export type ValuableType =
  | "research"
  | "industry"
  | "gold"
  | "food"
  | "population"
  | "defense"
  | "culture"
  | "happiness";
export type AdvisorCards = { [Property in AdvisorType]: string[] };
export type Valuables = { [Property in ValuableType]: number | undefined };
export type Resources = { [Property in ResourceType]: boolean | undefined };
export interface Card {
  id: string;
  advisor: AdvisorType;
  label: string;
  description: string;
  immediatePlay?: boolean;
  reuse?: boolean;
  imageSrc: string;
  requirements: {
    valuables?: Partial<Valuables>;
    resources?: Partial<Resources>;
  };
  play: {
    addCard?: Partial<AdvisorCards>;
    removeCard?: Partial<AdvisorCards>;
    addValuablesOnce?: Partial<Valuables>;
    addValuablesPerTurn?: Partial<Valuables>;
    addResources?: Partial<Resources>;
  };
  upkeep?: Partial<Valuables>;
}

export const makeId = (set: SetType, advisor: AdvisorType, key: string) => {
  return `${set}__${advisor}__${key}`;
};

export const hydrate = (
  set: SetType,
  advisor: AdvisorType,
  key: string,
  value: SimpleCard
) => {
  return {
    id: makeId(set, advisor, key),
    advisor,
    label: `${key}__label`,
    description: `${key}__description`,
    immediatePlay: value.immediatePlay,
    reuse: value.reuse,
    imageSrc: `${key}__imageSrc`,
    combatType: value.combatType,
    strength: value.strength,
    rangedStrength: value.rangedStrength,
    range: value.range,
    speed: value.speed,
    requirements: {
      valuables: {
        research: value.researchPoints,
        industry: value.industryPoints,
        gold: value.gold,
        food: value.food,
      },
      resources: {
        iron: value.requiresIron,
        oil: value.requiresOil,
        horses: value.requiresHorses,
        coal: value.requiresCoal,
        aluminum: value.requiresAluminum,
      },
    },
    play: {
      addCard: {
        domestic: value.addBuilding?.map((c) => makeId(set, "domestic", c)),
        science: value.addResearch?.map((c) => makeId(set, "science", c)),
        defense: value.addMilitary?.map((c) => makeId(set, "defense", c)),
        foreign: value.addForeign?.map((c) => makeId(set, "foreign", c)),
      },
      removeCard: {
        defense: value.removeMilitary?.map((c) => makeId(set, "defense", c)),
      },
      addValuablesOnce: {},
      addValuablesPerTurn: {
        research: value.addResearchPoints,
        industry: value.addIndustryPoints,
        gold: value.addGold,
        food: value.addFood,
        population: value.addPopulationPoints,
        defense: value.addDefensePoints,
        culture: value.addCulturePoints,
        happiness: value.addHappinessPoints,
      },
      addResources: {
        iron: value.hasIron,
        oil: value.hasOil,
        horses: value.hasHorses,
        coal: value.hasCoal,
        aluminum: value.hasAluminum,
        melee: value.hasMelee,
        handguns: value.hasHandguns,
        rifles: value.hasRifles,
        shotguns: value.hasShotguns,
        sniperRifles: value.hasSniperRifels,
      },
    },
    upkeep: { industry: value.industryUpkeep },
  };
};

export const hydrateAll = () => {
  const ret: Indexable<Card> = {};
  Object.entries(techCards).forEach(([k, v]) => {
    ret[makeId("alpha", "science", k)] = hydrate("alpha", "science", k, v);
  });
  Object.entries(buildingCards).forEach(([k, v]) => {
    ret[makeId("alpha", "domestic", k)] = hydrate("alpha", "domestic", k, v);
  });
  Object.entries(foreignCards).forEach(([k, v]) => {
    ret[makeId("alpha", "foreign", k)] = hydrate("alpha", "foreign", k, v);
  });
  Object.entries(militaryCards).forEach(([k, v]) => {
    ret[makeId("alpha", "defense", k)] = hydrate("alpha", "defense", k, v);
  });

  let newRet = removeEmpty(ret);
  console.log(newRet);
  return newRet;
};

const removeEmpty = (obj: any) => {
  let newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};

export const militaryCards: Indexable<SimpleMilitaryCard> = {
  archer: {
    industryPoints: 70,
    combatType: "archery",
    strength: 4,
    rangedStrength: 6,
    range: 2,
    speed: 2,
  },

  chariot_archer: {
    industryPoints: 20,
    combatType: "melee",
    strength: 60,
    rangedStrength: 3,
    range: 2,
    speed: 4,
    requiresHorses: true,
  },

  scout: {
    industryPoints: 25,
    combatType: "recon",
    strength: 4,
    speed: 2,
  },

  spearman: {
    industryPoints: 50,
    combatType: "melee",
    strength: 7,
    speed: 2,
  },

  warrior: {
    industryPoints: 40,
    combatType: "melee",
    strength: 6,
    speed: 2,
  },

  catapult: {
    industryPoints: 100,
    combatType: "siege",
    strength: 4,
    rangedStrength: 14,
    range: 2,
    speed: 2,
    requiresIron: true,
  },

  horseman: {
    industryPoints: 80,
    combatType: "mounted",
    strength: 12,
    speed: 4,
    requiresHorses: true,
  },

  swordsman: {
    industryPoints: 80,
    combatType: "melee",
    strength: 11,
    speed: 2,
    requiresIron: true,
  },

  crosbowman: {
    industryPoints: 120,
    combatType: "archery",
    strength: 6,
    rangedStrength: 12,
    range: 2,
    speed: 2,
  },

  knight: {
    industryPoints: 150,
    combatType: "mounted",
    strength: 18,
    speed: 3,
    requiresHorses: true,
  },

  longswordsman: {
    industryPoints: 150,
    combatType: "melee",
    strength: 18,
    speed: 2,
    requiresIron: true,
  },

  pikeman: {
    industryPoints: 100,
    combatType: "melee",
    strength: 10,
    speed: 2,
  },

  trebuchet: {
    industryPoints: 170,
    combatType: "siege",
    strength: 10,
    rangedStrength: 20,
    range: 2,
    speed: 2,
    requiresIron: true,
  },

  cannon: {
    industryPoints: 250,
    combatType: "siege",
    strength: 10,
    rangedStrength: 26,
    range: 2,
    speed: 2,
  },

  cavalry: {
    industryPoints: 260,
    combatType: "mounted",
    strength: 25,
    speed: 3,
    requiresHorses: true,
  },

  lancer: {
    industryPoints: 220,
    combatType: "mounted",
    strength: 22,
    speed: 4,
    requiresHorses: true,
  },

  musketman: {
    industryPoints: 120,
    combatType: "gunpowder",
    strength: 16,
    speed: 2,
  },

  rifleman: {
    industryPoints: 200,
    combatType: "gunpowder",
    strength: 25,
    speed: 2,
  },

  anti_aircraft_gun: {
    industryPoints: 300,
    combatType: "gunpowder",
    strength: 32,
    rangedStrength: 32,
    range: 2,
    speed: 2,
  },

  artillery: {
    industryPoints: 420,
    combatType: "siege",
    strength: 16,
    rangedStrength: 32,
    range: 3,
    speed: 2,
  },

  infantry: {
    industryPoints: 300,
    combatType: "gunpowder",
    strength: 36,
    speed: 2,
  },

  bomber: {
    industryPoints: 520,
    combatType: "air",
    strength: 21,
    rangedStrength: 60,
    range: 10,
    speed: 10,
    requiresOil: true,
  },

  helicopter_gunship: {
    industryPoints: 450,
    combatType: "air",
    strength: 50,
    speed: 6,
    requiresAluminum: true,
  },

  rocket_artillery: {
    industryPoints: 600,
    combatType: "siege",
    strength: 18,
    rangedStrength: 46,
    range: 3,
    speed: 3,
    requiresAluminum: true,
  },
};

export const foreignCards: Indexable<SimpleCard> = {
  found_city_1: {
    immediatePlay: true,
    addForeign: [
      "city_attacks_1",
      "recon_city_1",
      "build_embasy_city_1",
      "found_city_2",
    ],
  },

  city_attacks_1: {
    immediatePlay: true,
  },

  recon_city_1: {},

  build_embasy_city_1: {},

  found_city_2: {
    immediatePlay: true,
    addForeign: [
      "city_attacks_2",
      "recon_city_2",
      "build_embasy_city_2",
      "found_city_3",
    ],
  },

  city_attacks_2: {
    immediatePlay: true,
  },

  recon_city_2: {},

  build_embasy_city_2: {},

  found_city_3: {
    immediatePlay: true,
    addForeign: [
      "city_attacks_3",
      "recon_city_3",
      "build_embasy_city_3",
      "found_city_4",
    ],
  },

  city_attacks_3: {
    immediatePlay: true,
  },

  recon_city_3: {},

  build_embasy_city_3: {},

  found_city_4: {
    immediatePlay: true,
    addForeign: [
      "city_attacks_4",
      "recon_city_4",
      "build_embasy_city_4",
      "found_city_5",
    ],
  },

  city_attacks_4: {
    immediatePlay: true,
  },

  recon_city_4: {},

  build_embasy_city_4: {},

  found_city_5: {
    immediatePlay: true,
    addForeign: ["city_attacks_5", "recon_city_5", "build_embasy_city_5"],
  },

  city_attacks_5: {
    immediatePlay: true,
  },

  recon_city_5: {},

  build_embasy_city_5: {},

  find_research_tools_1: {
    food: 1,
    addResearchPoints: 10,
    addForeign: ["find_research_tools_2"],
  },

  find_research_tools_2: {
    food: 1,
    addResearchPoints: 20,
    addForeign: ["find_research_tools_3"],
  },

  find_research_tools_3: {
    food: 2,
    addResearchPoints: 30,
    addForeign: ["find_research_tools_4"],
  },

  find_research_tools_4: {
    food: 2,
    addResearchPoints: 40,
    addForeign: ["find_research_tools_5"],
  },

  find_research_tools_5: {
    food: 3,
    addResearchPoints: 50,
  },

  find_weapons_1: {
    gold: 1,
    hasMelee: true,
    addForeign: ["find_weapons_2"],
  },

  find_weapons_2: {
    gold: 1,
    hasHandguns: true,
    addForeign: ["find_weapons_3"],
  },

  find_weapons_3: {
    gold: 2,
    hasRifles: true,
    addForeign: ["find_weapons_4"],
  },

  find_weapons_4: {
    gold: 2,
    hasShotguns: true,
    addForeign: ["find_weapons_5"],
  },

  find_weapons_5: {
    gold: 3,
    hasSniperRifels: true,
  },

  find_building_tools_1: {
    food: 1,
    addIndustryPoints: 20,
    addForeign: ["find_building_tools_2"],
  },

  find_building_tools_2: {
    food: 2,
    addIndustryPoints: 30,
    addForeign: ["find_building_tools_3"],
  },

  find_building_tools_3: {
    food: 3,
    addIndustryPoints: 40,
    addForeign: ["find_building_tools_4"],
  },

  find_building_tools_4: {
    food: 4,
    addIndustryPoints: 50,
    addForeign: ["find_building_tools_5"],
  },

  find_building_tools_5: {
    food: 5,
    addIndustryPoints: 60,
  },

  find_food: {
    reuse: true,
    gold: 1,
    addFood: 3,
  },

  find_gold: {
    reuse: true,
    food: 1,
    addGold: 3,
  },

  find_coal: {
    hasCoal: true,
  },

  find_iron: {
    hasIron: true,
  },

  find_oil: {
    hasOil: true,
  },

  find_horses: {
    hasHorses: true,
  },

  find_aluminum: {
    hasAluminum: true,
  },
};

export const buildingCards: Indexable<SimpleCard> = {
  grainary: {
    industryPoints: 100,
    industryUpkeep: 1,
    addFood: 2,
  },

  lighthouse: {
    industryPoints: 80,
    industryUpkeep: 1,
    addFood: 4,
  },

  harbor: {
    industryPoints: 80,
    industryUpkeep: 3,
    addIndustryPoints: 6,
  },

  observatory: {
    industryPoints: 180,
    industryUpkeep: 2,
    addResearchPoints: 40,
  },

  seaport: {
    industryPoints: 140,
    industryUpkeep: 2,
    addIndustryPoints: 10,
  },

  library: {
    industryPoints: 80,
    industryUpkeep: 1,
    addResearchPoints: 40,
  },

  university: {
    industryPoints: 200,
    industryUpkeep: 3,
    addResearchPoints: 34,
  },

  public_school: {
    industryPoints: 350,
    industryUpkeep: 3,
    addResearchPoints: 40,
  },

  hospital: {
    industryPoints: 400,
    industryUpkeep: 2,
    addFood: 7,
  },

  medical_lab: {
    industryPoints: 500,
    industryUpkeep: 3,
    addFood: 5,
  },

  solar_plant: {
    industryPoints: 600,
    industryUpkeep: 3,
    addIndustryPoints: 13,
  },

  research_lab: {
    industryPoints: 600,
    industryUpkeep: 3,
    addIndustryPoints: 800,
  },

  hydro_plant: {
    industryPoints: 600,
    industryUpkeep: 3,
    addIndustryPoints: 12,
    requiresAluminum: true,
  },

  military_base: {
    industryPoints: 450,
    industryUpkeep: 4,
    addDefensePoints: 12,
  },

  broadcast_tower: {
    industryPoints: 600,
    industryUpkeep: 3,
    addCulturePoints: 5,
  },

  factory: {
    industryPoints: 300,
    industryUpkeep: 3,
    addIndustryPoints: 36,
    requiresCoal: true,
  },

  arsenal: {
    industryPoints: 350,
    industryUpkeep: 3,
    addIndustryPoints: 8,
  },

  monastery: {
    industryPoints: 120,
    industryUpkeep: 2,
    addCulturePoints: 4,
  },

  stable: {
    industryPoints: 100,
    industryUpkeep: 1,
    addIndustryPoints: 4,
    requiresHorses: true,
  },

  circus: {
    industryPoints: 150,
    industryUpkeep: 3,
    addHappinessPoints: 3,
    requiresHorses: true,
  },

  castle: {
    industryPoints: 200,
    industryUpkeep: 3,
    addDefensePoints: 7.5,
  },

  courthouse: {
    industryPoints: 200,
    industryUpkeep: 5,
    addHappinessPoints: 5,
  },

  market: {
    industryPoints: 120,
    industryUpkeep: 0,
    addGold: 4,
  },

  mint: {
    industryPoints: 120,
    industryUpkeep: 0,
    addGold: 6,
  },

  bank: {
    industryPoints: 220,
    industryUpkeep: 0,
    addGold: 5,
  },

  walls: {
    industryPoints: 100,
    industryUpkeep: 1,
    addDefensePoints: 5,
  },

  colosseum: {
    industryPoints: 150,
    industryUpkeep: 3,
    addHappinessPoints: 4,
    addBuilding: ["theater"],
  },

  theater: {
    industryPoints: 300,
    industryUpkeep: 5,
    addHappinessPoints: 4,
    addBuilding: ["stadium"],
  },

  stadium: {
    industryPoints: 450,
    industryUpkeep: 6,
    addHappinessPoints: 4,
  },

  military_academy: {
    industryPoints: 350,
    industryUpkeep: 3,
    addDefensePoints: 5,
  },

  armory: {
    industryPoints: 130,
    industryUpkeep: 3,
    addDefensePoints: 5,
  },

  forge: {
    industryPoints: 150,
    industryUpkeep: 2,
    addDefensePoints: 6,
    requiresIron: true,
  },

  workshop: {
    industryPoints: 100,
    industryUpkeep: 2,
    addDefensePoints: 11,
  },

  temple: {
    industryPoints: 120,
    industryUpkeep: 2,
    addCulturePoints: 3,
    addBuilding: ["opera_house"],
  },

  opera_house: {
    industryPoints: 220,
    industryUpkeep: 3,
    addCulturePoints: 5,
    addBuilding: ["opera_house"],
  },

  windmill: {
    industryPoints: 180,
    industryUpkeep: 2,
    addIndustryPoints: 9,
  },

  garden: {
    industryPoints: 120,
    industryUpkeep: 2,
    addGold: 2,
    addCulturePoints: 2,
    addHappinessPoints: 2,
    addFood: 1,
  },

  barracks: {
    industryPoints: 80,
    industryUpkeep: 1,
    addDefensePoints: 2,
  },

  monumnet: {
    industryPoints: 60,
    industryUpkeep: 1,
    addCulturePoints: 2,
  },

  water_mill: {
    industryPoints: 120,
    industryUpkeep: 2,
    addFood: 2,
  },

  burial_tomb: {
    industryPoints: 120,
    industryUpkeep: 0,
    addCulturePoints: 2,
    addHappinessPoints: 2,
  },

  basic_planning: {
    reuse: true,
    addIndustryPoints: 20,
  },
};

export const techCards: Indexable<SimpleCard> = {
  agriculture: {
    addResearch: ["pottery", "animal_husbandry", "mining", "basic_research"],
    addBuilding: ["monument", "water_wheel", "basic_planning"],
    addForeign: [
      "find_research_tools_1",
      "find_weapons_1",
      "find_building_tools_1",
      "find_food",
      "find_gold",
    ],
    addMilitary: ["warrior", "scout", "charriot_archer"],
  },

  basic_research: {
    reuse: true,
    addResearchPoints: 15,
  },

  pottery: {
    researchPoints: 35,
    addResearch: ["sailing", "calendar", "writing"],
    addBuilding: ["grainary"],
  },

  sailing: {
    researchPoints: 55,
    addResearch: ["optics"],
  },

  optics: {
    researchPoints: 80,
    addResearch: ["compass"],
    addBuilding: ["lighthouse"],
  },

  compass: {
    researchPoints: 340,
    addResearch: ["astronomy"],
    addBuilding: ["harbor"],
  },

  astronomy: {
    researchPoints: 650,
    addResearch: ["navigation"],
    addBuilding: ["observatory"],
  },

  navigation: {
    researchPoints: 900,
    addResearch: ["archaeology"],
    addBuilding: ["seaport"],
  },

  archaeology: {
    researchPoints: 1300,
    addResearch: [],
  },

  writing: {
    researchPoints: 55,
    addResearch: ["education"],
    addBuilding: ["library"],
  },

  education: {
    researchPoints: 440,
    addResearch: ["scientific_theory"],
    addBuilding: ["university"],
  },

  scientific_theory: {
    researchPoints: 1300,
    addResearch: ["biology", "steam_power"],
    addBuilding: ["public_school"],
    addForeign: ["find_coal"],
  },

  biology: {
    researchPoints: 1680,
    addResearch: ["electricity"],
    addBuilding: ["hospital"],
    addForeign: ["find_oil"],
  },

  electricity: {
    researchPoints: 1900,
    addResearch: ["refrigeration", "telegraph", "radio"],
    addForeign: ["find_aluminum"],
  },

  refrigeration: {
    researchPoints: 2200,
    addResearch: ["penicillin", "plastics"],
  },

  penicillin: {
    researchPoints: 2600,
    addResearch: ["ecology"],
    addBuilding: ["medical_lab"],
  },

  ecology: {
    researchPoints: 3000,
    addResearch: [],
    addBuilding: ["solar_plant"],
  },

  plastics: {
    researchPoints: 2600,
    addResearch: [],
    addBuilding: ["research_lab", "hydro_plant"],
  },

  telegraph: {
    researchPoints: 2200,
    addResearch: ["electronics"],
    addBuilding: ["military_base"],
  },

  electronics: {
    researchPoints: 2600,
    addResearch: ["computers"],
  },

  computers: {
    researchPoints: 3000,
    addResearch: ["robotics"],
  },

  robotics: {
    researchPoints: 3350,
    addResearch: [],
  },

  radio: {
    researchPoints: 2200,
    addResearch: ["radar"],
    addBuilding: ["broadcast_tower"],
    addMilitary: ["anti_aircraft_gun"],
  },

  radar: {
    researchPoints: 2600,
    addResearch: ["rocketry", "lasers"],
    addMilitary: ["bomber"],
  },

  rocketry: {
    researchPoints: 3000,
    addResearch: [],
    addMilitary: ["helicopter_gunship", "rocket_artillery"],
    removeMilitary: ["lancer", "artillery"],
  },

  lasers: {
    researchPoints: 3000,
    addResearch: [],
  },

  steam_power: {
    researchPoints: 1680,
    addResearch: ["replacable_parts", "railroad"],
    addBuilding: ["factory"],
  },

  replacable_parts: {
    researchPoints: 1900,
    addResearch: ["flight"],
    addMilitary: ["infantry"],
    removeMilitary: ["rifleman"],
  },

  flight: {
    researchPoints: 2200,
    addResearch: [],
  },

  railroad: {
    researchPoints: 1900,
    addResearch: [],
    addBuilding: ["arsenal"],
  },

  calendar: {
    researchPoints: 70,
    addResearch: ["philosophy"],
  },

  philosophy: {
    researchPoints: 100,
    addResearch: ["theology"],
    addBuilding: ["temple", "burial_tomb"],
  },

  theology: {
    researchPoints: 250,
    addResearch: [],
    addBuilding: ["monastery", "garden"],
  },

  animal_husbandry: {
    researchPoints: 35,
    addResearch: ["horseback_riding", "trapping"],
    addForeign: ["find_horses"],
  },

  horseback_riding: {
    researchPoints: 100,
    addResearch: ["civil_service"],
    addBuilding: ["stable", "circus"],
    addMilitary: ["horseman"],
  },

  civil_service: {
    researchPoints: 400,
    addResearch: ["chivalry"],
    addMilitary: ["pikeman"],
    removeMilitary: ["spearman"],
  },

  chivalry: {
    researchPoints: 440,
    addResearch: [],
    addBuilding: ["castle"],
    addMilitary: ["knight"],
    removeMilitary: ["horseman", "chariot_archer"],
  },

  trapping: {
    researchPoints: 55,
    addResearch: ["archery"],
  },

  archery: {
    researchPoints: 35,
    addResearch: ["mathamatics"],
    addBuilding: ["windmill"],
    addMilitary: ["archer"],
  },

  mathamatics: {
    researchPoints: 100,
    addResearch: ["currency"],
    addBuilding: ["courthouse"],
    addMilitary: ["catapult"],
  },

  currency: {
    researchPoints: 250,
    addResearch: ["banking"],
    addBuilding: ["market", "mint"],
  },

  banking: {
    researchPoints: 650,
    addResearch: [],
    addBuilding: ["bank"],
  },

  mining: {
    researchPoints: 35,
    addResearch: ["masonry", "bronze_working"],
  },

  masonry: {
    researchPoints: 55,
    addResearch: ["construction"],
    addBuilding: ["walls"],
  },

  construction: {
    researchPoints: 100,
    addResearch: ["engineering"],
    addBuilding: ["colosseum"],
  },

  engineering: {
    researchPoints: 250,
    addResearch: ["physics", "machinery"],
  },

  physics: {
    researchPoints: 440,
    addResearch: ["chemistry"],
    addMilitary: ["trebuchet"],
    removeMilitary: ["catapult"],
  },

  chemistry: {
    researchPoints: 900,
    addResearch: ["fertalizer", "military_science"],
    addMilitary: ["cannon"],
    removeMilitary: ["trebuchet"],
  },

  fertalizer: {
    researchPoints: 1300,
    addResearch: ["dynamite"],
  },

  dynamite: {
    researchPoints: 1900,
    addResearch: ["combustion"],
    addMilitary: ["artillery"],
    removeMilitary: ["cannon"],
  },

  combustion: {
    researchPoints: 2200,
    addResearch: [],
  },

  military_science: {
    researchPoints: 1300,
    addResearch: [],
    addBuilding: ["militasry_academy"],
    addMilitary: ["cavalry"],
    removeMilitary: ["knight"],
  },

  machinery: {
    researchPoints: 440,
    addResearch: [],
    addMilitary: ["crossbowman"],
    removeMilitary: ["archer"],
  },

  bronze_working: {
    researchPoints: 55,
    addResearch: ["iron_working"],
    addBuilding: ["barracks"],
    addMilitary: ["spearman"],
  },

  iron_working: {
    researchPoints: 150,
    addResearch: ["metal_casting"],
    addBuilding: ["armory"],
    addForeign: ["find_iron"],
    addMilitary: ["swordsman"],
    removeMilitary: ["warrior"],
  },

  metal_casting: {
    researchPoints: 250,
    addResearch: ["steel"],
    addBuilding: ["forge", "workshop"],
  },

  steel: {
    researchPoints: 440,
    addResearch: ["gunpowder"],
    addMilitary: ["longswordsman"],
    removeMilitary: ["swordsman"],
  },

  gunpowder: {
    researchPoints: 680,
    addResearch: ["metallurgy"],
    addMilitary: ["musketman"],
  },

  metallurgy: {
    researchPoints: 900,
    addResearch: ["rifling"],
    addMilitary: ["lancer"],
  },

  rifling: {
    researchPoints: 1425,
    addResearch: [],
    addMilitary: ["rifleman"],
    removeMilitary: ["longswordsman", "pikeman", "crossbowman", "musketman"],
  },
};
