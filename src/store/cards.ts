import { Indexable } from "./util";
import { AdvisorType, onAllAdvisors } from "./advisors";

export interface SimpleCard {
  // play valuables
  scienceCost?: number;
  industryCost?: number;
  goldCost?: number;
  foodCost?: number;
  populationCost?: number;
  defenseCost?: number;
  cultureCost?: number;
  happinessCost?: number;

  // upkeep
  scienceUpkeep?: number;
  industryUpkeep?: number;
  goldUpkeep?: number;
  foodUpkeep?: number;
  populationUpkeep?: number;
  defenseUpkeep?: number;
  cultureUpkeep?: number;
  happinessUpkeep?: number;

  // add valuables
  addFood?: number;
  addIndustry?: number;
  addScience?: number;
  addPopulation?: number;
  addDefense?: number;
  addGold?: number;
  addCulture?: number;
  addHappiness?: number;
  addFoodOnce?: number;
  addIndustryOnce?: number;
  addScienceOnce?: number;
  addPopulationOnce?: number;
  addDefenseOnce?: number;
  addGoldOnce?: number;
  addCultureOnce?: number;
  addHappinessOnce?: number;

  // play resources
  requiresIron?: boolean;
  requiresOil?: boolean;
  requiresHorses?: boolean;
  requiresCoal?: boolean;
  requiresAluminum?: boolean;
  requiresMelee?: boolean;
  requiresHandguns?: boolean;
  requiresRifles?: boolean;
  requiresShotguns?: boolean;
  requiresSniperRifles?: boolean;

  // set resources
  setHasIron?: boolean;
  setHasOil?: boolean;
  setHasHorses?: boolean;
  setHasCoal?: boolean;
  setHasAluminum?: boolean;
  setHasMelee?: boolean;
  setHasHandguns?: boolean;
  setHasRifles?: boolean;
  setHasShotguns?: boolean;
  setHasSniperRifles?: boolean;

  // cards
  addScienceCard?: string[];
  addDomesticCard?: string[];
  addDefenseCard?: string[];
  addForeignCard?: string[];
  removeScienceCard?: string[];
  removeDomesticCard?: string[];
  removeDefenseCard?: string[];
  removeForeignCard?: string[];

  // combat
  combatType?: string;
  strength?: number;
  rangedStrength?: number;
  range?: number;
  speed?: number;

  // other
  immediatePlay?: boolean;
  reuse?: boolean;
}

export type SetType = "alpha";
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
  | "science"
  | "industry"
  | "gold"
  | "food"
  | "population"
  | "defense"
  | "culture"
  | "happiness";

export const onAllValuables = (func: (key: string) => void) => {
  [
    "science",
    "industry",
    "gold",
    "food",
    "population",
    "defense",
    "culture",
    "happiness",
  ].forEach((key: string) => func(key));
};

export const onAllResources = (func: (key: string) => void) => {
  [
    "iron",
    "oil",
    "horses",
    "coal",
    "aluminum",
    "melee",
    "handguns",
    "rifles",
    "shotguns",
    "sniperRifles",
  ].forEach((key: string) => func(key));
};

export type AdvisorCards = { [Property in AdvisorType]: string[] };
type ValuablesNullable = { [Property in ValuableType]: number | undefined };
type ResourcesNullable = { [Property in ResourceType]: boolean | undefined };
export type Valuables = { [Property in ValuableType]: number };
export type Resources = { [Property in ResourceType]: boolean };
export interface Card {
  id: string;
  advisor: AdvisorType;
  label: string;
  description: string;
  immediatePlay?: boolean;
  reuse?: boolean;
  imageSrc: string;
  combatType?: string;
  strength?: number;
  rangedStrength?: number;
  range?: number;
  speed?: number;
  requirements: {
    valuables?: Partial<ValuablesNullable>;
    resources?: Partial<ResourcesNullable>;
  };
  play: {
    addCard?: Partial<AdvisorCards>;
    removeCard?: Partial<AdvisorCards>;
    addValuablesOnce?: Partial<ValuablesNullable>;
    addValuablesPerTurn?: Partial<ValuablesNullable>;
    addResources?: Partial<ResourcesNullable>;
    upkeep?: Partial<ValuablesNullable>;
  };
}

export const makeId = (set: SetType, advisor: AdvisorType, key: string) => {
  return `${set}__${advisor}__${key}`;
};

export const hydrate = (
  set: SetType,
  advisor: AdvisorType,
  key: string,
  value: SimpleCard
): Card => {
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
        science: value.scienceCost,
        industry: value.industryCost,
        gold: value.goldCost,
        food: value.foodCost,
        population: value.populationCost,
        defense: value.defenseCost,
        culture: value.cultureCost,
        happiness: value.happinessCost,
      },
      resources: {
        iron: value.requiresIron,
        oil: value.requiresOil,
        horses: value.requiresHorses,
        coal: value.requiresCoal,
        aluminum: value.requiresAluminum,
        melee: value.requiresMelee,
        handguns: value.requiresHandguns,
        rifles: value.requiresRifles,
        shotguns: value.requiresShotguns,
        sniperRifles: value.requiresSniperRifles,
      },
    },
    play: {
      addCard: {
        domestic: value.addDomesticCard?.map((c) => makeId(set, "domestic", c)),
        science: value.addScienceCard?.map((c) => makeId(set, "science", c)),
        defense: value.addDefenseCard?.map((c) => makeId(set, "defense", c)),
        foreign: value.addForeignCard?.map((c) => makeId(set, "foreign", c)),
      },
      removeCard: {
        domestic: value.removeDomesticCard?.map((c) =>
          makeId(set, "domestic", c)
        ),
        science: value.removeScienceCard?.map((c) => makeId(set, "science", c)),
        defense: value.removeDefenseCard?.map((c) => makeId(set, "defense", c)),
        foreign: value.removeForeignCard?.map((c) => makeId(set, "foreign", c)),
      },
      addValuablesOnce: {
        science: value.addScienceOnce,
        industry: value.addIndustryOnce,
        gold: value.addGoldOnce,
        food: value.addFoodOnce,
        population: value.addPopulationOnce,
        defense: value.addDefenseOnce,
        culture: value.addCultureOnce,
        happiness: value.addHappinessOnce,
      },
      addValuablesPerTurn: {
        science: value.addScience,
        industry: value.addIndustry,
        gold: value.addGold,
        food: value.addFood,
        population: value.addPopulation,
        defense: value.addDefense,
        culture: value.addCulture,
        happiness: value.addHappiness,
      },
      upkeep: {
        science: value.scienceUpkeep,
        industry: value.industryUpkeep,
        gold: value.goldUpkeep,
        food: value.foodUpkeep,
        population: value.populationUpkeep,
        defense: value.defenseUpkeep,
        culture: value.cultureUpkeep,
        happiness: value.happinessUpkeep,
      },
      addResources: {
        iron: value.setHasIron,
        oil: value.setHasOil,
        horses: value.setHasHorses,
        coal: value.setHasCoal,
        aluminum: value.setHasAluminum,
        melee: value.setHasMelee,
        handguns: value.setHasHandguns,
        rifles: value.setHasRifles,
        shotguns: value.setHasShotguns,
        sniperRifles: value.setHasSniperRifles,
      },
    },
  };
};

export const hydrateAll = () => {
  const ret: Indexable<Card> = {};
  Object.entries(scienceCards).forEach(([k, v]) => {
    ret[makeId("alpha", "science", k)] = hydrate("alpha", "science", k, v);
  });
  Object.entries(domesticCards).forEach(([k, v]) => {
    ret[makeId("alpha", "domestic", k)] = hydrate("alpha", "domestic", k, v);
  });
  Object.entries(foreignCards).forEach(([k, v]) => {
    ret[makeId("alpha", "foreign", k)] = hydrate("alpha", "foreign", k, v);
  });
  Object.entries(defenseCards).forEach(([k, v]) => {
    ret[makeId("alpha", "defense", k)] = hydrate("alpha", "defense", k, v);
  });

  // test
  Object.values(ret).forEach((c) => {
    let useless = true;
    onAllAdvisors((g) => {
      if (c.play.addCard) {
        c.play.addCard[g as AdvisorType]?.forEach((a) => {
          useless = false;
          if (!ret[a]) {
            console.log(`addCard for ${a} failed`);
          }
        });
      }
      if (c.play.removeCard) {
        c.play.removeCard[g as AdvisorType]?.forEach((a) => {
          useless = false;
          if (!ret[a]) {
            console.log(`removeCard for ${a} failed`);
          }
        });
      }
    });

    onAllValuables((v) => {
      if (
        c.play.addValuablesOnce &&
        c.play.addValuablesOnce[v as ValuableType]
      ) {
        useless = false;
      }
      if (
        c.play.addValuablesPerTurn &&
        c.play.addValuablesPerTurn[v as ValuableType]
      ) {
        useless = false;
      }
    });

    onAllResources((v) => {
      if (c.play.addResources && c.play.addResources[v as ResourceType]) {
        useless = false;
      }
    });

    if (useless && c.combatType === undefined) {
      console.log(`Useless Leaf: ${c.id}`);
    }
  });

  // dfs
  const visited: Indexable<boolean> = {};
  const stack: Card[] = [ret["alpha__science__agriculture"]];
  while (stack.length) {
    const node = stack.pop();
    if (node && !visited[node.id]) {
      visited[node.id] = true;
      // console.log(`we visited ${node.id}`);
      onAllAdvisors((g) => {
        if (node.play.addCard) {
          node.play.addCard[g as AdvisorType]?.forEach((a) => {
            if (stack.includes(ret[a])) {
              console.log("Error: cycle in graph");
            }
            stack.push(ret[a]);
          });
        }
      });
    }
  }
  const found = new Set(Object.keys(visited));
  const all = new Set(Object.keys(ret));
  let difference = new Set([...all].filter((x) => !found.has(x)));
  if (difference.size) {
    console.log("These cards are not yet part of the graph:");
    console.log(`Found ${found.size} of ${all.size}}`, difference);
  }

  console.log(ret);
  return ret;
};

export const defenseCards: Indexable<SimpleCard> = {
  archer: {
    industryCost: 70,
    combatType: "archery",
    strength: 4,
    rangedStrength: 6,
    range: 2,
    speed: 2,
  },

  chariot_archer: {
    industryCost: 20,
    combatType: "melee",
    strength: 60,
    rangedStrength: 3,
    range: 2,
    speed: 4,
    requiresHorses: true,
  },

  scout: {
    industryCost: 25,
    combatType: "recon",
    strength: 4,
    speed: 2,
  },

  spearman: {
    industryCost: 50,
    combatType: "melee",
    strength: 7,
    speed: 2,
  },

  warrior: {
    industryCost: 40,
    combatType: "melee",
    strength: 6,
    speed: 2,
  },

  catapult: {
    industryCost: 100,
    combatType: "siege",
    strength: 4,
    rangedStrength: 14,
    range: 2,
    speed: 2,
    requiresIron: true,
  },

  horseman: {
    industryCost: 80,
    combatType: "mounted",
    strength: 12,
    speed: 4,
    requiresHorses: true,
  },

  swordsman: {
    industryCost: 80,
    combatType: "melee",
    strength: 11,
    speed: 2,
    requiresIron: true,
  },

  crossbowman: {
    industryCost: 120,
    combatType: "archery",
    strength: 6,
    rangedStrength: 12,
    range: 2,
    speed: 2,
  },

  knight: {
    industryCost: 150,
    combatType: "mounted",
    strength: 18,
    speed: 3,
    requiresHorses: true,
  },

  longswordsman: {
    industryCost: 150,
    combatType: "melee",
    strength: 18,
    speed: 2,
    requiresIron: true,
  },

  pikeman: {
    industryCost: 100,
    combatType: "melee",
    strength: 10,
    speed: 2,
  },

  trebuchet: {
    industryCost: 170,
    combatType: "siege",
    strength: 10,
    rangedStrength: 20,
    range: 2,
    speed: 2,
    requiresIron: true,
  },

  cannon: {
    industryCost: 250,
    combatType: "siege",
    strength: 10,
    rangedStrength: 26,
    range: 2,
    speed: 2,
  },

  cavalry: {
    industryCost: 260,
    combatType: "mounted",
    strength: 25,
    speed: 3,
    requiresHorses: true,
  },

  lancer: {
    industryCost: 220,
    combatType: "mounted",
    strength: 22,
    speed: 4,
    requiresHorses: true,
  },

  musketman: {
    industryCost: 120,
    combatType: "gunpowder",
    strength: 16,
    speed: 2,
  },

  rifleman: {
    industryCost: 200,
    combatType: "gunpowder",
    strength: 25,
    speed: 2,
  },

  anti_aircraft_gun: {
    industryCost: 300,
    combatType: "gunpowder",
    strength: 32,
    rangedStrength: 32,
    range: 2,
    speed: 2,
  },

  artillery: {
    industryCost: 420,
    combatType: "siege",
    strength: 16,
    rangedStrength: 32,
    range: 3,
    speed: 2,
  },

  infantry: {
    industryCost: 300,
    combatType: "gunpowder",
    strength: 36,
    speed: 2,
  },

  bomber: {
    industryCost: 520,
    combatType: "air",
    strength: 21,
    rangedStrength: 60,
    range: 10,
    speed: 10,
    requiresOil: true,
  },

  helicopter_gunship: {
    industryCost: 450,
    combatType: "air",
    strength: 50,
    speed: 6,
    requiresAluminum: true,
  },

  rocket_artillery: {
    industryCost: 600,
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
    addForeignCard: [
      "city_attacks_1",
      "recon_city_1",
      "build_embasy_city_1",
      "found_city_2",
    ],
  },

  // todo: useless
  city_attacks_1: {
    immediatePlay: true,
  },

  // todo: useless
  recon_city_1: {},

  // todo: useless
  build_embasy_city_1: {},

  found_city_2: {
    immediatePlay: true,
    addForeignCard: [
      "city_attacks_2",
      "recon_city_2",
      "build_embasy_city_2",
      "found_city_3",
    ],
  },

  // todo: useless
  city_attacks_2: {
    immediatePlay: true,
  },

  // todo: useless
  recon_city_2: {},

  // todo: useless
  build_embasy_city_2: {},

  found_city_3: {
    immediatePlay: true,
    addForeignCard: [
      "city_attacks_3",
      "recon_city_3",
      "build_embasy_city_3",
      "found_city_4",
    ],
  },

  // todo: useless
  city_attacks_3: {
    immediatePlay: true,
  },

  // todo: useless
  recon_city_3: {},

  // todo: useless
  build_embasy_city_3: {},

  found_city_4: {
    immediatePlay: true,
    addForeignCard: [
      "city_attacks_4",
      "recon_city_4",
      "build_embasy_city_4",
      "found_city_5",
    ],
  },

  // todo: useless
  city_attacks_4: {
    immediatePlay: true,
  },

  // todo: useless
  recon_city_4: {},

  // todo: useless
  build_embasy_city_4: {},

  found_city_5: {
    immediatePlay: true,
    addForeignCard: ["city_attacks_5", "recon_city_5", "build_embasy_city_5"],
  },

  // todo: useless
  city_attacks_5: {
    immediatePlay: true,
  },

  // todo: useless
  recon_city_5: {},

  // todo: useless
  build_embasy_city_5: {},

  find_research_tools_1: {
    foodCost: 1,
    addScience: 10,
    addForeignCard: ["find_research_tools_2"],
  },

  find_research_tools_2: {
    foodCost: 1,
    addScience: 20,
    addForeignCard: ["find_research_tools_3"],
  },

  find_research_tools_3: {
    foodCost: 2,
    addScience: 30,
    addForeignCard: ["find_research_tools_4"],
  },

  find_research_tools_4: {
    foodCost: 2,
    addScience: 40,
    addForeignCard: ["find_research_tools_5"],
  },

  find_research_tools_5: {
    foodCost: 3,
    addScience: 50,
  },

  find_weapons_1: {
    goldCost: 1,
    setHasMelee: true,
    addForeignCard: ["find_weapons_2"],
  },

  find_weapons_2: {
    goldCost: 1,
    setHasHandguns: true,
    addForeignCard: ["find_weapons_3"],
  },

  find_weapons_3: {
    goldCost: 2,
    setHasRifles: true,
    addForeignCard: ["find_weapons_4"],
  },

  find_weapons_4: {
    goldCost: 2,
    setHasShotguns: true,
    addForeignCard: ["find_weapons_5"],
  },

  find_weapons_5: {
    goldCost: 3,
    setHasSniperRifles: true,
  },

  find_building_tools_1: {
    foodCost: 1,
    addIndustry: 20,
    addForeignCard: ["find_building_tools_2"],
  },

  find_building_tools_2: {
    foodCost: 2,
    addIndustry: 30,
    addForeignCard: ["find_building_tools_3"],
  },

  find_building_tools_3: {
    foodCost: 3,
    addIndustry: 40,
    addForeignCard: ["find_building_tools_4"],
  },

  find_building_tools_4: {
    foodCost: 4,
    addIndustry: 50,
    addForeignCard: ["find_building_tools_5"],
  },

  find_building_tools_5: {
    foodCost: 5,
    addIndustry: 60,
  },

  find_food: {
    reuse: true,
    goldCost: 1,
    addFood: 3,
  },

  find_gold: {
    reuse: true,
    foodCost: 1,
    addGold: 3,
  },

  find_coal: {
    setHasCoal: true,
  },

  find_iron: {
    setHasIron: true,
  },

  find_oil: {
    setHasOil: true,
  },

  find_horses: {
    setHasHorses: true,
  },

  find_aluminum: {
    setHasAluminum: true,
  },
};

export const domesticCards: Indexable<SimpleCard> = {
  grainary: {
    industryCost: 100,
    industryUpkeep: 1,
    addFood: 2,
  },

  lighthouse: {
    industryCost: 80,
    industryUpkeep: 1,
    addFood: 4,
  },

  harbor: {
    industryCost: 80,
    industryUpkeep: 3,
    addIndustry: 6,
  },

  observatory: {
    industryCost: 180,
    industryUpkeep: 2,
    addScience: 40,
  },

  seaport: {
    industryCost: 140,
    industryUpkeep: 2,
    addIndustry: 10,
  },

  library: {
    industryCost: 80,
    industryUpkeep: 1,
    addScience: 40,
  },

  university: {
    industryCost: 200,
    industryUpkeep: 3,
    addScience: 34,
  },

  public_school: {
    industryCost: 350,
    industryUpkeep: 3,
    addScience: 40,
  },

  hospital: {
    industryCost: 400,
    industryUpkeep: 2,
    addFood: 7,
  },

  medical_lab: {
    industryCost: 500,
    industryUpkeep: 3,
    addFood: 5,
  },

  solar_plant: {
    industryCost: 600,
    industryUpkeep: 3,
    addIndustry: 13,
  },

  research_lab: {
    industryCost: 600,
    industryUpkeep: 3,
    addIndustry: 800,
  },

  hydro_plant: {
    industryCost: 600,
    industryUpkeep: 3,
    addIndustry: 12,
    requiresAluminum: true,
  },

  military_base: {
    industryCost: 450,
    industryUpkeep: 4,
    addDefense: 12,
  },

  broadcast_tower: {
    industryCost: 600,
    industryUpkeep: 3,
    addCulture: 5,
  },

  factory: {
    industryCost: 300,
    industryUpkeep: 3,
    addIndustry: 36,
    requiresCoal: true,
  },

  arsenal: {
    industryCost: 350,
    industryUpkeep: 3,
    addIndustry: 8,
  },

  monastery: {
    industryCost: 120,
    industryUpkeep: 2,
    addCulture: 4,
  },

  stable: {
    industryCost: 100,
    industryUpkeep: 1,
    addIndustry: 4,
    requiresHorses: true,
  },

  circus: {
    industryCost: 150,
    industryUpkeep: 3,
    addHappiness: 3,
    requiresHorses: true,
  },

  castle: {
    industryCost: 200,
    industryUpkeep: 3,
    addDefense: 7.5,
  },

  courthouse: {
    industryCost: 200,
    industryUpkeep: 5,
    addHappiness: 5,
  },

  market: {
    industryCost: 120,
    industryUpkeep: 0,
    addGold: 4,
  },

  mint: {
    industryCost: 120,
    industryUpkeep: 0,
    addGold: 6,
  },

  bank: {
    industryCost: 220,
    industryUpkeep: 0,
    addGold: 5,
  },

  walls: {
    industryCost: 100,
    industryUpkeep: 1,
    addDefense: 5,
  },

  colosseum: {
    industryCost: 150,
    industryUpkeep: 3,
    addHappiness: 4,
    addDomesticCard: ["theater"],
  },

  theater: {
    industryCost: 300,
    industryUpkeep: 5,
    addHappiness: 4,
    addDomesticCard: ["stadium"],
  },

  stadium: {
    industryCost: 450,
    industryUpkeep: 6,
    addHappiness: 4,
  },

  military_academy: {
    industryCost: 350,
    industryUpkeep: 3,
    addDefense: 5,
  },

  armory: {
    industryCost: 130,
    industryUpkeep: 3,
    addDefense: 5,
  },

  forge: {
    industryCost: 150,
    industryUpkeep: 2,
    addDefense: 6,
    requiresIron: true,
  },

  workshop: {
    industryCost: 100,
    industryUpkeep: 2,
    addDefense: 11,
  },

  temple: {
    industryCost: 120,
    industryUpkeep: 2,
    addCulture: 3,
    addDomesticCard: ["opera_house"],
  },

  opera_house: {
    industryCost: 220,
    industryUpkeep: 3,
    addCulture: 5,
    addDomesticCard: ["opera_house"],
  },

  windmill: {
    industryCost: 180,
    industryUpkeep: 2,
    addIndustry: 9,
  },

  garden: {
    industryCost: 120,
    industryUpkeep: 2,
    addGold: 2,
    addCulture: 2,
    addHappiness: 2,
    addFood: 1,
  },

  barracks: {
    industryCost: 80,
    industryUpkeep: 1,
    addDefense: 2,
  },

  monument: {
    industryCost: 60,
    industryUpkeep: 1,
    addCulture: 2,
  },

  water_mill: {
    industryCost: 120,
    industryUpkeep: 2,
    addFood: 2,
  },

  burial_tomb: {
    industryCost: 120,
    industryUpkeep: 0,
    addCulture: 2,
    addHappiness: 2,
  },

  basic_planning: {
    reuse: true,
    addIndustry: 20,
  },
};

export const scienceCards: Indexable<SimpleCard> = {
  agriculture: {
    addScienceCard: ["pottery", "animal_husbandry", "mining", "basic_research"],
    addDomesticCard: ["monument", "water_mill", "basic_planning"],
    addForeignCard: [
      "find_research_tools_1",
      "find_weapons_1",
      "find_building_tools_1",
      "find_food",
      "find_gold",
    ],
    addDefenseCard: ["warrior", "scout", "chariot_archer"],
  },

  basic_research: {
    reuse: true,
    addScience: 15,
  },

  pottery: {
    scienceCost: 35,
    addScienceCard: ["sailing", "calendar", "writing"],
    addDomesticCard: ["grainary"],
  },

  sailing: {
    scienceCost: 55,
    addScienceCard: ["optics"],
  },

  optics: {
    scienceCost: 80,
    addScienceCard: ["compass"],
    addDomesticCard: ["lighthouse"],
  },

  compass: {
    scienceCost: 340,
    addScienceCard: ["astronomy"],
    addDomesticCard: ["harbor"],
  },

  astronomy: {
    scienceCost: 650,
    addScienceCard: ["navigation"],
    addDomesticCard: ["observatory"],
  },

  navigation: {
    scienceCost: 900,
    addScienceCard: ["archaeology"],
    addDomesticCard: ["seaport"],
  },

  // todo: useless
  archaeology: {
    scienceCost: 1300,
    addScienceCard: [],
  },

  writing: {
    scienceCost: 55,
    addScienceCard: ["education"],
    addDomesticCard: ["library"],
    addForeignCard: ["found_city_1"],
  },

  education: {
    scienceCost: 440,
    addScienceCard: ["scientific_theory"],
    addDomesticCard: ["university"],
  },

  scientific_theory: {
    scienceCost: 1300,
    addScienceCard: ["biology", "steam_power"],
    addDomesticCard: ["public_school"],
    addForeignCard: ["find_coal"],
  },

  biology: {
    scienceCost: 1680,
    addScienceCard: ["electricity"],
    addDomesticCard: ["hospital"],
    addForeignCard: ["find_oil"],
  },

  electricity: {
    scienceCost: 1900,
    addScienceCard: ["refrigeration", "telegraph", "radio"],
    addForeignCard: ["find_aluminum"],
  },

  refrigeration: {
    scienceCost: 2200,
    addScienceCard: ["penicillin", "plastics"],
  },

  penicillin: {
    scienceCost: 2600,
    addScienceCard: ["ecology"],
    addDomesticCard: ["medical_lab"],
  },

  ecology: {
    scienceCost: 3000,
    addScienceCard: [],
    addDomesticCard: ["solar_plant"],
  },

  plastics: {
    scienceCost: 2600,
    addScienceCard: [],
    addDomesticCard: ["research_lab", "hydro_plant"],
  },

  telegraph: {
    scienceCost: 2200,
    addScienceCard: ["electronics"],
    addDomesticCard: ["military_base"],
  },

  electronics: {
    scienceCost: 2600,
    addScienceCard: ["computers"],
  },

  computers: {
    scienceCost: 3000,
    addScienceCard: ["robotics"],
  },

  // todo: useless
  robotics: {
    scienceCost: 3350,
    addScienceCard: [],
  },

  radio: {
    scienceCost: 2200,
    addScienceCard: ["radar"],
    addDomesticCard: ["broadcast_tower"],
    addDefenseCard: ["anti_aircraft_gun"],
  },

  radar: {
    scienceCost: 2600,
    addScienceCard: ["rocketry", "lasers"],
    addDefenseCard: ["bomber"],
  },

  rocketry: {
    scienceCost: 3000,
    addScienceCard: [],
    addDefenseCard: ["helicopter_gunship", "rocket_artillery"],
    removeDefenseCard: ["lancer", "artillery"],
  },

  // todo: useless
  lasers: {
    scienceCost: 3000,
    addScienceCard: [],
  },

  steam_power: {
    scienceCost: 1680,
    addScienceCard: ["replacable_parts", "railroad"],
    addDomesticCard: ["factory"],
  },

  replacable_parts: {
    scienceCost: 1900,
    addScienceCard: ["flight"],
    addDefenseCard: ["infantry"],
    removeDefenseCard: ["rifleman"],
  },

  // todo: useless
  flight: {
    scienceCost: 2200,
    addScienceCard: [],
  },

  railroad: {
    scienceCost: 1900,
    addScienceCard: [],
    addDomesticCard: ["arsenal"],
  },

  calendar: {
    scienceCost: 70,
    addScienceCard: ["philosophy"],
  },

  philosophy: {
    scienceCost: 100,
    addScienceCard: ["theology"],
    addDomesticCard: ["temple", "burial_tomb"],
  },

  theology: {
    scienceCost: 250,
    addScienceCard: [],
    addDomesticCard: ["monastery", "garden"],
  },

  animal_husbandry: {
    scienceCost: 35,
    addScienceCard: ["horseback_riding", "trapping"],
    addForeignCard: ["find_horses"],
  },

  horseback_riding: {
    scienceCost: 100,
    addScienceCard: ["civil_service"],
    addDomesticCard: ["stable", "circus"],
    addDefenseCard: ["horseman"],
  },

  civil_service: {
    scienceCost: 400,
    addScienceCard: ["chivalry"],
    addDefenseCard: ["pikeman"],
    removeDefenseCard: ["spearman"],
  },

  chivalry: {
    scienceCost: 440,
    addScienceCard: [],
    addDomesticCard: ["castle"],
    addDefenseCard: ["knight"],
    removeDefenseCard: ["horseman", "chariot_archer"],
  },

  trapping: {
    scienceCost: 55,
    addScienceCard: ["archery"],
  },

  archery: {
    scienceCost: 35,
    addScienceCard: ["mathamatics"],
    addDomesticCard: ["windmill"],
    addDefenseCard: ["archer"],
  },

  mathamatics: {
    scienceCost: 100,
    addScienceCard: ["currency"],
    addDomesticCard: ["courthouse"],
    addDefenseCard: ["catapult"],
  },

  currency: {
    scienceCost: 250,
    addScienceCard: ["banking"],
    addDomesticCard: ["market", "mint"],
  },

  banking: {
    scienceCost: 650,
    addScienceCard: [],
    addDomesticCard: ["bank"],
  },

  mining: {
    scienceCost: 35,
    addScienceCard: ["masonry", "bronze_working"],
  },

  masonry: {
    scienceCost: 55,
    addScienceCard: ["construction"],
    addDomesticCard: ["walls"],
  },

  construction: {
    scienceCost: 100,
    addScienceCard: ["engineering"],
    addDomesticCard: ["colosseum"],
  },

  engineering: {
    scienceCost: 250,
    addScienceCard: ["physics", "machinery"],
  },

  physics: {
    scienceCost: 440,
    addScienceCard: ["chemistry"],
    addDefenseCard: ["trebuchet"],
    removeDefenseCard: ["catapult"],
  },

  chemistry: {
    scienceCost: 900,
    addScienceCard: ["fertilizer", "military_science"],
    addDefenseCard: ["cannon"],
    removeDefenseCard: ["trebuchet"],
  },

  fertilizer: {
    scienceCost: 1300,
    addScienceCard: ["dynamite"],
  },

  dynamite: {
    scienceCost: 1900,
    addScienceCard: ["combustion"],
    addDefenseCard: ["artillery"],
    removeDefenseCard: ["cannon"],
  },

  // todo: useless
  combustion: {
    scienceCost: 2200,
    addScienceCard: [],
  },

  military_science: {
    scienceCost: 1300,
    addScienceCard: [],
    addDomesticCard: ["military_academy"],
    addDefenseCard: ["cavalry"],
    removeDefenseCard: ["knight"],
  },

  machinery: {
    scienceCost: 440,
    addScienceCard: [],
    addDefenseCard: ["crossbowman"],
    removeDefenseCard: ["archer"],
  },

  bronze_working: {
    scienceCost: 55,
    addScienceCard: ["iron_working"],
    addDomesticCard: ["barracks"],
    addDefenseCard: ["spearman"],
  },

  iron_working: {
    scienceCost: 150,
    addScienceCard: ["metal_casting"],
    addDomesticCard: ["armory"],
    addForeignCard: ["find_iron"],
    addDefenseCard: ["swordsman"],
    removeDefenseCard: ["warrior"],
  },

  metal_casting: {
    scienceCost: 250,
    addScienceCard: ["steel"],
    addDomesticCard: ["forge", "workshop"],
  },

  steel: {
    scienceCost: 440,
    addScienceCard: ["gunpowder"],
    addDefenseCard: ["longswordsman"],
    removeDefenseCard: ["swordsman"],
  },

  gunpowder: {
    scienceCost: 680,
    addScienceCard: ["metallurgy"],
    addDefenseCard: ["musketman"],
  },

  metallurgy: {
    scienceCost: 900,
    addScienceCard: ["rifling"],
    addDefenseCard: ["lancer"],
  },

  rifling: {
    scienceCost: 1425,
    addScienceCard: [],
    addDefenseCard: ["rifleman"],
    removeDefenseCard: ["longswordsman", "pikeman", "crossbowman", "musketman"],
  },
};
