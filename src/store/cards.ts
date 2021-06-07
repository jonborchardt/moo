import LeaderTypeSrc from "../icons/GameToken_27_1.png";
import InteriorTypeSrc from "../icons/GameToken_31_1.png";
import ScienceTypeSrc from "../icons/GameToken_34_1.png";
import ScienceSrc from "../icons/g_02.png";
import InteriorSrc from "../icons/gr_05.png";
import MarineBarracksSrc from "../icons/SGI_76.png";

import { AdvisorKey, AdvisorCards } from "./advisors";
import { Indexable } from "./util";

export interface Card {
  id: string;
  advisor: AdvisorKey;
  label: string;
  description: string;
  imageSrc: string;
  typeSrc: string;
  requirements: {
    researchPoints?: number;
    industryPoints?: number;
  };
  play: {
    addCard?: Partial<AdvisorCards>;
    removeCard?: Partial<AdvisorCards>;
    removeCardAll?: Partial<AdvisorCards>;
    addResearchPointsPerTurn?: number;
    addIndustryPointsPerTurn?: number;
  };
}

export const cards: Indexable<Card> = {
  l1_science: {
    id: "l1_science",
    advisor: "leader",
    label: "Science",
    description: "See the Secretary of Science",
    imageSrc: ScienceSrc,
    typeSrc: LeaderTypeSrc,
    requirements: {},
    play: {},
  },
  l1_interior: {
    id: "l1_interior",
    advisor: "leader",
    label: "Interior",
    description: "See the Secretary of the Interior",
    imageSrc: InteriorSrc,
    typeSrc: LeaderTypeSrc,
    requirements: {},
    play: {},
  },

  // science cards
  s1_pureResearch: {
    id: "s1_pureResearch",
    advisor: "science",
    label: "Pure Research",
    description: "Advance Research points",
    imageSrc: MarineBarracksSrc,
    typeSrc: ScienceTypeSrc,
    requirements: { researchPoints: 10 },
    play: {
      addResearchPointsPerTurn: 10,
    },
  },
  s1_marineBarracks: {
    id: "s1_marineBarracks",
    advisor: "science",
    label: "Marine Barracks",
    description: "Research Marine Barracks",
    imageSrc: MarineBarracksSrc,
    typeSrc: ScienceTypeSrc,
    requirements: { researchPoints: 50 },
    play: {
      addCard: {
        interior: ["i1_marineBarracks"],
      },
      removeCardAll: {
        science: ["s1_marineBarracks"],
      },
    },
  },

  // interior cards
  i1_marineBarracks: {
    id: "i1_marineBarracks",
    advisor: "interior",
    label: "Marine Barracks",
    description: "Build Marine Barracks",
    imageSrc: MarineBarracksSrc,
    typeSrc: InteriorTypeSrc,
    requirements: { industryPoints: 500 },
    play: {},
  },
};
