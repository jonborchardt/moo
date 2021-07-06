import { Card } from "../../store/cards";
import type { AdvisorKey } from "../../store/advisors";
import ScienceTypeSrc from "../icons/GameToken_34_1.png";
import ScienceSrc from "../icons/g_02.png";

export class Pottery implements Card {
  id = "s1_pottery";
  advisor = "science" as AdvisorKey;
  label = "pottery";
  description = "pottery";
  imageSrc = ScienceSrc;
  typeSrc = ScienceTypeSrc;
  requirements = {
    researchPoints: 35,
  };
  play = {
    addCard: {
      science: ["s1_sailing", "s1_calendar", "s1_writing"],
    },
    removeCardAll: {
      science: ["s1_pottery"],
    },
  };
}
